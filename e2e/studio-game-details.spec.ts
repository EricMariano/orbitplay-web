import { expect, test, type Page } from '@playwright/test'

const gameId = '01920000-0000-7000-8000-0000000000d1'
const testId = '01920000-0000-7000-8000-0000000000a1'
const path = `/studio/games/${gameId}`
const game = {
  id: gameId,
  title: 'Jogo de corrida',
  organizationId: 'org',
  slug: 'jogo-de-corrida',
  description: 'Uma nova pista para explorar.',
  genre: 'Corrida',
  platform: 'Windows',
  status: 'active',
  bannerUrl: null,
  coverUrl: null,
  metrics: {
    testsTotal: 3,
    testsActive: 2,
    sessionsValid: 32,
    playersTotal: 45,
    averageRating: 4.5,
  },
  createdAt: '2026-10-01T00:00:00Z',
  updatedAt: '2026-10-01T00:00:00Z',
}

function gameTest(id: string, title: string, status = 'published') {
  return {
    id,
    gameId,
    title,
    status,
    testModelKey: 'free_exploration',
    publishedAt: status === 'draft' ? null : '2026-10-01T00:00:00Z',
    expiresAt: '2026-12-01T00:00:00Z',
    rewardCents: 250,
    build: { validationSteps: [{ key: 'plugin_manifest', status: 'unavailable' }] },
  }
}

async function session(page: Page, role: 'owner' | 'player' = 'owner') {
  await page.route('**/api/auth/refresh', (route) =>
    route.fulfill({
      json: {
        accessToken: 'test-token',
        user: {
          id: 'user',
          displayName: 'Estúdio Teste',
          email: 'test@example.com',
          role,
          organizationId: 'org',
        },
      },
    }),
  )
}

async function gameApi(page: Page, canEdit = true) {
  await session(page)
  await page.route(`**/api/games/${gameId}/summary`, (route) =>
    route.fulfill({
      json: { game, availability: 'available', metrics: game.metrics, canEdit },
    }),
  )
  await page.route('**/api/test-models', (route) =>
    route.fulfill({
      json: {
        data: [
          {
            key: 'free_exploration',
            name: 'Exploração livre',
            description: 'Explore o jogo e compartilhe sua experiência.',
            deliverables: ['Avaliação dos jogadores'],
            technicalRequirements: [],
            requiresTelemetry: false,
            requiresBuild: true,
            available: true,
            unavailableReason: null,
          },
        ],
      },
    }),
  )
  await page.route(`**/api/games/${gameId}/tests?*`, (route) => {
    const params = new URL(route.request().url()).searchParams
    const all = params.get('tab') === 'all'
    const next = params.get('cursor') === 'next'
    return route.fulfill({
      json: {
        data: [
          next
            ? gameTest('second-test', 'Segunda pista', 'draft')
            : all
              ? gameTest('finished-test', 'Teste encerrado', 'finished')
              : gameTest(testId, 'Primeira pista'),
        ],
        nextCursor: !all && !next ? 'next' : null,
      },
    })
  })
}

test('Configurar opens game details and test tabs preserve backend pagination', async ({
  page,
}) => {
  await gameApi(page)
  await page.route('**/api/games?*', (route) =>
    route.fulfill({ json: { data: [game], nextCursor: null } }),
  )
  await page.goto('/studio/games')
  await page.getByRole('link', { name: 'Configurar!', exact: true }).click()
  await expect(page).toHaveURL(new RegExp(`${path}(?:[?]tab=active)?$`))
  await expect(page.getByRole('heading', { name: game.title })).toBeVisible()
  await expect(page.getByText('45', { exact: true })).toBeVisible()
  await expect(page.getByText('Primeira pista', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Novo teste', exact: true })).toHaveAttribute(
    'href',
    `${path}/tests/new`,
  )
  await expect(page.getByRole('link', { name: 'Relatório', exact: true })).toHaveAttribute(
    'href',
    `${path}/tests/${testId}`,
  )
  await page.getByRole('button', { name: 'Carregar mais testes' }).click()
  await expect(page.getByText('Segunda pista', { exact: true })).toBeVisible()
  await expect(page.getByRole('row')).toHaveCount(3)
  await page.getByRole('tab', { name: 'Todos os testes', exact: true }).click()
  await expect(page).toHaveURL(/tab=all$/)
  await expect(page.getByText('Teste encerrado', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Relatório final' })).toBeVisible()
  await expect(page.getByText('Primeira pista', { exact: true })).toHaveCount(0)
  await page.reload()
  await expect(page.getByRole('tab', { name: 'Todos os testes' })).toHaveAttribute(
    'data-state',
    'active',
  )
  await expect(page.getByText('Teste encerrado', { exact: true })).toBeVisible()
})

test('secondary tabs use shared game endpoints without player credentials', async ({ page }) => {
  await gameApi(page)
  const playerRequests: string[] = []
  page.on('request', (request) => {
    if (request.url().includes('/api/player/')) playerRequests.push(request.url())
  })
  await page.route(`**/api/games/${gameId}/reviews?*`, (route) =>
    route.fulfill({
      json: {
        data: [{ id: 'review', authorDisplayName: 'Ana', rating: 5, body: 'Ótima direção!' }],
        nextCursor: null,
        averageRating: 5,
      },
    }),
  )
  await page.route(`**/api/games/${gameId}/community/posts?*`, (route) =>
    route.fulfill({
      json: {
        data: [{ id: 'post', authorDisplayName: 'Carlos', body: 'Gostei da nova pista.' }],
        nextCursor: null,
      },
    }),
  )
  await page.route(`**/api/games/${gameId}/specs`, (route) =>
    route.fulfill({
      json: {
        minimumRequirements: { RAM: '8 GB' },
        recommendedRequirements: { RAM: '16 GB' },
        supportedPlatforms: ['windows'],
        languages: ['Português'],
      },
    }),
  )
  await page.goto(`${path}?tab=reviews`)
  await expect(page.getByText('Ótima direção!')).toBeVisible()
  await page.getByRole('tab', { name: 'Comunidade', exact: true }).click()
  await expect(page.getByText('Gostei da nova pista.')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Gerenciar chat' })).toHaveAttribute(
    'href',
    `${path}/chat`,
  )
  await page.getByRole('tab', { name: 'Especificações' }).click()
  await expect(page.getByText('8 GB', { exact: true })).toBeVisible()
  await expect(page.getByText('16 GB', { exact: true })).toBeVisible()
  await page.getByRole('tab', { name: 'Conquistas' }).click()
  await expect(page.getByRole('heading', { name: 'Conquistas do jogo em breve' })).toBeVisible()
  expect(playerRequests).toEqual([])
})

test('summary permission and missing media keep the read-only page usable', async ({ page }) => {
  await gameApi(page, false)
  await page.goto(path)
  await expect(page.getByRole('heading', { name: game.title })).toBeVisible()
  await expect(page.getByText('Banner do jogo', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Novo teste', exact: true })).toHaveCount(0)
  await expect(page.getByRole('tab')).toHaveCount(6)
})

test('a draft game can be activated from the header so it reaches the player feed', async ({
  page,
}) => {
  await gameApi(page)
  let status = 'draft'
  let patchBody: unknown = null
  await page.route(`**/api/games/${gameId}/summary`, (route) =>
    route.fulfill({
      json: {
        game: { ...game, status },
        availability: 'available',
        metrics: game.metrics,
        canEdit: true,
      },
    }),
  )
  await page.route(`**/api/games/${gameId}`, (route) => {
    if (route.request().method() !== 'PATCH') return route.fallback()
    patchBody = route.request().postDataJSON()
    status = 'active'
    return route.fulfill({ json: { ...game, status } })
  })
  await page.goto(path)
  const header = page.getByRole('region', { name: game.title })
  await expect(header.getByText('Rascunho', { exact: true })).toBeVisible()
  await header.getByRole('button', { name: 'Ativar jogo' }).click()
  await expect(header.getByText('Ativo', { exact: true })).toBeVisible()
  await expect(header.getByRole('button', { name: 'Ativar jogo' })).toHaveCount(0)
  expect(patchBody).toEqual({ status: 'active' })
})

test('a read-only draft game does not offer activation', async ({ page }) => {
  await gameApi(page, false)
  await page.route(`**/api/games/${gameId}/summary`, (route) =>
    route.fulfill({
      json: {
        game: { ...game, status: 'draft' },
        availability: 'available',
        metrics: game.metrics,
        canEdit: false,
      },
    }),
  )
  await page.goto(path)
  await expect(page.getByRole('heading', { name: game.title })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Ativar jogo' })).toHaveCount(0)
})

test('banner, mobile layout and new-test navigation remain usable', async ({ page }) => {
  await gameApi(page)
  const gameWithBanner = {
    ...game,
    bannerUrl: '/src/assets/game-details/horizon-chase-2-banner.jpg',
  }
  await page.route(`**/api/games/${gameId}/summary`, (route) =>
    route.fulfill({
      json: {
        game: gameWithBanner,
        availability: 'available',
        metrics: game.metrics,
        canEdit: true,
      },
    }),
  )
  await page.route(`**/api/games/${gameId}`, (route) => route.fulfill({ json: game }))
  await page.goto(path)
  const banner = page.getByRole('img', { name: `Banner de ${game.title}` })
  await expect(banner).toBeVisible()
  await expect
    .poll(() => banner.evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBeGreaterThan(0)
  await expect(page.getByText('Primeira pista', { exact: true })).toBeVisible()
  await page.screenshot({ path: 'test-results/studio-game-details.png', fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.getByRole('heading', { name: game.title })).toBeVisible()
  await page.screenshot({ path: 'test-results/studio-game-details-mobile.png', fullPage: true })
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
    .toBeLessThanOrEqual(390)
  await page.getByRole('link', { name: 'Novo teste', exact: true }).click()
  await expect(page).toHaveURL(new RegExp(`${path}/tests/new$`))
  await expect(page.getByRole('heading', { name: 'Novo teste', exact: true })).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Configuração de testes', exact: true }),
  ).toHaveCount(0)
})

test('unauthorized summary blocks all game content and can be retried', async ({ page }) => {
  await gameApi(page)
  let denied = true
  const tabRequests: string[] = []
  page.on('request', (request) => {
    if (/\/tests\?|\/reviews\?|\/specs/.test(request.url())) tabRequests.push(request.url())
  })
  await page.route(`**/api/games/${gameId}/summary`, (route) =>
    route.fulfill(
      denied
        ? { status: 404, json: { code: 'NOT_FOUND', message: 'Jogo não encontrado' } }
        : { json: { game, availability: 'available', metrics: game.metrics, canEdit: true } },
    ),
  )
  await page.goto(path)
  await expect(page.getByText('Jogo não encontrado', { exact: true })).toBeVisible()
  await expect(page.getByRole('tab')).toHaveCount(0)
  expect(tabRequests).toEqual([])
  denied = false
  await page.getByRole('button', { name: 'Tentar novamente' }).click()
  await expect(page.getByRole('heading', { name: game.title })).toBeVisible()
})

test('empty active tests and invalid tabs render a recoverable default', async ({ page }) => {
  await gameApi(page)
  await page.route(`**/api/games/${gameId}/tests?*`, (route) =>
    route.fulfill({ json: { data: [], nextCursor: null } }),
  )
  await page.goto(`${path}?tab=invalid`)
  await expect(page.getByRole('tab', { name: 'Testes ativos', exact: true })).toHaveAttribute(
    'data-state',
    'active',
  )
  await expect(page.getByRole('heading', { name: 'Nenhum teste ativo' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Novo teste', exact: true })).toBeVisible()
})

test('game details keep the studio role guard', async ({ page }) => {
  await page.route('**/api/auth/refresh', (route) => route.fulfill({ status: 401, json: {} }))
  await page.goto(path)
  await expect(page).toHaveURL(/\/login$/)
  await session(page, 'player')
  await page.goto(path)
  await expect(page).toHaveURL(/\/player\/?$/)
  await expect(page.getByRole('heading', { name: 'Configuração de testes' })).toHaveCount(0)
})
