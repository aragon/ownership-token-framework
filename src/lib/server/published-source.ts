/**
 * Runtime published-content source, fronting published-data.ts. When the
 * publish pipeline is enabled via env it fetches the latest aragon/otf-cms
 * GitHub Release snapshot, validates it against the vendored schemas, and
 * serves it with a short in-process TTL; with no env configured (default,
 * shipped dark) it serves the committed data byte-identically.
 *
 * Hard rule: NEVER throws to the caller. Any fetch/parse/validate failure falls
 * back to committed data and logs a warning.
 */
import {
  type FaqTopic,
  type FrameworkDoc,
  faqSchema,
  frameworkDocSchema,
  type IndexRow,
  indexSchema,
  type Manifest,
  manifestSchema,
  type Provenance,
  type TokenDoc,
  testimonialsSchema,
  tokenDocSchema,
} from "@/lib/schemas"
import {
  getPublishedFaq as getCommittedFaq,
  getPublishedFramework as getCommittedFramework,
  getPublishedIndex as getCommittedIndex,
  getProvenance as getCommittedProvenance,
  getPublishedTokenDoc as getCommittedTokenDoc,
  resolveCommitRef,
} from "@/lib/server/published-data"

// Overridable so a fork can read its own releases.
const CONTENT_REPO = process.env.OTF_CONTENT_REPO ?? "aragon/otf-cms"
const RELEASE_API_URL = `https://api.github.com/repos/${CONTENT_REPO}/releases/latest`
const SNAPSHOT_ASSET_NAME = "snapshot.json"
const USER_AGENT = "otf-dashboard"
/** How long a validated release bundle is served before we revalidate. */
const CACHE_TTL_MS = 60_000
// Whole-operation budget (lookup + asset). A timeout aborts the fetch and falls
// back like any other failure, so a hung GitHub can't block an SSR render.
const REQUEST_TIMEOUT_MS = 8_000

/** A fully validated snapshot bundle composed from the release asset. */
type Bundle = {
  manifest: Manifest
  index: { tokens: IndexRow[] }
  tokens: Map<string, TokenDoc>
  framework: FrameworkDoc
  faq: { topics: FaqTopic[] }
  /** The release's publication time (ISO) — distinct from content last_updated. */
  publishedAt: string | null
}

/**
 * Cross-file integrity: manifest, index rows, and token docs must cover the
 * SAME ids. Per-part schema validation can't catch a shape-valid but incomplete
 * snapshot — e.g. an index row whose token doc is missing links to a /tokens/{id}
 * that 404s. A throw here falls back to committed data.
 */
function assertTokenSetsAgree(
  manifest: Manifest,
  index: { tokens: IndexRow[] },
  tokens: Map<string, TokenDoc>
): void {
  const manifestIds = [...manifest.tokens].sort()
  const indexIds = index.tokens.map((t) => t.id).sort()
  const docIds = [...tokens.keys()].sort()
  const agree =
    manifestIds.length === indexIds.length &&
    manifestIds.length === docIds.length &&
    manifestIds.every((id, i) => id === indexIds[i] && id === docIds[i])
  if (!agree) {
    throw new Error(
      `snapshot token sets disagree (manifest ${manifestIds.length}, index ${indexIds.length}, docs ${docIds.length})`
    )
  }
}

let cachedBundle: Bundle | null = null
let cachedAtMs = 0
/** De-dupes concurrent revalidations so a request burst issues one fetch. */
let inFlight: Promise<Bundle | null> | null = null

/**
 * The publish pipeline is opt-in; anything but "true" serves committed data.
 *
 * TODO(post-migration): this flag is a dark-launch tool. Once runtime reads are
 * trusted, delete it and gate on OTF_CONTENT_TOKEN presence instead (no token →
 * committed; correct for dev/test/CI). The fallback below stays regardless.
 */
export function isReleaseEnabled(): boolean {
  return process.env.OTF_PUBLISHED_RELEASE === "true"
}

/**
 * Fetch + validate the latest release snapshot into a Bundle. Returns null on
 * ANY failure after logging a warning; the caller falls back to committed data.
 */
async function fetchReleaseBundle(): Promise<Bundle | null> {
  const token = process.env.OTF_CONTENT_TOKEN
  try {
    // One time budget shared across both fetches below.
    const signal = AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    const releaseRes = await fetch(RELEASE_API_URL, {
      signal,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: "application/vnd.github+json",
        "User-Agent": USER_AGENT,
      },
    })
    if (!releaseRes.ok) {
      console.warn(
        `[published-source] release lookup failed: ${releaseRes.status} ${releaseRes.statusText}`
      )
      return null
    }
    const release = (await releaseRes.json()) as {
      published_at?: string | null
      assets?: Array<{ name?: string; url?: string }>
    }
    const asset = release.assets?.find((a) => a.name === SNAPSHOT_ASSET_NAME)
    if (!asset?.url) {
      console.warn(
        `[published-source] release has no "${SNAPSHOT_ASSET_NAME}" asset`
      )
      return null
    }

    const assetRes = await fetch(asset.url, {
      signal,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // The GitHub asset API returns the raw bytes only with this Accept.
        Accept: "application/octet-stream",
        "User-Agent": USER_AGENT,
      },
    })
    if (!assetRes.ok) {
      console.warn(
        `[published-source] asset download failed: ${assetRes.status} ${assetRes.statusText}`
      )
      return null
    }

    const raw = (await assetRes.json()) as Record<string, unknown>

    const manifest = manifestSchema.parse(raw.manifest)
    const index = indexSchema.parse(raw.index)
    const framework = frameworkDocSchema.parse(raw.framework)
    const faq = faqSchema.parse(raw.faq)
    // Validated for integrity but not served via this seam's endpoints.
    testimonialsSchema.parse(raw.testimonials)

    const rawTokens = (raw.tokens ?? {}) as Record<string, unknown>
    const tokens = new Map<string, TokenDoc>()
    for (const doc of Object.values(rawTokens)) {
      const parsed = tokenDocSchema.parse(doc)
      tokens.set(parsed.id, parsed)
    }

    assertTokenSetsAgree(manifest, index, tokens)

    return {
      manifest,
      index,
      tokens,
      framework,
      faq,
      publishedAt: release.published_at ?? null,
    }
  } catch (err) {
    console.warn(
      `[published-source] falling back to committed data: ${
        err instanceof Error ? err.message : String(err)
      }`
    )
    return null
  }
}

/**
 * Active release bundle, revalidating on TTL expiry. On a failed revalidation
 * keeps serving the stale bundle rather than dropping to committed data. Null
 * only when release is disabled or no bundle has ever validated.
 */
async function getActiveBundle(): Promise<Bundle | null> {
  if (!isReleaseEnabled()) {
    return null
  }
  const fresh = cachedBundle && Date.now() - cachedAtMs < CACHE_TTL_MS
  if (fresh) {
    return cachedBundle
  }
  // Coalesce concurrent revalidations into one in-flight fetch.
  if (!inFlight) {
    inFlight = fetchReleaseBundle().finally(() => {
      inFlight = null
    })
  }
  const next = await inFlight
  if (next) {
    cachedBundle = next
    cachedAtMs = Date.now()
    return next
  }
  // Revalidation failed — serve the last good bundle if we have one, else the
  // caller falls back to committed data.
  return cachedBundle
}

export async function getProvenance(): Promise<Provenance> {
  const bundle = await getActiveBundle()
  if (!bundle) {
    return getCommittedProvenance()
  }
  return {
    snapshot_id: bundle.manifest.snapshot_id,
    commit_ref: resolveCommitRef(),
    last_updated: bundle.manifest.last_updated,
    published_at: bundle.publishedAt,
    source: "release",
  }
}

export async function getIndex(): Promise<{ tokens: IndexRow[] }> {
  const bundle = await getActiveBundle()
  return bundle ? bundle.index : getCommittedIndex()
}

export async function getTokenDoc(tokenId: string): Promise<TokenDoc | null> {
  const bundle = await getActiveBundle()
  if (!bundle) {
    return getCommittedTokenDoc(tokenId)
  }
  return bundle.tokens.get(tokenId.trim().toLowerCase()) ?? null
}

export async function getFramework(): Promise<FrameworkDoc> {
  const bundle = await getActiveBundle()
  return bundle ? bundle.framework : getCommittedFramework()
}

export async function getFaq(): Promise<{ topics: FaqTopic[] }> {
  const bundle = await getActiveBundle()
  return bundle ? bundle.faq : getCommittedFaq()
}
