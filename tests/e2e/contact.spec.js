const { test, expect } = require("@playwright/test");
const { gotoStable } = require("./helpers");

const VALID_PAYLOAD = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: "Project enquiry",
  message: "Hello, I would like to discuss a project.",
  id: "design",
};

const PROJECT_NETWORK = { chromium: 1, firefox: 2, webkit: 3 };

function ipFor(projectName, suffix) {
  const network = PROJECT_NETWORK[projectName] || 9;
  return `198.51.${network}.${suffix}`;
}

async function postContact(request, { data, headers = {}, ip }) {
  return request.post("/api/send", {
    data: typeof data === "string" ? data : JSON.stringify(data),
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
      ...headers,
    },
  });
}

test.describe("contact form journey", () => {
  test("submits once and shows accessible success feedback", async ({
    page,
  }) => {
    let requests = 0;
    let requestBody;

    await page.route("**/api/send", async (route) => {
      requests += 1;
      requestBody = JSON.parse(route.request().postData());
      await new Promise((resolve) => setTimeout(resolve, 300));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await gotoStable(page, "/contact?id=design");
    await page.getByLabel("Name").fill("Ada Lovelace");
    await page.getByLabel("Email").fill("ada@example.com");
    await page.getByLabel("Subject").fill("Project enquiry");
    await page
      .getByLabel("Message")
      .fill("Hello, I would like to discuss a project.");

    const submit = page.getByRole("button", { name: /let's talk/i });
    await submit.click();

    await expect(page.getByRole("button", { name: /sending/i })).toBeDisabled();
    await expect(page.getByText(/Message sent successfully/i)).toBeVisible();

    expect(requests).toBe(1);
    expect(requestBody).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      subject: "Project enquiry",
      message: "Hello, I would like to discuss a project.",
      id: "design",
    });
  });

  test("shows a generic error state on server failure", async ({ page }) => {
    await page.route("**/api/send", async (route) => {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ ok: false, error: "unavailable" }),
      });
    });

    await gotoStable(page, "/contact");
    await page.getByLabel("Name").fill("Ada");
    await page.getByLabel("Email").fill("ada@example.com");
    await page.getByLabel("Subject").fill("Hello");
    await page.getByLabel("Message").fill("Message body");
    await page.getByRole("button", { name: /let's talk/i }).click();

    await expect(page.locator("form").getByRole("alert")).toContainText(
      /could not be sent/i,
    );
  });
});

test.describe("contact API security", () => {
  test("rejects non-POST methods", async ({ request }, testInfo) => {
    const response = await request.get("/api/send", {
      headers: { "x-forwarded-for": ipFor(testInfo.project.name, 10) },
    });

    expect(response.status()).toBe(405);
    expect(response.headers()["allow"]).toBe("POST");
    expect(await response.json()).toEqual({
      ok: false,
      error: "method_not_allowed",
    });
  });

  test("rejects unsupported content types", async ({ request }, testInfo) => {
    const response = await request.post("/api/send", {
      data: "plain text",
      headers: {
        "content-type": "text/plain",
        "x-forwarded-for": ipFor(testInfo.project.name, 11),
      },
    });

    expect(response.status()).toBe(415);
  });

  test("rejects malformed JSON", async ({ request }, testInfo) => {
    const response = await postContact(request, {
      data: '{"name":',
      ip: ipFor(testInfo.project.name, 12),
    });

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({
      ok: false,
      error: "invalid_request",
    });
  });

  test("rejects oversized payloads", async ({ request }, testInfo) => {
    const response = await postContact(request, {
      data: { ...VALID_PAYLOAD, message: "x".repeat(20 * 1024) },
      ip: ipFor(testInfo.project.name, 13),
    });

    expect(response.status()).toBe(413);
  });

  const abuseCases = [
    ["unexpected field", { ...VALID_PAYLOAD, role: "admin" }],
    [
      "header injection",
      { ...VALID_PAYLOAD, subject: "Hi\r\nBcc: evil@example.com" },
    ],
    ["unsafe service id", { ...VALID_PAYLOAD, id: "../../etc/passwd" }],
    ["invalid email", { ...VALID_PAYLOAD, email: "not-an-email" }],
    ["empty message", { ...VALID_PAYLOAD, message: "   " }],
  ];

  abuseCases.forEach(([label, data], index) => {
    test(`rejects ${label}`, async ({ request }, testInfo) => {
      const response = await postContact(request, {
        data,
        ip: ipFor(testInfo.project.name, 20 + index),
      });

      expect(response.status()).toBe(400);
      expect(await response.json()).toEqual({
        ok: false,
        error: "invalid_request",
      });
    });
  });

  test("rejects cross-site origins", async ({ request }, testInfo) => {
    const response = await postContact(request, {
      data: VALID_PAYLOAD,
      headers: { origin: "https://evil.example" },
      ip: ipFor(testInfo.project.name, 15),
    });

    expect(response.status()).toBe(403);
  });

  test("accepts a valid request without leaking configuration", async ({
    request,
  }, testInfo) => {
    const response = await postContact(request, {
      data: VALID_PAYLOAD,
      ip: ipFor(testInfo.project.name, 16),
    });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ ok: true });

    const body = await response.text();
    expect(body).not.toContain("owner@example.com");
    expect(body).not.toContain("portfolio@example.com");
    expect(body).not.toContain("Ada Lovelace");
  });

  test("rate limits abuse and returns Retry-After", async ({
    request,
  }, testInfo) => {
    const ip = `203.0.113.${PROJECT_NETWORK[testInfo.project.name] || 9}`;
    const statuses = [];

    for (let attempt = 0; attempt < 6; attempt += 1) {
      const response = await postContact(request, {
        data: VALID_PAYLOAD,
        ip,
      });
      statuses.push(response.status());

      if (response.status() === 429) {
        expect(Number(response.headers()["retry-after"])).toBeGreaterThan(0);
        expect(await response.json()).toEqual({
          ok: false,
          error: "rate_limited",
        });
      }
    }

    expect(statuses.slice(0, 5)).toEqual([200, 200, 200, 200, 200]);
    expect(statuses[5]).toBe(429);
  });

  test("sets hardening headers and no-store caching", async ({
    request,
  }, testInfo) => {
    const response = await request.get("/", {
      headers: { "x-forwarded-for": ipFor(testInfo.project.name, 17) },
    });
    const headers = response.headers();

    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["content-security-policy"]).toContain("default-src 'self'");
    expect(headers["content-security-policy"]).toContain(
      "frame-ancestors 'none'",
    );
    expect(headers["x-powered-by"]).toBeUndefined();

    const apiResponse = await request.get("/api/send", {
      headers: { "x-forwarded-for": ipFor(testInfo.project.name, 18) },
    });
    expect(apiResponse.headers()["cache-control"]).toBe("no-store");
  });
});
