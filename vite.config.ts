import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vitest/config'
import { DESKTOP_INSTALLER_FILES, DESKTOP_RELEASE_URL } from './src/lib/desktop-release.ts'

// Só dev: atende /downloads/<arquivo>, para o menu "Baixar app" funcionar local
// sem gerar nada. Se houver um instalador em `release/` (ex.: o .exe de
// `pnpm desktop:dist`), serve ele — útil para testar mudanças no Electron.
// Senão, redireciona para a Release `desktop-latest`, que o workflow
// `desktop-release` atualiza a cada merge na `main`.
// Fora do `public/` de propósito: iria para o dist/ e para dentro do próprio app.
const DESKTOP_INSTALLERS = [
  { name: DESKTOP_INSTALLER_FILES.win, match: /Setup.*\.exe$/ },
  { name: DESKTOP_INSTALLER_FILES.mac, match: /\.dmg$/ },
  { name: DESKTOP_INSTALLER_FILES.linux, match: /\.AppImage$/ },
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
            res.writeHead(302, { Location: `${DESKTOP_RELEASE_URL}/${installer.name}` })
            res.end()
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

// Só no build: o dev/HMR do Vite (e o preâmbulo do React Refresh) usa script
// inline, que esta política bloquearia. Conservadora de propósito — img, media
// e connect ficam livres porque as URLs assinadas do MinIO e a origem da API só
// são conhecidas em runtime.
const CONTENT_SECURITY_POLICY = [
  "script-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

function contentSecurityPolicy(): Plugin {
  return {
    name: 'content-security-policy',
    apply: 'build',
    transformIndexHtml: () => [
      {
        tag: 'meta',
        attrs: { 'http-equiv': 'Content-Security-Policy', content: CONTENT_SECURITY_POLICY },
        // A meta só vale para o que vem depois dela: primeira coisa do <head>.
        injectTo: 'head-prepend',
      },
    ],
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
    contentSecurityPolicy(),
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
