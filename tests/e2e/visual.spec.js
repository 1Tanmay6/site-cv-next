const { test, expect } = require("@playwright/test");

const CASES = [
  { name: "home", route: "/" },
  { name: "services", route: "/services" },
  { name: "contact", route: "/contact" },
];

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "desktop", width: 1440, height: 900 },
];

test.describe("visual regression", () => {
  for (const testCase of CASES) {
    for (const viewport of VIEWPORTS) {
      test(`${testCase.name} at ${viewport.name}`, async ({
        page,
      }, testInfo) => {
        test.skip(
          testInfo.project.name !== "chromium",
          "Screenshot baselines are maintained for Chromium only.",
        );

        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });
        await page.goto(testCase.route, { waitUntil: "networkidle" });
        await page.waitForTimeout(2_000);

        await expect(page).toHaveScreenshot(
          `${testCase.name}-${viewport.name}.png`,
          { animations: "disabled" },
        );
      });
    }
  }
});
