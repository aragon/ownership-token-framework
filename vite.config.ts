import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import { defineConfig, loadEnv } from "vite"

const config = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const tokenSymbolEnv =
    env.VITE_TOKEN_SYMBOL ?? env.VERCEL_GIT_COMMIT_REF ?? ""

  return {
    define: {
      "import.meta.env.VITE_TOKEN_SYMBOL": JSON.stringify(tokenSymbolEnv),
    },
    plugins: [
      devtools(),
      nitro(),
      viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
    ],
  }
})

console.log("VITE_TOKEN_SYMBOL:", process.env.VITE_TOKEN_SYMBOL)
console.log("VERCEL_GIT_COMMIT_REF:", process.env.VERCEL_GIT_COMMIT_REF)

export default config
