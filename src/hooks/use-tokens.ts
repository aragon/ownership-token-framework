import { useMemo } from "react"
import { getTokens, type Token } from "@/lib/token-data"

export function useTokens(): Token[] {
  return useMemo(() => getTokens(), [])
}
