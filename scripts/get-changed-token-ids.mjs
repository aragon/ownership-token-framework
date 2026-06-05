/**
 * Emit a comma-separated list of token ids whose content changed between two
 * git refs. A token counts as changed when its registry atom
 * (content/tokens/<id>.json) or any of its evaluation atoms
 * (content/evaluations/<id>/**) differ.
 *
 * Usage: node scripts/get-changed-token-ids.mjs --before <sha> --after <sha>
 * With no usable --before (e.g. zero sha on first push), all token ids are
 * reported.
 */
import { execSync } from "node:child_process"
import { readdir } from "node:fs/promises"

function parseArgs(argv) {
  const beforeIndex = argv.indexOf("--before")
  const afterIndex = argv.indexOf("--after")
  return {
    before: beforeIndex === -1 ? "" : argv[beforeIndex + 1] ?? "",
    after: afterIndex === -1 ? "" : argv[afterIndex + 1] ?? "",
  }
}

function tokenIdFromPath(filePath) {
  const registry = filePath.match(/^content\/tokens\/([^/]+)\.json$/)
  if (registry) return registry[1]
  const evaluation = filePath.match(/^content\/evaluations\/([^/]+)\//)
  if (evaluation) return evaluation[1]
  return null
}

async function allTokenIds() {
  const files = await readdir("content/tokens")
  return files
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
}

const { before, after } = parseArgs(process.argv.slice(2))
const zeroSha = /^0+$/
const hasBefore = before && !zeroSha.test(before)
const hasAfter = after && !zeroSha.test(after)

let ids

if (!hasBefore) {
  ids = await allTokenIds()
} else {
  try {
    const range = hasAfter ? `${before} ${after}` : before
    const diff = execSync(
      `git diff --name-only ${range} -- content/tokens content/evaluations`,
      { encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] }
    )
    ids = [
      ...new Set(
        diff
          .split("\n")
          .map((line) => tokenIdFromPath(line.trim()))
          .filter(Boolean)
      ),
    ]
  } catch (_error) {
    console.error(
      "::warning::Unable to diff content paths from git; skipping updates."
    )
    process.exit(0)
  }
}

process.stdout.write(ids.join(","))
