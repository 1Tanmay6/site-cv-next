import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  {
    rules: {
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["scripts/**/*.mjs", "tests/**/*.{js,jsx}", "*.config.js"],
    rules: {
      "no-console": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
  ]),
]);
