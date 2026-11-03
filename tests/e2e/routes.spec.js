const { test, expect } = require("@playwright/test");
const { ROUTES, collectPageErrors, gotoStable } = require("./helpers");

test.describe("public routes", () => {
  for (const route of ROUTES) {
    test(`${route.path} renders without runtime errors`, async ({ page }) => {
      const errors = collectPageErrors(page);

      const response = await page.goto(route.path, {
        waitUntil: "networkidle",
      });
      await page.waitForTimeout(1700);

      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
      await expect(page.locator("h1, h2").first()).toContainText(route.heading);
      await expect(
        page.getByRole("navigation", { name: "Main navigation" }),
      ).toBeVisible();

      expect(errors, `console errors on ${route.path}`).toEqual([]);
    });
  }

  test("renders the 404 experience", async ({ page }) => {
    const errors = collectPageErrors(page);
    const response = await page.goto("/this-page-does-not-exist");
    await page.waitForTimeout(500);

    expect(response?.status()).toBe(404);
    await expect(page.getByText(/could not be found/i)).toBeVisible();
    expect(
      errors.filter((error) => !error.includes("status of 404")),
      "console errors on 404",
    ).toEqual([]);
  });
});

test.describe("navigation and links", () => {
  test("navigates through the main navigation", async ({ page }) => {
    await gotoStable(page, "/");
    const navigation = page.getByRole("navigation", {
      name: "Main navigation",
    });

    await navigation.getByRole("link", { name: "about" }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    await navigation.getByRole("link", { name: "contact" }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByLabel("Name")).toBeVisible();
  });

  test("deep links survive a reload", async ({ page }) => {
    await gotoStable(page, "/work");
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(1700);
    await expect(page.getByRole("heading", { name: /My Work/i })).toBeVisible();
  });

  test("service cards link to a pre-filled contact form", async ({ page }) => {
    await gotoStable(page, "/services");
    const designLink = page.locator('a[href="/contact?id=design"]');
    await expect(designLink).toHaveCount(1);

    await designLink.click();
    await expect(page).toHaveURL(/\/contact\?id=design$/);
    await expect(page.getByLabel("Name")).toBeVisible();
  });

  test("external social links are safe and labelled", async ({ page }) => {
    await gotoStable(page, "/");
    const linkedIn = page.getByRole("link", { name: "LinkedIn" });
    await expect(linkedIn).toHaveAttribute("rel", /noopener/);
    await expect(linkedIn).toHaveAttribute("href", /linkedin\.com/);
  });
});
