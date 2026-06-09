#!/usr/bin/env node
/**
 * Vendored-contract integrity gate (CI): every vendored file (schemas +
 * composer) must match the vendor lock written by scripts/vendor-schemas.mjs.
 * Direct edits to a vendored copy fail here — change it in otf-cms and
 * re-vendor.
 */
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const lock = JSON.parse(
  readFileSync(join(root, "src/lib/schemas/.vendor-lock.json"), "utf8")
)

const drifted = []
for (const [rel, expected] of Object.entries(lock.files)) {
  let hash
  try {
    hash = createHash("sha256")
      .update(readFileSync(join(root, rel), "utf8"))
      .digest("hex")
  } catch {
    drifted.push(`${rel} (missing)`)
    continue
  }
  if (hash !== expected) drifted.push(rel)
}

if (drifted.length > 0) {
  console.error(
    `Vendored contract drift: ${drifted.join(", ")}\n` +
      `These are vendored from aragon/otf-cms (locked at ${lock.source_commit.slice(0, 7)}). ` +
      "Edit them in otf-cms, then run: node scripts/vendor-schemas.mjs"
  )
  process.exit(1)
}

console.log(
  `vendored contract intact (${Object.keys(lock.files).length} files, ${lock.source}@${lock.source_commit.slice(0, 7)})`
)
