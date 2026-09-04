import { expect, test } from '@playwright/test'

// This step's E2E covers only acceptance items 1–3 (pure client logic). Items
// that need the real API (real login, live data, token refresh) are pending in
// DECISIONS.md and are not exercised here.

test('unauthenticated root redirects to /login', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeVisible()
})

test('protected areas redirect to /login without a session', async ({ page }) => {
  await page.goto('/studio')
  await expect(page).toHaveURL(/\/login$/)

  await page.goto('/player')
  await expect(page).toHaveURL(/\/login$/)
})

test('role guard routes to the correct area and blocks the other, then logs out', async ({
  page,
}) => {
  await page.goto('/login')

  // Seed a studio session via the dev-only shortcut (no API in this phase).
  await page.getByTestId('dev-login-studio').click()
  await expect(page).toHaveURL(/\/studio$/)
  await expect(page.getByRole('heading', { name: /Bem-vindo/ })).toBeVisible()

  // A studio user must not reach the player area — the guard bounces it back to
  // /studio. Navigate client-side (not page.goto, which would reload and drop
  // the in-memory session) so we exercise the live role guard.
  await page.evaluate(() => {
    const w = window as unknown as {
      __router: { navigate: (opts: { to: string }) => Promise<void> }
    }
    return w.__router.navigate({ to: '/player' })
  })
  await expect(page).toHaveURL(/\/studio$/)

  // Logout returns to /login.
  await page.getByRole('button', { name: 'Sair' }).click()
  await expect(page).toHaveURL(/\/login$/)
})
