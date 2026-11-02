import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const MANIFEST_PATH = path.join(".next", "build-manifest.json");
const BASELINE_PATH = path.join("scripts", "bundle-baseline.json");
const updateBaseline =
  process.argv.includes("--update") ||
  process.env.UPDATE_BUNDLE_BASELINE === "1";

if (!fs.existsSync(MANIFEST_PATH)) {
  console.error(
    "Missing .next/build-manifest.json. Run `npm run build` before checking the bundle budget.",
  );
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));

/**
 * Sum the JS delivered for a route. Files are concatenated before compression
 * so gzip is measured consistently even when the bundler changes chunking.
 */
export function measureRoutes(manifestObject) {
  const appChunks = manifestObject.pages?.["/_app"] ?? [];
  const measurements = {};

  for (const [route, routeFiles] of Object.entries(
    manifestObject.pages ?? {},
  )) {
    if (route.startsWith("/_")) continue;

    const files = [...new Set([...appChunks, ...routeFiles])].filter((file) =>
      file.endsWith(".js"),
    );
    const buffers = [];

    for (const file of files) {
      const absolute = path.join(".next", file);
      if (fs.existsSync(absolute)) {
        buffers.push(fs.readFileSync(absolute));
      }
    }

    const concatenated = Buffer.concat(buffers);
    measurements[route] = {
      rawBytes: concatenated.length,
      gzipBytes: zlib.gzipSync(concatenated, { level: 9 }).length,
    };
  }

  return measurements;
}

const current = measureRoutes(manifest);

if (updateBaseline || !fs.existsSync(BASELINE_PATH)) {
  const baseline = {
    methodology:
      "Route JS = union of _app chunks and route chunks from .next/build-manifest.json, concatenated then gzipped at level 9.",
    generatedAt: new Date().toISOString().slice(0, 10),
    tolerance: 0.1,
    routes: current,
  };

  fs.writeFileSync(BASELINE_PATH, `${JSON.stringify(baseline, null, 2)}\n`);
  console.log(
    `${updateBaseline ? "Updated" : "Created"} bundle baseline at ${BASELINE_PATH}`,
  );
  process.exit(0);
}

const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8"));
const tolerance = Number(
  process.env.BUNDLE_BUDGET_TOLERANCE ?? baseline.tolerance ?? 0.1,
);

const failures = [];
const rows = [];

for (const [route, measurement] of Object.entries(current)) {
  const previous = baseline.routes?.[route];

  if (!previous) {
    failures.push(`${route}: new route has no approved bundle baseline`);
    rows.push({ route, change: "new", budget: "-", status: "FAIL" });
    continue;
  }

  const gzipChange =
    (measurement.gzipBytes - previous.gzipBytes) / previous.gzipBytes;
  const rawChange =
    (measurement.rawBytes - previous.rawBytes) / previous.rawBytes;

  const regressed = gzipChange > tolerance || rawChange > tolerance;
  if (regressed) {
    failures.push(
      `${route}: gzip ${(gzipChange * 100).toFixed(1)}%, raw ${(rawChange * 100).toFixed(1)}% (tolerance ${(tolerance * 100).toFixed(0)}%)`,
    );
  }

  rows.push({
    route,
    change: `${(gzipChange * 100).toFixed(1)}%`,
    budget: `${(tolerance * 100).toFixed(0)}%`,
    status: regressed ? "FAIL" : "ok",
  });
}

for (const route of Object.keys(baseline.routes ?? {})) {
  if (!current[route]) {
    console.warn(`warning: baseline route ${route} no longer exists`);
  }
}

console.table(rows);

if (failures.length > 0) {
  console.error("\nBundle budget exceeded:");
  for (const failure of failures) console.error(` - ${failure}`);
  console.error(
    "\nIf the change is intentional and reviewed, regenerate the baseline with `npm run test:bundle -- --update`.",
  );
  process.exit(1);
}

console.log("Bundle budget passed.");
