import { expect, test, type Page } from '@playwright/test'
import type { StudioBenchmark } from '../src/api-types'

const gameId = '01920000-0000-7000-8000-0000000000d1'
const otherId = '01920000-0000-7000-8000-0000000000d2'
const testId = '01920000-0000-7000-8000-0000000000a1'
const secondTestId = '01920000-0000-7000-8000-0000000000a2'
const game = (id: string, title: string) => ({
  id,
  title,
  organizationId: 'org',
  slug: title,
  description: null,
  genre: 'Corrida',
  platform: 'Windows',
  status: 'active',
  bannerUrl: null,
  coverUrl: '/src/assets/game-details/horizon-chase-2-banner.jpg',
  metrics: { testsTotal: 3, testsActive: 1, sessionsValid: 4, playersTotal: 8, averageRating: 4.5 },
  createdAt: '2026-10-01T00:00:00Z',
  updatedAt: '2026-10-01T00:00:00Z',
})
const firstGame = game(gameId, 'Racha de Rua')
const model = {
  key: 'free_exploration',
  name: 'Exploração livre',
  description: 'Explore o jogo.',
  deliverables: [],
  technicalRequirements: [],
  requiresTelemetry: false,
  requiresBuild: true,
  available: true,
  unavailableReason: null,
}
const gameTest = (id: string, title: string, status = 'published') => ({
  id,
  gameId,
  title,
  status,
  testModelKey: 'free_exploration',
  publishedAt: '2026-10-01T00:00:00Z',
  expiresAt: '2026-12-01T00:00:00Z',
  build: {
    validationSteps: [{ key: 'plugin_manifest', status: id === testId ? 'ready' : 'unavailable' }],
  },
})
const kpi = (value: number | null) => ({ value, delta: null, unit: null })
const dashboard = () => ({
  kpis: {
    gamesTotal: kpi(28),
    testsTotal: kpi(56),
    testsActive: kpi(12),
    sessionsValid: kpi(120),
    playersTotal: kpi(320),
    averageRating: kpi(4.5),
    completionRate: kpi(0.75),
  },
  games: [firstGame, game(otherId, 'Azura')],
  recentTests: [
    gameTest(testId, 'Primeira pista'),
    gameTest(secondTestId, 'Teste finalizado', 'finished'),
  ],
  stats: {
    key: 'sessions_evolution',
    status: 'ready',
    payload: {
      points: [
        { date: '2026-10-01', sessions: 3 },
        { date: '2026-10-04', sessions: 8 },
        { date: '2026-10-08', sessions: 5 },
        { date: '2026-10-12', sessions: 14 },
      ],
    },
    computedAt: '2026-10-19T12:00:00Z',
  },
})

const benchmark = (): StudioBenchmark => ({
  key: 'benchmark',
  status: 'ready',
  payload: {
    scope: 'organization',
    period: 'all_time',
    metric: 'completed_sessions_per_participation',
    data: [
      {
        gameId,
        title: 'Racha de Rua',
        participationsTotal: 8,
        sessionsCompleted: 6,
        playersTotal: 5,
        averageRating: 4.5,
        completionRate: 0.75,
      },
      {
        gameId: otherId,
        title: 'Azura',
        participationsTotal: 0,
        sessionsCompleted: 0,
        playersTotal: 0,
        averageRating: null,
        completionRate: null,
      },
    ],
    nextCursor: null,
  },
  computedAt: '2026-10-19T12:00:00Z',
})

async function setup(page: Page) {
  await page.route('**/api/auth/refresh', (route) =>
    route.fulfill({
      json: {
        accessToken: 'test-token',
        user: {
          id: 'user',
          displayName: 'Blackstar Games',
          email: 'test@example.com',
          role: 'owner',
          organizationId: 'org',
        },
      },
    }),
  )
  await page.route('**/api/studio/dashboard', (route) => route.fulfill({ json: dashboard() }))
  await page.route('**/api/studio/benchmark?*', (route) => route.fulfill({ json: benchmark() }))
  await page.route('**/api/test-models', (route) => route.fulfill({ json: { data: [model] } }))
  await page.route('**/api/tests/*/report', (route) =>
    route.fulfill({
      json: {
        blocks: [
          {
            key: 'telemetry',
            status: route.request().url().includes(testId) ? 'ready' : 'unavailable',
            payload: route.request().url().includes(testId)
              ? { sessionsAnalyzed: 9, activeTriggers: 3, discoveries: null, aiSuggestions: null }
              : null,
            computedAt: null,
          },
        ],
      },
    }),
  )
}

test('Home renders backend KPIs, registered games, chart and actionable recent tests', async ({
  page,
}) => {
  await setup(page)
  const gameListRequests: string[] = []
  page.on('request', (request) => {
    if (/\/api\/games\?/.test(request.url())) gameListRequests.push(request.url())
  })
  await page.goto('/studio')
  await expect(page.getByRole('heading', { name: 'Bem-vindo Blackstar Games' })).toBeVisible()
  const kpis = page.locator('dl[aria-label="Indicadores do estúdio"]')
  await expect(kpis.getByText('28', { exact: true })).toBeVisible()
  await expect(kpis.getByText('75%', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Configurar!', exact: true })).toHaveCount(2)
  await expect(page.getByRole('img', { name: 'Gráfico de sessões válidas por dia' })).toBeVisible()
  const recent = page.getByRole('table', { name: 'Testes recentes do estúdio' })
  await expect(recent.getByText('Exploração livre', { exact: true })).toHaveCount(2)
  await expect(recent.getByRole('link', { name: 'Relatório', exact: true })).toHaveAttribute(
    'href',
    `/studio/games/${gameId}/tests/${testId}`,
  )
  await expect(recent.getByRole('link', { name: 'Relatório final', exact: true })).toHaveAttribute(
    'href',
    `/studio/games/${gameId}/tests/${secondTestId}`,
  )
  await expect(recent.getByText('Sim', { exact: true })).toBeVisible()
  const comparison = page.getByRole('region', { name: 'Comparativo dos seus jogos', exact: true })
  await expect(comparison.getByText('75%', { exact: true })).toBeVisible()
  await expect(comparison.getByText('6 sessões concluídas / 8 participações')).toBeVisible()
  await expect(comparison.getByText('5 jogadores únicos · Nota 4,5 / 5')).toBeVisible()
  await expect(comparison.getByText('Sem participações', { exact: true })).toBeVisible()
  await expect(comparison.getByRole('link', { name: 'Racha de Rua' })).toHaveAttribute(
    'href',
    `/studio/games/${gameId}`,
  )
  expect(gameListRequests).toEqual([])
  await expect(page.getByText('Aguardando dados do backend')).toHaveCount(0)
})

test('telemetry selector changes the test report without inventing organization totals', async ({
  page,
}) => {
  await setup(page)
  await page.goto('/studio')
  const telemetry = page.getByRole('region', { name: 'Telemetria / Orbit Plug-in', exact: true })
  await expect(telemetry.getByText('9', { exact: true })).toBeVisible()
  await expect(telemetry.getByText('Descobertas de IA', { exact: true })).toBeVisible()
  await expect(telemetry.getByText('—', { exact: true })).toBeVisible()
  await telemetry.getByRole('combobox', { name: 'Teste de telemetria' }).click()
  await page.getByRole('option', { name: 'Teste finalizado', exact: true }).click()
  await expect(telemetry.getByRole('heading', { name: 'Sem telemetria neste teste' })).toBeVisible()
  await expect(telemetry.getByRole('link', { name: 'Abrir telemetria do teste' })).toHaveAttribute(
    'href',
    `/studio/games/${gameId}/tests/${secondTestId}?tab=plugin`,
  )
  await expect(page.getByRole('table', { name: 'Testes recentes do estúdio' })).toBeVisible()
})

test('empty studio keeps zero distinct from unavailable and offers its first actions', async ({
  page,
}) => {
  await setup(page)
  const data = {
    ...dashboard(),
    kpis: {
      gamesTotal: kpi(0),
      testsTotal: kpi(0),
      testsActive: kpi(0),
      sessionsValid: kpi(0),
      playersTotal: kpi(0),
      averageRating: kpi(null),
      completionRate: kpi(null),
    },
    games: [],
    recentTests: [],
    stats: {
      key: 'sessions_evolution',
      status: 'ready',
      payload: { points: [] },
      computedAt: null,
    },
  }
  const reportRequests: string[] = []
  page.on('request', (request) => {
    if (/\/api\/tests\/.+\/report/.test(request.url())) reportRequests.push(request.url())
  })
  await page.route('**/api/studio/dashboard', (route) => route.fulfill({ json: data }))
  await page.route('**/api/studio/benchmark?*', (route) => {
    const empty = benchmark()
    empty.payload!.data = []
    return route.fulfill({ json: empty })
  })
  await page.goto('/studio')
  const kpis = page.locator('dl[aria-label="Indicadores do estúdio"]')
  await expect(kpis.getByText('0', { exact: true })).toHaveCount(5)
  await expect(kpis.getByText('—', { exact: true })).toHaveCount(2)
  await expect(page.getByRole('link', { name: 'Adicionar jogo', exact: true })).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Nenhuma sessão válida no período' }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Publique um teste para acompanhar a telemetria' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Nenhum teste criado' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Nenhum jogo para comparar' })).toBeVisible()
  await expect(page.getByRole('meter')).toHaveCount(0)
  expect(reportRequests).toEqual([])
})

test('a failed statistics block does not hide games, comparison or recent tests', async ({
  page,
}) => {
  await setup(page)
  await page.route('**/api/studio/dashboard', (route) =>
    route.fulfill({
      json: {
        ...dashboard(),
        stats: { key: 'sessions_evolution', status: 'failed', payload: null, computedAt: null },
      },
    }),
  )
  await page.goto('/studio')
  await expect(page.getByRole('heading', { name: 'Não foi possível calcular' })).toBeVisible()
  await expect(
    page.getByRole('region', { name: 'Comparativo dos seus jogos' }).getByText('75%'),
  ).toBeVisible()
  await expect(page.getByRole('link', { name: 'Configurar!', exact: true })).toHaveCount(2)
  await expect(page.getByRole('table', { name: 'Testes recentes do estúdio' })).toBeVisible()
})

test('Home request failures show one recoverable error', async ({ page }) => {
  await setup(page)
  let denied = true
  await page.route('**/api/studio/dashboard', (route) =>
    route.fulfill(
      denied
        ? { status: 403, json: { message: 'Acesso temporariamente indisponível' } }
        : { json: dashboard() },
    ),
  )
  await page.goto('/studio')
  await expect(page.getByRole('alert')).toHaveCount(1)
  await expect(page.getByText('Acesso temporariamente indisponível')).toBeVisible()
  denied = false
  await page.getByRole('button', { name: 'Tentar novamente' }).click()
  await expect(page.getByRole('heading', { name: 'Seus jogos', exact: true })).toBeVisible()
})

test('comparison loads cursor pages and distinguishes zero completion from no participation', async ({
  page,
}) => {
  await setup(page)
  const cursors: Array<string | null> = []
  await page.route('**/api/studio/benchmark?*', (route) => {
    const params = new URL(route.request().url()).searchParams
    expect(params.get('limit')).toBe('5')
    cursors.push(params.get('cursor'))
    const data = benchmark()
    if (params.get('cursor')) {
      data.payload!.data = [
        { ...data.payload!.data[1], participationsTotal: 2, playersTotal: 2, completionRate: 0 },
      ]
    } else {
      data.payload!.data = [data.payload!.data[0]]
      data.payload!.nextCursor = 'next-page'
    }
    return route.fulfill({ json: data })
  })
  await page.goto('/studio')
  const comparison = page.getByRole('region', { name: 'Comparativo dos seus jogos' })
  await expect(comparison.getByText('75%', { exact: true })).toBeVisible()
  await comparison.getByRole('button', { name: 'Carregar mais jogos' }).click()
  await expect(comparison.getByRole('link')).toHaveCount(2)
  await expect(comparison.getByText('0%', { exact: true })).toBeVisible()
  await expect(comparison.getByText('0 sessões concluídas / 2 participações')).toBeVisible()
  await expect(comparison.getByText('Sem participações', { exact: true })).toHaveCount(0)
  await expect(comparison.getByRole('button', { name: 'Carregar mais jogos' })).toHaveCount(0)
  expect(cursors[0]).toBeNull()
  expect(cursors.at(-1)).toBe('next-page')
  expect(cursors.filter((cursor) => cursor === 'next-page')).toHaveLength(1)
})

test('comparison calculation failure is isolated and can be retried', async ({ page }) => {
  await setup(page)
  let failed = true
  await page.route('**/api/studio/benchmark?*', (route) =>
    route.fulfill({
      json: failed
        ? { key: 'benchmark', status: 'failed', payload: null, computedAt: null }
        : benchmark(),
    }),
  )
  await page.goto('/studio')
  const comparison = page.getByRole('region', { name: 'Comparativo dos seus jogos' })
  await expect(comparison.getByRole('heading', { name: 'Não foi possível calcular' })).toBeVisible()
  await expect(page.getByRole('table', { name: 'Testes recentes do estúdio' })).toBeVisible()
  failed = false
  await comparison.getByRole('button', { name: 'Tentar novamente' }).click()
  await expect(comparison.getByText('75%', { exact: true })).toBeVisible()
})

test('manual refresh reloads backend totals', async ({ page }) => {
  await setup(page)
  let calls = 0
  let gamesTotal = 28
  await page.route('**/api/studio/dashboard', (route) => {
    calls++
    return route.fulfill({
      json: {
        ...dashboard(),
        kpis: { ...dashboard().kpis, gamesTotal: kpi(gamesTotal) },
      },
    })
  })
  await page.goto('/studio')
  await expect(
    page.locator('dl[aria-label="Indicadores do estúdio"]').getByText('28', { exact: true }),
  ).toBeVisible()
  const readsBeforeRefresh = calls
  gamesTotal = 29
  await page.getByRole('button', { name: 'Atualizar Home', exact: true }).click()
  await expect(
    page.locator('dl[aria-label="Indicadores do estúdio"]').getByText('29', { exact: true }),
  ).toBeVisible()
  expect(calls).toBeGreaterThan(readsBeforeRefresh)
})

test('creating a game invalidates the inactive Home cache', async ({ page }) => {
  await setup(page)
  let created = false
  let dashboardReads = 0
  let benchmarkReads = 0
  const newGame = game(otherId, 'Jogo recém-criado')
  await page.route('**/api/studio/benchmark?*', (route) => {
    benchmarkReads++
    const data = benchmark()
    data.payload!.data = created
      ? [{ ...data.payload!.data[1], title: newGame.title }]
      : [data.payload!.data[0]]
    return route.fulfill({ json: data })
  })
  await page.route('**/api/studio/dashboard', (route) => {
    dashboardReads++
    return route.fulfill({
      json: { ...dashboard(), games: created ? [newGame, firstGame] : [firstGame] },
    })
  })
  await page.route('**/api/games?*', (route) =>
    route.fulfill({ json: { data: [firstGame], nextCursor: null } }),
  )
  await page.route('**/api/games', (route) => {
    created = true
    return route.fulfill({ status: 201, json: newGame })
  })
  await page.route('**/api/games/*/access', (route) => route.fulfill({ json: { data: [] } }))
  await page.goto('/studio')
  await expect(page.getByRole('link', { name: 'Configurar!', exact: true })).toHaveCount(1)
  const initialDashboardReads = dashboardReads
  const initialBenchmarkReads = benchmarkReads
  await page.getByRole('link', { name: 'Ir para meus jogos' }).click()
  await page.getByRole('link', { name: 'Novo jogo', exact: true }).click()
  await page.getByLabel('Nome do jogo').fill('Jogo recém-criado')
  await page.getByRole('button', { name: 'Adicionar Action', exact: true }).click()
  await page.getByRole('button', { name: 'Salvar', exact: true }).click()
  await expect(page).toHaveURL(new RegExp(`/studio/games/${otherId}`))
  await page.getByLabel('Estúdio').getByRole('link', { name: 'Home', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Jogo recém-criado', exact: true })).toBeVisible()
  expect(dashboardReads).toBeGreaterThan(initialDashboardReads)
  const comparison = page.getByRole('region', { name: 'Comparativo dos seus jogos' })
  await expect(comparison.getByRole('link', { name: newGame.title })).toBeVisible()
  expect(benchmarkReads).toBeGreaterThan(initialBenchmarkReads)
})

test('desktop and mobile layouts keep Home content inside the viewport', async ({ page }) => {
  await setup(page)
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/studio')
  await expect(
    page
      .getByRole('table', { name: 'Testes recentes do estúdio' })
      .getByText('Exploração livre', { exact: true }),
  ).toHaveCount(2)
  await expect(
    page
      .getByRole('region', { name: 'Telemetria / Orbit Plug-in', exact: true })
      .getByText('9', { exact: true }),
  ).toBeVisible()
  await page.screenshot({ path: 'test-results/studio-home.png', fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
    .toBeLessThanOrEqual(390)
  await page.screenshot({ path: 'test-results/studio-home-mobile.png', fullPage: true })
  expect(errors).toEqual([])
})
