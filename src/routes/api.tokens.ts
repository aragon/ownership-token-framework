import { createFileRoute } from "@tanstack/react-router"
import { handleGetTokens } from "@/lib/server/token-api"

export const Route = createFileRoute("/api/tokens")({
  server: {
    handlers: {
      GET: () => handleGetTokens(),
    },
  },
})
