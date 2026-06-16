#!/usr/bin/env node
/**
 * Re-vendor the data contract + composer from otf-cms (the source of truth).
 *
 * Usage: node scripts/vendor-schemas.mjs [path-to-otf-cms-checkout]
 *        (default: ../otf-cms sibling checkout)
 *
 * Vendors:
 *   otf-cms/schemas/*.ts        → src/lib/schemas/        (the Zod contract)
 *   otf-cms/scripts/compose-data.ts → scripts/lib/compose-data.ts
 *     (the composer — the app composes otf-cms content at build time, so it
 *      must run the exact same composition logic)
 *
 * Records a vendor lock (source commit + per-file hashes). CI verifies it —
 * direct edits to the vendored copies fail; this script is the only
 * sanctioned way to change them.
 */
import { execSync } from "node:child_process"
import { createHash } from "node:crypto"
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const sourceRepo = resolve(root, process.argv[2] ?? "../otf-cms")

const BANNER = (commit) => `/**
 * OTF data contract — VENDORED COPY. DO NOT EDIT HERE.
 *
 * Source of truth: https://github.com/aragon/otf-cms, vendored at commit
 * ${commit}. Change upstream, then re-vendor:
 *   node scripts/vendor-schemas.mjs
 * CI fails on direct edits (scripts/check-schema-drift.mjs).
 */`

const sourceCommit = execSync("git rev-parse HEAD", {
  cwd: sourceRepo,
  encoding: "utf8",
}).trim()

const lock = { source: "aragon/otf-cms", source_commit: sourceCommit, files: {} }

/** Copy a source file to a repo-root-relative target; record its hash. */
function vendor(srcAbs, targetRel, { banner = false } = {}) {
  let content = readFileSync(srcAbs, "utf8")
  if (banner) content = content.replace(/^\/\*\*[\s\S]*?\*\//, BANNER(sourceCommit))
  const targetAbs = join(root, targetRel)
  mkdirSync(dirname(targetAbs), { recursive: true })
  writeFileSync(targetAbs, content)
  lock.files[targetRel] = createHash("sha256").update(content).digest("hex")
}

// Schemas
const schemaDir = join(sourceRepo, "schemas")
for (const f of readdirSync(schemaDir).filter((f) => f.endsWith(".ts")).sort()) {
  vendor(join(schemaDir, f), join("src/lib/schemas", f), { banner: f === "index.ts" })
}

// Composer
vendor(
  join(sourceRepo, "scripts", "compose-data.ts"),
  "scripts/lib/compose-data.ts"
)

writeFileSync(
  join(root, "src/lib/schemas/.vendor-lock.json"),
  `${JSON.stringify(lock, null, 2)}\n`
)

console.log(
  `vendored ${Object.keys(lock.files).length} files from otf-cms@${sourceCommit.slice(0, 7)}`
)
