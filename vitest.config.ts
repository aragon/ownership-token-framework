import { defineConfig } from "vitest/config"
import tsConfigPaths from "vite-tsconfig-paths"

// Standalone test config: deliberately does NOT load the app's vite.config.ts
// plugins (nitro, tanstackStart, tailwind, react), which are build-time only
// and break under the test runner. Only the path-alias resolver is needed.
export default defineConfig({
  plugins: [tsConfigPaths({ projects: ["./tsconfig.json"] })],
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
})
