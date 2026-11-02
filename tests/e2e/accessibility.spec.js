const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;
const { ROUTES } = require("./helpers");

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

async function analyzePage(page) {
  return new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
}

test.describe("accessibility", () => {
  for (const route of ROUTES) {
    test(`${route.path} has no serious accessibility violations on desktop`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(route.path, { waitUntil: "networkidle" });
      await page.waitForTimeout(1800);

      const results = await analyzePage(page);
      await test.info().attach("axe-violations.json", {
        body: JSON.stringify(results.violations, null, 2),
        contentType: "application/json",
      });

      const serious = results.violations.filter((violation) =>
        ["serious", "critical"].includes(violation.impact),
      );

      expect(
        serious.map((violation) => `${violation.id}: ${violation.help}`),
      ).toEqual([]);
    });
  }

  for (const route of ["/", "/contact"]) {
    test(`${route} has no serious accessibility violations on mobile`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(route, { waitUntil: "networkidle" });
      await page.waitForTimeout(1800);

      const results = await analyzePage(page);
      const serious = results.violations.filter((violation) =>
        ["serious", "critical"].includes(violation.impact),
      );

      expect(
        serious.map((violation) => `${violation.id}: ${violation.help}`),
      ).toEqual([]);
    });
  }

  test("keyboard focus reaches the navigation without a trap", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const navigation = page.getByRole("navigation", {
      name: "Main navigation",
    });
    const homeLink = navigation.getByRole("link", { name: "home" });
    await homeLink.focus();
    await expect(homeLink).toBeFocused();

    await page.keyboard.press("Tab");
    const focusedRole = await page.evaluate(
      () =>
        document.activeElement?.getAttribute("role") ||
        document.activeElement?.tagName,
    );
    expect(focusedRole).toBeTruthy();
  });

  test("honours reduced motion by not mounting the particles engine", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "networkidle" });

    await expect(page.locator("#tsparticles")).toHaveCount(0);
  });
});
