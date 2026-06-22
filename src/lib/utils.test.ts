import { describe, expect, it } from "vitest"
import { cn, formatUnixTimestamp, truncateAddress } from "./utils"

describe("cn", () => {
  it("merges and dedupes tailwind classes", () => {
    expect(cn("p-2", "p-4")).toBe("p-4")
    expect(cn("text-sm", false && "hidden", "font-bold")).toBe(
      "text-sm font-bold"
    )
  })
})

describe("truncateAddress", () => {
  it("truncates a long address", () => {
    expect(truncateAddress("0x1234567890abcdef")).toBe("0x1234...cdef")
  })

  it("leaves short addresses untouched", () => {
    expect(truncateAddress("0x1234")).toBe("0x1234")
  })

  it("does not double-truncate an already-truncated value", () => {
    expect(truncateAddress("0x1234...cdef")).toBe("0x1234...cdef")
  })
})

describe("formatUnixTimestamp", () => {
  it("formats a unix timestamp (UTC) as 'D Mon YYYY'", () => {
    // 2021-01-01T00:00:00Z
    expect(formatUnixTimestamp(1609459200)).toBe("1 Jan 2021")
  })

  it("returns 'Unknown' for non-finite input", () => {
    expect(formatUnixTimestamp(Number.NaN)).toBe("Unknown")
    expect(formatUnixTimestamp(Number.POSITIVE_INFINITY)).toBe("Unknown")
  })
})
