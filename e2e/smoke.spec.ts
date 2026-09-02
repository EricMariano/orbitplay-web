import { expect, test } from '@playwright/test'

test('unauthenticated root redirects to /login', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('button', { name: 'Entrar!', exact: true })).toBeVisible()
})

test('protected areas redirect to /login without a session', async ({ page }) => {
  await page.goto('/studio')
  await expect(page).toHaveURL(/\/login$/)

  await page.goto('/player')
  await expect(page).toHaveURL(/\/login$/)
})

test('login switches both account visuals on the same form', async ({ page }) => {
  await page.goto('/login')

  const testerTab = page.getByRole('tab', { name: 'Sou um tester' })
  const studioTab = page.getByRole('tab', { name: 'Sou um estúdio' })
  const testerVisual = page.getByTestId('login-visual-tester')
  const studioVisual = page.getByTestId('login-visual-studio')

  await expect(testerTab).toHaveAttribute('data-state', 'active')
  await expect(testerVisual).toHaveCSS('opacity', '1')
  await expect(studioVisual).toHaveCSS('opacity', '0')

  await studioTab.click()
  await expect(studioTab).toHaveAttribute('data-state', 'active')
  await expect(studioVisual).toHaveCSS('opacity', '1')
  await expect(testerVisual).toHaveCSS('opacity', '0')
  await expect(page.getByLabel('E-mail')).toBeVisible()
  await expect(page.getByLabel('Senha')).toBeVisible()
  await expect(page.getByRole('checkbox', { name: 'Lembrar login' })).toBeChecked()
})

test('login validates required fields before submitting', async ({ page }) => {
  await page.goto('/login')
  await page.getByRole('button', { name: 'Entrar!', exact: true }).click()

  await expect(page.getByText('Informe seu e-mail')).toBeVisible()
  await expect(page.getByText('Use pelo menos 8 caracteres')).toBeVisible()
})

test('login submits the backend contract without deriving a role from the tab', async ({
  page,
}) => {
  await page.goto('/login')
  await page.getByRole('tab', { name: 'Sou um estúdio' }).click()
  await page.getByLabel('E-mail').fill('studio@example.com')
  await page.getByLabel('Senha').fill('senha-segura')
  await page.getByRole('checkbox', { name: 'Lembrar login' }).uncheck()

  const submit = page.getByRole('button', { name: 'Entrar!' })
  await page.evaluate(() => {
    Reflect.set(window, '__loginWasDisabled', false)
    const record = () => {
      const button = document.querySelector<HTMLButtonElement>('button[type="submit"]')
      if (button?.disabled) Reflect.set(window, '__loginWasDisabled', true)
    }
    new MutationObserver(() => {
      record()
    }).observe(document.body, { attributes: true, childList: true, subtree: true })
  })

  const requestPromise = page.waitForRequest((request) => request.url().endsWith('/api/auth/login'))
  await submit.click()
  const request = await requestPromise

  expect(request.method()).toBe('POST')
  expect(request.postDataJSON()).toEqual({
    identifier: 'studio@example.com',
    password: 'senha-segura',
    rememberMe: false,
  })
  await expect.poll(() => page.evaluate(() => Reflect.get(window, '__loginWasDisabled'))).toBe(true)
})
