import { describe, expect, it } from "vitest"
import {
  CRITERIA_STATUS,
  getCriteriaStatus,
  getMetricsByTokenId,
  normalizeCriteriaStatus,
} from "./metrics-data"
import { getTokens } from "./token-data"

// Find a real token that has metrics so we exercise the happy paths.
const tokenWithMetrics = getTokens().find(
  (t) => getMetricsByTokenId(t.id).length > 0
)
if (!tokenWithMetrics) {
  throw new Error("test fixture: expected at least one token with metrics")
}

describe("normalizeCriteriaStatus", () => {
  it("passes through known statuses", () => {
    for (const status of Object.values(CRITERIA_STATUS)) {
      expect(normalizeCriteriaStatus(status)).toBe(status)
    }
  })

  it("falls back to reference for unknown or missing values", () => {
    expect(normalizeCriteriaStatus("bogus")).toBe(CRITERIA_STATUS.REFERENCE)
    expect(normalizeCriteriaStatus(undefined)).toBe(CRITERIA_STATUS.REFERENCE)
  })
})

describe("getMetricsByTokenId", () => {
  it("returns an empty array for an unknown token", () => {
    expect(getMetricsByTokenId("not-a-token")).toEqual([])
  })

  it("returns framework-enriched metrics for a known token", () => {
    expect(tokenWithMetrics).toBeDefined()
    const metrics = getMetricsByTokenId(tokenWithMetrics.id)
    expect(metrics.length).toBeGreaterThan(0)
    for (const metric of metrics) {
      expect(typeof metric.id).toBe("string")
      expect(Array.isArray(metric.criteria)).toBe(true)
    }
  })
})

describe("getCriteriaStatus", () => {
  it("returns reference for an unknown token/criteria", () => {
    expect(getCriteriaStatus("not-a-token", "nope")).toBe(
      CRITERIA_STATUS.REFERENCE
    )
  })

  it("returns a normalized status for a known token/criteria", () => {
    expect(tokenWithMetrics).toBeDefined()
    const [metric] = getMetricsByTokenId(tokenWithMetrics.id)
    const criteria = metric.criteria[0]
    const status = getCriteriaStatus(tokenWithMetrics.id, criteria.id)
    expect(Object.values(CRITERIA_STATUS)).toContain(status)
  })
})
