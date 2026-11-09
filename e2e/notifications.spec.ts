import { expect, test } from '@playwright/test'

function notification(id: string, title: string, link: string | null) {
  return {
    id,
    type: 'system',
    title,
    body: null,
    link,
    read: true,
    createdAt: '2026-10-19T14:00:00.000Z',
  }
}

test('notifications only become links for internal paths or http(s) URLs', async ({ page }) => {
  // Tudo que não for mockado abaixo responde 404, sem depender de API real.
  await page.route(
    (url) => url.pathname.startsWith('/api/'),
    (route) => route.fulfill({ status: 404, json: {} }),
  )
  await page.route('**/api/auth/refresh', (route) =>
    route.fulfill({
      json: {
        accessToken: 'test-token',
        user: {
          id: 'player',
          displayName: 'Aline Player',
          email: 'aline@example.com',
          role: 'player',
          organizationId: 'org',
        },
      },
    }),
  )
  await page.route(
    (url) => url.pathname === '/api/notifications',
    (route) =>
      route.fulfill({
        json: {
          data: [
            notification('internal', 'Resultado disponível', '/player/library'),
            notification('external', 'Novidades', 'https://orbitplay.example/novidades'),
            notification('script', 'Script', 'javascript:alert(document.domain)'),
            notification('data', 'Data', 'data:text/html,<h1>phishing</h1>'),
            notification('other-host', 'Outro domínio', '//evil.example/login'),
          ],
          nextCursor: null,
          unreadCount: 0,
        },
      }),
  )

  await page.goto('/player')
  await page.getByRole('button', { name: 'Notificações' }).click()

  await expect(page.getByRole('menuitem', { name: /Resultado disponível/ })).toHaveAttribute(
    'href',
    '/player/library',
  )
  await expect(page.getByRole('menuitem', { name: /Novidades/ })).toHaveAttribute(
    'href',
    'https://orbitplay.example/novidades',
  )
  for (const title of ['Script', 'Data', 'Outro domínio']) {
    const item = page.getByRole('menuitem', { name: new RegExp(title) })
    await expect(item).toBeVisible()
    await expect(item).not.toHaveAttribute('href')
  }
})
