# Copilot Code Review Instructions

## OG Image Verification

When reviewing pull requests that modify `src/data/tokens.json`:

- **WARN** if new tokens are added without corresponding OG images in `public/og-images/`
- For each new token with ID `{token-id}`, verify that `public/og-images/tokens-{token-id}.png` exists
- If OG images are missing, request that the contributor either:
  - Run `pnpm og:generate-enhanced` to create them before merging
  - Or create a follow-up issue to generate the missing OG images
