import { createFileRoute } from "@tanstack/react-router"
import {
  handleGetFramework,
  handleMethodNotAllowed,
  handleOptions,
} from "@/lib/server/token-api"

export const Route = createFileRoute("/api/v1/framework")({
  server: {
    handlers: {
      GET: ({ request }) => handleGetFramework(request),
      OPTIONS: () => handleOptions(),
      POST: () => handleMethodNotAllowed(),
      PUT: () => handleMethodNotAllowed(),
      PATCH: () => handleMethodNotAllowed(),
      DELETE: () => handleMethodNotAllowed(),
    },
  },
})
