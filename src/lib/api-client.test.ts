import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { AuthUser } from '@/api-types'
import { api, initializeSession } from './api-client'
import { useAuthStore } from './auth'

const user: AuthUser = {
  id: 'user-a',
  organizationId: 'org-a',
  role: 'owner',
  email: 'a@example.test',
  displayName: 'A',
}
const login = (accessToken = 'old-token', principal = user) =>
  useAuthStore.getState().setSession({ user: principal, accessToken })
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status })
const unauthorized = () => json({ message: 'Sessão inválida' }, 401)
const refreshed = () => json({ user, accessToken: 'new-token' })
const unreachable = () => json({ code: 'api_unreachable', message: 'API indisponível.' }, 502)
function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

describe('API session and retry boundaries', () => {
  const fetchMock = vi.fn<typeof fetch>()
  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
    window.history.replaceState(null, '', '/login')
    login()
  })
  afterEach(() => vi.unstubAllGlobals())

  it('preserves the idempotency key and payload when retrying a mutation after refresh', async () => {
    fetchMock
      .mockResolvedValueOnce(unauthorized())
      .mockResolvedValueOnce(refreshed())
      .mockResolvedValueOnce(json({ id: 'created' }))
    await expect(api.post('/tests', { title: 'Test' }, { idempotent: true })).resolves.toEqual({
      id: 'created',
    })
    const first = fetchMock.mock.calls[0]![1]!
    const retry = fetchMock.mock.calls[2]![1]!
    const key = new Headers(first.headers).get('Idempotency-Key')
    expect(key).toBeTruthy()
    expect(new Headers(retry.headers).get('Idempotency-Key')).toBe(key)
    expect(new Headers(retry.headers).get('Authorization')).toBe('Bearer new-token')
    expect(retry.body).toBe(first.body)
  })

  it('shares one refresh across parallel unauthorized requests', async () => {
    const refresh = deferred<Response>()
    fetchMock
      .mockResolvedValueOnce(unauthorized())
      .mockResolvedValueOnce(unauthorized())
      .mockReturnValueOnce(refresh.promise)
      .mockImplementation(async () => json({ ok: true }))
    const requests = Promise.all([api.get('/one'), api.get('/two')])
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3))
    refresh.resolve(refreshed())
    await requests
    expect(
      fetchMock.mock.calls.filter(([url]) => String(url).endsWith('/auth/refresh')),
    ).toHaveLength(1)
  })

  it('reuses a token already refreshed when an older 401 arrives late', async () => {
    const late = deferred<Response>()
    fetchMock
      .mockReturnValueOnce(late.promise)
      .mockResolvedValueOnce(unauthorized())
      .mockResolvedValueOnce(refreshed())
      .mockImplementation(async () => json({ ok: true }))
    const oldRequest = api.get('/slow')
    await api.get('/fast')
    late.resolve(unauthorized())
    await oldRequest
    expect(
      fetchMock.mock.calls.filter(([url]) => String(url).endsWith('/auth/refresh')),
    ).toHaveLength(1)
  })

  it.each(['logout', 'login'] as const)(
    'does not restore an obsolete refresh after %s',
    async (action) => {
      const refresh = deferred<Response>()
      fetchMock.mockResolvedValueOnce(unauthorized()).mockReturnValueOnce(refresh.promise)
      const result = api.get('/private').catch((error: unknown) => error)
      await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
      if (action === 'logout') useAuthStore.getState().clearSession()
      else login('another-token', { ...user, id: 'user-b', organizationId: 'org-b' })
      refresh.resolve(refreshed())
      await expect(result).resolves.toMatchObject({ status: 401 })
      expect(useAuthStore.getState().accessToken).toBe(action === 'logout' ? null : 'another-token')
      expect(fetchMock).toHaveBeenCalledTimes(2)
    },
  )

  it('clears the session when the retried request is also unauthorized', async () => {
    fetchMock
      .mockResolvedValueOnce(unauthorized())
      .mockResolvedValueOnce(refreshed())
      .mockResolvedValueOnce(unauthorized())
    await expect(api.get('/private')).rejects.toMatchObject({ status: 401 })
    expect(useAuthStore.getState().status).toBe('unauthenticated')
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it.each([401, 403])(
    'clears the session when the API refuses the refresh (%i)',
    async (status) => {
      fetchMock
        .mockResolvedValueOnce(unauthorized())
        .mockResolvedValueOnce(json({ message: 'Sessão inválida' }, status))
      await expect(api.get('/private')).rejects.toMatchObject({ status: 401 })
      expect(useAuthStore.getState().status).toBe('unauthenticated')
      expect(fetchMock).toHaveBeenCalledTimes(2)
    },
  )

  it('keeps the session when the refresh hits a 5xx and renews on the next 401', async () => {
    fetchMock.mockResolvedValueOnce(unauthorized()).mockResolvedValueOnce(unreachable())
    await expect(api.get('/private')).rejects.toMatchObject({
      status: 502,
      code: 'api_unreachable',
    })
    expect(useAuthStore.getState()).toMatchObject({
      status: 'authenticated',
      accessToken: 'old-token',
    })

    fetchMock
      .mockResolvedValueOnce(unauthorized())
      .mockResolvedValueOnce(refreshed())
      .mockResolvedValueOnce(json({ ok: true }))
    await expect(api.get('/private')).resolves.toEqual({ ok: true })
    expect(useAuthStore.getState().accessToken).toBe('new-token')
  })

  it('keeps the session when the refresh cannot reach the API', async () => {
    const offline = new TypeError('Failed to fetch')
    fetchMock.mockResolvedValueOnce(unauthorized()).mockRejectedValueOnce(offline)
    await expect(api.get('/private')).rejects.toBe(offline)
    expect(useAuthStore.getState()).toMatchObject({
      status: 'authenticated',
      accessToken: 'old-token',
    })
  })

  it('rejects a private response that arrives after an account change', async () => {
    const response = deferred<Response>()
    fetchMock.mockReturnValueOnce(response.promise)
    const result = api.get('/private')
    login('another-token', { ...user, id: 'user-b' })
    response.resolve(json({ secret: 'old account' }))
    await expect(result).rejects.toMatchObject({ status: 401 })
    expect(useAuthStore.getState().accessToken).toBe('another-token')
  })

  it('does not refresh or clear an existing session on a public login failure', async () => {
    fetchMock.mockResolvedValueOnce(unauthorized())
    await expect(api.post('/auth/login', {}, { auth: false })).rejects.toMatchObject({
      status: 401,
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(useAuthStore.getState().accessToken).toBe('old-token')
    expect(new Headers(fetchMock.mock.calls[0]![1]?.headers).has('Authorization')).toBe(false)
  })

  it('does not clear a new login when session initialization fails late', async () => {
    useAuthStore.getState().clearSession()
    const refresh = deferred<Response>()
    fetchMock.mockReturnValueOnce(refresh.promise)
    const initial = initializeSession()
    login('login-token')
    refresh.resolve(unauthorized())
    await initial
    expect(useAuthStore.getState().accessToken).toBe('login-token')
  })

  it('retries the boot refresh on the next navigation when the API was unavailable', async () => {
    // Módulos novos: a inicialização é memoizada por carregamento da página.
    vi.resetModules()
    const client = await import('./api-client')
    const { useAuthStore: store } = await import('./auth')
    fetchMock.mockResolvedValueOnce(unreachable()).mockResolvedValueOnce(refreshed())

    await expect(client.initializeSession()).resolves.toBeUndefined()
    expect(store.getState().status).toBe('unauthenticated')

    await client.initializeSession()
    expect(store.getState()).toMatchObject({ status: 'authenticated', accessToken: 'new-token' })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
