# Public API versioning policy

Scope: the public JSON API served under `/api/v1/*`. This is a **contract**
version, independent of everything else that carries a version in this project:

| Clock | What it versions | Where | How it moves |
|---|---|---|---|
| **API contract** (this doc) | The *shape* of `/api/v1/*` responses | the `v1` in the URL path | manual, on breaking change only |
| Data / content | *Which* snapshot the data came from | `provenance.snapshot_id` + `commit_ref` on every response | automatically, every content edit |
| App release | The dashboard app build | git tags / GitHub Releases (see [app-releases.md](./app-releases.md)) | per release |
| MCP package | The `otf-mcp-server` npm package | `mcp/package.json` + `mcp-v*` tags | per npm publish |

These are four separate clocks. Do not couple them. In particular, do **not**
bump `/api/v1` because the app released, the data changed, or the MCP published —
and vice versa.

## Principle: URL-path major versioning

`v1` is a stability promise: a consumer that pins `/api/v1` keeps working until
`v1` is formally deprecated. We version the *major* in the path and nothing else
(no `Accept` header negotiation, no minor/patch in the URL). Backward-compatible
changes ship in place under `v1`; breaking changes get a new path.

The OpenAPI document mirrors this: `info.version` is `"v1"` and `servers` is
`/api/v1`. Component schema ids (`TokenDoc`, `TokenIndex`, `FrameworkDoc`, …) are
kept stable so codegen consumers can `$ref` them across releases.

## What does NOT bump the version (additive, ships under `v1`)

A tolerant consumer must ignore what it doesn't recognize; these are safe:

- A **new endpoint** under `/api/v1`.
- A **new optional query parameter** (existing calls behave unchanged).
- A **new field** in a response object.
- **Relaxing** a request constraint (accepting input that used to 400).

## What DOES bump the version (breaking → new path)

- **Removing or renaming** a response field, or changing its **type**.
- Changing the **meaning or units** of an existing field.
- Making an **optional request param required**, or otherwise **tightening**
  request validation.
- Removing an endpoint, or changing the **error envelope** (`{ error: { code,
  message } }`) or the `{ data, provenance }` wrapper.
- **Adding a value to a closed response enum.** The criterion `status` vocabulary
  (`positive | warning | at_risk | unevaluated | reference`) is deliberately
  closed and documented as exhaustive, so a sixth value can break consumers that
  switch on it exhaustively. Treat enum additions as breaking unless the field is
  explicitly documented as open-ended.

When a breaking change is needed: stand up `/api/v2` **alongside** `v1`, keep
`v1` serving through a deprecation window, announce the sunset, and (optionally)
emit `Deprecation` / `Sunset` response headers on `v1`. Do not mutate `v1` in
place.

## Cadence: manual, human decision

There is no programmatic version bump, and that is the point — the value of a URL
version is that it is stable and deliberate. A person decides when a change is
breaking enough to warrant `/api/v2`.

## Recommended automation: detect, don't assign

Automation's job here is a **guard**, not a bumper. Recommended (not yet built):
a CI contract test that diffs the served responses / generated
`/api/v1/openapi.json` against a committed baseline and **fails the build** when
a change is breaking-without-a-new-path. That turns "did someone break `v1`?"
from a judgment call into a red check, while leaving the *when to cut v2*
decision to a human. The OpenAPI doc is generated from the vendored Zod
read-models, so it already can't silently drift from the served shapes — the
missing piece is asserting the *diff* against a baseline.

## Consumer guidance

- **Pin `/api/v1`.** Read tolerantly: ignore unknown fields; don't assume the
  response enum is closed unless this doc says so.
- **Cite `provenance`** (`snapshot_id`, `commit_ref`, `last_updated`) for
  reproducibility. Do not infer data freshness from cache headers or from the
  contract version — the contract version says nothing about *which* data you
  got.
- Watch for `Deprecation` / `Sunset` headers on a version once one is scheduled
  for removal.
