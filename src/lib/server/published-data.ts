/**
 * Committed-data source: the composed read models in src/data/generated/.
 * published-source.ts fronts this, serving the Release snapshot in release mode
 * and falling back here otherwise (identical response shape either way).
 */
import faqData from "@/data/generated/faq.json"
import frameworkData from "@/data/generated/framework.json"
import indexData from "@/data/generated/index.json"
import manifestData from "@/data/generated/manifest.json"
import type {
  FaqTopic,
  FrameworkDoc,
  IndexRow,
  Manifest,
  Provenance,
  TokenDoc,
} from "@/lib/schemas"

const manifest = manifestData as Manifest

const tokenDocModules = import.meta.glob<{ default: TokenDoc }>(
  "../../data/generated/tokens/*.json",
  { eager: true }
)

const tokenDocs = new Map(
  Object.values(tokenDocModules).map((mod) => [mod.default.id, mod.default])
)

/**
 * Commit ref from the deployment env, "dev" outside CI/deploy so the field is
 * never null. Exported so the release seam stamps the same value.
 */
export function resolveCommitRef(): string {
  return (
    process.env.VERCEL_GIT_COMMIT_SHA ??
    process.env.CF_PAGES_COMMIT_SHA ??
    process.env.GITHUB_SHA ??
    "dev"
  )
}

export function getProvenance(): Provenance {
  return {
    snapshot_id: manifest.snapshot_id,
    commit_ref: resolveCommitRef(),
    last_updated: manifest.last_updated,
    // Stamped by the publish pipeline once snapshots are published; distinct
    // from last_updated.
    published_at: null,
    source: "generated",
  }
}

export function getPublishedIndex(): { tokens: IndexRow[] } {
  return indexData as { tokens: IndexRow[] }
}

export function getPublishedTokenDoc(tokenId: string): TokenDoc | null {
  return tokenDocs.get(tokenId.trim().toLowerCase()) ?? null
}

export function getPublishedFramework(): FrameworkDoc {
  return frameworkData as FrameworkDoc
}

export function getPublishedFaq(): { topics: FaqTopic[] } {
  return faqData as { topics: FaqTopic[] }
}
