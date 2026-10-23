import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vitest/config'

// Só dev: serve o instalador gerado por `pnpm desktop:dist` (release/) em
// /downloads/OrbitPlay-Setup.exe, para o botão "Baixar app" funcionar local.
// Fora do `public/` de propósito: iria para o dist/ e para dentro do próprio .exe.
function serveDesktopInstaller(): Plugin {
  const releaseDir = path.resolve('release')
  return {
    name: 'serve-desktop-installer',
    configureServer(server) {
      server.middlewares.use('/downloads/OrbitPlay-Setup.exe', (_req, res) => {
        const name = fs.existsSync(releaseDir)
          ? fs.readdirSync(releaseDir).find((f) => /Setup.*\.exe$/.test(f))
          : undefined
        if (!name) {
          res.statusCode = 404
          res.end('Instalador não gerado. Rode `pnpm desktop:dist`.')
          return
        }
        const file = path.join(releaseDir, name)
        res.writeHead(200, {
          'Content-Type': 'application/octet-stream',
          'Content-Length': fs.statSync(file).size,
          'Content-Disposition': 'attachment; filename="OrbitPlay-Setup.exe"',
        })
        fs.createReadStream(file).pipe(res)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // The router plugin must run before the React plugin.
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    serveDesktopInstaller(),
  ],
  resolve: {
    alias: {
      // fileURLToPath decodes %20; URL.pathname breaks when the repo sits in a path with spaces.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    // O electron-builder escreve milhares de arquivos aqui; sem ignorar, o Vite
    // recarrega a página sem parar e segura os arquivos (EPERM no Windows).
    watch: { ignored: ['**/release/**', '**/dist-electron/**'] },
    proxy: {
      // Same-origin proxy so the session cookie works and we avoid CORS in dev.
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Playwright specs live in e2e/ and are run by their own runner.
    exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**'],
  },
})
