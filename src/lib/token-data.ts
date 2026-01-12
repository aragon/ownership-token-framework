import tokensData from "@/data/tokens.json"

export type Token = (typeof tokensData.tokens)[number]

const rawTokens = tokensData.tokens as Token[]

function normalizeTokenSymbol(value: string): string {
  return value.trim().toUpperCase()
}

const envSymbolFilter = normalizeTokenSymbol(
  import.meta.env.VITE_TOKEN_SYMBOL ?? ""
)

const matchingTokens = envSymbolFilter
  ? rawTokens.filter(
      (token) => normalizeTokenSymbol(token.symbol) === envSymbolFilter
    )
  : []

const filteredTokens = matchingTokens.length > 0 ? matchingTokens : rawTokens

function getTokens(): Token[] {
  return filteredTokens
}

function getTokenById(tokenId: string): Token | null {
  const normalizedId = tokenId.trim().toLowerCase()
  return (
    filteredTokens.find((token) => token.id.toLowerCase() === normalizedId) ??
    null
  )
}

export { envSymbolFilter, getTokenById, getTokens }
