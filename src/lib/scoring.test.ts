import { describe, expect, it } from "vitest"
import type { Metric } from "./metrics-data"
import {
  getMetricScore,
  getScoreStatus,
  getTokenOwnershipScore,
} from "./scoring"

function metric(
  overrides: Partial<Metric> & { criteria: Metric["criteria"] }
): Metric {
  return {
    id: "m",
    name: "Metric",
    about: "",
    summary: "",
    tags: [],
    ...overrides,
  }
}

describe("getScoreStatus", () => {
  it("is not-evaluated when not evaluated", () => {
    expect(getScoreStatus(100, false)).toBe("not-evaluated")
  })

  it("passes at 75% or above, warns below", () => {
    expect(getScoreStatus(75, true)).toBe("passing")
    expect(getScoreStatus(74.9, true)).toBe("warning")
  })
})

describe("getMetricScore", () => {
  it("counts only evaluated criteria and computes percentage", () => {
    const score = getMetricScore(
      metric({
        criteria: [
          {
            id: "a",
            name: "",
            about: "",
            status: "positive",
            notes: "",
            evidence: [],
          },
          {
            id: "b",
            name: "",
            about: "",
            status: "at_risk",
            notes: "",
            evidence: [],
          },
          {
            id: "c",
            name: "",
            about: "",
            status: "unevaluated",
            notes: "",
            evidence: [],
          },
        ],
      })
    )
    expect(score.total).toBe(2) // positive + at_risk are evaluated; unevaluated is not
    expect(score.passing).toBe(1) // only positive passes
    expect(score.percentage).toBe(50)
    expect(score.evaluated).toBe(true)
  })

  it("marks reference metrics as not evaluated", () => {
    const score = getMetricScore(
      metric({
        tags: ["Reference"],
        criteria: [
          {
            id: "a",
            name: "",
            about: "",
            status: "positive",
            notes: "",
            evidence: [],
          },
        ],
      })
    )
    expect(score.reference).toBe(true)
    expect(score.evaluated).toBe(false)
  })
})

describe("getTokenOwnershipScore", () => {
  it("returns a zeroed score for an unknown token", () => {
    const score = getTokenOwnershipScore("not-a-token")
    expect(score).toMatchObject({
      passing: 0,
      total: 0,
      percentage: 0,
      metrics: [],
    })
  })
})
