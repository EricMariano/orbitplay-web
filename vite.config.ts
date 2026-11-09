import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vitest/config'

// Só dev: serve os instaladores de `release/` em /downloads/<arquivo>, para o
// menu "Baixar app" funcionar local. O .exe sai de `pnpm desktop:dist` na sua
// máquina; o .dmg (macOS) e o .AppImage (Linux) só podem ser gerados no próprio
// sistema — em geral pelo workflow `desktop-release` no GitHub Actions — e, se
// você copiar o arquivo para `release/`, ele é servido aqui também.
// Fora do `public/` de propósito: iria para o dist/ e para dentro do próprio app.
const DESKTOP_INSTALLERS = [
  { name: 'OrbitPlay-Setup.exe', match: /Setup.*\.exe$/ },
  { name: 'OrbitPlay.dmg', match: /\.dmg$/ },
  { name: 'OrbitPlay.AppImage', match: /\.AppImage$/ },
]

function serveDesktopInstallers(): Plugin {
  const releaseDir = path.resolve('release')
  return {
    name: 'serve-desktop-installers',
    configureServer(server) {
      for (const installer of DESKTOP_INSTALLERS) {
        server.middlewares.use(`/downloads/${installer.name}`, (_req, res) => {
          const found = fs.existsSync(releaseDir)
            ? fs.readdirSync(releaseDir).find((f) => installer.match.test(f))
            : undefined
          if (!found) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'text/plain; charset=utf-8')
            res.end(
              `${installer.name} não encontrado em release/. Windows: rode \`pnpm desktop:dist\`. ` +
                'macOS/Linux: gere pelo workflow "Desktop release" (GitHub Actions) ou no próprio sistema.',
            )
            return
          }
          const file = path.join(releaseDir, found)
          res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Length': fs.statSync(file).size,
            'Content-Disposition': `attachment; filename="${installer.name}"`,
          })
          fs.createReadStream(file).pipe(res)
        })
      }
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
    serveDesktopInstallers(),
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
