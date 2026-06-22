import { defineConfig, loadEnv } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const tokenSymbolEnv = env.VERCEL_GIT_COMMIT_REF ?? ''

  return {
    define: {
      'import.meta.env.VITE_TOKEN_SYMBOL': JSON.stringify(tokenSymbolEnv),
    },
    plugins: [
      devtools(),
      // Emit Vercel Build Output API artifacts instead of relying on Vercel
      // to adapt Nitro's generic Node server at deployment time.
      nitro({
        preset: 'vercel',
        // Baseline security response headers on every route. A strict CSP is
        // intentionally omitted for now (the inline GA bootstrap + third-party
        // scripts need a nonce strategy first); these are the safe wins.
        routeRules: {
          '/**': {
            headers: {
              'X-Content-Type-Options': 'nosniff',
              'Referrer-Policy': 'strict-origin-when-cross-origin',
              'X-Frame-Options': 'SAMEORIGIN',
              'Strict-Transport-Security':
                'max-age=63072000; includeSubDomains; preload',
              'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
            },
          },
        },
      }),
      // this is the plugin that enables path aliases
      viteTsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
    ],
  }
})

export default config
