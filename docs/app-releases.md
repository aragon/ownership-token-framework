# App release flow (scope)

This is a scoping doc for versioning the **dashboard app itself** — distinct from
the public API contract ([api-versioning.md](./api-versioning.md)) and from the
MCP npm package. It captures where things stand and what a release-flow ticket
would build. The flow is **not** implemented here.

## Today

- Deployment is **continuous**: push to `main` → `.github/workflows/deploy.yml`
  → Vercel. No tags, no GitHub Releases, no changelog.
- The root `package.json` is `private: true` with **no `version`**; the repo has
  **0 git tags**.
- Production *content* is a separate clock again — it arrives at runtime from the
  otf-cms published Release, not from an app build.

So the app has *deploy*, not *release*. That is fine for a private, deploy-only
app; a version buys traceability and a changelog, not npm distribution.

## Proposed (the ticket)

- **Tag pattern `v*`** (or `app-v*`). It **must not** be `mcp-v*` — that prefix
  is reserved for the MCP publish flow (`.github/workflows/publish-mcp.yml`), and
  keeping the tag namespaces disjoint is what guarantees the two release flows
  never cross-trigger.
- A **`release.yml`** that, on a `v*` tag push, cuts a **GitHub Release** with
  auto-generated notes.
- Give the root `package.json` a `version` and a bump step — manual, or a tool
  like Changesets / release-please if automation is wanted.
- Optionally stamp the app version into the API discovery root (`/api/v1`) for
  build provenance — but note this is the *app* version, orthogonal to the API
  *contract* version, which stays `v1` regardless.

## Independence (the invariant)

Four release clocks, none coupled — see the table in
[api-versioning.md](./api-versioning.md). The concrete guarantee that keeps the
two *workflow* flows independent is the **disjoint tag namespace**:

| Flow | Trigger | Output |
|---|---|---|
| MCP publish | `mcp-v*` tag | npm package |
| App release (proposed) | `v*` / `app-v*` tag | GitHub Release |

Different prefixes → different workflows fire → no accidental npm publish on an
app release, and no app release on an MCP tag.
