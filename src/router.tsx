import { createRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { queryClient } from "./lib/query-client"

// Import the generated route tree
import { routeTree } from "./routeTree.gen"

/**
 * Router factory — TanStack Start calls this per SSR request (and once on the
 * client). The router MUST be fresh per request: SSR streaming state lives on
 * the router instance, and a shared router carries request A's consumed
 * stream into request B ("ReadableStream is locked").
 *
 * The QueryClient stays a shared singleton (src/lib/query-client.ts): the
 * published data it caches is immutable per deployment snapshot, so
 * cross-request sharing is correct — and the data libs read it synchronously.
 */
export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    trailingSlash: "preserve",
  })

  // Dehydrates the query cache into the SSR stream and hydrates it on the
  // client, so loader-ensured published data is synchronously readable on
  // first client render. Also wraps the app in a QueryClientProvider.
  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}
