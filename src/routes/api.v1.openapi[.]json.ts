import { createFileRoute } from "@tanstack/react-router"
import {
  handleGetOpenApi,
  handleMethodNotAllowed,
  handleOptions,
} from "@/lib/server/token-api"

export const Route = createFileRoute("/api/v1/openapi.json")({
  server: {
    handlers: {
      GET: ({ request }) => handleGetOpenApi(request),
      OPTIONS: () => handleOptions(),
      POST: () => handleMethodNotAllowed(),
      PUT: () => handleMethodNotAllowed(),
      PATCH: () => handleMethodNotAllowed(),
      DELETE: () => handleMethodNotAllowed(),
    },
  },
})
