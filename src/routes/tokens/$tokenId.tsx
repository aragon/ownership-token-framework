import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import TokenDetail from "@/components/token-detail"
import { generateOpenGraphMetadata } from "@/lib/metadata"
import { publishedTokenDocQuery, readPublished } from "@/lib/published-queries"
import { queryClient } from "@/lib/query-client"
import { getTokenById } from "@/lib/token-data"

export const Route = createFileRoute("/tokens/$tokenId")({
  // The detail page reads the full composed token doc (metrics, criteria,
  // evidence) synchronously from the query cache — ensure it before render.
  loader: async ({ params }) => {
    await readPublished(queryClient, publishedTokenDocQuery(params.tokenId))
  },
  component: TokenDetailPage,
  head: ({ params }) => {
    const token = getTokenById(params.tokenId)
    const title = `${params.tokenId.toUpperCase()} - Ownership Token Framework`
    const description = token
      ? `${token.description} View governance metrics, evidence entries, and framework assessment for ${token.symbol}.`
      : "View detailed token analysis and governance metrics."

    const image = `/og-images/tokens-${params.tokenId}.png`
    const imageAlt = token ? `${token.symbol} token logo` : "Token details"

    return {
      meta: generateOpenGraphMetadata({
        title,
        description,
        image,
        imageAlt,
        type: "article",
        url: `/tokens/${params.tokenId}`,
      }),
    }
  },
})

function TokenDetailPage() {
  const { tokenId } = Route.useParams()
  // Keep the token doc observed (no GC, SWR) so the synchronous getTokenDoc
  // read in <TokenDetail> always finds it. Suspends on an empty cache instead
  // of throwing, caught by the root Suspense boundary.
  useSuspenseQuery(publishedTokenDocQuery(tokenId))
  return <TokenDetail tokenId={tokenId} />
}
