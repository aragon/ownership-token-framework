import { createFileRoute } from "@tanstack/react-router"
import {
  handleGetToken,
  handleMethodNotAllowed,
  handleOptions,
} from "@/lib/server/token-api"

export const Route = createFileRoute("/api/v1/tokens/$tokenId")({
  server: {
    handlers: {
      GET: ({ params, request }) => handleGetToken(params.tokenId, request),
      OPTIONS: () => handleOptions(),
      POST: () => handleMethodNotAllowed(),
      PUT: () => handleMethodNotAllowed(),
      PATCH: () => handleMethodNotAllowed(),
      DELETE: () => handleMethodNotAllowed(),
    },
  },
})
