/**
 * Published-data source for the canonical API endpoints.
 *
 * This is the transport seam: today it reads the committed composed read
 * models (src/data/generated/); when the publish pipeline lands, a KV-backed
 * implementation replaces the internals without any response-shape change —
 * consumers depend only on this module's interface.
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
 * Commit ref resolved from the deployment environment at request time.
 * Falls back to "dev" outside CI/deploy contexts so the field is never null.
 */
function resolveCommitRef(): string {
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
    // When the content was last edited (carried in the composed manifest).
    last_updated: manifest.last_updated,
    // Stamped by the publish pipeline once snapshots are actually published;
    // kept distinct from last_updated.
    published_at: null,
    source: "generated",
  }
}

// DEMO_ONLY (throwaway, do not merge): isolate the dataset to a single token
// for a client preview. Strips every other token from the UI, direct URLs, and
// /api/v1 — the only token reachable on this deploy is the one below.
const DEMO_ONLY_TOKEN = "cow"

export function getPublishedIndex(): { tokens: IndexRow[] } {
  return {
    tokens: (indexData as { tokens: IndexRow[] }).tokens.filter(
      (t) => t.id === DEMO_ONLY_TOKEN
    ),
  }
}

export function getPublishedTokenDoc(tokenId: string): TokenDoc | null {
  if (tokenId.trim().toLowerCase() !== DEMO_ONLY_TOKEN) {
    return null
  }
  return tokenDocs.get(DEMO_ONLY_TOKEN) ?? null
}

export function getPublishedFramework(): FrameworkDoc {
  return frameworkData as FrameworkDoc
}

export function getPublishedFaq(): { topics: FaqTopic[] } {
  return faqData as { topics: FaqTopic[] }
}

export function listPublishedTokenIds(): string[] {
  return manifest.tokens
}
