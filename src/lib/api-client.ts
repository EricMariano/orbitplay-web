import type { ApiError as ApiErrorShape } from '@/api-types'
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
  /** Internal: guards against an infinite refresh loop. */
  _isRetry?: boolean
}

function buildHeaders(options: RequestOptions): Headers {
  const headers = new Headers(options.headers)
  if (options.json !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const token = getAccessToken()
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
let refreshPromise: Promise<boolean> | null = null

async function tryRefresh(): Promise<boolean> {
  refreshPromise ??= (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!res.ok) return false
      const data = (await res.json()) as { accessToken?: string }
      if (!data.accessToken) return false
      useAuthStore.getState().setAccessToken(data.accessToken)
      return true
    } catch {
      return false
    }
  })()

  try {
    return await refreshPromise
  } finally {
    refreshPromise = null
  }
}

function redirectToLogin() {
  clearSession()
  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.assign('/login')
  }
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { json, idempotent, _isRetry, ...init } = options
  void idempotent // consumed in buildHeaders

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: buildHeaders(options),
    body: json !== undefined ? JSON.stringify(json) : undefined,
  })

  if (response.status === 401 && !_isRetry) {
    const refreshed = await tryRefresh()
    if (refreshed) {
      return request<T>(path, { ...options, _isRetry: true })
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
