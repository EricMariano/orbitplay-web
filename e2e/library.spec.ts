import { expect, test, type Page } from '@playwright/test'

const gameId = '01920000-0000-7000-8000-0000000000d1'
const otherId = '01920000-0000-7000-8000-0000000000d2'
const game = (id: string, title: string) => ({
  id,
  title,
  organizationId: 'org',
  slug: title,
  description: null,
  genre: 'Corrida',
  platform: 'PC',
  status: 'active',
  coverUrl: null,
  bannerUrl: null,
  metrics: {
    testsTotal: 2,
    testsActive: 1,
    sessionsValid: 0,
    playersTotal: 0,
    averageRating: null,
  },
  createdAt: '2026-10-01T00:00:00Z',
  updatedAt: '2026-10-01T00:00:00Z',
})

async function session(page: Page, role: 'player' | 'owner') {
  await page.route('**/api/auth/refresh', (route) =>
    route.fulfill({
      json: {
        accessToken: 'test-token',
        user: {
          id: 'user',
          displayName: 'Pessoa Teste',
          email: 'test@example.com',
          role,
          organizationId: 'org',
        },
      },
    }),
  )
}

test('player library uses participations and the catalog preserves its feed seed', async ({
  page,
}) => {
  await session(page, 'player')
  await page.route('**/api/player/participations?*', (route) =>
    route.fulfill({
      json: {
        data: [{ gameId }, { gameId }],
        nextCursor: null,
      },
    }),
  )
  await page.route(`**/api/player/games/${gameId}`, (route) =>
    route.fulfill({ json: { game: game(gameId, 'Meu jogo') } }),
  )
  let secondPageSeed: string | null = null
  await page.route('**/api/player/feed?*', (route) => {
    const params = new URL(route.request().url()).searchParams
    if (params.has('cursor')) secondPageSeed = params.get('seed')
    return route.fulfill({
      json: {
        data: [params.has('cursor') ? game(otherId, 'Outro jogo') : game(gameId, 'Meu jogo')],
        nextCursor: params.has('cursor') ? null : 'page-2',
        seed: 'frozen-seed',
      },
    })
  })
  await page.goto('/player/games')
  await expect(page.getByRole('heading', { name: 'Jogos', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Meu jogo' })).toHaveCount(1)
  await expect(page.getByRole('link', { name: 'Ver detalhes' })).toHaveAttribute(
    'href',
    `/player/games/${gameId}`,
  )
  await page.getByRole('tab', { name: 'Explorar jogos' }).click()
  await expect(page.getByRole('heading', { name: 'Outro jogo' })).toBeVisible()
  expect(secondPageSeed).toBe('frozen-seed')
})

test('owner can switch library views and retains game creation and chat', async ({ page }) => {
  await session(page, 'owner')
  await page.route('**/api/games?*', (route) => {
    const next = new URL(route.request().url()).searchParams.has('cursor')
    return route.fulfill({
      json: {
        data: [next ? game(otherId, 'Jogo dois') : game(gameId, 'Jogo um')],
        nextCursor: next ? null : 'page-2',
      },
    })
  })
  await page.goto('/studio/games')
  await expect(page.getByText('Jogo dois', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Configurar!' })).toHaveCount(2)
  await expect(page.getByRole('link', { name: 'Gerenciar chat' })).toHaveCount(2)
  await page.getByRole('button', { name: 'Tabela', exact: true }).click()
  await expect(page.getByRole('table')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Novo teste' })).toHaveCount(2)
  await page.getByRole('link', { name: 'Novo jogo', exact: true }).click()
  await expect(page).toHaveURL(/\/studio\/games\/new$/)
  await expect(page.getByRole('heading', { name: 'Informações gerais' })).toBeVisible()
  await expect(page.getByLabel('Nome do jogo')).toBeVisible()
})

test('library routes require a session', async ({ page }) => {
  await page.route('**/api/auth/refresh', (route) => route.fulfill({ status: 401, json: {} }))
  await page.goto('/player/games')
  await expect(page).toHaveURL(/\/login$/)
  await page.goto('/studio/games')
  await expect(page).toHaveURL(/\/login$/)
})
