import { createServerFn } from "@tanstack/react-start"
import { type MarketData, fetchMarketData } from "@/lib/coingecko"

type MarketDataInput = {
  coingeckoIds: string[]
}

type CacheEntry = {
  data: Record<string, MarketData>
  expiresAt: number
}

const CACHE_TTL = 10 * 60 * 1000 // 10 minutes
let cache: CacheEntry | null = null

export const fetchMarketDataFn = createServerFn({ method: "GET" })
  .inputValidator((data: MarketDataInput) => data)
  .handler(async ({ data }): Promise<Record<string, MarketData>> => {
    const { coingeckoIds } = data

    if (!coingeckoIds.length) {
      return {}
    }

    if (cache && cache.expiresAt > Date.now()) {
      // Return cached data for requested IDs
      const result: Record<string, MarketData> = {}
      for (const id of coingeckoIds) {
        if (cache.data[id]) {
          result[id] = cache.data[id]
        }
      }
      // Only use cache if we have all requested IDs
      if (Object.keys(result).length === coingeckoIds.length) {
        return result
      }
    }

    const freshData = await fetchMarketData(coingeckoIds)

    cache = {
      data: { ...cache?.data, ...freshData },
      expiresAt: Date.now() + CACHE_TTL,
    }

    return freshData
  })
