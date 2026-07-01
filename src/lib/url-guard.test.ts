import { describe, expect, it } from "vitest"
import { isBlockedPathname } from "./url-guard"

describe("isBlockedPathname", () => {
  it("allows the routes the app actually serves", () => {
    expect(isBlockedPathname("/")).toBe(false)
    expect(isBlockedPathname("/faq")).toBe(false)
    expect(isBlockedPathname("/tokens/uni")).toBe(false)
    expect(isBlockedPathname("/tokens/aave")).toBe(false)
    expect(isBlockedPathname("/api/market-data")).toBe(false)
    expect(isBlockedPathname("/og-images/tokens-crv.png")).toBe(false)
  })

  it("allows benign unknown paths (they 404 normally, no loop)", () => {
    expect(isBlockedPathname("/foo")).toBe(false)
    expect(isBlockedPathname("/foo bar")).toBe(false)
    expect(isBlockedPathname("/café")).toBe(false)
  })

  it("blocks HTML/URL-dangerous chars that trigger the router redirect loop", () => {
    // Decoded forms of the probes seen in production (/zzz%22/%3E%3Clink etc.)
    expect(isBlockedPathname('/zzz"')).toBe(true)
    expect(isBlockedPathname('/zzz"/><link')).toBe(true)
    expect(isBlockedPathname("/<script>")).toBe(true)
    expect(isBlockedPathname("/foo>bar")).toBe(true)
  })

  it("blocks control characters", () => {
    expect(isBlockedPathname("/foo\x00bar")).toBe(true)
    expect(isBlockedPathname("/foo\nbar")).toBe(true)
  })

  it("blocks paths with malformed percent-encoding", () => {
    expect(isBlockedPathname("/%")).toBe(true)
    expect(isBlockedPathname("/%zz")).toBe(true)
  })
})
