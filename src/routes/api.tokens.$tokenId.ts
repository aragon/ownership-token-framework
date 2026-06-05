import { createFileRoute } from "@tanstack/react-router"
import { handleGetToken } from "@/lib/server/token-api"

export const Route = createFileRoute("/api/tokens/$tokenId")({
  server: {
    handlers: {
      GET: ({ params }) => handleGetToken(params.tokenId),
    },
  },
})
