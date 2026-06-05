/**
 * Freshness gate: the committed src/data/generated/ output must equal what
 * the composer produces from the current content/ atoms. Fails when someone
 * edits atoms without re-running `node scripts/compose-data.mjs`.
 */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
// @ts-expect-error untyped .mjs module
import { composeAll } from "../scripts/compose-data.mjs"

const generated = join(__dirname, "..", "src", "data", "generated")
const readJson = (p: string) => JSON.parse(readFileSync(p, "utf8"))

describe("generated read models are fresh", () => {
  const composed = composeAll()

  it("index.json", () => {
    expect(readJson(join(generated, "index.json"))).toEqual(composed.index)
  })

  it("token docs", () => {
    for (const doc of composed.tokenDocs) {
      expect(
        readJson(join(generated, "tokens", `${doc.id}.json`)),
        doc.id
      ).toEqual(doc)
    }
  })

  it("framework.json", () => {
    expect(readJson(join(generated, "framework.json"))).toEqual(
      composed.frameworkDoc
    )
  })

  it("faq + testimonials", () => {
    expect(readJson(join(generated, "faq.json"))).toEqual(composed.faq)
    expect(readJson(join(generated, "testimonials.json"))).toEqual(
      composed.testimonials
    )
  })

  it("manifest.json (snapshot identity)", () => {
    expect(readJson(join(generated, "manifest.json"))).toEqual(
      composed.manifest
    )
  })
})
