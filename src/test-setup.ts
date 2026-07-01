/**
 * Seed the published query cache from the committed generated read-models.
 *
 * The data libs read published data synchronously via getQueryData, relying on
 * a route loader (or SSR hydration) to have populated it. The test runner has
 * no loader, so seed the same cache here from src/data/generated/* before any
 * test runs (vitest runs setupFiles ahead of each module, isolated client per
 * file).
 */

import {
  publishedFrameworkQuery,
  publishedIndexQuery,
  publishedTokenDocQuery,
} from "@/lib/published-queries"
import { queryClient } from "@/lib/query-client"
import type { FrameworkDoc, IndexRow, TokenDoc } from "@/lib/schemas"
import frameworkData from "./data/generated/framework.json"
import indexData from "./data/generated/index.json"

queryClient.setQueryData(
  publishedIndexQuery.queryKey,
  indexData as { tokens: IndexRow[] }
)
queryClient.setQueryData(
  publishedFrameworkQuery.queryKey,
  frameworkData as unknown as FrameworkDoc
)

// All per-token docs, so getTokenDoc / getMetricsByTokenId resolve.
const tokenDocs = import.meta.glob("./data/generated/tokens/*.json", {
  eager: true,
})
for (const mod of Object.values(tokenDocs)) {
  const doc = (mod as { default: TokenDoc }).default
  queryClient.setQueryData(publishedTokenDocQuery(doc.id).queryKey, doc)
}
