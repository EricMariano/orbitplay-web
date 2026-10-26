import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  // Unhandled requests stay inside the test; no live backend data is used.
  await page.route(
    (url) => url.pathname.startsWith('/api/'),
    (route) => route.fulfill({ status: 404, json: {} }),
  )
})

for (const role of ['owner', 'admin', 'studio', 'player'] as const) {
  test(`restores ${role} on reload and redirects to the authorized area`, async ({ page }) => {
    let refreshes = 0
    await page.route('**/api/auth/refresh', (route) => {
      refreshes += 1
      return route.fulfill({
        json: {
          accessToken: 'test-token',
          user: {
            id: 'user',
            organizationId: 'org',
            displayName: 'Test',
            email: 'test@example.test',
            role,
          },
        },
      })
    })
    const home = role === 'player' ? '/player' : '/studio'
    await page.goto(role === 'player' ? '/studio' : '/player')
    await expect(page).toHaveURL(new RegExp(`${home}$`))
    await page.reload()
    await expect(page).toHaveURL(new RegExp(`${home}$`))
    expect(refreshes).toBe(2)
  })
}

test('returns to login if the protected request still fails after refresh', async ({ page }) => {
  let refreshes = 0
  await page.route('**/api/auth/refresh', (route) => {
    refreshes += 1
    return route.fulfill({
      json: {
        accessToken: `token-${refreshes}`,
        user: {
          id: 'player',
          organizationId: 'org',
          displayName: 'Test',
          email: 'test@example.test',
          role: 'player',
        },
      },
    })
  })
  await page.route('**/api/player/home', (route) =>
    route.fulfill({ status: 401, json: { message: 'Expired' } }),
  )
  await page.goto('/player')
  await expect(page).toHaveURL(/\/login$/)
  expect(refreshes).toBe(2)
})
