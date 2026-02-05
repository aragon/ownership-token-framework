import { createFileRoute } from "@tanstack/react-router"
import TokenDetail from "@/components/token-detail"
import { generateOpenGraphMetadata } from "@/lib/metadata"
import { getTokenById } from "@/lib/token-data"

export const Route = createFileRoute("/tokens/$tokenId")({
  component: TokenDetailPage,
  head: ({ params }) => {
    const token = getTokenById(params.tokenId)
    const title = `${params.tokenId.toUpperCase()} - Ownership Token Framework`
    const description = token
      ? `${token.description} View governance metrics, evidence entries, and framework assessment for ${token.symbol}.`
      : "View detailed token analysis and governance metrics."
    const image = token?.icon
    const imageAlt = token ? `${token.symbol} token logo` : undefined

    return {
      meta: generateOpenGraphMetadata({
        title,
        description,
        image,
        imageAlt,
        type: "article",
      }),
    }
  },
})

function TokenDetailPage() {
  const { tokenId } = Route.useParams()
  return <TokenDetail tokenId={tokenId} />
}
