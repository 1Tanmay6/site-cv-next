const ROUTES = [
  { path: "/", heading: /Agentic AI/i },
  { path: "/about", heading: /From Research/i },
  { path: "/services", heading: /My Services/i },
  { path: "/work", heading: /My Work/i },
  { path: "/testimonials", heading: /What Clients Say/i },
  { path: "/contact", heading: /Connect/i },
];

function collectPageErrors(page) {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });
  return errors;
}

async function gotoStable(page, route) {
  await page.goto(route, { waitUntil: "networkidle" });
  // The page transition overlay animates over the viewport for about a second;
  // wait for it to finish before interacting or auditing.
  await page.waitForTimeout(1700);
}

module.exports = { ROUTES, collectPageErrors, gotoStable };
