#!/usr/bin/env node
/**
 * One-shot migration: src/data/*.json (legacy monoliths) → content/ atoms.
 *
 * Deterministic and idempotent — wipes and rebuilds content/ from the legacy
 * files. Kept for re-runs during review; obsolete once the legacy files are
 * deleted.
 *
 * What it strips (and why):
 * - token positive/neutral/atRisk/evidenceEntries: derived counts, stale for
 *   every token in the legacy data — recomputed at compose time
 * - metric/criterion `about`: framework-owned, masked at runtime today
 *   (metrics-data.ts merge) — composed from framework atoms
 * - metric `name`: uniform per metric id across tokens — becomes
 *   framework displayName
 * - criterion `name`: kept ONLY where it diverges from the framework name
 *   (exactly one case today: lqty onchain-ctrl__access-gating)
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const src = join(root, "src", "data")
const out = join(root, "content")

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"))
const writeJson = (p, data) => {
  mkdirSync(dirname(p), { recursive: true })
  writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`)
}

// Framework constants leaving src/lib/framework.ts
const METRIC_ANCHORS = {
  "onchain-ctrl": "#metric-1-onchain-control",
  "val-accrual": "#metric-2-value-accrual",
  verifiability: "#metric-3-verifiability",
  distribution: "#metric-4-token-distribution",
  offchain: "#offchain-dependencies",
}
const FRAMEWORK_BASE_URL =
  "https://github.com/aragon/ownership-token-framework/blob/development/README.md"

const tokens = readJson(join(src, "tokens.json")).tokens
const metricsByToken = readJson(join(src, "metrics.json"))
const framework = readJson(join(src, "framework.json"))

rmSync(out, { recursive: true, force: true })

// --- content/tokens/<id>.json ---------------------------------------------
for (const t of tokens) {
  const {
    positive: _p,
    neutral: _n,
    atRisk: _r,
    evidenceEntries: _e,
    ...atom
  } = t
  writeJson(join(out, "tokens", `${t.id}.json`), atom)
}

// --- content/framework/ ----------------------------------------------------
// displayName = the per-token metric name, asserted uniform across tokens
const displayNames = new Map()
for (const [tokenId, metrics] of Object.entries(metricsByToken)) {
  for (const m of metrics) {
    const seen = displayNames.get(m.id)
    if (seen !== undefined && seen !== m.name) {
      throw new Error(
        `metric ${m.id} display name diverges at ${tokenId}: "${m.name}" vs "${seen}"`
      )
    }
    displayNames.set(m.id, m.name)
  }
}

for (const fm of framework) {
  const atom = {
    id: fm.id,
    name: fm.name,
    displayName: displayNames.get(fm.id) ?? fm.name,
    about: fm.about,
    ...(METRIC_ANCHORS[fm.id] ? { anchor: METRIC_ANCHORS[fm.id] } : {}),
    criteria: fm.criteria,
  }
  writeJson(join(out, "framework", `${fm.id}.json`), atom)
}
writeJson(join(out, "framework", "_meta.json"), {
  baseUrl: FRAMEWORK_BASE_URL,
  order: framework.map((m) => m.id),
})

// --- content/evaluations/<tokenId>/<metricId>/ -----------------------------
const frameworkCriterionNames = new Map(
  framework.flatMap((m) => m.criteria.map((c) => [c.id, c.name]))
)

let criterionCount = 0
let nameOverrides = 0
for (const [tokenId, metrics] of Object.entries(metricsByToken)) {
  for (const m of metrics) {
    const dir = join(out, "evaluations", tokenId, m.id)
    writeJson(join(dir, "_metric.json"), { summary: m.summary, tags: m.tags })
    for (const c of m.criteria) {
      const atom = {}
      if (c.name !== frameworkCriterionNames.get(c.id)) {
        atom.name = c.name
        nameOverrides++
      }
      atom.status = c.status
      atom.notes = c.notes
      if ("tags" in c) atom.tags = c.tags
      if ("evidence" in c) atom.evidence = c.evidence
      writeJson(join(dir, `${c.id}.json`), atom)
      criterionCount++
    }
  }
}

// --- content/faq.json + content/testimonials.json --------------------------
writeJson(join(out, "faq.json"), readJson(join(src, "faq.json")))
writeJson(join(out, "testimonials.json"), readJson(join(src, "testimonials.json")))

console.log(
  `migrated: ${tokens.length} tokens, ${framework.length} framework metrics, ` +
    `${criterionCount} criterion evaluations (${nameOverrides} name overrides)`
)
