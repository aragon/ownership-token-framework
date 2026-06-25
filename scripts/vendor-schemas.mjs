#!/usr/bin/env node
/**
 * Sync the shared data contract (Zod schemas + composer) from otf-cms into this
 * repo by COPYING the files in. This is "vendoring": the app keeps checked-in
 * copies of otf-cms's source instead of installing it as an npm package, so
 * there's one source of truth (otf-cms) with no registry or publish step. To
 * "re-vendor" is just to re-run this script to refresh the copies after the
 * otf-cms originals change.
 *
 * Usage: node scripts/vendor-schemas.mjs [path-to-otf-cms-checkout]
 *        (default: ../otf-cms sibling checkout)
 *
 * Copies:
 *   otf-cms/schemas/*.ts            → src/lib/schemas/   (the Zod contract)
 *   otf-cms/scripts/compose-data.ts → scripts/lib/compose-data.ts (the composer)
 *
 * Writes a lock file (the otf-cms source commit + a hash of each copied file).
 * CI (check-schema-drift.mjs) re-checks those hashes, so hand-editing a copy
 * here fails the build — change it in otf-cms and re-run this script instead.
 */
import { execSync } from "node:child_process"
import { createHash } from "node:crypto"
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const sourceRepo = resolve(root, process.argv[2] ?? "../otf-cms")

const BANNER = (commit) => `/**
 * OTF data contract — a checked-in COPY of otf-cms's source (i.e. "vendored").
 * DO NOT EDIT HERE: a change to this copy fails CI's drift check.
 *
 * Source of truth: https://github.com/aragon/otf-cms (copied at ${commit}).
 * To change it, edit the file in otf-cms, then refresh the copies here by
 * re-running:  node scripts/vendor-schemas.mjs
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
