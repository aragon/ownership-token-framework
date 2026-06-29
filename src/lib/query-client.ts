import { QueryClient } from "@tanstack/react-query"

/**
 * Shared QueryClient singleton.
 *
 * Client: the app-wide cache, hydrated from SSR via the router ssr-query
 * integration (src/router.tsx).
 * Server: shared across requests by design — the published data it caches is
 * immutable per deployment snapshot (~90-day update cadence), so cross-request
 * sharing is correct and saves rereads.
 *
 * Lives in its own module (not router.tsx) so data libs can import it without
 * creating an import cycle through the route tree.
 */
export const queryClient = new QueryClient()
