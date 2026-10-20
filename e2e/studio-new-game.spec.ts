import { expect, test, type Page } from '@playwright/test'

const gameId = '01930000-0000-7000-8000-0000000000d1'
const uploadUrl = 'https://storage.example/upload'

const members = [
  {
    userId: 'user',
    email: 'test@example.com',
    displayName: 'Blackstar Games',
    role: 'owner',
    status: 'active',
  },
  {
    userId: 'u-ana',
    email: 'ana@example.com',
    displayName: 'Ana Souza',
    role: 'studio',
    status: 'active',
  },
  {
    userId: 'u-player',
    email: 'jo@example.com',
    displayName: 'Jogador Jo',
    role: 'player',
    status: 'active',
  },
]
const groups = [
  {
    id: 'g-qa',
    name: 'QA',
    memberCount: 2,
    memberUserIds: ['u-ana', 'user'],
    createdAt: '2026-01-01T00:00:00.000Z',
  },
]

function createdGame(body: Record<string, unknown>) {
  return {
    id: gameId,
    organizationId: 'org',
    slug: 'nebula',
    description: null,
    genre: null,
    platform: null,
    status: 'draft',
    coverUrl: null,
    bannerUrl: null,
    logoUrl: null,
    iconUrl: null,
    metrics: {
      testsTotal: 0,
      testsActive: 0,
      sessionsValid: 0,
      playersTotal: 0,
      averageRating: null,
    },
    createdAt: '2026-10-20T10:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
    ...body,
  }
}

type Captured = {
  creates: Record<string, unknown>[]
  uploadRequests: Record<string, unknown>[]
  confirms: Record<string, unknown>[]
  access: Record<string, unknown>[]
  storagePuts: number
}

async function setup(page: Page, options: { failUploads?: () => boolean } = {}): Promise<Captured> {
  const captured: Captured = {
    creates: [],
    uploadRequests: [],
    confirms: [],
    access: [],
    storagePuts: 0,
  }
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
  await page.route('**/api/orgs/members?*', (route) =>
    route.fulfill({ json: { data: members, nextCursor: null } }),
  )
  await page.route('**/api/orgs/groups', (route) => route.fulfill({ json: { data: groups } }))
  await page.route('**/api/games', (route) => {
    if (route.request().method() !== 'POST')
      return route.fulfill({ json: { data: [], nextCursor: null } })
    const body = route.request().postDataJSON() as Record<string, unknown>
    captured.creates.push(body)
    return route.fulfill({ status: 201, json: createdGame(body) })
  })
  await page.route(`**/api/games/${gameId}/assets/upload-url`, (route) => {
    captured.uploadRequests.push(route.request().postDataJSON() as Record<string, unknown>)
    if (options.failUploads?.()) {
      return route.fulfill({
        status: 500,
        json: { statusCode: 500, code: 'INTERNAL_ERROR', message: 'Storage fora do ar' },
      })
    }
    const kind = (captured.uploadRequests.at(-1) as { kind: string }).kind
    return route.fulfill({
      status: 201,
      json: {
        uploadUrl: `${uploadUrl}/${kind}`,
        storageKey: `orgs/org/games/${gameId}/assets/${kind}/key.png`,
        expiresAt: '2026-10-20T11:00:00.000Z',
        maxSizeBytes: 5 * 1024 * 1024,
      },
    })
  })
  await page.route(`${uploadUrl}/**`, (route) => {
    const cors = {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'PUT, OPTIONS',
      'access-control-allow-headers': '*',
    }
    if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors })
    captured.storagePuts++
    return route.fulfill({ status: 200, headers: cors })
  })
  await page.route(`**/api/games/${gameId}/assets`, (route) => {
    const body = route.request().postDataJSON() as Record<string, unknown>
    captured.confirms.push(body)
    return route.fulfill({
      status: 201,
      json: {
        id: `asset-${String(body.kind)}`,
        kind: body.kind,
        url: 'https://storage.example/img.png',
        contentType: 'image/png',
        sizeBytes: 10,
        createdAt: '2026-10-20T10:00:00.000Z',
      },
    })
  })
  await page.route(`**/api/games/${gameId}/access`, (route) => {
    captured.access.push(route.request().postDataJSON() as Record<string, unknown>)
    return route.fulfill({ json: { data: [] } })
  })
  return captured
}

const png = {
  name: 'capa.png',
  mimeType: 'image/png',
  buffer: Buffer.from('89504e470d0a1a0a', 'hex'),
}

async function fillInfo(page: Page) {
  await page.getByLabel('Nome do jogo').fill('Nebula Drift')
  await page.getByLabel('Subtítulo / tagline').fill('Corrida espacial')
  await page.getByRole('button', { name: 'Adicionar Action', exact: true }).click()
  await page.getByRole('button', { name: 'Plataformas', exact: true }).click()
  await page.getByRole('menuitemcheckbox', { name: 'Windows' }).click()
  await page.getByRole('menuitemcheckbox', { name: 'Web' }).click()
  await page.keyboard.press('Escape')
  await page.getByRole('combobox', { name: 'Estágio de desenvolvimento' }).click()
  await page.getByRole('option', { name: 'Beta' }).click()
}

test('wizard blocks the first step until title and genre are filled', async ({ page }) => {
  await setup(page)
  await page.goto('/studio/games/new')
  await expect(page.getByRole('heading', { name: 'Novo jogo' })).toBeVisible()
  await page.getByRole('button', { name: 'Próximo' }).click()
  await expect(page.getByText('Informe o nome do jogo')).toBeVisible()
  await expect(page.getByText('Escolha ao menos um gênero')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Informações gerais' })).toBeVisible()
})

test('creates a game through the four stages, uploading media and saving permissions', async ({
  page,
}) => {
  const captured = await setup(page)
  await page.goto('/studio/games/new')
  await fillInfo(page)
  await page.getByRole('button', { name: 'Próximo' }).click()

  await expect(page.getByRole('heading', { name: 'Imagens e mídias' })).toBeVisible()
  await page.getByLabel('Imagem de capa').setInputFiles(png)
  await page.getByLabel('Ícone / thumbnail').setInputFiles({ ...png, name: 'icone.png' })
  await page.getByLabel('Trailer / vídeo').fill('https://youtu.be/abc')
  await expect(page.getByAltText('Pré-visualização de imagem de capa')).toBeVisible()
  await page.getByRole('button', { name: 'Próximo' }).click()

  await expect(page.getByRole('heading', { name: 'Responsáveis e permissões' })).toBeVisible()
  const matrix = page.getByRole('table', { name: 'Permissões por membro e grupo' })
  await expect(matrix.getByText('Blackstar Games')).toBeVisible()
  await page.getByRole('button', { name: 'Adicionar membros ou grupo' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByText('Jogador Jo')).toHaveCount(0)
  await dialog.getByRole('checkbox').nth(0).click() // QA
  await dialog.getByRole('checkbox', { name: /Ana Souza/ }).click()
  await dialog.getByRole('button', { name: 'Finalizar' }).click()
  await expect(matrix.getByText('QA (2 perfis)')).toBeVisible()
  await matrix.getByRole('switch', { name: /QA: Acessar relatórios/ }).click()
  await page.getByRole('button', { name: 'Finalizar' }).click()

  await expect(page.getByRole('heading', { name: 'Jogo criado com sucesso!' })).toBeVisible()
  await expect(page.getByText('“Nebula Drift” foi adicionado ao seu estúdio.')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Ir para o jogo' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Voltar para a Home' })).toBeVisible()

  expect(captured.creates).toHaveLength(1)
  expect(captured.creates[0]).toMatchObject({
    title: 'Nebula Drift',
    tagline: 'Corrida espacial',
    genres: expect.arrayContaining(['Action']),
    supportedPlatforms: ['windows', 'web'],
    developmentStage: 'beta',
    trailerUrl: 'https://youtu.be/abc',
  })
  expect(captured.confirms.map((c) => c.kind).sort()).toEqual(['cover', 'icon'])
  expect(captured.storagePuts).toBe(2)
  expect(captured.access).toHaveLength(1)
  const entries = (
    captured.access[0] as {
      entries: { subjectType: string; subjectId: string; permissions: Record<string, boolean> }[]
    }
  ).entries
  expect(entries.map((e) => `${e.subjectType}:${e.subjectId}`).sort()).toEqual([
    'group:g-qa',
    'member:u-ana',
    'member:user',
  ])
  expect(entries.find((e) => e.subjectId === 'g-qa')?.permissions).toEqual({
    manageAccess: false,
    editInfo: false,
    manageTests: false,
    viewReports: true,
  })
  expect(entries.find((e) => e.subjectId === 'user')?.permissions).toEqual({
    manageAccess: true,
    editInfo: true,
    manageTests: true,
    viewReports: true,
  })
})

test('retrying after a failed upload does not create the game twice', async ({ page }) => {
  let fail = true
  const captured = await setup(page, { failUploads: () => fail })
  await page.goto('/studio/games/new')
  await fillInfo(page)
  await page.getByRole('button', { name: 'Próximo' }).click()
  await page.getByLabel('Imagem de capa').setInputFiles(png)
  await page.getByRole('button', { name: 'Próximo' }).click()
  await page.getByRole('button', { name: 'Finalizar' }).click()

  await expect(page.getByText('O jogo foi criado, mas nem tudo foi salvo.')).toBeVisible()
  await expect(page.getByRole('status')).toContainText('O jogo já foi criado como rascunho')
  expect(captured.creates).toHaveLength(1)

  fail = false
  await page.getByRole('button', { name: 'Tentar de novo' }).click()
  await expect(page.getByRole('heading', { name: 'Jogo criado com sucesso!' })).toBeVisible()
  expect(captured.creates).toHaveLength(1)
  expect(captured.confirms.map((c) => c.kind)).toEqual(['cover'])
  expect(captured.access).toHaveLength(1)
})

test('API field errors send the user back to the step that owns the field', async ({ page }) => {
  await setup(page)
  await page.route('**/api/games', (route) =>
    route.request().method() === 'POST'
      ? route.fulfill({
          status: 422,
          json: {
            statusCode: 422,
            code: 'VALIDATION_ERROR',
            message: 'Dados inválidos',
            fieldErrors: { 'supportedPlatforms.0': 'Plataforma inválida' },
          },
        })
      : route.fulfill({ json: { data: [], nextCursor: null } }),
  )
  await page.goto('/studio/games/new')
  await fillInfo(page)
  await page.getByRole('button', { name: 'Próximo' }).click()
  await page.getByRole('button', { name: 'Próximo' }).click()
  await page.getByRole('button', { name: 'Finalizar' }).click()
  await expect(page.getByRole('heading', { name: 'Informações gerais' })).toBeVisible()
  await expect(page.getByText('Plataforma inválida')).toBeVisible()
})

test('rejects images that are not png, jpg or webp', async ({ page }) => {
  await setup(page)
  await page.goto('/studio/games/new')
  await fillInfo(page)
  await page.getByRole('button', { name: 'Próximo' }).click()
  await page
    .getByLabel('Logo')
    .setInputFiles({ name: 'logo.gif', mimeType: 'image/gif', buffer: Buffer.from('GIF89a') })
  await expect(page.getByText('Use uma imagem PNG, JPG ou WebP.')).toBeVisible()
})

test('new game keeps the studio role guard', async ({ page }) => {
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
  await page.goto('/studio/games/new')
  await expect(page).not.toHaveURL(/\/studio\/games\/new$/)
})
