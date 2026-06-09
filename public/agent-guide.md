# OTF agent guide

Orientation for agents and analysts consuming the Ownership Token Framework
data. The framework evaluates how genuinely tokenholder-owned a crypto
protocol is, on evidence, against a fixed rubric.

## The data model in one minute

A **token's analysis** is a join of two things:

- the **framework** — a fixed rubric of ~5 metrics, each with several
  criteria (the *questions*, identical for every token). See
  `/api/v1/framework`.
- that token's **evaluations** — one verdict per criterion: a status, notes,
  and evidence (the *answers*). Delivered composed inside `/api/v1/tokens/{id}`.

Criterion ids encode their place in the rubric: `onchain-ctrl__governance-workflow`
= the `governance-workflow` criterion of the `onchain-ctrl` metric.

## Endpoints

| Endpoint | Use |
|---|---|
| `/api/v1/tokens` | discovery + cross-token comparison: slim rows with score, status counts, and a `criteriaStatuses` map keyed by criterion id |
| `/api/v1/tokens/{id}` | a full token report: `metrics[].criteria[]` with `status`, `notes`, `evidence[]`; plus `score` and counts |
| `/api/v1/framework` | the rubric: metric/criterion `name` + `about` definitions |
| `/api/v1/faq` | methodology and framework Q&A |

`{id}` is the lowercase token id (e.g. `ldo`, `aave`).

## Status vocabulary (exactly these)

- `positive` — criterion met
- `warning` — partially met / caveats
- `at_risk` — not met (the terminal negative)
- `unevaluated` — not yet assessed
- `reference` — informational, not a judgment

A token's `score` counts only evaluated, non-reference criteria.

## Provenance and reproducibility

Every response is `{ data, provenance }`. `provenance.snapshot_id` is a
deterministic content hash of the entire published data set — cite it to pin
exactly what you read. `provenance.commit_ref` ties it to a deployment.
`published_at` may be null in the current serving mode; use `snapshot_id` /
`commit_ref` as the version of record.

## How to use it well

- To analyze a protocol, fetch its token doc and follow the **evidence URLs**
  (onchain explorers, docs, governance forums) — the framework is the map;
  the evidence is the territory.
- To compare protocols, use the index's `criteriaStatuses` map — no need to
  fetch every token doc.
- Statuses are the canonical machine signal; `notes` are human prose context.
- The data updates roughly quarterly; the same `snapshot_id` means the data
  has not changed.
