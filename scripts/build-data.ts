#!/usr/bin/env tsx
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
 *   (+ OTF_CONTENT_TOKEN)  compose it. Deploy workflow sets this for both
 *                          production and previews: CMS publishes pass the
 *                          exact CMS commit, app-code production pushes default
 *                          to otf-cms main, and PR previews pass the content
 *                          branch. Blank remains local/test/fixture fallback.
 *
 * Composition uses the VENDORED composer (scripts/lib/compose-data.mjs), so
 * the app produces byte-identical output to otf-cms. The composed output is
 * Zod-validated against the shared contract BEFORE it is written, so an
 * invalid ref (or composer/schema drift) fails the build instead of shipping
 * unvalidated data into the deployment artifact.
 */
import { Buffer } from "node:buffer"
import { execFileSync } from "node:child_process"
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
// Vendored composer (TypeScript, same composition logic as otf-cms).
import { composeAll } from "./lib/compose-data"
import {
  faqSchema,
  frameworkDocSchema,
  indexSchema,
  manifestSchema,
  testimonialsSchema,
  tokenDocSchema,
} from "../src/lib/schemas/index"

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
async function resolveContentDir(): Promise<{
  contentDir: string
  cleanup: () => void
}> {
  if (local) {
    const dir = join(local, "content")
    if (!existsSync(dir)) throw new Error(`No content/ at ${local}`)
    console.log(`build-data: composing from local checkout ${local}`)
    return { contentDir: dir, cleanup: () => {} }
  }

  const token = process.env.OTF_CONTENT_TOKEN
  if (!token) throw new Error("OTF_CONTENT_REF set but OTF_CONTENT_TOKEN missing")
  // Content repo, overridable so a fork builds from its own content. The
  // tarball extracts to "<owner>-<repo>-<sha>/", so the prefix tracks the repo.
  const repo = process.env.OTF_CONTENT_REPO ?? "aragon/otf-cms"
  const tmp = mkdtempSync(join(tmpdir(), "otf-content-"))
  const tarball = join(tmp, "otf-cms.tar.gz")
  console.log(`build-data: fetching ${repo}@${ref}`)

  // Native fetch — no shell. The token rides an Authorization header (never a
  // command line), and the ref is URL-encoded into the path. GitHub's tarball
  // API 302-redirects to a pre-signed codeload URL; fetch follows it.
  const res = await fetch(
    `https://api.github.com/repos/${repo}/tarball/${encodeURIComponent(ref as string)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "otf-app-build",
        Accept: "application/vnd.github+json",
      },
    }
  )
  if (!res.ok) {
    throw new Error(`fetch ${repo}@${ref} failed: ${res.status} ${res.statusText}`)
  }
  writeFileSync(tarball, Buffer.from(await res.arrayBuffer()))

  // execFileSync with an args array — no shell, so no metacharacter injection.
  execFileSync("tar", ["xzf", tarball, "-C", tmp], { stdio: "inherit" })
  const extractedPrefix = `${repo.replace("/", "-")}-`
  const extracted = readdirSync(tmp).find((n) => n.startsWith(extractedPrefix))
  if (!extracted) throw new Error("tarball did not contain the expected root")
  return {
    contentDir: join(tmp, extracted, "content"),
    cleanup: () => rmSync(tmp, { recursive: true, force: true }),
  }
}

const { contentDir, cleanup } = await resolveContentDir()
try {
  const { index, tokenDocs, frameworkDoc, faq, testimonials, manifest } =
    composeAll(contentDir)

  // Validate against the shared contract before writing. Throwing here fails
  // the build — invalid content never reaches the deployment artifact.
  indexSchema.parse(index)
  frameworkDocSchema.parse(frameworkDoc)
  faqSchema.parse(faq)
  testimonialsSchema.parse(testimonials)
  manifestSchema.parse(manifest)
  for (const doc of tokenDocs) tokenDocSchema.parse(doc)

  rmSync(generatedDir, { recursive: true, force: true })
  const write = (rel: string, data: unknown) => {
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
    `build-data: validated + composed ${tokenDocs.length} token docs (snapshot ${manifest.snapshot_id})`
  )
} finally {
  cleanup()
}
