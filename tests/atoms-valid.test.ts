/**
 * Schema validation: every atom under content/ and every composed read model
 * under src/data/generated/ must parse against the shared Zod contract.
 */
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import {
  criterionEvaluationAtomSchema,
  faqSchema,
  frameworkDocSchema,
  frameworkMetaSchema,
  frameworkMetricAtomSchema,
  indexSchema,
  metricEditorialAtomSchema,
  testimonialsSchema,
  tokenAtomSchema,
  tokenDocSchema,
} from "@/lib/schemas"

const root = join(__dirname, "..")
const content = join(root, "content")
const generated = join(root, "src", "data", "generated")

const readJson = (p: string) => JSON.parse(readFileSync(p, "utf8"))
const jsonFiles = (dir: string) =>
  readdirSync(dir).filter((f) => f.endsWith(".json"))

describe("content/ atoms parse against write-model schemas", () => {
  it("token atoms", () => {
    for (const f of jsonFiles(join(content, "tokens"))) {
      expect(
        () => tokenAtomSchema.parse(readJson(join(content, "tokens", f))),
        f
      ).not.toThrow()
    }
  })

  it("framework atoms + meta", () => {
    for (const f of jsonFiles(join(content, "framework"))) {
      const schema =
        f === "_meta.json" ? frameworkMetaSchema : frameworkMetricAtomSchema
      expect(
        () => schema.parse(readJson(join(content, "framework", f))),
        f
      ).not.toThrow()
    }
  })

  it("evaluation atoms", () => {
    const evals = join(content, "evaluations")
    for (const tokenId of readdirSync(evals)) {
      for (const metricId of readdirSync(join(evals, tokenId))) {
        for (const f of jsonFiles(join(evals, tokenId, metricId))) {
          const schema =
            f === "_metric.json"
              ? metricEditorialAtomSchema
              : criterionEvaluationAtomSchema
          expect(
            () => schema.parse(readJson(join(evals, tokenId, metricId, f))),
            `${tokenId}/${metricId}/${f}`
          ).not.toThrow()
        }
      }
    }
  })

  it("faq + testimonials", () => {
    expect(() => faqSchema.parse(readJson(join(content, "faq.json")))).not.toThrow()
    expect(() =>
      testimonialsSchema.parse(readJson(join(content, "testimonials.json")))
    ).not.toThrow()
  })
})

describe("src/data/generated/ parses against read-model schemas", () => {
  it("index", () => {
    expect(() =>
      indexSchema.parse(readJson(join(generated, "index.json")))
    ).not.toThrow()
  })

  it("token docs", () => {
    for (const f of jsonFiles(join(generated, "tokens"))) {
      expect(
        () => tokenDocSchema.parse(readJson(join(generated, "tokens", f))),
        f
      ).not.toThrow()
    }
  })

  it("framework doc", () => {
    expect(() =>
      frameworkDocSchema.parse(readJson(join(generated, "framework.json")))
    ).not.toThrow()
  })

  it("faq + testimonials passthrough", () => {
    expect(() =>
      faqSchema.parse(readJson(join(generated, "faq.json")))
    ).not.toThrow()
    expect(() =>
      testimonialsSchema.parse(readJson(join(generated, "testimonials.json")))
    ).not.toThrow()
  })
})
