import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const baseUrl = process.env.A11Y_BASE_URL || "http://127.0.0.1:3100";
const routes = [
  "/",
  "/about",
  "/services",
  "/work",
  "/testimonials",
  "/contact",
];
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
const page = await context.newPage();

for (const route of routes) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);
  const results = await new AxeBuilder({ page }).withTags(tags).analyze();

  console.log(`\n=== ${route}`);
  if (results.violations.length === 0) {
    console.log("no violations");
    continue;
  }

  for (const violation of results.violations) {
    console.log(
      `[${violation.impact}] ${violation.id}: ${violation.help} (${violation.nodes.length})`,
    );
    for (const node of violation.nodes.slice(0, 6)) {
      console.log(`  - ${node.target.join(" ")}`);
      const detail = node.any?.[0]?.data;
      if (detail) {
        console.log(`    ${JSON.stringify(detail)}`);
      }
    }
  }
}

await browser.close();
