#!/usr/bin/env node
/**
 * Build-time data layer. Produces src/data/generated/ (the read models the
 * app serves) from otf-cms content. Three modes, by env:
 *
 *   (default)              no env set → leave the committed src/data/generated/
 *                          as-is. Hermetic builds, local dev, and the test
 *                          suite all use the committed snapshot.
 *
 *   OTF_CONTENT_LOCAL=<p>  compose from a local otf-cms checkout at <p>.
 *                          Local development against sibling content.
 *
 *   OTF_CONTENT_REF=<ref>  fetch otf-cms content at <ref> (a branch/sha) and
 *   (+ OTF_CONTENT_TOKEN)  compose it. This is the production + preview path:
 *                          prod builds from `main`, PR previews from the
 *                          content branch — one mechanism, no committed data
 *                          churn, no write access to this repo.
 *
 * Composition uses the VENDORED composer (scripts/lib/compose-data.mjs), so
 * the app produces byte-identical output to otf-cms.
 */
import { execSync } from "node:child_process"
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { composeAll } from "./lib/compose-data.mjs"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const generatedDir = join(root, "src", "data", "generated")

const ref = process.env.OTF_CONTENT_REF
const local = process.env.OTF_CONTENT_LOCAL

if (!ref && !local) {
  console.log(
    "build-data: no OTF_CONTENT_REF / OTF_CONTENT_LOCAL — using committed src/data/generated/"
  )
  process.exit(0)
}

/** Resolve the otf-cms `content/` directory for this build. */
function resolveContentDir() {
  if (local) {
    const dir = join(local, "content")
    if (!existsSync(dir)) throw new Error(`No content/ at ${local}`)
    console.log(`build-data: composing from local checkout ${local}`)
    return { contentDir: dir, cleanup: () => {} }
  }

  const token = process.env.OTF_CONTENT_TOKEN
  if (!token) throw new Error("OTF_CONTENT_REF set but OTF_CONTENT_TOKEN missing")
  const tmp = mkdtempSync(join(tmpdir(), "otf-content-"))
  const tarball = join(tmp, "otf-cms.tar.gz")
  console.log(`build-data: fetching otf-cms@${ref}`)
  // GitHub tarball API; -L follows the redirect to the asset.
  execSync(
    `curl -sSL -H "Authorization: Bearer ${token}" -H "User-Agent: otf-app-build" ` +
      `-o "${tarball}" "https://api.github.com/repos/aragon/otf-cms/tarball/${ref}"`,
    { stdio: "inherit" }
  )
  execSync(`tar xzf "${tarball}" -C "${tmp}"`, { stdio: "inherit" })
  const extracted = readdirSync(tmp).find((n) => n.startsWith("aragon-otf-cms-"))
  if (!extracted) throw new Error("tarball did not contain the expected root")
  return {
    contentDir: join(tmp, extracted, "content"),
    cleanup: () => rmSync(tmp, { recursive: true, force: true }),
  }
}

const { contentDir, cleanup } = resolveContentDir()
try {
  const { index, tokenDocs, frameworkDoc, faq, testimonials, manifest } =
    composeAll(contentDir)

  rmSync(generatedDir, { recursive: true, force: true })
  const write = (rel, data) => {
    const p = join(generatedDir, rel)
    mkdirSync(dirname(p), { recursive: true })
    writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`)
  }
  write("index.json", index)
  write("framework.json", frameworkDoc)
  write("faq.json", faq)
  write("testimonials.json", testimonials)
  write("manifest.json", manifest)
  for (const doc of tokenDocs) write(join("tokens", `${doc.id}.json`), doc)

  console.log(
    `build-data: composed ${tokenDocs.length} token docs (snapshot ${manifest.snapshot_id})`
  )
} finally {
  cleanup()
}
