// @ts-check
const { defineConfig, devices } = require("@playwright/test");

const PORT = 3100;
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${PORT}`;

module.exports = defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: `npm run clean && npm run build && npm run start -- --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    env: {
      CONTACT_MAIL_TRANSPORT: "json",
      MAIL_FROM: "portfolio@example.com",
      MAIL_TO: "owner@example.com",
      CONTACT_RATE_LIMIT_MAX: "5",
      CONTACT_RATE_LIMIT_WINDOW_MS: "60000",
      CONTACT_GLOBAL_RATE_LIMIT_MAX: "1000",
      CONTACT_ALLOWED_ORIGINS: baseURL,
    },
  },
});
