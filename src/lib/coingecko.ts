const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3"

export interface MarketData {
  market_cap: number
  current_price: number
  total_supply: number
}

interface CoinGeckoMarketItem {
  id: string
  market_cap: number
  current_price: number
  total_supply: number
}

export async function fetchMarketData(
  coingeckoIds: string[]
): Promise<Record<string, MarketData>> {
  const ids = coingeckoIds.join(",")
  const url = `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=${coingeckoIds.length}&page=1&sparkline=false`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`)
  }

  const items: CoinGeckoMarketItem[] = await response.json()
  const result: Record<string, MarketData> = {}

  for (const item of items) {
    result[item.id] = {
      market_cap: item.market_cap,
      current_price: item.current_price,
      total_supply: item.total_supply,
    }
  }

  return result
}
