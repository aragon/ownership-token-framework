/**
 * Read-model schemas — the composed, consumer-shaped output under
 * `src/data/generated/` (produced by scripts/compose-data.mjs).
 *
 * These are the shapes the app renders and that the future publish
 * pipeline will serve from KV/R2 — transport changes later, shape doesn't.
 */
import { z } from "zod"
import { tokenAtomSchema } from "./atoms"
import { evidenceSchema, rawCriteriaStatusSchema } from "./common"

/** A criterion as rendered: framework `about` merged, raw status preserved. */
export const composedCriterionSchema = z.strictObject({
  id: z.string(),
  name: z.string(),
  about: z.string(),
  status: rawCriteriaStatusSchema,
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

/** generated/index.json row — the dashboard-table read model (legacy Token shape). */
export const indexRowSchema = z.strictObject({
  ...tokenAtomSchema.shape,
  positive: z.number(),
  neutral: z.number(),
  atRisk: z.number(),
  evidenceEntries: z.number(),
  score: z.strictObject({
    passing: z.number(),
    total: z.number(),
    percentage: z.number(),
  }),
})

export const indexSchema = z.strictObject({
  tokens: z.array(indexRowSchema),
})

/** generated/tokens/<id>.json — the per-token reusable unit. */
export const tokenDocSchema = z.strictObject({
  ...indexRowSchema.shape,
  metrics: z.array(composedMetricSchema),
  score: tokenScoreSchema,
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
  tokens: z.array(z.string()),
})

/**
 * Provenance envelope wrapped around every API response.
 * published_at stays null until the publish pipeline stamps real publishes.
 */
export const provenanceSchema = z.strictObject({
  snapshot_id: z.string(),
  commit_ref: z.string(),
  published_at: z.string().nullable(),
  source: z.enum(["generated", "kv"]),
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
