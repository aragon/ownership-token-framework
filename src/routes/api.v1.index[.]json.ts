import { createFileRoute } from "@tanstack/react-router"
import {
  handleGetDiscovery,
  handleMethodNotAllowed,
  handleOptions,
} from "@/lib/server/token-api"

export const Route = createFileRoute("/api/v1/index.json")({
  server: {
    handlers: {
      GET: ({ request }) => handleGetDiscovery(request),
      OPTIONS: () => handleOptions(),
      POST: () => handleMethodNotAllowed(),
      PUT: () => handleMethodNotAllowed(),
      PATCH: () => handleMethodNotAllowed(),
      DELETE: () => handleMethodNotAllowed(),
    },
  },
})
