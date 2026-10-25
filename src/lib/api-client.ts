import type { ApiError as ApiErrorShape, LoginResponse } from '@/api-types'
import { clearSession, getAccessToken, useAuthStore } from '@/lib/auth'

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

/** Typed error thrown for any non-ok response. Preserves per-field errors so
 *  forms can show them without losing what the user typed (handoff requirement). */
export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly fieldErrors?: Record<string, string>

  constructor(status: number, body: Partial<ApiErrorShape> | null, fallbackMessage: string) {
    super(body?.message ?? fallbackMessage)
    this.name = 'ApiError'
    this.status = status
    this.code = body?.code ?? 'unknown'
    this.fieldErrors = body?.fieldErrors
  }
}

export type RequestOptions = Omit<RequestInit, 'body'> & {
  /** Serialized to JSON automatically. */
  json?: unknown
  /** Attach a generated Idempotency-Key (mutations that require it, e.g. the test wizard). */
  idempotent?: boolean
  /** Set false for public or cookie-only authentication endpoints. */
  auth?: boolean
  /** Internal: guards against an infinite refresh loop. */
  _isRetry?: boolean
}

function buildHeaders(options: RequestOptions): Headers {
  const headers = new Headers(options.headers)
  if (options.json !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const token = options.auth === false ? null : getAccessToken()
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  if (options.idempotent && !headers.has('Idempotency-Key')) {
    headers.set('Idempotency-Key', crypto.randomUUID())
  }
  return headers
}

async function parseError(response: Response): Promise<ApiError> {
  let body: Partial<ApiErrorShape> | null = null
  try {
    body = (await response.json()) as Partial<ApiErrorShape>
  } catch {
    // non-JSON error body — fall back to status text
  }
  return new ApiError(response.status, body, response.statusText || 'Request failed')
}

/** Single-flight refresh so parallel 401s don't each fire a refresh. */
let refreshFlight: { revision: number; promise: Promise<boolean> } | null = null

async function tryRefresh(): Promise<boolean> {
  const revision = useAuthStore.getState().revision
  if (refreshFlight?.revision === revision) return refreshFlight.promise
  const promise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!res.ok) return false
      const data = (await res.json()) as LoginResponse
      if (!data.accessToken || !data.user) return false
      return useAuthStore.getState().refreshSession(data, revision)
    } catch {
      return false
    }
  })()
  const flight = { revision, promise }
  refreshFlight = flight

  try {
    return await promise
  } finally {
    if (refreshFlight === flight) refreshFlight = null
  }
}

let initializePromise: Promise<void> | null = null

export function initializeSession(): Promise<void> {
  initializePromise ??= (async () => {
    if (getAccessToken()) return
    const revision = useAuthStore.getState().revision
    const restored = await tryRefresh()
    if (!restored && useAuthStore.getState().revision === revision) clearSession()
  })()
  return initializePromise
}

function redirectToLogin() {
  clearSession()
  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    // A reload would bootstrap the still-present refresh cookie and reopen the failed session.
    void import('@/app/router').then(({ router }) =>
      router.navigate({ to: '/login', replace: true }),
    )
  }
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  // Keep the same mutation key when authentication requires a retry.
  if (options.idempotent) {
    const headers = new Headers(options.headers)
    if (!headers.has('Idempotency-Key')) headers.set('Idempotency-Key', crypto.randomUUID())
    options = { ...options, headers }
  }
  const { json, idempotent, auth, _isRetry, ...init } = options
  void idempotent // consumed in buildHeaders
  const revision = useAuthStore.getState().revision
  const token = getAccessToken()

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: buildHeaders(options),
    body: json !== undefined ? JSON.stringify(json) : undefined,
  })

  if (auth !== false && useAuthStore.getState().revision !== revision) {
    throw new ApiError(401, null, 'A sessão foi alterada')
  }

  if (response.status === 401 && auth !== false) {
    if (!_isRetry) {
      const refreshed = getAccessToken() !== token || (await tryRefresh())
      if (useAuthStore.getState().revision !== revision) throw await parseError(response)
      if (refreshed) return request<T>(path, { ...options, _isRetry: true })
    }
    redirectToLogin()
    throw await parseError(response)
  }

  if (!response.ok) {
    throw await parseError(response)
  }

  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, json?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', json }),
  put: <T>(path: string, json?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', json }),
  patch: <T>(path: string, json?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', json }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}
