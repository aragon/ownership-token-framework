/**
 * Write-model schemas — the editable atoms under `content/`.
 *
 * Atoms are research-shaped: small, flat, id-keyed. Anything derivable
 * (status counts, scores, framework-owned `about` text) is intentionally
 * absent and produced at composition time (scripts/compose-data.mjs).
 */
import { z } from "zod"
import { criteriaStatusSchema, evidenceSchema, tkUrlSchema } from "./common"

/** content/tokens/<id>.json — registry atom: identity, display, chain data. */
export const tokenAtomSchema = z.strictObject({
  id: z.string(),
  coingeckoId: z.string(),
  name: z.string(),
  symbol: z.string(),
  address: z.string(),
  /** Icon url, or "TK" while deferred (lenient so partial tokens compose). */
  icon: tkUrlSchema,
  description: z.string(),
  infoDescription: z.string(),
  network: z.string(),
  links: z.strictObject({
    website: tkUrlSchema,
    twitter: tkUrlSchema,
    scan: tkUrlSchema,
  }),
  /** Editorial provenance; future home is Git history (publish pipeline). */
  lastUpdated: z.number(),
  updatedBy: z.strictObject({
    name: z.string(),
    avatar: z.string(),
  }),
})

/** content/summaries/<tokenId>/<metricId>.json — per-token metric editorial. */
export const metricEditorialAtomSchema = z.strictObject({
  // Optional: the editor omits an empty summary on a WIP token; compose
  // defaults it and the readiness gate reports the gap.
  summary: z.string().optional(),
  tags: z.array(z.string()),
})

/** content/evaluations/<tokenId>/<metricId>/<criterionId>.json */
export const criterionEvaluationAtomSchema = z.strictObject({
  /** Display-name override; present only where it diverges from framework. */
  name: z.string().optional(),
  status: criteriaStatusSchema,
  // Optional: omitted on a WIP token; compose defaults it to "".
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  evidence: z.array(evidenceSchema).optional(),
})

/**
 * A metric block inside the unified token doc: the editorial (summary/tags)
 * plus its criteria keyed by criterion id (each value an evaluation atom).
 */
export const unifiedMetricSchema = z.strictObject({
  summary: z.string().optional(),
  tags: z.array(z.string()),
  criteria: z.record(z.string(), criterionEvaluationAtomSchema),
})

/**
 * Lenient identity for the editable write-model. id/name/symbol are required;
 * the rest are filled in incrementally — a WIP token saved from the editor
 * omits its empty fields. The composer defaults every missing field so the
 * read-model stays complete, and the readiness gate reports the gaps. (The
 * strict tokenAtomSchema above remains the read-model identity contract.)
 */
export const tokenIdentityWriteSchema = z.strictObject({
  id: z.string(),
  coingeckoId: z.string().optional(),
  name: z.string(),
  symbol: z.string(),
  address: z.string().optional(),
  icon: tkUrlSchema.optional(),
  description: z.string().optional(),
  infoDescription: z.string().optional(),
  network: z.string().optional(),
  links: z
    .strictObject({
      website: tkUrlSchema.optional(),
      twitter: tkUrlSchema.optional(),
      scan: tkUrlSchema.optional(),
    })
    .optional(),
  lastUpdated: z.number().optional(),
  updatedBy: z
    .strictObject({
      name: z.string().optional(),
      avatar: z.string().optional(),
    })
    .optional(),
})

/**
 * content/tokens/<id>.json — the unified token doc: lenient identity plus the
 * full rubric nested by metric/criterion. This is what compose-data reads; the
 * atom mirrors (metadata/evaluations/summaries) are a decomposition of it, kept
 * in sync by the rebuild Action.
 */
export const unifiedTokenAtomSchema = z.strictObject({
  ...tokenIdentityWriteSchema.shape,
  metrics: z.record(z.string(), unifiedMetricSchema),
})

/** content/framework/<metricId>.json — canonical metric definition. */
export const frameworkCriterionSchema = z.strictObject({
  id: z.string(),
  name: z.string(),
  about: z.string(),
})

export const frameworkMetricAtomSchema = z.strictObject({
  id: z.string(),
  /** Formal framework name (e.g. "Metric 1: Onchain Control"). */
  name: z.string(),
  /** Clean display name used in composed token docs (e.g. "Onchain Control"). */
  displayName: z.string(),
  about: z.string(),
  /** README section anchor for getFrameworkUrl; absent → base URL only. */
  anchor: z.string().optional(),
  criteria: z.array(frameworkCriterionSchema),
})

/** content/framework/_meta.json — framework-wide constants. */
export const frameworkMetaSchema = z.strictObject({
  baseUrl: z.string(),
  /** Canonical metric ordering for composed docs. */
  order: z.array(z.string()),
})

/** content/faq.json */
export const faqQuestionSchema = z.strictObject({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
})

export const faqTopicSchema = z.strictObject({
  id: z.string(),
  name: z.string(),
  about: z.string().optional(),
  questions: z.array(faqQuestionSchema),
})

export const faqSchema = z.strictObject({
  topics: z.array(faqTopicSchema),
})

/** content/testimonials.json */
export const testimonialSchema = z.strictObject({
  id: z.string(),
  name: z.string(),
  organization: z.string(),
  avatar: z.string(),
  url: z.string(),
  quote: z.string(),
})

export const testimonialsSchema = z.strictObject({
  title: z.string(),
  testimonials: z.array(testimonialSchema),
})

export type TokenAtom = z.infer<typeof tokenAtomSchema>
export type UnifiedMetric = z.infer<typeof unifiedMetricSchema>
export type UnifiedTokenAtom = z.infer<typeof unifiedTokenAtomSchema>
export type MetricEditorialAtom = z.infer<typeof metricEditorialAtomSchema>
export type CriterionEvaluationAtom = z.infer<
  typeof criterionEvaluationAtomSchema
>
export type FrameworkCriterion = z.infer<typeof frameworkCriterionSchema>
export type FrameworkMetricAtom = z.infer<typeof frameworkMetricAtomSchema>
export type FrameworkMeta = z.infer<typeof frameworkMetaSchema>
export type FaqQuestion = z.infer<typeof faqQuestionSchema>
export type FaqTopic = z.infer<typeof faqTopicSchema>
export type Testimonial = z.infer<typeof testimonialSchema>
export type TestimonialsContent = z.infer<typeof testimonialsSchema>
