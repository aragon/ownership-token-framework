import { createFileRoute } from "@tanstack/react-router"
import TokenDetail from "@/components/token-detail"

export const Route = createFileRoute("/tokens/$tokenId")({
  component: TokenDetailPage,
  head: ({ params }) => {
    return {
      meta: [
        {
          title: `${params.tokenId.toUpperCase()} - Ownership Token Framework`,
        },
      ],
    }
  },
})

function TokenDetailPage() {
  const { tokenId } = Route.useParams()
  return <TokenDetail tokenId={tokenId} />
}
