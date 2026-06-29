import { describe, expect, it } from "vitest"
import {
  getAllFrameworkMetrics,
  getFrameworkBaseUrl,
  getFrameworkCriteria,
  getFrameworkMetric,
  getFrameworkUrl,
} from "./framework"

describe("framework lookups", () => {
  const first = getAllFrameworkMetrics()[0]

  it("returns metrics from the framework definition", () => {
    expect(getAllFrameworkMetrics().length).toBeGreaterThan(0)
  })

  it("finds a framework metric by id", () => {
    expect(getFrameworkMetric(first.id)?.id).toBe(first.id)
  })

  it("returns null for unknown metric/criteria ids", () => {
    expect(getFrameworkMetric("nope")).toBeNull()
    expect(getFrameworkCriteria("nope")).toBeNull()
  })
})

describe("getFrameworkUrl", () => {
  it("appends a section anchor for known metrics", () => {
    expect(getFrameworkUrl("onchain-ctrl")).toBe(
      `${getFrameworkBaseUrl()}#metric-1-onchain-control`
    )
  })

  it("falls back to the base url for unknown metrics", () => {
    expect(getFrameworkUrl("nope")).toBe(getFrameworkBaseUrl())
  })
})
