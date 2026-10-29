import { expect, test, type Page } from '@playwright/test'

const gameId = '01930000-0000-7000-8000-0000000000d1'
const testId = '01930000-0000-7000-8000-0000000000a1'
const sessionId = '01930000-0000-7000-8000-0000000000b1'
const path = `/studio/games/${gameId}/tests/${testId}/sessions/${sessionId}`

function detail() {
  return {
    session: {
      sessionId,
      participationId: 'participation',
      testerId: 'tester',
      testerName: 'Joana Souza',
      status: 'completed',
      startedAt: '2026-10-19T14:00:00.000Z',
      endedAt: '2026-10-19T14:22:00.000Z',
      durationMs: 1320000,
      valid: true,
      averageRating: 4,
      archetype: 'explorer',
      playerTier: 'casual',
      aiQualityScore: null,
      telemetryConnected: true,
    },
    evaluation: {
      submittedAt: '2026-10-19T14:25:00.000Z',
      answers: [
        {
          questionId: 'one',
          prompt: 'O que mais gostou?',
          type: 'open_text',
          valueText: 'A pista final.',
          valueNumber: null,
          valueBoolean: null,
          optionLabels: [],
        },
        {
          questionId: 'two',
          prompt: 'Indicaria o jogo?',
          type: 'boolean',
          valueText: null,
          valueNumber: null,
          valueBoolean: true,
          optionLabels: [],
        },
        {
          questionId: 'three',
          prompt: 'Nota para a dificuldade',
          type: 'scale',
          valueText: null,
          valueNumber: 0,
          valueBoolean: null,
          optionLabels: [],
        },
      ],
    },
    studioRating: null,
    recordings: [
      {
        id: 'recording',
        kind: 'screen',
        status: 'ready',
        contentType: 'video/webm',
        durationMs: 1320000,
      },
    ],
    transcript: { status: 'unavailable', data: [] },
    telemetry: {
      status: 'ready',
      data: [
        {
          id: 'event',
          triggerKey: 'finish_line',
          type: 'counter',
          valueNum: 1,
          valueJson: null,
          tMs: 1260000,
          receivedAt: '2026-10-19T14:21:00.000Z',
        },
      ],
    },
    insights: { status: 'unavailable', model: null, data: [] },
  }
}

async function setup(page: Page) {
  await page.route('**/api/auth/refresh', (route) =>
    route.fulfill({
      json: {
        accessToken: 'token',
        user: {
          id: 'owner',
          displayName: 'Estúdio',
          email: 'studio@example.com',
          role: 'owner',
          organizationId: 'org',
        },
      },
    }),
  )
  await page.route(`**/api/tests/${testId}/report/sessions/${sessionId}/detail`, (route) =>
    route.fulfill({ json: detail() }),
  )
  await page.route(`**/api/sessions/${sessionId}/recordings/recording/playback-url`, (route) =>
    route.fulfill({
      json: {
        status: 'ready',
        url: 'https://media.example/session.webm',
        expiresAt: '2026-10-19T15:00:00.000Z',
        durationMs: 1320000,
        thumbnailUrl: null,
      },
    }),
  )
}

test('studio session detail presents recording, evaluation, telemetry and independent unavailable blocks', async ({
  page,
}) => {
  await setup(page)
  await page.goto(path)
  await expect(page.getByRole('heading', { name: 'Sessão de teste' })).toBeVisible()
  await expect(page.getByText('Joana Souza', { exact: true })).toBeVisible()
  await expect(page.locator('video')).toHaveAttribute('src', 'https://media.example/session.webm')
  await expect(page.getByText('A pista final.')).toBeVisible()
  await expect(page.getByText('Sim', { exact: true })).toBeVisible()
  // Nota 0 é resposta, não "Não respondida".
  await expect(page.locator('dd', { hasText: /^0$/ })).toBeVisible()
  await expect(page.getByText('Não respondida')).toHaveCount(0)
  await expect(page.getByText('finish_line', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Indisponível' })).toHaveCount(2)
  await expect(page.getByText('Eventos de telemetria')).toBeVisible()
})

test('studio can rate a session without leaving its detail', async ({ page }) => {
  await setup(page)
  let requestBody: unknown
  await page.route(`**/api/sessions/${sessionId}/rate`, async (route) => {
    requestBody = route.request().postDataJSON()
    await route.fulfill({
      json: {
        sessionId,
        rating: 4,
        comment: 'Boa execução.',
        markedInvalid: false,
        ratedByUserId: 'owner',
        updatedAt: '2026-10-19T15:00:00.000Z',
      },
    })
  })
  await page.goto(path)
  await page.getByRole('button', { name: '4 estrelas' }).click()
  await page.getByLabel('Comentário interno').fill('Boa execução.')
  await page.getByRole('button', { name: 'Salvar avaliação' }).click()
  await expect
    .poll(() => requestBody)
    .toEqual({ rating: 4, comment: 'Boa execução.', markedInvalid: false })
})

test('session detail keeps a recording failure isolated', async ({ page }) => {
  await setup(page)
  await page.route(`**/api/tests/${testId}/report/sessions/${sessionId}/detail`, (route) => {
    const data = detail()
    data.recordings = [{ ...data.recordings[0], status: 'failed' }]
    data.telemetry = { status: 'unavailable', data: [] }
    return route.fulfill({ json: data })
  })
  await page.goto(path)
  await expect(page.getByText('A gravação não pôde ser processada')).toBeVisible()
  await expect(page.getByText('A pista final.')).toBeVisible()
  await expect(page.locator('video')).toHaveCount(0)
})

test('session detail keeps the studio role guard', async ({ page }) => {
  await page.route('**/api/auth/refresh', (route) =>
    route.fulfill({
      json: {
        accessToken: 'token',
        user: {
          id: 'player',
          displayName: 'Jogador',
          email: 'player@example.com',
          role: 'player',
          organizationId: 'org',
        },
      },
    }),
  )
  await page.goto(path)
  await expect(page).toHaveURL(/\/player\/?$/)
})
