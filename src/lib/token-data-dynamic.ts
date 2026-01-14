/**
 * Token Data with Dynamic GitHub Fetching
 *
 * This is an example of how to refactor token-data.ts to use the GitHub fetcher.
 * Replace the existing token-data.ts with this implementation once data is moved to GitHub.
 */

import { fetchGitHubData } from "@/lib/data-fetcher"
// Import local data as fallback for development
import tokensDataLocal from "@/data/tokens.json"

export type Token = (typeof tokensDataLocal.tokens)[number]

interface TokensResponse {
  tokens: Token[]
}

let cachedTokens: Token[] | null = null

/**
 * Fetch tokens from GitHub or use local fallback
 */
async function fetchTokens(): Promise<Token[]> {
  // If already cached in memory, return immediately
  if (cachedTokens) return cachedTokens

  // Try to fetch from GitHub
  try {
    const data = await fetchGitHubData<TokensResponse>("tokens")
    cachedTokens = data.tokens
    return cachedTokens
  } catch (error) {
    console.warn("Failed to fetch tokens from GitHub, using local fallback", error)
    // Fallback to local data
    cachedTokens = tokensDataLocal.tokens as Token[]
    return cachedTokens
  }
}

function normalizeTokenSymbol(value: string): string {
  return value.trim().toUpperCase()
}

/**
 * Get all tokens with optional symbol filter from env var
 */
export async function getTokens(): Promise<Token[]> {
  const allTokens = await fetchTokens()

  // Apply env var filter if present
  const envSymbolFilter = normalizeTokenSymbol(
    import.meta.env.VITE_TOKEN_SYMBOL ?? ""
  )

  if (!envSymbolFilter) return allTokens

  const matchingTokens = allTokens.filter(
    (token) => normalizeTokenSymbol(token.symbol) === envSymbolFilter
  )

  return matchingTokens.length > 0 ? matchingTokens : allTokens
}

/**
 * Get a single token by ID
 */
export async function getTokenById(tokenId: string): Promise<Token | null> {
  const tokens = await getTokens()
  const normalizedId = tokenId.trim().toLowerCase()
  return tokens.find((token) => token.id.toLowerCase() === normalizedId) ?? null
}

/**
 * Synchronous versions for backwards compatibility
 * Note: These use the local fallback data and should be deprecated
 */
export function getTokensSync(): Token[] {
  return tokensDataLocal.tokens as Token[]
}

export function getTokenByIdSync(tokenId: string): Token | null {
  const normalizedId = tokenId.trim().toLowerCase()
  return (
    (tokensDataLocal.tokens as Token[]).find(
      (token) => token.id.toLowerCase() === normalizedId
    ) ?? null
  )
}
