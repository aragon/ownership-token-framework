#!/usr/bin/env node
/**
 * Vendored-schema integrity gate (CI): every file in src/lib/schemas/ must
 * match the vendor lock written by scripts/vendor-schemas.mjs. Direct edits
 * to the vendored copy fail here — change schemas in otf-cms and re-vendor.
 */
import { createHash } from "node:crypto"
import { readdirSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const dir = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "lib",
  "schemas"
)

const lock = JSON.parse(readFileSync(join(dir, ".vendor-lock.json"), "utf8"))
const files = readdirSync(dir).filter((f) => f.endsWith(".ts"))

const drifted = []
for (const file of files.sort()) {
  const hash = createHash("sha256")
    .update(readFileSync(join(dir, file), "utf8"))
    .digest("hex")
  if (lock.files[file] !== hash) drifted.push(file)
}
for (const file of Object.keys(lock.files)) {
  if (!files.includes(file)) drifted.push(`${file} (missing)`)
}

if (drifted.length > 0) {
  console.error(
    `Vendored schema drift detected: ${drifted.join(", ")}\n` +
      "src/lib/schemas/ is a vendored copy of otf-cms/schemas " +
      `(locked at ${lock.source_commit.slice(0, 7)}). ` +
      "Edit the schemas in aragon/otf-cms, then run: node scripts/vendor-schemas.mjs"
  )
  process.exit(1)
}

console.log(
  `vendored schemas intact (${files.length} files, source ${lock.source}@${lock.source_commit.slice(0, 7)})`
)
