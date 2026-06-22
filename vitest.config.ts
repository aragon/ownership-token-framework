import tsConfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

// Standalone test config: deliberately does NOT load the app's vite.config.ts
// plugins (nitro, tanstackStart, tailwind, react), which are build-time only
// and break under the test runner. Only the path-alias resolver is needed.
export default defineConfig({
  plugins: [tsConfigPaths({ projects: ["./tsconfig.json"] })],
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      // Scope coverage to the pure-logic modules that are under test. Expand
      // this list as new modules get test coverage (e.g. analytics, data
      // loaders) rather than weakening the thresholds below.
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
