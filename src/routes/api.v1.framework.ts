import { createFileRoute } from "@tanstack/react-router"
import { handleGetFramework } from "@/lib/server/token-api"

export const Route = createFileRoute("/api/v1/framework")({
  server: {
    handlers: {
      GET: () => handleGetFramework(),
    },
  },
})
