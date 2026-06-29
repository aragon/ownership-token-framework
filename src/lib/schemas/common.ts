import { z } from "zod"

/**
 * Publish-readiness sentinel. A field is either a real value or the literal
 * "TK" (a deferral marker borrowed from editorial usage). Schemas stay lenient
 * so partial tokens still validate and previews build; the publish gate
 * (schemas/readiness.ts) treats "TK" — like empty and `unevaluated` — as
 * UNRESOLVED and excludes the token from Release.
 */
export const TK = "TK" as const

/** A url field that may be deferred with the TK sentinel. */
export const tkUrlSchema = z.union([z.url(), z.literal(TK)])

/** A free-text field that may be deferred with the TK sentinel. */
export const tkTextSchema = z.string()

/**
 * Canonical criteria workflow statuses — the ONLY valid vocabulary.
 * Non-canonical values are a validation failure by design (ADR 0002):
 * there is no runtime mapping/normalization layer for dialect statuses.
 */
export const CRITERIA_STATUS = {
  POSITIVE: "positive",
  WARNING: "warning",
  AT_RISK: "at_risk",
  UNEVALUATED: "unevaluated",
  REFERENCE: "reference",
} as const

export type CriteriaStatusValue =
  (typeof CRITERIA_STATUS)[keyof typeof CRITERIA_STATUS]

export const criteriaStatusSchema = z.enum([
  CRITERIA_STATUS.POSITIVE,
  CRITERIA_STATUS.WARNING,
  CRITERIA_STATUS.AT_RISK,
  CRITERIA_STATUS.UNEVALUATED,
  CRITERIA_STATUS.REFERENCE,
])

export const evidenceUrlSchema = z.strictObject({
  name: z.string(),
  url: tkUrlSchema,
  type: z.enum(["docs", "explorer", "github", "vote", "website"]).optional(),
})

export const evidenceSchema = z.strictObject({
  name: z.string().optional(),
  summary: z.string().optional(),
  urls: z.array(evidenceUrlSchema),
})

export type EvidenceUrl = z.infer<typeof evidenceUrlSchema>
export type Evidence = z.infer<typeof evidenceSchema>
