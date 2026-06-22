import { createRouter as createTanStackRouter } from "@tanstack/react-router"

// Import the generated route tree
import { routeTree } from "./routeTree.gen"

// Return a NEW router per call, never a singleton: TanStack Start mutates the
// returned router with each request's URL, so a shared instance would leak one
// request's location into another under concurrency.
export function getRouter() {
  return createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    trailingSlash: "preserve",
  })
}
