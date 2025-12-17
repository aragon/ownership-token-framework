import { createFileRoute } from "@tanstack/react-router"
import TokenDetail from "@/components/token-detail"

export const Route = createFileRoute("/tokens/$tokenId")({
  component: TokenDetailPage,
})

function TokenDetailPage() {
  const { tokenId } = Route.useParams()
  return <TokenDetail tokenId={tokenId} />
}
