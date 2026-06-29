import tsConfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

// Standalone test config: deliberately does NOT load the app's vite.config.ts
// plugins (nitro, tanstackStart, tailwind, react), which are build-time only
// and break under the test runner. Only the path-alias resolver is needed.
export default defineConfig({
  plugins: [tsConfigPaths({ projects: ["./tsconfig.json"] })],
  test: {
    environment: "node",
    // Union of both layouts: colocated src tests (e.g. url-guard) and the
    // tests/ suite (generated-valid, api-endpoints).
    include: ["src/**/*.{test,spec}.{ts,tsx}", "tests/**/*.test.ts"],
  },
})
