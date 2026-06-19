import { createFileRoute } from "@tanstack/react-router"
import {
  handleGetFaq,
  handleMethodNotAllowed,
  handleOptions,
} from "@/lib/server/token-api"

export const Route = createFileRoute("/api/v1/faq")({
  server: {
    handlers: {
      GET: ({ request }) => handleGetFaq(request),
      OPTIONS: () => handleOptions(),
      POST: () => handleMethodNotAllowed(),
      PUT: () => handleMethodNotAllowed(),
      PATCH: () => handleMethodNotAllowed(),
      DELETE: () => handleMethodNotAllowed(),
    },
  },
})
