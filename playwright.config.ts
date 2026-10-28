import { defineConfig, devices } from '@playwright/test'

// E2E runs against the dev server. Playwright boots it and waits for the port.
const port = Number(process.env.PLAYWRIGHT_PORT ?? 5173)
const baseURL = `http://localhost:${port}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Sem `--`: o pnpm o repassaria literal ao Vite, que ignoraria o `--port`.
    // `--strictPort` falha na hora se a porta estiver ocupada, em vez de o Vite
    // subir em outra porta e o Playwright esperar até o timeout.
    command: `pnpm dev --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
