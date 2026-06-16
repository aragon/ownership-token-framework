#!/usr/bin/env node
/**
 * Drift gate (CI). The shared contract files here (the Zod schemas + composer)
 * are checked-in COPIES of otf-cms's source — "vendored" by
 * scripts/vendor-schemas.mjs. This verifies each copy still matches the hash
 * recorded in the lock, so a hand-edit of a copy fails the build. To change
 * one: edit it in otf-cms, then re-run vendor-schemas.mjs to refresh the copies.
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
