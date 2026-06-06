#!/usr/bin/env node
/**
 * Re-vendor the schema contract from otf-cms (the source of truth).
 *
 * Usage: node scripts/vendor-schemas.mjs [path-to-otf-cms-checkout]
 *        (default: ../otf-cms sibling checkout)
 *
 * Copies otf-cms/schemas/*.ts into src/lib/schemas/, injects the VENDORED
 * banner into index.ts, and records a vendor lock (source commit + per-file
 * hashes). CI verifies the lock — direct edits to the vendored copy fail CI;
 * this script is the only sanctioned way to change these files.
 */
import { execSync } from "node:child_process"
import { createHash } from "node:crypto"
import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const sourceRepo = resolve(root, process.argv[2] ?? "../otf-cms")
const sourceDir = join(sourceRepo, "schemas")
const targetDir = join(root, "src", "lib", "schemas")

const BANNER = (commit) => `/**
 * OTF data contract — VENDORED COPY. DO NOT EDIT HERE.
 *
 * Source of truth: https://github.com/aragon/otf-cms (schemas/), vendored
 * at commit ${commit}. Change upstream, then re-vendor:
 *   node scripts/vendor-schemas.mjs
 * CI fails on direct edits (scripts/check-schema-drift.mjs).
 */`

const sourceCommit = execSync("git rev-parse HEAD", {
  cwd: sourceRepo,
  encoding: "utf8",
}).trim()

const files = readdirSync(sourceDir).filter((f) => f.endsWith(".ts"))
const lock = { source: "aragon/otf-cms", source_commit: sourceCommit, files: {} }

for (const file of files.sort()) {
  let content = readFileSync(join(sourceDir, file), "utf8")
  if (file === "index.ts") {
    // Replace the upstream header comment with the vendored banner
    content = content.replace(/^\/\*\*[\s\S]*?\*\//, BANNER(sourceCommit))
  }
  writeFileSync(join(targetDir, file), content)
  lock.files[file] = createHash("sha256").update(content).digest("hex")
}

writeFileSync(
  join(targetDir, ".vendor-lock.json"),
  `${JSON.stringify(lock, null, 2)}\n`
)

console.log(
  `vendored ${files.length} schema files from otf-cms@${sourceCommit.slice(0, 7)}`
)
