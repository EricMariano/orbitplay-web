import { expect, test, type Page } from '@playwright/test'

const testId = '01920000-0000-7000-8000-0000000000a1'
const participationId = '01920000-0000-7000-8000-0000000000b1'

async function setupPlayerHome(page: Page) {
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
  await page.route('**/api/player/home', (route) =>
    route.fulfill({
      json: {
        continuing: {
          participationId,
          testId,
          gameId: 'game-1',
          title: 'Exploração de Neon Runner',
          coverUrl: null,
          status: 'playing',
          progress: 75,
          rewardCents: 2500,
          endsAt: '2030-10-30T12:00:00.000Z',
        },
        tests: [
          {
            participationId,
            testId,
            gameId: 'game-1',
            title: 'Exploração de Neon Runner',
            coverUrl: null,
            status: 'playing',
            progress: 75,
            rewardCents: 2500,
            endsAt: '2030-10-30T12:00:00.000Z',
          },
          {
            participationId: '01920000-0000-7000-8000-0000000000b2',
            testId: '01920000-0000-7000-8000-0000000000a2',
            gameId: 'game-2',
            title: 'Teste concluído',
            coverUrl: null,
            status: 'completed',
            progress: 100,
            rewardCents: 1500,
            endsAt: null,
          },
        ],
        earnings: {
          currency: 'BRL',
          last7DaysCents: 2500,
          totalValidatedCents: 4000,
          series: Array.from({ length: 7 }, (_, index) => ({
            date: `2030-10-${String(20 + index).padStart(2, '0')}`,
            amountCents: index === 6 ? 2500 : 0,
          })),
        },
      },
    }),
  )
  await page.route('**/api/player/progress', (route) =>
    route.fulfill({
      json: {
        level: 2,
        xp: 160,
        xpToNextLevel: 40,
        feedbackQuality: 4.5,
        achievementsUnlocked: 3,
        hoursPlayed: 8,
        testsCompleted: 1,
      },
    }),
  )
  await page.route('**/api/player/feed?*', (route) =>
    route.fulfill({ json: { data: [], nextCursor: null, seed: 'home' } }),
  )
  await page.route('**/api/player/missions', (route) => route.fulfill({ json: { data: [] } }))
  await page.route('**/api/rankings', (route) =>
    route.fulfill({
      json: { data: [], nextCursor: null, currentUserEntry: null, generatedAt: null },
    }),
  )
}

test('player home renders the active test, validated earnings and recent participations', async ({
  page,
}) => {
  await setupPlayerHome(page)
  await page.goto('/player')

  await expect(page.getByRole('heading', { name: 'Continue seu teste' })).toBeVisible()
  await expect(page.getByText('Exploração de Neon Runner', { exact: true })).toHaveCount(2)
  await expect(page.getByText('Sessão em andamento')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Continuar' }).first()).toHaveAttribute(
    'href',
    `/player/tests/${testId}/tutorial`,
  )
  await expect(page.getByText('Meu resumo de ganhos')).toBeVisible()
  await expect(page.getByText('R$ 25,00', { exact: true })).toBeVisible()
  await expect(page.getByText('R$ 40,00', { exact: true })).toBeVisible()
  await expect(page.getByText('Teste concluído', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Ver resultado' })).toHaveAttribute(
    'href',
    '/player/participations/01920000-0000-7000-8000-0000000000b2/result',
  )
})

test('player home clearly renders no active participation', async ({ page }) => {
  await setupPlayerHome(page)
  await page.route('**/api/player/home', (route) =>
    route.fulfill({
      json: {
        continuing: null,
        tests: [],
        earnings: {
          currency: 'BRL',
          last7DaysCents: 0,
          totalValidatedCents: 0,
          series: [],
        },
      },
    }),
  )
  await page.goto('/player')
  await expect(page.getByText('Nenhum teste em andamento')).toBeVisible()
  await expect(page.getByText('Nenhum teste por aqui')).toBeVisible()
})
