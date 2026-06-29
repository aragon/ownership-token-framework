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

/** content/evaluations/<tokenId>/<metricId>/_metric.json — per-token metric editorial. */
export const metricEditorialAtomSchema = z.strictObject({
  summary: z.string(),
  tags: z.array(z.string()),
})

/** content/evaluations/<tokenId>/<metricId>/<criterionId>.json */
export const criterionEvaluationAtomSchema = z.strictObject({
  /** Display-name override; present only where it diverges from framework. */
  name: z.string().optional(),
  status: criteriaStatusSchema,
  notes: z.string(),
  tags: z.array(z.string()).optional(),
  evidence: z.array(evidenceSchema).optional(),
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
