import { QueryClient } from "@tanstack/react-query"

/**
 * Shared QueryClient singleton.
 *
 * Client: the app-wide cache, hydrated from SSR via the router ssr-query
 * integration (src/router.tsx).
 * Server: shared across requests by design. In committed mode the data is
 * immutable per deploy, so cross-request sharing is trivially correct. In
 * release mode the data can change without a deploy, so freshness is handled
 * by RELEASE_MODE_SSR forcing staleTime:0 per render (src/lib/published-queries.ts)
 * rather than relying on the shared cache.
 *
 * Lives in its own module (not router.tsx) so data libs can import it without
 * an import cycle through the route tree.
 */
export const queryClient = new QueryClient()
