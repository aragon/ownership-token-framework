<<<<<<< HEAD
=======
import { defineConfig, loadEnv } from 'vite'
>>>>>>> 1dd7c8a155a90ecfc8bcc8a8876433211b23293e
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import { defineConfig, loadEnv } from "vite"

const config = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const tokenSymbolEnv = env.VERCEL_GIT_COMMIT_REF ?? ''

  return {
    define: {
      'import.meta.env.VITE_TOKEN_SYMBOL': JSON.stringify(tokenSymbolEnv),
    },
    plugins: [
      devtools(),
      nitro(),
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
