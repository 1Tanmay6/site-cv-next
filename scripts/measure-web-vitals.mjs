import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const BASE_URL = process.env.PERF_BASE_URL || "http://127.0.0.1:3100";
const BASELINE_PATH = path.join("scripts", "web-vitals-baseline.json");
const RUNS = Number.parseInt(process.env.PERF_RUNS ?? "3", 10);
const TOLERANCE = Number.parseFloat(process.env.PERF_TOLERANCE ?? "0.2");
const updateBaseline = process.argv.includes("--update");

const ROUTES = [
  "/",
  "/about",
  "/services",
  "/work",
  "/testimonials",
  "/contact",
];

function median(values) {
  const sorted = values
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);
  if (sorted.length === 0) return null;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[middle - 1] + sorted[middle]) / 2)
    : sorted[middle];
}

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});

await context.addInitScript(() => {
  window.__portfolioVitals = { lcp: 0, cls: 0 };
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      window.__portfolioVitals.lcp = entry.startTime;
    }
  }).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        window.__portfolioVitals.cls += entry.value;
      }
    }
  }).observe({ type: "layout-shift", buffered: true });
});

const page = await context.newPage();
const results = {};

for (const route of ROUTES) {
  const samples = [];

  for (let run = 0; run < RUNS; run += 1) {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
    // Let the full-screen page-transition wipe finish, then measure layout
    // stability of the actual content. The transition itself animates width
    // and is a pre-existing, uniform CLS source on every route.
    await page.waitForTimeout(1_500);
    await page.evaluate(() => {
      window.__portfolioVitals.cls = 0;
    });
    await page.waitForTimeout(800);

    samples.push(
      await page.evaluate(() => {
        const navigation = performance.getEntriesByType("navigation")[0];
        return {
          ttfbMs: navigation ? Math.round(navigation.responseStart) : null,
          loadMs: navigation ? Math.round(navigation.loadEventEnd) : null,
          lcpMs: Math.round(window.__portfolioVitals.lcp),
          cls: Number(window.__portfolioVitals.cls.toFixed(4)),
        };
      }),
    );
  }

  results[route] = {
    ttfbMs: median(samples.map((sample) => sample.ttfbMs)),
    loadMs: median(samples.map((sample) => sample.loadMs)),
    lcpMs: median(samples.map((sample) => sample.lcpMs)),
    cls: median(samples.map((sample) => sample.cls)),
  };
}

await browser.close();

if (updateBaseline || !fs.existsSync(BASELINE_PATH)) {
  fs.writeFileSync(
    BASELINE_PATH,
    `${JSON.stringify(
      {
        methodology:
          "Chromium production build, reduced motion, median of PERF_RUNS (default 3) runs per route. LCP is measured from navigation; CLS is measured after the pre-existing page-transition wipe settles.",
        generatedAt: new Date().toISOString().slice(0, 10),
        tolerance: TOLERANCE,
        routes: results,
      },
      null,
      2,
    )}\n`,
  );
  console.log(`Updated Web Vitals baseline at ${BASELINE_PATH}`);
  process.exit(0);
}

const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8"));
const regressions = [];
const absoluteFloors = {
  ttfbMs: 10,
  loadMs: 15,
  lcpMs: 15,
  cls: 0.02,
};

for (const [route, metrics] of Object.entries(results)) {
  const previous = baseline.routes[route];
  console.log(`\n${route}`);
  console.log(
    `  TTFB ${metrics.ttfbMs}ms (baseline ${previous.ttfbMs}ms), LCP ${metrics.lcpMs}ms (baseline ${previous.lcpMs}ms), CLS ${metrics.cls} (baseline ${previous.cls})`,
  );

  for (const key of ["ttfbMs", "loadMs", "lcpMs", "cls"]) {
    const before = previous[key];
    const after = metrics[key];
    if (!Number.isFinite(before) || !Number.isFinite(after) || before === 0) {
      continue;
    }
    const change = (after - before) / before;
    const budget = Math.max(absoluteFloors[key], before * TOLERANCE);
    if (after - before > budget) {
      regressions.push(
        `${route} ${key}: ${after} vs ${before} (change ${(change * 100).toFixed(1)}%, budget +${budget.toFixed(2)})`,
      );
    }
  }
}

if (regressions.length > 0) {
  console.error("\nWeb Vitals regressions:");
  for (const regression of regressions) console.error(` - ${regression}`);
  console.error(
    "\nRe-run on a quiet machine. If the change is intentional, update with `npm run perf:measure:update`.",
  );
  process.exit(1);
}

console.log("\nWeb Vitals baseline check passed.");
