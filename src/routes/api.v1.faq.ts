import { createFileRoute } from "@tanstack/react-router"
import { handleGetFaq } from "@/lib/server/token-api"

export const Route = createFileRoute("/api/v1/faq")({
  server: {
    handlers: {
      GET: () => handleGetFaq(),
    },
  },
})
