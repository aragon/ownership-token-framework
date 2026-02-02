import { createRouter } from "@tanstack/react-router"

// Import the generated route tree
import { routeTree } from "./routeTree.gen"

// Create a new router instance
export const router = createRouter({
  routeTree,
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
})

// Legacy function export for backward compatibility
export const getRouter = () => router
