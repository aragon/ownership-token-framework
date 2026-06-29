/**
 * Publish-readiness detector — the keystone of the two-tier (preview / Release)
 * model. Given a COMPOSED token doc (read-model shape), it returns a granular
 * list of every UNRESOLVED item. A token is publish-ready ⟺ that list is empty.
 *
 * "Unresolved" items carry a reason, and reasons split by SEVERITY:
 *  - BLOCKING (hold the token out of the production Release):
 *    - "tk":         a field literally equal to the "TK" sentinel (explicit
 *                    "not done" marker — the deliberate deferral signal)
 *    - "regression": a field that was non-empty in the last published Release
 *                    and is now blank/removed (accidental-deletion guard; this
 *                    reason is attached by the CI-side baseline diff, not here)
 *  - ADVISORY (surfaced on the PR for visibility, but shippable — legacy
 *    content is grandfathered, so these never gut the current board):
 *    - "empty":       a field that is blank
 *    - "missing":     a field absent from the doc
 *
 * `unevaluated` is NOT a gap: it's a complete verdict ("we have not
 * evaluated"), tracked separately as coverage (see `coverage()`), never here.
 *
 * Hard-required identity (id/name/symbol) is enforced by Zod upstream, so a
 * token can never compose without them — this layer governs the softer
 * completeness (notes, evidence, optional identity, summaries) plus TK.
 *
 * Pure (no fs, no app imports) so the bundle gate, the preview app, and a CI
 * comment can all call it. This module is vendored by the app verbatim — keep
 * it dependency-light and self-contained.
 */
import { TK } from "./common"

/** One unresolved field, addressed by a dotted path into the token doc. */
export type UnresolvedItem = {
  path: string
  reason: "tk" | "empty" | "missing" | "regression"
}

/** Coverage stat for a token: how many criteria are evaluated vs `unevaluated`. */
export type Coverage = { evaluated: number; unevaluated: number; total: number }

/**
 * Reasons that hold a token out of the production Release. Everything else is
 * advisory — reported on the PR, but the token still publishes (grandfathered).
 */
export const BLOCKING_REASONS: ReadonlySet<UnresolvedItem["reason"]> = new Set([
  "tk",
  "regression",
])

/** Identity fields that must be present, non-empty, and not "TK". */
const IDENTITY_FIELDS = [
  "id",
  "coingeckoId",
  "name",
  "symbol",
  "address",
  "icon",
  "description",
  "infoDescription",
  "network",
] as const

/** links.* sub-fields that must be present, non-empty, and not "TK". */
const LINK_FIELDS = ["website", "twitter", "scan"] as const

/** Statuses that don't require notes/evidence to be considered resolved. */
const EXEMPT_STATUSES = new Set(["reference", "unevaluated"])

const isTk = (v: unknown): boolean => v === TK
const isBlank = (v: unknown): boolean =>
  v === undefined || v === null || (typeof v === "string" && v.trim() === "")

/**
 * Classify a required string field. Returns the unresolved reason, or null if
 * the field carries a real value. Order matters: TK is reported as "tk" even
 * though it is also non-blank, so editors see the sentinel called out.
 */
function classifyText(v: unknown): UnresolvedItem["reason"] | null {
  if (v === undefined) return "missing"
  if (isTk(v)) return "tk"
  if (isBlank(v)) return "empty"
  return null
}

/** Classify a required url field (TK sentinel → "tk", blank → "empty"). */
function classifyUrl(v: unknown): UnresolvedItem["reason"] | null {
  if (v === undefined) return "missing"
  if (isTk(v)) return "tk"
  if (isBlank(v)) return "empty"
  return null
}

/**
 * Return every unresolved item in a composed token doc. Empty ⟺ publish-ready.
 * `doc` is typed loosely on purpose: this runs over composer output that has
 * not necessarily passed Zod yet (partial tokens are schema-valid but WIP).
 */
export function unresolved(doc: any): UnresolvedItem[] {
  const items: UnresolvedItem[] = []

  // 1. Identity fields: present, non-empty, not "TK".
  for (const field of IDENTITY_FIELDS) {
    const reason =
      field === "icon" ? classifyUrl(doc?.[field]) : classifyText(doc?.[field])
    if (reason) items.push({ path: field, reason })
  }

  // 2. links.* — url fields; a "TK" url is unresolved.
  const links = doc?.links
  if (isBlank(links) || typeof links !== "object") {
    items.push({
      path: "links",
      reason: links === undefined ? "missing" : "empty",
    })
  } else {
    for (const key of LINK_FIELDS) {
      const reason = classifyUrl(links[key])
      if (reason) items.push({ path: `links.${key}`, reason })
    }
  }

  // 3. Metrics: each criterion status must be evaluated; notes + evidence must
  //    be resolved for any verdict that isn't reference/unevaluated; each
  //    metric summary must be non-empty / not-TK.
  const metrics: any[] = Array.isArray(doc?.metrics) ? doc.metrics : []
  for (const metric of metrics) {
    const mId = metric?.id ?? "?"

    const summaryReason = classifyText(metric?.summary)
    if (summaryReason) {
      items.push({ path: `metrics.${mId}.summary`, reason: summaryReason })
    }

    const criteria: any[] = Array.isArray(metric?.criteria)
      ? metric.criteria
      : []
    for (const c of criteria) {
      const cId = c?.id ?? "?"
      const base = `metrics.${mId}.criteria.${cId}`
      const status = c?.status

      // `unevaluated` is a COMPLETE verdict ("we have not evaluated"), not a
      // gap — it's tracked as coverage (see `coverage()`), never as unresolved.
      // Notes/evidence are only required for real verdicts; reference and
      // unevaluated are exempt.
      if (!EXEMPT_STATUSES.has(status)) {
        const notesReason = classifyText(c?.notes)
        if (notesReason) {
          items.push({ path: `${base}.notes`, reason: notesReason })
        }
        const evidence = c?.evidence
        if (!Array.isArray(evidence) || evidence.length === 0) {
          items.push({ path: `${base}.evidence`, reason: "empty" })
        }
      }
    }
  }

  return items
}

/**
 * Blocking subset of unresolved items — the ones that hold a token out of the
 * production Release. Advisory items (empty/unevaluated/missing) are excluded.
 * Pass `extra` to fold in items computed elsewhere (e.g. the CI baseline diff's
 * "regression" items) before deciding readiness.
 */
export function blockingUnresolved(
  doc: any,
  extra: UnresolvedItem[] = []
): UnresolvedItem[] {
  return [...unresolved(doc), ...extra].filter((i) =>
    BLOCKING_REASONS.has(i.reason)
  )
}

/**
 * A composed token doc is publish-ready ⟺ it has no BLOCKING unresolved items.
 * Advisory gaps (legacy empty) are grandfathered and still ship. `extra` lets
 * the caller include CI-computed regression items in the decision.
 */
export function isPublishReady(
  doc: any,
  extra: UnresolvedItem[] = []
): boolean {
  return blockingUnresolved(doc, extra).length === 0
}

/**
 * Evaluation coverage for a token — how many criteria carry a real verdict vs
 * are still `unevaluated`. This is informational ("12/18 evaluated"), NOT a
 * gap: an `unevaluated` criterion is a complete, shippable answer.
 */
export function coverage(doc: any): Coverage {
  const metrics: any[] = Array.isArray(doc?.metrics) ? doc.metrics : []
  let unevaluated = 0
  let total = 0
  for (const metric of metrics) {
    const criteria: any[] = Array.isArray(metric?.criteria)
      ? metric.criteria
      : []
    for (const c of criteria) {
      total++
      if (c?.status === "unevaluated") unevaluated++
    }
  }
  return { evaluated: total - unevaluated, unevaluated, total }
}
