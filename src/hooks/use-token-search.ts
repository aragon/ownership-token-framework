import { useMemo, useRef, useState } from "react"
import { useTokens } from "@/hooks/use-tokens"

interface Token {
  id: string
  name: string
  symbol: string
  icon?: string
}

function fuzzyMatch(query: string, target: string): boolean {
  let queryIndex = 0
  let targetIndex = 0
  const normalizedQuery = query.toLowerCase()
  const normalizedTarget = target.toLowerCase()

  while (
    queryIndex < normalizedQuery.length &&
    targetIndex < normalizedTarget.length
  ) {
    if (normalizedQuery[queryIndex] === normalizedTarget[targetIndex]) {
      queryIndex += 1
    }
    targetIndex += 1
  }

  return queryIndex === normalizedQuery.length
}

export function useTokenSearch() {
  const tokens = useTokens() as Token[]
  const [searchQuery, setSearchQuery] = useState("")
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const resultRefs = useRef<Array<HTMLAnchorElement | null>>([])

  const filteredTokens = useMemo(() => {
    const query = searchQuery.trim()
    if (!query) return []

    return tokens.filter((token) => {
      const nameMatch = fuzzyMatch(query, token.name)
      const symbolMatch = fuzzyMatch(query, token.symbol)
      return nameMatch || symbolMatch
    })
  }, [searchQuery, tokens])

  const hasResults = filteredTokens.length > 0

  const updateSearchQuery = (value: string) => {
    setSearchQuery(value)
    setHighlightedIndex(-1)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setHighlightedIndex(-1)
  }

  return {
    clearSearch,
    filteredTokens,
    hasResults,
    highlightedIndex,
    resultRefs,
    searchQuery,
    setHighlightedIndex,
    updateSearchQuery,
  }
}
