import { describe, expect, it } from "vitest"
import { getTokenById, getTokens } from "./token-data"

describe("getTokens", () => {
  it("returns a non-empty list of tokens", () => {
    const tokens = getTokens()
    expect(Array.isArray(tokens)).toBe(true)
    expect(tokens.length).toBeGreaterThan(0)
  })
})

describe("getTokenById", () => {
  const sample = getTokens()[0]

  it("finds a token by its exact id", () => {
    expect(getTokenById(sample.id)?.id).toBe(sample.id)
  })

  it("is case-insensitive and trims whitespace", () => {
    expect(getTokenById(`  ${sample.id.toUpperCase()}  `)?.id).toBe(sample.id)
  })

  it("returns null for an unknown id", () => {
    expect(getTokenById("definitely-not-a-token")).toBeNull()
  })

  it("returns null for an empty id", () => {
    expect(getTokenById("")).toBeNull()
  })
})
