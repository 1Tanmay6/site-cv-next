import { Readable } from "node:stream";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../lib/contact-store", () => ({
  saveContactRequest: vi.fn().mockResolvedValue({ id: "test" }),
}));

import handler from "../../pages/api/send";
import { saveContactRequest } from "../../lib/contact-store";

let ipCounter = 0;

function nextIp() {
  ipCounter += 1;
  return `198.51.100.${ipCounter}`;
}

function createRequest({
  method = "POST",
  headers = {},
  body,
  rawBody,
  ip = nextIp(),
} = {}) {
  const payload =
    rawBody !== undefined
      ? Buffer.from(rawBody)
      : body !== undefined
        ? Buffer.from(JSON.stringify(body))
        : undefined;

  const request = Readable.from(payload ? [payload] : []);
  request.method = method;
  request.socket = { remoteAddress: ip };
  request.headers = {
    host: "localhost:3000",
    "content-type": "application/json",
    "x-forwarded-for": ip,
    ...(payload ? { "content-length": String(payload.length) } : {}),
    ...headers,
  };

  return request;
}

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    finished: false,
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    end(chunk) {
      this.body = chunk ? JSON.parse(chunk) : undefined;
      this.finished = true;
    },
  };
}

async function invoke(options) {
  const request = createRequest(options);
  const response = createResponse();
  await handler(request, response);
  return { request, response };
}

const validPayload = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: "Project enquiry",
  message: "Hello, I would like to discuss a project.",
  id: "design",
};

describe("POST /api/send", () => {
  beforeEach(() => {
    saveContactRequest.mockResolvedValue({ messageId: "test" });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("rejects non-POST methods with 405 and an Allow header", async () => {
    const { response } = await invoke({ method: "GET" });

    expect(response.statusCode).toBe(405);
    expect(response.headers.allow).toBe("POST");
    expect(response.body).toEqual({ ok: false, error: "method_not_allowed" });
    expect(saveContactRequest).not.toHaveBeenCalled();
  });

  it("rejects unsupported content types with 415", async () => {
    const { response } = await invoke({
      headers: { "content-type": "text/plain" },
      rawBody: JSON.stringify(validPayload),
    });

    expect(response.statusCode).toBe(415);
    expect(saveContactRequest).not.toHaveBeenCalled();
  });

  it("rejects cross-site origins with 403", async () => {
    const { response } = await invoke({
      headers: { origin: "https://evil.example" },
      body: validPayload,
    });

    expect(response.statusCode).toBe(403);
    expect(saveContactRequest).not.toHaveBeenCalled();
  });

  it("rejects requests marked as cross-site by the browser", async () => {
    const { response } = await invoke({
      headers: { "sec-fetch-site": "cross-site" },
      body: validPayload,
    });

    expect(response.statusCode).toBe(403);
  });

  it("accepts same-origin requests", async () => {
    const { response } = await invoke({
      headers: { origin: "http://localhost:3000" },
      body: validPayload,
    });

    expect(response.statusCode).toBe(200);
    expect(saveContactRequest).toHaveBeenCalledTimes(1);
  });

  it("rejects malformed JSON with a generic 400", async () => {
    const { response } = await invoke({ rawBody: '{"name":' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ ok: false, error: "invalid_request" });
    expect(saveContactRequest).not.toHaveBeenCalled();
  });

  it("rejects empty bodies with a generic 400", async () => {
    const { response } = await invoke({ rawBody: "" });

    expect(response.statusCode).toBe(400);
    expect(saveContactRequest).not.toHaveBeenCalled();
  });

  it("rejects oversized payloads with 413", async () => {
    const oversized = JSON.stringify({
      ...validPayload,
      message: "x".repeat(20 * 1024),
    });

    const { response } = await invoke({ rawBody: oversized });

    expect(response.statusCode).toBe(413);
    expect(response.body).toEqual({ ok: false, error: "payload_too_large" });
    expect(saveContactRequest).not.toHaveBeenCalled();
  });

  it("rejects oversized payloads declared through content-length", async () => {
    const { response } = await invoke({
      headers: { "content-length": String(1024 * 1024) },
      body: validPayload,
    });

    expect(response.statusCode).toBe(413);
  });

  it.each([
    ["unexpected field", { ...validPayload, admin: true }],
    [
      "CRLF in subject",
      { ...validPayload, subject: "Hello\r\nBcc: evil@example.com" },
    ],
    ["unsafe service id", { ...validPayload, id: "billing" }],
    ["invalid email", { ...validPayload, email: "nope" }],
    ["missing message", { ...validPayload, message: "" }],
  ])("rejects %s before sending mail", async (_label, body) => {
    const { response } = await invoke({ body });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ ok: false, error: "invalid_request" });
    expect(saveContactRequest).not.toHaveBeenCalled();
  });

  it("sends one normalized mail for a valid request", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { response } = await invoke({
      body: {
        ...validPayload,
        name: "  Ada Lovelace ",
        email: " ADA@example.com ",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ ok: true });
    expect(saveContactRequest).toHaveBeenCalledTimes(1);
    expect(saveContactRequest).toHaveBeenCalledWith({
      name: "Ada Lovelace",
      email: "ADA@example.com",
      subject: "Project enquiry",
      message: "Hello, I would like to discuss a project.",
      serviceId: "design",
    });
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("returns a generic 503 when the contact store fails without leaking data", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    saveContactRequest.mockRejectedValueOnce(
      Object.assign(new Error("Invalid login"), {
        code: "EAUTH",
        command: "AUTH",
        responseCode: 535,
      }),
    );

    const { response } = await invoke({ body: validPayload });

    expect(response.statusCode).toBe(503);
    expect(response.body).toEqual({ ok: false, error: "unavailable" });
    expect(JSON.stringify(response.body)).not.toContain("SMTP");
    expect(errorSpy).toHaveBeenCalledWith(
      "[contact] store request failed",
      expect.objectContaining({
        name: "Error",
        code: "EAUTH",
        command: "AUTH",
        responseCode: 535,
      }),
    );
    const logged = JSON.stringify(errorSpy.mock.calls);
    expect(logged).not.toContain("ada@example.com");
    expect(logged).not.toContain("Hello, I would like");
    expect(logged).not.toContain("password");
  });

  it("logs configuration errors by variable name only", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    saveContactRequest.mockRejectedValueOnce(
      Object.assign(
        new Error(
          "Missing contact store configuration: repo_name, git_pat_token",
        ),
        { name: "ContactStoreConfigurationError" },
      ),
    );

    const { response } = await invoke({ body: validPayload });

    expect(response.statusCode).toBe(503);
    expect(errorSpy).toHaveBeenCalledWith(
      "[contact] store configuration error: Missing contact store configuration: repo_name, git_pat_token",
    );
    const logged = JSON.stringify(errorSpy.mock.calls);
    expect(logged).not.toContain("ada@example.com");
    expect(logged).not.toContain("Hello, I would like");
  });

  it("rate limits repeated requests from the same address", async () => {
    const ip = "203.0.113.77";

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const { response } = await invoke({ body: validPayload, ip });
      expect(response.statusCode).toBe(200);
    }

    const { response } = await invoke({ body: validPayload, ip });

    expect(response.statusCode).toBe(429);
    expect(response.body).toEqual({ ok: false, error: "rate_limited" });
    expect(Number(response.headers["retry-after"])).toBeGreaterThan(0);
    expect(saveContactRequest).toHaveBeenCalledTimes(5);
  });

  it("sets no-store caching on every response", async () => {
    const { response } = await invoke({ body: validPayload });
    expect(response.headers["cache-control"]).toBe("no-store");
    expect(response.headers["content-type"]).toBe(
      "application/json; charset=utf-8",
    );
  });
});
