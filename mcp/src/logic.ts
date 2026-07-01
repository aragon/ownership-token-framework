/**
 * Pure tool logic for the OTF MCP — filtering, search, fuzzy matching, and the
 * self-healing "next best action" guidance. Extracted from index.ts so every
 * branch is unit-testable without spinning up the stdio server.
 *
 * Guidance contract (anti-loop). An empty result is one of two very different
 * things, and the guidance must say which so an agent never loops:
 *   - CORRECTABLE — the input was malformed (unknown criterion, typo'd token).
 *     Guidance offers the valid values / a "did you mean", so a single corrected
 *     retry converges.
 *   - COMPLETE — a well-formed query that genuinely has no matches (a valid
 *     criterion+status no token holds, or a token OTF simply hasn't analyzed).
 *     Guidance states "0 is the correct answer, do not retry", so the agent
 *     stops instead of endlessly relaxing filters or guessing token ids.
 */
import type { TokenIndexRow } from "./client.js"

export const STATUS_VOCAB = [
  "positive",
  "warning",
  "at_risk",
  "unevaluated",
  "reference",
] as const
export type Status = (typeof STATUS_VOCAB)[number]

/** Levenshtein edit distance — small, dependency-free, for "did you mean". */
export function editDistance(a: string, b: string): number {
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m
  let prev = Array.from({ length: n + 1 }, (_, i) => i)
  for (let i = 1; i <= m; i++) {
    const cur = [i]
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      )
    }
    prev = cur
  }
  return prev[n]
}

/**
 * Closest candidates to `query`: substring hits rank first, then near edit
 * distance. Tolerance scales with query length (so "lido" → "ldo" but not to an
 * unrelated id). Deduped, lowercased, capped at `max`.
 */
export function closest(
  query: string,
  candidates: string[],
  max = 3
): string[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const tolerance = Math.max(2, Math.floor(q.length / 3))
  const uniq = [
    ...new Set(candidates.filter((c) => c).map((c) => c.toLowerCase())),
  ]
  return uniq
    .map((c) => ({
      c,
      d: c.includes(q) || q.includes(c) ? 0 : editDistance(q, c),
    }))
    .filter((x) => x.d <= tolerance)
    .sort((a, b) => a.d - b.d)
    .slice(0, max)
    .map((x) => x.c)
}

/** Rows → the sorted, deduped set of criterion ids present across their status maps. */
export function criterionIdsIn(rows: TokenIndexRow[]): string[] {
  return [
    ...new Set(rows.flatMap((r) => Object.keys(r.criteriaStatuses ?? {}))),
  ].sort()
}

/** Rows → the sorted, deduped set of networks present (lowercased). */
export function networksIn(rows: TokenIndexRow[]): string[] {
  return [
    ...new Set(
      rows.map((r) => (r.network ?? "").toLowerCase()).filter((n) => n)
    ),
  ].sort()
}

/** Count of each status value seen for one criterion across all rows. */
function statusDistribution(
  rows: TokenIndexRow[],
  criterion: string
): Record<string, number> {
  const dist: Record<string, number> = {}
  for (const r of rows) {
    const s = r.criteriaStatuses?.[criterion]
    if (s) dist[s] = (dist[s] ?? 0) + 1
  }
  return dist
}

export interface TokenFilters {
  network?: string
  minScorePercentage?: number
  criterion?: string
  status?: Status
}

export interface FilterResult {
  rows: TokenIndexRow[]
  guidance?: string
}

/**
 * Apply the list_tokens filters and, when the result is empty, attach the
 * appropriate CORRECTABLE-vs-COMPLETE guidance (see the module header).
 */
export function filterTokens(
  all: TokenIndexRow[],
  f: TokenFilters
): FilterResult {
  let rows = all
  const notes: string[] = []

  if (f.network) {
    const want = f.network.toLowerCase()
    rows = rows.filter((r) => (r.network ?? "").toLowerCase() === want)
    if (rows.length === 0) {
      notes.push(
        `No tokens on network "${f.network}" (networks present: ${networksIn(all).join(", ")}). ` +
          "If that was a typo, retry with a listed network; otherwise 0 is the correct answer."
      )
    }
  }

  if (typeof f.minScorePercentage === "number") {
    const min = f.minScorePercentage
    rows = rows.filter((r) => (r.score?.percentage ?? -1) >= min)
  }

  if (f.criterion) {
    const criterion = f.criterion
    const valid = criterionIdsIn(all)
    if (!valid.includes(criterion)) {
      const near = closest(criterion, valid)
      notes.push(
        `Unknown criterion "${criterion}" — retry with a valid id.` +
          (near.length ? ` Did you mean: ${near.join(", ")}?` : "") +
          ` Valid criterion ids (${valid.length}) look like '<metric>__<criterion>', ` +
          `e.g. ${valid.slice(0, 4).join(", ")}… — full list via get_framework.`
      )
      rows = []
    } else if (f.status) {
      const status = f.status
      rows = rows.filter((r) => r.criteriaStatuses?.[criterion] === status)
      if (rows.length === 0) {
        notes.push(
          `Complete result (0 is correct, not an error): criterion "${criterion}" is valid ` +
            `and genuinely has 0 tokens at status "${status}". Real distribution: ` +
            `${JSON.stringify(statusDistribution(all, criterion))} — re-query only if you meant ` +
            "one of those statuses; do not repeat this query."
        )
      }
    } else {
      notes.push(
        `Criterion "${criterion}" was set without status, so it did not filter. ` +
          `Add status (${STATUS_VOCAB.join("|")}) to select by criterion status.`
      )
    }
  }

  let guidance = notes.join(" ") || undefined
  if (!guidance && rows.length === 0) {
    guidance =
      "Complete result (0 is correct, not an error): all filters are valid and no token " +
      "satisfies them together. This is likely the real answer — broaden only if the emptiness " +
      "is genuinely unexpected, and do not repeat the identical query."
  }
  return { rows, guidance }
}

export interface SearchResult {
  matches: TokenIndexRow[]
  guidance?: string
}

/**
 * Substring search over id/name/symbol. On no match, distinguish "close id
 * exists (typo)" from "OTF has not analyzed this" so the agent stops rather
 * than searching variants forever.
 */
export function searchTokens(
  all: TokenIndexRow[],
  query: string
): SearchResult {
  const q = query.trim().toLowerCase()
  const matches = all.filter((r) =>
    [r.id, r.name, r.symbol]
      .filter((v): v is string => typeof v === "string")
      .some((v) => v.toLowerCase().includes(q))
  )
  if (matches.length > 0) return { matches }

  const ids = all.map((r) => r.id)
  const near = closest(query, ids)
  const guidance = near.length
    ? `No exact match for "${query}", but close ids exist: ${near.join(", ")} — ` +
      'try get_token on one. Ids are short symbols (Lido → "ldo").'
    : `Complete result (not an error): no OTF token matches "${query}". OTF covers ` +
      `${ids.length} tokens (${ids.join(", ")}); "${query}" is likely not analyzed. ` +
      "Do not keep searching variants."
  return { matches, guidance }
}

/**
 * Guidance for a get_token 404: typo of a real id ("did you mean") vs a token
 * OTF genuinely hasn't analyzed (COMPLETE — do not retry variants).
 */
export function tokenNotFoundGuidance(id: string, ids: string[]): string {
  const near = closest(id, ids)
  return near.length
    ? `Likely a typo — did you mean: ${near.join(", ")}? Retry once with a valid id. ` +
        "Ids are short symbols (Lido → 'ldo')."
    : `Complete answer (not an error): OTF has not analyzed "${id}" — it is not among the ` +
        `${ids.length} covered tokens (${ids.join(", ")}). The token is not in the dataset; ` +
        "do not retry with variants."
}
