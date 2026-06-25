/**
 * The committed read models (src/data/generated/ — produced by otf-cms's
 * composer, synced here until the Blob/Edge Config backing lands) must parse
 * against the vendored schema contract.
 */
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import {
  faqSchema,
  frameworkDocSchema,
  indexSchema,
  manifestSchema,
  testimonialsSchema,
  tokenDocSchema,
} from "@/lib/schemas"

const generated = join(__dirname, "..", "src", "data", "generated")
const readJson = (p: string) => JSON.parse(readFileSync(p, "utf8"))

describe("src/data/generated/ parses against the vendored schema contract", () => {
  it("index", () => {
    expect(() =>
      indexSchema.parse(readJson(join(generated, "index.json")))
    ).not.toThrow()
  })

  it("token docs (one per manifest entry)", () => {
    const manifest = manifestSchema.parse(
      readJson(join(generated, "manifest.json"))
    )
    const files = readdirSync(join(generated, "tokens"))
    expect(files.map((f) => f.replace(/\.json$/, "")).sort()).toEqual(
      [...manifest.tokens].sort()
    )
    for (const id of manifest.tokens) {
      expect(
        () => tokenDocSchema.parse(readJson(join(generated, "tokens", `${id}.json`))),
        id
      ).not.toThrow()
    }
  })

  it("framework, faq, testimonials", () => {
    expect(() =>
      frameworkDocSchema.parse(readJson(join(generated, "framework.json")))
    ).not.toThrow()
    expect(() =>
      faqSchema.parse(readJson(join(generated, "faq.json")))
    ).not.toThrow()
    expect(() =>
      testimonialsSchema.parse(readJson(join(generated, "testimonials.json")))
    ).not.toThrow()
  })
})
