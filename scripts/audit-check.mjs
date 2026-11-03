import { spawnSync } from "node:child_process";
import fs from "node:fs";

const EXCEPTIONS_PATH = "security/audit-exceptions.json";
const BLOCKING_SEVERITIES = new Set(["high", "critical"]);

function runAudit(extraArguments) {
  const result = spawnSync("npm", ["audit", "--json", ...extraArguments], {
    encoding: "utf8",
    env: process.env,
    maxBuffer: 32 * 1024 * 1024,
  });

  const output = result.stdout?.trim();
  if (!output) {
    throw new Error(
      `npm audit produced no JSON output (status ${result.status}): ${result.stderr?.trim()}`
    );
  }

  return JSON.parse(output);
}

function loadExceptions() {
  if (!fs.existsSync(EXCEPTIONS_PATH)) {
    return [];
  }

  const parsed = JSON.parse(fs.readFileSync(EXCEPTIONS_PATH, "utf8"));
  const exceptions = Array.isArray(parsed.exceptions) ? parsed.exceptions : [];
  const today = new Date();
  const problems = [];

  for (const exception of exceptions) {
    const required = ["package", "owner", "justification", "expires"];
    for (const field of required) {
      if (!exception[field]) {
        problems.push(`Exception for ${exception.package ?? "?"} is missing ${field}`);
      }
    }

    if (typeof exception.reachable !== "boolean") {
      problems.push(
        `Exception for ${exception.package ?? "?"} must record reachability`
      );
    }

    if (exception.expires && new Date(exception.expires) < today) {
      problems.push(
        `Exception for ${exception.package ?? "?"} expired on ${exception.expires}`
      );
    }
  }

  if (problems.length > 0) {
    console.error("Invalid audit exceptions:");
    for (const problem of problems) console.error(` - ${problem}`);
    process.exit(1);
  }

  return exceptions;
}

function advisoryIds(vulnerability) {
  const ids = new Set();

  for (const via of vulnerability.via ?? []) {
    if (typeof via === "string") continue;
    const match = String(via.url ?? "").match(/GHSA-[\w-]+/);
    if (match) ids.add(match[0]);
  }

  return ids;
}

function isCovered(packageName, vulnerability, exceptions) {
  return exceptions.some(
    (exception) =>
      exception.package === packageName &&
      (exception.reachable === false ||
        !exception.advisory ||
        advisoryIds(vulnerability).has(exception.advisory))
  );
}

function evaluate(scope, report, exceptions) {
  const blocking = [];

  for (const [packageName, vulnerability] of Object.entries(
    report.vulnerabilities ?? {}
  )) {
    if (!BLOCKING_SEVERITIES.has(vulnerability.severity)) continue;
    if (isCovered(packageName, vulnerability, exceptions)) continue;

    blocking.push({
      package: packageName,
      severity: vulnerability.severity,
      advisories: [...advisoryIds(vulnerability)],
    });
  }

  const summary = report.metadata?.vulnerabilities ?? {};
  console.log(
    `${scope}: critical=${summary.critical ?? 0} high=${summary.high ?? 0} moderate=${summary.moderate ?? 0} low=${summary.low ?? 0}`
  );

  return blocking;
}

const exceptions = loadExceptions();
const full = runAudit([]);
const production = runAudit(["--omit=dev"]);

const blocking = [
  ...evaluate("full", full, exceptions).map((entry) => ({ scope: "full", ...entry })),
  ...evaluate("production", production, exceptions).map((entry) => ({
    scope: "production",
    ...entry,
  })),
];

if (blocking.length > 0) {
  console.error("\nUnresolved critical/high advisories:");
  for (const entry of blocking) {
    console.error(
      ` - [${entry.scope}] ${entry.package} (${entry.severity}) ${entry.advisories.join(", ")}`
    );
  }
  console.error(
    "\nResolve the advisory or add a time-bound, owned, reachability-assessed exception to security/audit-exceptions.json."
  );
  process.exit(1);
}

console.log("Audit gate passed: no unresolved critical/high advisories.");
