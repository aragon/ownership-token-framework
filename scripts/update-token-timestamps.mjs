import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const dataPath = path.resolve("src/data/tokens.json")

function normalizeSymbol(value) {
  return value.split("/").pop()?.trim().toUpperCase() ?? ""
}

function parseArgs(argv) {
  const args = new Set(argv)
  const idsIndex = argv.indexOf("--ids")
  const symbolIndex = argv.indexOf("--symbol")
  const timestampIndex = argv.indexOf("--timestamp")

  const ids =
    idsIndex === -1 ? null : argv[idsIndex + 1]?.split(",").filter(Boolean)
  const symbol = symbolIndex === -1 ? "" : argv[symbolIndex + 1] ?? ""
  const timestampArg = timestampIndex === -1 ? null : argv[timestampIndex + 1]

  return {
    updateAll: args.has("--all") || (!ids && !symbol),
    ids,
    symbol: normalizeSymbol(symbol),
    timestamp: timestampArg ? Number(timestampArg) : null,
  }
}

const { updateAll, ids, symbol, timestamp } = parseArgs(process.argv.slice(2))
const nextTimestamp = Number.isFinite(timestamp)
  ? timestamp
  : Math.floor(Date.now() / 1000)

const raw = await readFile(dataPath, "utf-8")
const payload = JSON.parse(raw)

if (!payload?.tokens || !Array.isArray(payload.tokens)) {
  throw new Error("Expected src/data/tokens.json to contain a tokens array")
}

const idSet = ids ? new Set(ids.map((id) => id.toLowerCase())) : null
let updated = 0

payload.tokens = payload.tokens.map((token) => {
  if (updateAll) {
    updated += 1
    return { ...token, lastUpdated: nextTimestamp }
  }

  if (idSet && idSet.has(token.id.toLowerCase())) {
    updated += 1
    return { ...token, lastUpdated: nextTimestamp }
  }

  if (symbol && token.symbol.toUpperCase() === symbol) {
    updated += 1
    return { ...token, lastUpdated: nextTimestamp }
  }

  return token
})

if (updated === 0) {
  console.log("No tokens matched; nothing updated.")
  process.exit(0)
}

await writeFile(dataPath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8")

console.log(
  `Updated ${updated} token${updated === 1 ? "" : "s"} to ${nextTimestamp}.`
)
