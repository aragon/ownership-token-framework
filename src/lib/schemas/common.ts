import { z } from "zod"

/** Canonical criteria workflow statuses. */
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

/**
 * Statuses as they actually appear in the data, including legacy values
 * ("fail", "partial") that normalize to "reference" at read time and are
 * excluded from scoring. Preserved as passthrough pending editorial cleanup.
 */
export const rawCriteriaStatusSchema = z.enum([
  CRITERIA_STATUS.POSITIVE,
  CRITERIA_STATUS.WARNING,
  CRITERIA_STATUS.AT_RISK,
  CRITERIA_STATUS.UNEVALUATED,
  CRITERIA_STATUS.REFERENCE,
  "fail",
  "partial",
])

export type RawCriteriaStatus = z.infer<typeof rawCriteriaStatusSchema>

export const evidenceUrlSchema = z.strictObject({
  name: z.string(),
  url: z.string(),
  type: z.enum(["docs", "explorer", "github", "vote", "website"]).optional(),
})

export const evidenceSchema = z.strictObject({
  name: z.string().optional(),
  summary: z.string().optional(),
  urls: z.array(evidenceUrlSchema),
})

export type EvidenceUrl = z.infer<typeof evidenceUrlSchema>
export type Evidence = z.infer<typeof evidenceSchema>
