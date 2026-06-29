/**
 * Read-model schemas — the composed, consumer-shaped output under
 * `src/data/generated/` (produced by scripts/compose-data.ts).
 *
 * These are the shapes the app renders and that the publish pipeline serves
 * from GitHub Release snapshots — transport changes later, shape doesn't.
 */
import { z } from "zod"
import { tokenAtomSchema } from "./atoms"
import { criteriaStatusSchema, evidenceSchema } from "./common"

/** A criterion as rendered: framework `about` merged, canonical status. */
export const composedCriterionSchema = z.strictObject({
  id: z.string(),
  name: z.string(),
  about: z.string(),
  status: criteriaStatusSchema,
  notes: z.string(),
  tags: z.array(z.string()).optional(),
  evidence: z.array(evidenceSchema).optional(),
})

/** A metric as rendered: display name + framework about + editorial summary. */
export const composedMetricSchema = z.strictObject({
  id: z.string(),
  name: z.string(),
  about: z.string(),
  summary: z.string(),
  tags: z.array(z.string()),
  criteria: z.array(composedCriterionSchema),
})

export const metricScoreSchema = z.strictObject({
  metricId: z.string(),
  metricName: z.string(),
  passing: z.number(),
  total: z.number(),
  percentage: z.number(),
  evaluated: z.boolean(),
  reference: z.boolean(),
})

export const tokenScoreSchema = z.strictObject({
  tokenId: z.string(),
  passing: z.number(),
  total: z.number(),
  percentage: z.number(),
  metrics: z.array(metricScoreSchema),
})

/**
 * Derived status counts. NOTE: computed from evaluations at compose time —
 * the hand-maintained counts in the legacy tokens.json were stale for all
 * 11 tokens and were dropped in the atom migration.
 */
export const tokenCountsSchema = z.strictObject({
  positive: z.number(),
  neutral: z.number(),
  atRisk: z.number(),
  evidenceEntries: z.number(),
})

/**
 * generated/index.json row — the dashboard-table read model (legacy Token
 * shape). Carries the FULL token score (per-metric breakdown feeds the score
 * hover) and a flat criterion-status map (single-criterion columns across all
 * tokens) so the dashboard needs only this one read model.
 */
export const indexRowSchema = z.strictObject({
  ...tokenAtomSchema.shape,
  positive: z.number(),
  neutral: z.number(),
  atRisk: z.number(),
  evidenceEntries: z.number(),
  score: tokenScoreSchema,
  criteriaStatuses: z.record(z.string(), criteriaStatusSchema),
})

export const indexSchema = z.strictObject({
  tokens: z.array(indexRowSchema),
})

/** generated/tokens/<id>.json — the per-token reusable unit (index row + full metrics). */
export const tokenDocSchema = z.strictObject({
  ...indexRowSchema.shape,
  metrics: z.array(composedMetricSchema),
})

/** generated/framework.json — definitions + anchors + base URL. */
export const frameworkDocSchema = z.strictObject({
  baseUrl: z.string(),
  metrics: z.array(
    z.strictObject({
      id: z.string(),
      name: z.string(),
      displayName: z.string(),
      about: z.string(),
      anchor: z.string().optional(),
      criteria: z.array(
        z.strictObject({
          id: z.string(),
          name: z.string(),
          about: z.string(),
        })
      ),
    })
  ),
})

/** generated/manifest.json — deterministic snapshot identity for the composed set. */
export const manifestSchema = z.strictObject({
  /** Content hash over the composed output; future R2 snapshot key component. */
  snapshot_id: z.string(),
  /** Most-recent editorial edit across the set (ISO); null if none carry one. */
  last_updated: z.string().nullable(),
  tokens: z.array(z.string()),
})

/**
 * Provenance envelope wrapped around every API response.
 * - last_updated: when the content was last edited (from the CMS).
 * - published_at: when this snapshot was published; stays null until the
 *   publish pipeline stamps real publishes. Kept distinct from last_updated.
 */
export const provenanceSchema = z.strictObject({
  snapshot_id: z.string(),
  commit_ref: z.string(),
  last_updated: z.string().nullable(),
  published_at: z.string().nullable(),
  source: z.enum(["generated", "release"]),
})

export const apiErrorSchema = z.strictObject({
  error: z.strictObject({
    code: z.string(),
    message: z.string(),
  }),
})

export type ComposedCriterion = z.infer<typeof composedCriterionSchema>
export type ComposedMetric = z.infer<typeof composedMetricSchema>
export type MetricScore = z.infer<typeof metricScoreSchema>
export type TokenScore = z.infer<typeof tokenScoreSchema>
export type TokenCounts = z.infer<typeof tokenCountsSchema>
export type IndexRow = z.infer<typeof indexRowSchema>
export type TokenDoc = z.infer<typeof tokenDocSchema>
export type FrameworkDoc = z.infer<typeof frameworkDocSchema>
export type Manifest = z.infer<typeof manifestSchema>
export type Provenance = z.infer<typeof provenanceSchema>
export type ApiError = z.infer<typeof apiErrorSchema>
