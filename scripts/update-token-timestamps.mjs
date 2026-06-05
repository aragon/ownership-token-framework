import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const tokensDir = path.resolve("content/tokens")

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

const idSet = ids ? new Set(ids.map((id) => id.toLowerCase())) : null
let updated = 0

const files = (await readdir(tokensDir)).filter((f) => f.endsWith(".json"))

for (const file of files) {
  const filePath = path.join(tokensDir, file)
  const token = JSON.parse(await readFile(filePath, "utf-8"))

  const matches =
    updateAll ||
    (idSet?.has(token.id.toLowerCase()) ?? false) ||
    (symbol !== "" && token.symbol.toUpperCase() === symbol)

  if (!matches) continue

  token.lastUpdated = nextTimestamp
  await writeFile(filePath, `${JSON.stringify(token, null, 2)}\n`, "utf-8")
  updated += 1
}

if (updated === 0) {
  console.log("No tokens matched; nothing updated.")
  process.exit(0)
}

console.log(
  `Updated ${updated} token${updated === 1 ? "" : "s"} to ${nextTimestamp}.`
)
