# Publishing `otf-mcp-server` to npm

The MCP server is released as a public npm package so anyone can run it with

```bash
npx -y otf-mcp-server
```

(no checkout, no build). Releases are automated by
`.github/workflows/publish-mcp.yml`. This doc is the one-time setup + the
recurring release steps.

## DevOps handoff — one-time setup

Everything below needs npm account/org admin; it is **not** something a repo
contributor can do. The code and workflow are already in place — the only gap is
the credential and the name claim.

1. **Claim the package name.** `otf-mcp-server` is currently unclaimed on npm
   (`npm view otf-mcp-server` → 404). Decide:
   - **Unscoped `otf-mcp-server`** (default; what the code, README, and every
     client-config example already use). No org required — the first successful
     publish claims it.
   - **Scoped `@aragon/otf-mcp-server`** (requires an npm org named `aragon`).
     If you choose this, change `name` in `mcp/package.json`, the `npx` examples
     in `mcp/README.md`, and tell users the new name. `publishConfig.access` is
     already `public`, so a scoped package still publishes publicly.

2. **Create an npm access token.** Use an **Automation** token (bypasses the 2FA
   OTP prompt in CI) with publish rights to the package/org.
   npmjs.com → Access Tokens → Generate New Token → Automation (or a Granular
   token scoped to this package with read+write).

3. **Add it as a repo secret.** GitHub → the `aragon/ownership-token-framework`
   repo → Settings → Secrets and variables → Actions → New repository secret:
   - Name: `NPM_TOKEN`
   - Value: the token from step 2

   That is the **only** secret the workflow needs. Package integrity uses npm
   **provenance** via GitHub OIDC (the workflow already requests
   `id-token: write`), so no PAT and no other trust anchor is required. The
   tarball is cryptographically linked to this repo + the release workflow.

That's it for DevOps. Nothing else (no Vercel, no branch protection) is involved.

## Cutting a release (maintainer, after the secret is set)

Two ways — both run build + tests before publishing.

**Tag (canonical):**
```bash
# bump the version in mcp/package.json first, commit it, then:
git tag mcp-v0.1.0
git push origin mcp-v0.1.0
```
The tag version must equal `mcp/package.json` `"version"` or the run fails on
purpose. Tag format is `mcp-v<version>` (the `mcp-` prefix scopes it so app
releases in this monorepo don't trigger an npm publish).

**Manual dispatch:** GitHub → Actions → **Publish MCP** → Run workflow.
- Leave `dry_run` = true to validate + pack without publishing.
- Set `dry_run` = false to publish from the current branch without a tag.

## Verify

```bash
npm view otf-mcp-server version        # shows the published version
npx -y otf-mcp-server                  # resolves + starts (Ctrl-C to exit)
```

Then in a client:
```bash
claude mcp add otf --env OTF_API_BASE=https://otf.aragon.org -- npx -y otf-mcp-server
```
`/mcp` should show `otf` as **connected** (not `failed`).

## Notes

- If the npm org enforces "require 2FA and disallow tokens", an Automation token
  won't work — use a **Granular** token scoped to the package, or configure npm
  **Trusted Publishing** (OIDC) for this workflow instead of a stored token.
- Provenance requires a public repo (this one is). No action needed.
- Adding a `LICENSE` file to `mcp/` is optional; the manifest already declares
  MIT, which is what npm surfaces.
