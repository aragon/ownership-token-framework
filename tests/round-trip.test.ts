/**
 * Round-trip gate: composed read models must reproduce the golden fixtures
 * captured from the pre-refactor runtime (tests/golden/, frozen 2026-06-05).
 *
 * ONE intentional diff is allowed and asserted explicitly: the token status
 * counts (positive/neutral/atRisk/evidenceEntries) are now DERIVED from
 * evaluations at compose time — the legacy hand-maintained counts were stale
 * for all 11 tokens and are corrected, not preserved.
 */
import { describe, expect, it } from "vitest"
// biome-ignore lint/style/noNamespaceImport: JSON module namespaces
import goldenFaq from "./golden/faq.json"
import goldenFramework from "./golden/framework.json"
import goldenMetrics from "./golden/metrics.json"
import goldenScores from "./golden/scores.json"
import goldenTestimonials from "./golden/testimonials.json"
import goldenTokens from "./golden/tokens.json"
// @ts-expect-error untyped .mjs module
import { composeAll } from "../scripts/compose-data.mjs"

const COUNT_FIELDS = ["positive", "neutral", "atRisk", "evidenceEntries"]

const withoutCounts = (obj: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([k]) => !COUNT_FIELDS.includes(k) && k !== "score"
    )
  )

const composed = composeAll()

describe("round-trip vs golden fixtures", () => {
  it("covers every golden token, none extra", () => {
    expect(composed.tokenDocs.map((d: { id: string }) => d.id).sort()).toEqual(
      goldenTokens.map((t) => t.id).sort()
    )
  })

  for (const golden of goldenTokens) {
    describe(golden.id, () => {
      const doc = composed.tokenDocs.find(
        (d: { id: string }) => d.id === golden.id
      )

      it("composed metrics equal golden merged metrics", () => {
        expect(doc.metrics).toEqual(
          goldenMetrics[golden.id as keyof typeof goldenMetrics]
        )
      })

      it("composed score equals golden score", () => {
        expect(doc.score).toEqual(
          goldenScores[golden.id as keyof typeof goldenScores]
        )
      })

      it("registry fields equal golden token (counts excluded)", () => {
        expect(withoutCounts(doc)).toMatchObject(withoutCounts(golden))
      })

      it("derived counts equal counts computed from golden metrics (intentional correction of stale legacy values)", () => {
        const criteria = goldenMetrics[
          golden.id as keyof typeof goldenMetrics
        ].flatMap((m) => m.criteria)
        expect(doc.positive).toBe(
          criteria.filter((c) => c.status === "positive").length
        )
        expect(doc.neutral).toBe(
          criteria.filter((c) => c.status === "warning").length
        )
        expect(doc.atRisk).toBe(
          criteria.filter((c) => c.status === "at_risk").length
        )
        expect(doc.evidenceEntries).toBe(
          criteria.flatMap((c) => ("evidence" in c ? c.evidence : [])).length
        )
      })
    })
  }

  it("framework doc projects onto golden framework", () => {
    expect(
      composed.frameworkDoc.metrics.map(
        ({
          id,
          name,
          about,
          criteria,
        }: {
          id: string
          name: string
          about: string
          criteria: unknown
        }) => ({ id, name, about, criteria })
      )
    ).toEqual(goldenFramework)
  })

  it("faq topics equal golden", () => {
    expect(composed.faq.topics).toEqual(goldenFaq)
  })

  it("testimonials equal golden", () => {
    expect(composed.testimonials).toEqual(goldenTestimonials)
  })

  it("index rows mirror token docs", () => {
    for (const row of composed.index.tokens) {
      const { metrics: _metrics, ...doc } = composed.tokenDocs.find(
        (d: { id: string }) => d.id === row.id
      )
      expect(withoutCounts(row)).toEqual(withoutCounts(doc))
      expect(row.score).toEqual({
        passing: doc.score.passing,
        total: doc.score.total,
        percentage: doc.score.percentage,
      })
    }
  })
})
