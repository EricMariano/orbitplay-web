import { expect, test, type Page } from '@playwright/test'

const sessionId = '01920000-0000-7000-8000-0000000000c1'

const game = {
  id: '01920000-0000-7000-8000-0000000000d1',
  organizationId: 'org',
  title: 'Neon Runner',
  slug: 'neon-runner',
  description: null,
  genre: 'Ação',
  platform: 'web',
  tagline: null,
  genres: [],
  subgenres: [],
  supportedPlatforms: ['web'],
  gameModes: [],
  engine: null,
  developmentStage: null,
  ageRating: null,
  languages: [],
  trailerUrl: null,
  status: 'active',
  coverUrl: null,
  bannerUrl: null,
  logoUrl: null,
  iconUrl: null,
  metrics: {
    testsTotal: 1,
    testsActive: 1,
    sessionsValid: 0,
    playersTotal: 1,
    averageRating: null,
  },
  createdAt: '2030-10-20T10:00:00.000Z',
  updatedAt: '2030-10-20T10:00:00.000Z',
}

const activeSession = {
  id: sessionId,
  participationId: '01920000-0000-7000-8000-0000000000b1',
  testId: '01920000-0000-7000-8000-0000000000a1',
  status: 'active',
  startedAt: '2030-10-20T10:00:00.000Z',
  endedAt: null,
  durationMs: null,
  invalidReason: null,
}

async function setup(page: Page) {
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
  await page.route(`**/api/sessions/${sessionId}/gameplay`, (route) =>
    route.fulfill({
      json: {
        session: activeSession,
        test: {
          id: activeSession.testId,
          gameId: game.id,
          title: 'Exploração livre',
          testModelKey: 'free_exploration',
          status: 'published',
          rewardCents: 2500,
          expiresAt: null,
        },
        game,
        heartbeatIntervalMs: 15_000,
        recordingRequired: true,
      },
    }),
  )
  await page.route(`**/api/sessions/${sessionId}/heartbeat`, (route) =>
    route.fulfill({ status: 204 }),
  )
  await page.route(`**/api/sessions/${sessionId}/devices`, (route) =>
    route.fulfill({ status: 204 }),
  )
  await page.route(`**/api/sessions/${sessionId}/finish`, (route) =>
    route.fulfill({ json: { ...activeSession, status: 'in_review' } }),
  )
  await page.route(`**/api/sessions/${sessionId}/summary`, (route) =>
    route.fulfill({
      json: {
        session: { ...activeSession, status: 'in_review' },
        test: {
          id: activeSession.testId,
          gameId: game.id,
          title: 'Exploração livre',
          testModelKey: 'free_exploration',
          status: 'published',
          rewardCents: 2500,
          expiresAt: null,
        },
        game,
        recording: null,
        form: { testId: activeSession.testId, questions: [] },
        alreadySubmitted: false,
      },
    }),
  )
}

test('gameplay overlay sends heartbeat and device events, then confirms the end of a session', async ({
  page,
}) => {
  await setup(page)
  const requests: Array<{ path: string; body: unknown }> = []
  page.on('request', (request) => {
    if (request.method() !== 'GET' && request.url().includes(`/api/sessions/${sessionId}/`)) {
      requests.push({ path: new URL(request.url()).pathname, body: request.postDataJSON() })
    }
  })

  await page.goto(`/player/sessions/${sessionId}/gameplay`)
  await expect(page.getByRole('heading', { name: 'Exploração livre' })).toBeVisible()
  await expect(page.getByText('Gravação de tela autorizada para este teste')).toBeVisible()
  await expect(page.getByText('Conectado')).toBeVisible()
  await expect(page.getByRole('button', { name: /Microfone/ })).toBeVisible()

  await page.getByRole('button', { name: /Microfone/ }).click()
  await expect(page.getByRole('button', { name: /Microfone/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect
    .poll(() => requests.find((request) => request.path.endsWith('/devices'))?.body)
    .toMatchObject({ kind: 'microphone', enabled: true })
  await expect(requests.some((request) => request.path.endsWith('/heartbeat'))).toBe(true)

  await page.getByRole('button', { name: 'Encerrar teste' }).click()
  await expect(page.getByRole('heading', { name: 'Encerrar este teste?' })).toBeVisible()
  await page.getByRole('button', { name: 'Encerrar e avaliar' }).click()
  await expect(page).toHaveURL(`/player/sessions/${sessionId}/summary`)
  await expect
    .poll(() => requests.find((request) => request.path.endsWith('/finish'))?.body)
    .toMatchObject({ confirmed: true, reason: 'completed' })
})
