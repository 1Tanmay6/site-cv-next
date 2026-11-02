import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.js"],
    include: ["tests/unit/**/*.{test,spec}.{js,jsx}"],
    exclude: ["tests/e2e/**", "node_modules/**", ".next/**"],
    restoreMocks: true,
    clearMocks: true,
    css: false,
  },
});
