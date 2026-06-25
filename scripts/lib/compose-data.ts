#!/usr/bin/env tsx
/**
 * Composer: content/ atoms → src/data/generated/ read models.
 *
 * Joins research-shaped atoms (registry, framework, evaluations) into
 * consumer-shaped docs by id:
 * - criterion name/about come from framework (atom `name` overrides)
 * - metric display name + about come from framework
 * - scores and status counts are computed here (compose time), not at render
 *
 * Replaces the runtime framework-merge formerly in src/lib/metrics-data.ts.
 * The scoring logic mirrors the pure functions in src/lib/scoring.ts and is
 * pinned to them by the golden round-trip tests.
 *
 * Inputs are read from JSON (untyped by nature) and the composed output is
 * Zod-validated downstream (otf-cms tests; the app's build-data step) — so the
 * transform is typed loosely on purpose and the schema contract is the source
 * of truth for the real shapes.
 *
 * Exports composeAll() for tests; run directly to write src/data/generated/.
 */
import { createHash } from "node:crypto"
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const contentDir = join(root, "content")
const generatedDir = join(root, "generated")

const readJson = (p: string): any => JSON.parse(readFileSync(p, "utf8"))

/**
 * Tolerant read for partial tokens: a token enters the set as soon as its
 * identity file exists, but its criterion atoms / metric summaries may not
 * exist yet (editors stand a token up progressively). A missing file is NOT a
 * build error — it yields `fallback` so the doc composes fully with everything
 * `unevaluated`/empty. The publish gate (bundle-snapshot) excludes such WIP
 * tokens from Release; previews build on the partial data.
 */
const readJsonOr = <T>(p: string, fallback: T): T =>
  existsSync(p) ? (readJson(p) as T) : fallback

const SCORED_STATUSES = new Set(["positive", "warning", "at_risk"])

function getMetricScore(metric: any) {
  const reference = metric.tags?.includes("Reference") ?? false
  const evaluatedCriteria = metric.criteria.filter((c: any) =>
    SCORED_STATUSES.has(c.status)
  )
  const total = evaluatedCriteria.length
  const passing = evaluatedCriteria.filter(
    (c: any) => c.status === "positive"
  ).length
  const evaluated = reference ? false : total > 0
  const percentage = total > 0 ? (passing / total) * 100 : 0

  return {
    metricId: metric.id,
    metricName: metric.name,
    passing,
    total,
    percentage,
    evaluated,
    reference,
  }
}

function getTokenScore(tokenId: string, metrics: any[]) {
  const metricScores = metrics.map(getMetricScore)
  const scoredMetrics = metricScores.filter((m) => m.evaluated && !m.reference)
  const passing = scoredMetrics.reduce((sum, m) => sum + m.passing, 0)
  const total = scoredMetrics.reduce((sum, m) => sum + m.total, 0)
  const percentage = total > 0 ? (passing / total) * 100 : 0

  return { tokenId, passing, total, percentage, metrics: metricScores }
}

export function composeAll(dir: string = contentDir) {
  const meta = readJson(join(dir, "framework-meta.json"))
  const framework = meta.order.map((id: string) =>
    readJson(join(dir, "framework", `${id}.json`))
  )

  const tokenIds: string[] = readdirSync(join(dir, "tokens"))
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort()

  const tokenAtoms = new Map<string, any>(
    tokenIds.map((id) => [id, readJson(join(dir, "tokens", `${id}.json`))])
  )

  const tokenDocs: any[] = []
  for (const tokenId of tokenIds) {
    const metrics: any[] = []
    for (const fm of framework) {
      const metricDir = join(dir, "evaluations", tokenId, fm.id)
      // Missing summary → empty editorial (token still composing).
      const editorial = readJsonOr<{ summary: string; tags: string[] }>(
        join(dir, "summaries", tokenId, `${fm.id}.json`),
        { summary: "", tags: [] }
      )
      const criteria = fm.criteria.map((fc: any) => {
        // Missing criterion atom → unevaluated (no notes/evidence yet).
        const atom = readJsonOr<any>(join(metricDir, `${fc.id}.json`), {
          status: "unevaluated",
          notes: "",
        })
        const composed: any = {
          id: fc.id,
          name: atom.name ?? fc.name,
          about: fc.about,
          status: atom.status,
          notes: atom.notes ?? "",
        }
        if ("tags" in atom) composed.tags = atom.tags
        if ("evidence" in atom) composed.evidence = atom.evidence
        return composed
      })
      metrics.push({
        id: fm.id,
        name: fm.displayName,
        about: fm.about,
        summary: editorial.summary,
        tags: editorial.tags,
        criteria,
      })
    }

    const allCriteria = metrics.flatMap((m) => m.criteria)
    const countBy = (status: string) =>
      allCriteria.filter((c) => c.status === status).length
    const score = getTokenScore(tokenId, metrics)

    tokenDocs.push({
      ...tokenAtoms.get(tokenId),
      positive: countBy("positive"),
      neutral: countBy("warning"),
      atRisk: countBy("at_risk"),
      evidenceEntries: allCriteria.flatMap((c) => c.evidence ?? []).length,
      score,
      criteriaStatuses: Object.fromEntries(
        allCriteria.map((c) => [c.id, c.status])
      ),
      metrics,
    })
  }

  // Index rows are the dashboard read model: full score (the score hover
  // shows the per-metric breakdown) and a flat criterion-status map (the
  // table renders single-criterion columns across all tokens) — so the
  // dashboard needs exactly one fetch and never loads per-token docs.
  const index = {
    tokens: tokenDocs.map(({ metrics: _metrics, ...row }) => row),
  }

  const frameworkDoc = { baseUrl: meta.baseUrl, metrics: framework }
  const faq = readJson(join(dir, "faq.json"))
  const testimonials = readJson(join(dir, "testimonials.json"))

  // Deterministic snapshot identity: a content hash over the composed output.
  // Stable across recompositions of identical content (keeps the freshness
  // gate meaningful); changes exactly when published data changes. The future
  // publish pipeline reuses this as the R2 snapshot key component.
  const snapshotId = createHash("sha256")
    .update(
      JSON.stringify({ index, tokenDocs, frameworkDoc, faq, testimonials })
    )
    .digest("hex")
    .slice(0, 16)

  // Most-recent editorial timestamp across the set (unix seconds → ISO).
  // Freshness signal surfaced in the API provenance envelope. Derived purely
  // from content already inside snapshot_id's hash, so it never perturbs it.
  const editedAt: number[] = tokenDocs
    .map((d) => d.lastUpdated)
    .filter((t) => typeof t === "number" && t > 0)
  const manifest = {
    snapshot_id: snapshotId,
    last_updated:
      editedAt.length > 0
        ? new Date(Math.max(...editedAt) * 1000).toISOString()
        : null,
    tokens: tokenDocs.map((d) => d.id as string),
  }

  return {
    index,
    tokenDocs,
    frameworkDoc,
    faq,
    testimonials,
    manifest,
  }
}

function main() {
  const { index, tokenDocs, frameworkDoc, faq, testimonials, manifest } =
    composeAll()

  rmSync(generatedDir, { recursive: true, force: true })
  const writeJson = (p: string, data: unknown) => {
    mkdirSync(dirname(p), { recursive: true })
    writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`)
  }

  writeJson(join(generatedDir, "index.json"), index)
  for (const doc of tokenDocs) {
    writeJson(join(generatedDir, "tokens", `${doc.id}.json`), doc)
  }
  writeJson(join(generatedDir, "framework.json"), frameworkDoc)
  writeJson(join(generatedDir, "faq.json"), faq)
  writeJson(join(generatedDir, "testimonials.json"), testimonials)
  writeJson(join(generatedDir, "manifest.json"), manifest)

  console.log(
    `composed: index (${index.tokens.length} rows), ${tokenDocs.length} token docs, framework, faq, testimonials (snapshot ${manifest.snapshot_id})`
  )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
