import { useQuery } from "@tanstack/react-query"
import { fetchMarketData } from "@/lib/coingecko"
import type { Token } from "@/lib/token-data"

export interface EnrichedToken extends Token {
  marketCap?: number
  price?: number
  totalSupply?: number
}

export function useMarketData(tokens: Token[]): {
  tokens: EnrichedToken[]
  isLoading: boolean
  error: Error | null
} {
  const coingeckoIds = tokens
    .map((t) => t.coingeckoId)
    .filter((id): id is string => Boolean(id))

  const {
    data: marketData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["market-data", ...coingeckoIds.sort()],
    queryFn: () => fetchMarketData(coingeckoIds),
    enabled: coingeckoIds.length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })

  const enrichedTokens: EnrichedToken[] = tokens.map((token) => {
    const data = token.coingeckoId ? marketData?.[token.coingeckoId] : undefined
    if (!data) return token
    return {
      ...token,
      marketCap: data.market_cap,
      price: data.current_price,
      totalSupply: data.total_supply,
    }
  })

  return { tokens: enrichedTokens, isLoading, error: error ?? null }
}
