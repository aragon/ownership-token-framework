# OTF MCP Server

[![npm](https://img.shields.io/npm/v/otf-mcp-server.svg)](https://www.npmjs.com/package/otf-mcp-server)

A [Model Context Protocol](https://modelcontextprotocol.io) server that puts the
**Ownership Token Framework (OTF)** in your AI assistant. Point Claude, Cursor,
or Codex at it and ask which crypto protocols are genuinely tokenholder-owned —
answered on evidence, against a fixed rubric, straight from the OTF data.

It is a thin, read-only wrapper over the public OTF API (`/api/v1/*`, no auth,
nothing to sign up for). Every answer carries a provenance line
(`provenance.snapshot_id` + `commit_ref`) so it is reproducible and citable.

## Quick start

No clone, no build. Add it to your assistant with one command — `npx` fetches
and runs the published package for you.

**Claude (Claude Code / Desktop):**

```bash
claude mcp add otf --env OTF_API_BASE=https://otf.aragon.org -- npx -y otf-mcp-server
```

**Cursor** — add to `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project):

```json
{
  "mcpServers": {
    "otf": {
      "command": "npx",
      "args": ["-y", "otf-mcp-server"],
      "env": { "OTF_API_BASE": "https://otf.aragon.org" }
    }
  }
}
```

**Codex CLI** — add to `~/.codex/config.toml`:

```toml
[mcp_servers.otf]
command = "npx"
args = ["-y", "otf-mcp-server"]
env = { OTF_API_BASE = "https://otf.aragon.org" }
```

That's it. Restart the client and ask it something like *"Using OTF, which tokens
score highest on tokenholder ownership, and why?"* Requires Node.js ≥ 20 (for
`npx`).

## Tools

| Tool | Input | Returns |
|---|---|---|
| `list_tokens` | `network?`, `minScorePercentage?`, `criterion?`, `status?` | Slim index rows. Filters are applied over `/api/v1/tokens`. `criterion`+`status` keeps tokens whose `criteriaStatuses[criterion] === status`. |
| `get_token` | `id` (lowercase, e.g. `ldo`) | The full token report: `metrics[].criteria[]` with `status`, `notes`, `evidence[]`, plus `score` and counts. |
| `get_framework` | — | The rubric: metric/criterion `name` + `about` definitions. |
| `search_tokens` | `query` | Case-insensitive match over token `name`/`symbol`/`id`. |
| `get_faq` | — | Methodology / framework Q&A. |

`status` is one of the OTF status vocabulary: `positive`, `warning`, `at_risk`,
`unevaluated`, `reference`. Asking for a token id that does not exist returns a
clean tool error, not a crash.

## Configuration

| Env var | Required | Notes |
|---|---|---|
| `OTF_API_BASE` | **yes** | Origin of the OTF API. Use `https://otf.aragon.org` for the live public data. There is no default on purpose — the server refuses to start without it, so it can never silently query the wrong origin. Point it at `http://localhost:3000` only if you are running the OTF app locally. |

The server speaks MCP over **stdio** — it is launched by your MCP client, not run
by hand. stdout is reserved for the protocol; all logs go to stderr.

## Run from source (contributors)

You only need this if you are hacking on the server itself — end users should use
the `npx` quick start above.

```bash
cd mcp
npm install        # standalone; creates its own package-lock.json
npm run build      # compiles src/ -> dist/
npm start          # runs dist/index.js over stdio
```

Type-check only: `npm run typecheck`. Tests: `npm test`.

Point a client at your local build with the absolute path to `dist/index.js`:

```bash
claude mcp add otf --env OTF_API_BASE=http://localhost:3000 -- node /ABSOLUTE/PATH/TO/ownership-token-framework/mcp/dist/index.js
```

Or install it on your `PATH` (`cd mcp && npm run build && npm install -g .`) and
launch it by bare name `otf-mcp-server`.

Cutting a release / the one-time npm setup: see [PUBLISHING.md](./PUBLISHING.md).

## Security & threat model

A read-only MCP over a public API still has a real attack surface; the hardening
here is deliberate.

- **Bounded blast radius.** Read-only — no tool writes, deletes, or mutates
  anything, and the server holds no credentials or auth tokens (the OTF API is
  public). The worst case through it is reading already-public data.
- **Indirect prompt injection.** OTF content (criterion notes, evidence, FAQ,
  and any future third-party submissions) is relayed verbatim into the agent's
  context. Every tool result is prefixed with an explicit *untrusted-content
  boundary* telling the model the payload is DATA, not instructions — so
  imperative text inside a token's notes is reported, not executed. Evidence
  URLs are labelled third-party and are not auto-fetched.
- **Input / request safety.** Tool inputs are zod-validated; the token `id` is
  constrained to `[a-z0-9-]` and URL-encoded before it reaches a path (no
  traversal / injection). Requests are GET-only, time-bounded (15s), and reject
  oversized responses (5 MB cap).
- **SSRF.** `OTF_API_BASE` is the one trust anchor — operator-set, never derived
  from agent/tool input — and is validated to be a real http(s) origin. Keep it
  pointed at the canonical OTF API.
- **Supply chain.** Dependencies (`@modelcontextprotocol/sdk`, `zod`) are
  exact-pinned (no `^`/`latest`) to versions published 7+ days earlier, installed
  from the committed `package-lock.json` (`npm ci`), with lifecycle scripts
  disabled (`.npmrc` `ignore-scripts=true`). Releases are published from CI with
  npm **provenance**, so each tarball is cryptographically linked to this repo
  and the release workflow.

## Notes

- **Standalone package.** This directory has its own `package.json` and
  `package-lock.json` and is installed with `npm` independently of the parent
  app's pnpm workspace. The root `pnpm-workspace.yaml` declares no `packages`, so
  `mcp/` is not part of the pnpm workspace and the app build is unaffected.
