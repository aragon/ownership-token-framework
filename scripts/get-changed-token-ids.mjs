import { readFile } from "node:fs/promises"
import { execSync } from "node:child_process"

const TOKENS_PATH = "src/data/tokens.json"
const METRICS_PATH = "src/data/metrics.json"

function parseArgs(argv) {
  const beforeIndex = argv.indexOf("--before")
  const afterIndex = argv.indexOf("--after")
  return {
    before: beforeIndex === -1 ? "" : argv[beforeIndex + 1] ?? "",
    after: afterIndex === -1 ? "" : argv[afterIndex + 1] ?? "",
  }
}

function stableStringify(value) {
  if (value === null || value === undefined) {
    return "null"
  }
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`
  }
  if (typeof value === "object") {
    const keys = Object.keys(value).sort()
    return `{${keys
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(",")}}`
  }
  return JSON.stringify(value)
}

function readJsonFile(path) {
  return readFile(path, "utf-8").then((data) => JSON.parse(data))
}

function readJsonFromGit(before, path) {
  try {
    const data = execSync(`git show ${before}:${path}`, {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    })
    return JSON.parse(data)
  } catch (error) {
    return null
  }
}

function collectTokenMap(payload) {
  if (!payload?.tokens || !Array.isArray(payload.tokens)) {
    return new Map()
  }
  return new Map(payload.tokens.map((token) => [token.id, token]))
}

function collectMetricsMap(payload) {
  if (!payload || typeof payload !== "object") {
    return new Map()
  }
  return new Map(Object.entries(payload))
}

const { before, after } = parseArgs(process.argv.slice(2))
const zeroSha = /^0+$/
const hasBefore = before && !zeroSha.test(before)
const hasAfter = after && !zeroSha.test(after)

const [currentTokens, currentMetrics] = hasAfter
  ? [
      readJsonFromGit(after, TOKENS_PATH),
      readJsonFromGit(after, METRICS_PATH),
    ]
  : await Promise.all([readJsonFile(TOKENS_PATH), readJsonFile(METRICS_PATH)])

const previousTokens = hasBefore ? readJsonFromGit(before, TOKENS_PATH) : null
const previousMetrics = hasBefore ? readJsonFromGit(before, METRICS_PATH) : null

if (hasAfter && (!currentTokens || !currentMetrics)) {
  console.error(
    "::warning::Unable to load after JSON from git; skipping updates."
  )
  process.exit(0)
}

if (hasBefore && (!previousTokens || !previousMetrics)) {
  console.error(
    "::warning::Unable to load before JSON from git; skipping updates."
  )
  process.exit(0)
}

const currentTokenMap = collectTokenMap(currentTokens)
const previousTokenMap = collectTokenMap(previousTokens)
const currentMetricsMap = collectMetricsMap(currentMetrics)
const previousMetricsMap = collectMetricsMap(previousMetrics)

const changed = new Set()

if (!hasBefore || !previousTokens) {
  for (const id of currentTokenMap.keys()) {
    changed.add(id)
  }
} else {
  const ids = new Set([...currentTokenMap.keys(), ...previousTokenMap.keys()])
  for (const id of ids) {
    const beforeValue = previousTokenMap.get(id)
    const afterValue = currentTokenMap.get(id)
    if (stableStringify(beforeValue) !== stableStringify(afterValue)) {
      changed.add(id)
    }
  }
}

if (!hasBefore || !previousMetrics) {
  for (const id of currentMetricsMap.keys()) {
    changed.add(id)
  }
} else {
  const ids = new Set([...currentMetricsMap.keys(), ...previousMetricsMap.keys()])
  for (const id of ids) {
    const beforeValue = previousMetricsMap.get(id)
    const afterValue = currentMetricsMap.get(id)
    if (stableStringify(beforeValue) !== stableStringify(afterValue)) {
      changed.add(id)
    }
  }
}

const output = Array.from(changed).filter(Boolean).join(",")
process.stdout.write(output)
