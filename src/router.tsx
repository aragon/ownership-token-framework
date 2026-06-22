import { createRouter as createTanStackRouter } from "@tanstack/react-router"

// Import the generated route tree
import { routeTree } from "./routeTree.gen"

// IMPORTANT: return a NEW router instance on every call — never a shared
// singleton. TanStack Start calls getRouter() for each request and then mutates
// the returned instance with that request's URL
// (`router.update({ history: createMemoryHistory({ initialEntries: [href] }) })`).
// A module-level singleton is therefore shared across concurrent requests on the
// same server instance, so one request's history/redirect state leaks into
// another — which produced intermittent 307s with a `Location` taken from a
// different request's path.
export function getRouter() {
  return createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    trailingSlash: "preserve",
  })
}
