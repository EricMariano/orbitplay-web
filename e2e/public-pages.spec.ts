import { expect, test } from '@playwright/test'

test('public navigation connects the landing, tester introduction and existing signup', async ({
  page,
}) => {
  const privateRequests: string[] = []
  page.on('request', (request) => {
    if (/\/api\/(?:player|games|tests)(?:\/|\?)/.test(request.url()))
      privateRequests.push(request.url())
  })
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Teste jogos. Ganhe dinheiro.' })).toBeVisible()
  await expect(page.getByText('Seu próximo jogo começa aqui')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Populares', exact: true })).toBeDisabled()
  await page.getByRole('link', { name: 'Quero testar!', exact: true }).click()
  await expect(page).toHaveURL(/\/tester$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Seja um testador de jogos')
  const download = page.getByRole('button', { name: 'Instale o OrbitPlay' })
  if (await download.count()) {
    await expect(download).toBeDisabled()
    await expect(page.getByText('Instalador ainda não disponível para este sistema.')).toBeVisible()
  } else {
    await expect(page.getByRole('link', { name: 'Instale o OrbitPlay' })).toHaveAttribute(
      'href',
      /^(https?:\/\/|\/)/,
    )
  }
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Seja um testador de jogos')
  await page.getByRole('link', { name: 'Jogos', exact: true }).click()
  await expect(page).toHaveURL(/\/#jogos$/)
  await expect(page.getByRole('heading', { name: 'Jogos disponíveis' })).toBeInViewport()
  await page.getByRole('link', { name: 'Como funciona', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Como funciona', exact: true })).toBeInViewport()
  await page.getByRole('link', { name: 'Recursos', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Jogue e explore' })).toBeInViewport()
  await page.getByRole('link', { name: 'OrbitPlay — início' }).click()
  await page.getByRole('link', { name: 'Sou um estúdio', exact: true }).click()
  await expect(page).toHaveURL(/\/signup\?account=studio$/)
  await expect(page.getByLabel('Nome do estúdio', { exact: true })).toBeVisible()
  await page.goto('/')
  await page.getByRole('link', { name: 'Cadastre-se', exact: true }).click()
  await expect(page).toHaveURL(/\/signup\?account=player$/)
  await expect(page.getByLabel('Nome do estúdio', { exact: true })).toHaveCount(0)
  expect(privateRequests).toEqual([])
})

for (const viewport of [
  { width: 1920, height: 1080 },
  { width: 1600, height: 900 },
  { width: 1440, height: 900 },
  { width: 1366, height: 768 },
]) {
  test(`both public pages fit ${viewport.width}×${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    for (const path of ['/', '/tester']) {
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await page.evaluate(() => document.fonts.ready)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
      const links = page.getByRole('navigation').getByRole('link')
      for (const link of await links.all()) await expect(link).toBeInViewport()
      for (const image of await page.locator('main img, .landing-character').all()) {
        await image.scrollIntoViewIfNeeded()
        await expect
          .poll(() =>
            image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0),
          )
          .toBe(true)
      }
      if (path === '/tester') {
        await expect(page.locator('.tester-install')).toBeInViewport()
        const overlap = await page.evaluate(() => {
          const copy = document.querySelector('.tester-copy')!.getBoundingClientRect()
          const art = document.querySelector('.tester-desktop-preview')!.getBoundingClientRect()
          return copy.right > art.left && copy.left < art.right
        })
        expect(overlap).toBe(false)
      }
    }
    expect(errors).toEqual([])
  })
}
