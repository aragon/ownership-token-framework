# App release flow

Versions and releases the **dashboard app's own code** — business logic and UI.
Lightweight subset of the Aragon standard release flow (Changesets + a signed
Release PR), trimmed to opsec + low friction: no Slack, no Linear, no staging/e2e
ceremony.

## What this does and does NOT version

This flow versions **app code only**. It does **not** touch content.

Content (tokens, evaluations, framework, FAQ) lives in **otf-cms** and ships on
its *own* clock: otf-cms `publish.yml` → an immutable content Release, which the
app reads at **runtime** (gated by `OTF_PUBLISHED_RELEASE`). Consequences:

- A **content edit needs no app release or redeploy** — it reaches production
  through otf-cms's publish, picked up at runtime.
- An **app release never reships or re-versions content** — merging a code
  release doesn't move content, and vice versa.
- Editors publishing content and engineers releasing the app are **independent
  cadences**. This is the same decoupling APP-556 was built for; the release flow
  just inherits it.

So the version this flow stamps (`vX.Y.Z`) answers "which app code is live,"
never "which content is live" (that's `provenance.snapshot_id`, see
[api-versioning.md](./api-versioning.md)).

## The flow

1. **Per PR: add a changeset.** `pnpm changeset` → pick the bump (patch/minor/
   major) and write a one-line summary. Commit the generated `.changeset/*.md`
   with your change. (No changeset = nothing to release for that PR.)
2. **Cut a release (maintainer): run *Release — prepare*** (Actions → manual
   dispatch). It consumes the pending changesets → bumps `package.json` version +
   regenerates `CHANGELOG.md`, commits that (GPG-signed by the bot), and opens a
   `release/vX.Y.Z → main` PR whose body points at the CHANGELOG diff.
3. **Review + merge the Release PR.** That merge *is* the release:
   - `deploy.yml` (push to `main`) ships production, and
   - `release-finalize.yml` tags `vX.Y.Z` and cuts a **GitHub Release** with the
     CHANGELOG section as notes.

## Opsec

- **Secrets via 1Password.** Only `OP_SERVICE_ACCOUNT_TOKEN` is stored in GitHub;
  the bot PAT and GPG key are loaded from 1Password at run time
  (`1password/load-secrets-action`). `release-finalize.yml` needs no secrets at
  all — tagging + releasing uses the built-in token.
- **Signed release commit.** The bot's "Release vX.Y.Z" commit is GPG-signed.
- **Least privilege.** The workflow's built-in `GITHUB_TOKEN` is read-only; a
  scoped bot PAT does the writes (and, deliberately, lets the Release PR trigger
  CI — a branch pushed with `GITHUB_TOKEN` would not).
- **Pinned actions.** All third-party actions are pinned to full commit SHAs.

## Versioning

SemVer via Changesets, seeded at `0.1.0`. Bump to `1.0.0` whenever you want to
declare the app stable — just make that changeset a `major`.

Tag namespace is **`v*`**, deliberately disjoint from **`mcp-v*`** (the MCP npm
publish flow, `publish-mcp.yml`). Disjoint prefixes are what guarantee the two
release flows never cross-trigger.

## DevOps handoff (one-time)

The flow is code-complete; it needs credentials provisioned:

1. **GitHub repo secret** — `OP_SERVICE_ACCOUNT_TOKEN` (1Password service
   account with read on the vault below). This is the only stored GitHub secret.
2. **1Password vault items** — confirm/create the vault and items referenced by
   `.github/workflows/release.yml` (currently `op://kv_otf_infra/...`; repoint to
   the real vault name if different):
   - `ARABOT_PAT` → `credential`: a bot PAT with **contents: write** +
     **pull-requests: write** on this repo. Pushes the release branch and opens
     the Release PR (so CI re-fires).
   - `arabot-1_SIGN_CERTS` → `private_key`: the bot's **GPG private key**.
   - `arabot-1_SIGN_CERTS` → `credential`: the **GPG key passphrase**.

Nothing else — no Vercel, no Slack, no Linear. If `main` is branch-protected,
allow the bot PAT (or the release path) to open/merge the Release PR per your
protection rules.

## Notes

- **Don't add changesets to an in-flight release.** `release-finalize.yml` fails
  if unconsumed `.changeset/*.md` land with the Release PR — seal a release when
  its PR opens; new scope → new release.
- **If production deploy is ever moved to trigger on `release: published`**, the
  Release must be created with a bot PAT, not the built-in token (a
  `GITHUB_TOKEN`-created Release emits no event). Today deploy runs on
  push-to-main, so the built-in token is fine.
