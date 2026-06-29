import tsConfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

// Standalone test config: deliberately does NOT load the app's vite.config.ts
// plugins (nitro, tanstackStart, tailwind, react), which are build-time only
// and break under the test runner. Only the path-alias resolver is needed.
export default defineConfig({
  plugins: [tsConfigPaths({ projects: ["./tsconfig.json"] })],
  test: {
    environment: "node",
    // Seed the published query cache from generated fixtures (no SSR loader in
    // tests) before each test file.
    setupFiles: ["./src/test-setup.ts"],
    // Union of both layouts: colocated src tests (e.g. url-guard) and the
    // tests/ suite (generated-valid, api-endpoints).
    include: ["src/**/*.{test,spec}.{ts,tsx}", "tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      // Scope coverage to the pure-logic modules under test. Expand this list
      // as new modules get coverage rather than weakening the thresholds.
      include: [
        "src/lib/coingecko.ts",
        "src/lib/framework.ts",
        "src/lib/metadata.ts",
        "src/lib/metrics-data.ts",
        "src/lib/scoring.ts",
        "src/lib/token-data.ts",
        "src/lib/utils.ts",
      ],
      thresholds: {
        statements: 85,
        branches: 80,
        functions: 85,
        lines: 85,
      },
    },
  },
})
