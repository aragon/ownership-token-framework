#!/usr/bin/env node
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
 * Exports composeAll() for tests; run directly to write src/data/generated/.
 */
import { createHash } from "node:crypto"
import {
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
const generatedDir = join(root, "src", "data", "generated")

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"))

const SCORED_STATUSES = new Set(["positive", "warning", "at_risk"])

function getMetricScore(metric) {
  const reference = metric.tags?.includes("Reference") ?? false
  const evaluatedCriteria = metric.criteria.filter((c) =>
    SCORED_STATUSES.has(c.status)
  )
  const total = evaluatedCriteria.length
  const passing = evaluatedCriteria.filter(
    (c) => c.status === "positive"
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

function getTokenScore(tokenId, metrics) {
  const metricScores = metrics.map(getMetricScore)
  const scoredMetrics = metricScores.filter((m) => m.evaluated && !m.reference)
  const passing = scoredMetrics.reduce((sum, m) => sum + m.passing, 0)
  const total = scoredMetrics.reduce((sum, m) => sum + m.total, 0)
  const percentage = total > 0 ? (passing / total) * 100 : 0

  return { tokenId, passing, total, percentage, metrics: metricScores }
}

export function composeAll(dir = contentDir) {
  const meta = readJson(join(dir, "framework", "_meta.json"))
  const framework = meta.order.map((id) =>
    readJson(join(dir, "framework", `${id}.json`))
  )
  const criterionDefs = new Map(
    framework.flatMap((m) => m.criteria.map((c) => [c.id, c]))
  )

  const tokenIds = readdirSync(join(dir, "tokens"))
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort()

  const tokenAtoms = new Map(
    tokenIds.map((id) => [id, readJson(join(dir, "tokens", `${id}.json`))])
  )

  const tokenDocs = []
  for (const tokenId of tokenIds) {
    const metrics = []
    for (const fm of framework) {
      const metricDir = join(dir, "evaluations", tokenId, fm.id)
      const editorial = readJson(join(metricDir, "_metric.json"))
      const criteria = fm.criteria.map((fc) => {
        const atom = readJson(join(metricDir, `${fc.id}.json`))
        const composed = {
          id: fc.id,
          name: atom.name ?? fc.name,
          about: fc.about,
          status: atom.status,
          notes: atom.notes,
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
    const countBy = (status) =>
      allCriteria.filter((c) => c.status === status).length
    const score = getTokenScore(tokenId, metrics)

    tokenDocs.push({
      ...tokenAtoms.get(tokenId),
      positive: countBy("positive"),
      neutral: countBy("warning"),
      atRisk: countBy("at_risk"),
      evidenceEntries: allCriteria.flatMap((c) => c.evidence ?? []).length,
      metrics,
      score,
    })
  }

  const index = {
    tokens: tokenDocs.map(({ metrics: _m, score, ...row }) => ({
      ...row,
      score: {
        passing: score.passing,
        total: score.total,
        percentage: score.percentage,
      },
    })),
  }

  const frameworkDoc = { baseUrl: meta.baseUrl, metrics: framework }
  const faq = readJson(join(dir, "faq.json"))
  const testimonials = readJson(join(dir, "testimonials.json"))

  // Deterministic snapshot identity: a content hash over the composed output.
  // Stable across recompositions of identical content (keeps the freshness
  // gate meaningful); changes exactly when published data changes. The future
  // publish pipeline reuses this as the R2 snapshot key component.
  const snapshotId = createHash("sha256")
    .update(JSON.stringify({ index, tokenDocs, frameworkDoc, faq, testimonials }))
    .digest("hex")
    .slice(0, 16)
  const manifest = {
    snapshot_id: snapshotId,
    tokens: tokenDocs.map((d) => d.id),
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
  const writeJson = (p, data) => {
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
