#!/usr/bin/env node

/**
 * Sync CoinGecko IDs for tokens in tokens.json
 *
 * Uses CoinGecko's /coins/{platform}/contract/{address} endpoint
 * to resolve the canonical CoinGecko ID from contract address + network.
 *
 * Usage:
 *   node scripts/sync-coingecko-ids.mjs           # dry-run, skips tokens with existing IDs
 *   node scripts/sync-coingecko-ids.mjs --write    # writes back to tokens.json
 *   node scripts/sync-coingecko-ids.mjs --force    # re-verify all tokens (ignores cached IDs)
 */

import { readFileSync, writeFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const TOKENS_PATH = resolve(__dirname, "../src/data/tokens.json")

// CoinGecko platform IDs mapped from our network names
const NETWORK_TO_PLATFORM = {
  ethereum: "ethereum",
  base: "base",
  arbitrum: "arbitrum-one",
  optimism: "optimistic-ethereum",
  polygon: "polygon-pos",
  avalanche: "avalanche",
  bsc: "binance-smart-chain",
}

const COINGECKO_API = "https://api.coingecko.com/api/v3"

// Rate limit: CoinGecko free tier allows ~10-30 req/min
const DELAY_MS = 2500

const c = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function lookupCoingeckoId(address, network) {
  const platform = NETWORK_TO_PLATFORM[network]
  if (!platform) {
    return { error: `Unknown network: ${network}` }
  }

  const url = `${COINGECKO_API}/coins/${platform}/contract/${address.toLowerCase()}`
  const res = await fetch(url)

  if (!res.ok) {
    return { error: `HTTP ${res.status} for ${address} on ${network}` }
  }

  const data = await res.json()
  return { id: data.id, name: data.name, symbol: data.symbol }
}

async function main() {
  const writeMode = process.argv.includes("--write")
  const tokensFile = JSON.parse(readFileSync(TOKENS_PATH, "utf-8"))
  const tokens = tokensFile.tokens

  let changes = 0

  console.log(`\n${c.cyan}${c.bold}  🦎 CoinGecko Sync${c.reset}`)
  console.log(`${c.dim}  ─────────────────────────────${c.reset}\n`)

  const forceAll = process.argv.includes("--force")
  const missing = tokens.filter((t) => !t.coingeckoId)

  if (!forceAll && missing.length === 0) {
    console.log(`  ${c.green}✓${c.reset} ${c.bold}${tokens.length} tokens${c.reset} synced ${c.dim}· no lookups needed${c.reset}\n`)
    return
  }

  const toProcess = forceAll ? tokens : missing

  for (const token of toProcess) {
    process.stdout.write(`  ${c.dim}${token.symbol}${c.reset} ${c.dim}${token.network}:${token.address.slice(0, 10)}…${c.reset} `)

    const result = await lookupCoingeckoId(token.address, token.network)

    if (result.error) {
      console.log(`${c.red}✗ ${result.error}${c.reset}`)
      continue
    }

    if (!token.coingeckoId) {
      console.log(`${c.green}+ ${result.id}${c.reset}`)
      token.coingeckoId = result.id
      changes++
    } else if (token.coingeckoId !== result.id) {
      console.log(`${c.yellow}≠ ${token.coingeckoId} → ${result.id}${c.reset}`)
      token.coingeckoId = result.id
      changes++
    } else {
      console.log(`${c.green}✓ ${result.id}${c.reset}`)
    }

    await sleep(DELAY_MS)
  }

  console.log()
  if (changes > 0 && writeMode) {
    writeFileSync(TOKENS_PATH, JSON.stringify(tokensFile, null, 2) + "\n")
    console.log(`  ${c.green}✓${c.reset} Written ${c.bold}${changes}${c.reset} update(s) to tokens.json\n`)
  } else if (changes > 0) {
    console.log(`  ${c.yellow}${changes}${c.reset} update(s) pending ${c.dim}· run with --write to save${c.reset}\n`)
  } else {
    console.log(`  ${c.green}✓${c.reset} All verified ${c.dim}· no changes${c.reset}\n`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
