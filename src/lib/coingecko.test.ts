import { afterEach, describe, expect, it, vi } from "vitest"
import { fetchMarketData } from "./coingecko"

function mockFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response)
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe("fetchMarketData", () => {
  it("maps a normal array response by coingecko id", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch(200, [
        { id: "uniswap", market_cap: 100, current_price: 2, total_supply: 50 },
      ])
    )

    const result = await fetchMarketData(["uniswap"])
    expect(result.uniswap).toEqual({
      market_cap: 100,
      current_price: 2,
      total_supply: 50,
    })
  })

  it("returns {} when a 2xx response body is not an array (rate-limit shape)", async () => {
    // The bug: this body used to crash `for...of` with 'items is not iterable'.
    vi.stubGlobal(
      "fetch",
      mockFetch(200, {
        status: { error_code: 429, error_message: "rate limited" },
      })
    )

    await expect(fetchMarketData(["uniswap"])).resolves.toEqual({})
  })

  it("skips malformed items without an id", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch(200, [
        { market_cap: 1, current_price: 1, total_supply: 1 },
        { id: "aave", market_cap: 5, current_price: 6, total_supply: 7 },
      ])
    )

    const result = await fetchMarketData(["aave"])
    expect(Object.keys(result)).toEqual(["aave"])
  })

  it("throws on a non-ok response", async () => {
    vi.stubGlobal("fetch", mockFetch(500, {}))
    await expect(fetchMarketData(["uniswap"])).rejects.toThrow(
      "CoinGecko API error: 500"
    )
  })
})
