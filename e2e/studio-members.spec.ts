import { expect, test, type Page } from '@playwright/test'

const ownerId = '01920000-0000-7000-8000-0000000000a1'
const developerId = '01920000-0000-7000-8000-0000000000a2'

function member(
  userId: string,
  displayName: string,
  email: string,
  role: string,
  status = 'active',
) {
  return { userId, displayName, email, role, status }
}

async function setup(page: Page) {
  const members = [
    member(ownerId, 'Blackstar Games', 'owner@blackstar.dev', 'owner'),
    member(developerId, 'Ana Lima', 'ana@blackstar.dev', 'studio'),
  ]
  const audit = [
    {
      id: '01920000-0000-7000-8000-0000000000f1',
      actorUserId: ownerId,
      actorEmail: 'owner@blackstar.dev',
      action: 'org.member_invited',
      entity: 'memberships',
      entityId: developerId,
      before: null,
      after: null,
      createdAt: '2026-10-20T12:00:00.000Z',
    },
  ]

  await page.route('**/api/auth/refresh', (route) =>
    route.fulfill({
      json: {
        accessToken: 'test-token',
        user: {
          id: ownerId,
          displayName: 'Blackstar Games',
          email: 'owner@blackstar.dev',
          role: 'owner',
          organizationId: 'org',
        },
      },
    }),
  )
  await page.route('**/api/orgs/members?*', (route) =>
    route.fulfill({ json: { data: members, nextCursor: null } }),
  )
  await page.route('**/api/audit-logs?*', (route) =>
    route.fulfill({ json: { data: audit, nextCursor: null } }),
  )
  await page.route('**/api/orgs/members/invite', async (route) => {
    const payload = route.request().postDataJSON() as {
      email: string
      displayName?: string
      role: string
    }
    const invited = member(
      '01920000-0000-7000-8000-0000000000a3',
      payload.displayName ?? payload.email,
      payload.email,
      payload.role,
      'invited',
    )
    members.push(invited)
    audit.unshift({
      ...audit[0],
      id: '01920000-0000-7000-8000-0000000000f2',
      action: 'org.member_invited',
      entityId: invited.userId,
    })
    await route.fulfill({ status: 201, json: invited })
  })
  await page.route('**/api/orgs/members/*/role', async (route) => {
    const payload = route.request().postDataJSON() as { role: string; confirm: boolean }
    const target = members.find((item) => item.userId === developerId)
    if (target) target.role = payload.role
    await route.fulfill({ json: target })
  })
  await page.route('**/api/orgs/members/*/status', async (route) => {
    const payload = route.request().postDataJSON() as { status: string; confirm: boolean }
    const target = members.find((item) => item.userId === developerId)
    if (target) target.status = payload.status
    await route.fulfill({ json: target })
  })
}

test('owner manages invitations, roles, status and audit records from the members central', async ({
  page,
}) => {
  await setup(page)
  await page.goto('/studio/members')

  await expect(page.getByRole('heading', { name: 'Membros do estúdio' })).toBeVisible()
  await expect(page.getByRole('table', { name: 'Membros da organização' })).toContainText(
    'Ana Lima',
  )
  await expect(page.getByLabel('Eventos de auditoria')).toContainText('Convite enviado')

  await page.getByRole('button', { name: 'Convidar membro' }).click()
  await page.getByLabel('E-mail do convite').fill('bia@blackstar.dev')
  await page.getByLabel('Nome de exibição (opcional)').fill('Bia Souza')
  await page.getByRole('button', { name: 'Enviar convite' }).click()
  await expect(page.getByRole('table', { name: 'Membros da organização' })).toContainText(
    'bia@blackstar.dev',
  )
  await expect(page.getByText('Convite pendente', { exact: true })).toBeVisible()
  // Só o convidado aceita o convite: não dá para ativá-lo nem desativá-lo daqui.
  await expect(
    page.getByRole('row', { name: /Bia Souza/ }).getByRole('button', { name: 'Desativar' }),
  ).toBeDisabled()

  const anaRow = page.getByRole('row', { name: /Ana Lima/ })
  await anaRow.getByRole('combobox', { name: 'Papel de Ana Lima' }).click()
  await page.getByRole('option', { name: 'Administrador', exact: true }).click()
  await expect(page.getByRole('dialog')).toContainText('Confirmar mudança de papel')
  await page.getByRole('button', { name: 'Confirmar alteração' }).click()
  await expect(anaRow.getByRole('combobox', { name: 'Papel de Ana Lima' })).toContainText(
    'Administrador',
  )

  await anaRow.getByRole('button', { name: 'Desativar' }).click()
  await expect(page.getByRole('dialog')).toContainText('Confirmar mudança de status')
  await page.getByRole('button', { name: 'Confirmar alteração' }).click()
  await expect(anaRow.getByText('Desativado', { exact: true })).toBeVisible()
})

test('member filters find invitation status without hiding the audit history', async ({ page }) => {
  await setup(page)
  await page.goto('/studio/members')

  await page.getByLabel('Buscar membro').fill('ana@blackstar.dev')
  await expect(page.getByRole('table', { name: 'Membros da organização' })).toContainText(
    'Ana Lima',
  )
  await expect(page.getByRole('table', { name: 'Membros da organização' })).not.toContainText(
    'Blackstar Games',
  )
  await expect(page.getByLabel('Eventos de auditoria')).toContainText('Convite enviado')
})
