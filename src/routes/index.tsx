import { createFileRoute } from "@tanstack/react-router"
import TokenOwnershipAnalytics from "@/components/token-ownership-analytics"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return <TokenOwnershipAnalytics />
}
