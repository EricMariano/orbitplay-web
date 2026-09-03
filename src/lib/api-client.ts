import { ApiError } from '@/lib/http/api-error'
import { createHttpClient, type HttpRequestOptions } from '@/lib/http/http-client'
import { clearSession, getAccessToken, useAuthStore } from '@/lib/auth'

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

// Generic transport: knows how to talk HTTP, nothing about sessions. It only
// depends on the `getAccessToken` function it's handed, not on the auth
// store itself (DIP) — see src/lib/http/http-client.ts.
const httpClient = createHttpClient({ baseUrl: BASE_URL, getAuthToken: getAccessToken })

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

/**
 * Session policy layered on top of the generic `httpClient`: retries once
 * after a silent refresh on 401, then clears the session and redirects to
 * /login. `isRetry` is a plain function argument (not part of the public
 * options type) so callers of `api.get/post/...` can never pass it in by
 * accident — the earlier version leaked an internal `_isRetry` flag through
 * the request options, which was an ISP violation.
 */
async function request<T>(
  path: string,
  options: HttpRequestOptions = {},
  isRetry = false,
): Promise<T> {
  try {
    return await httpClient.request<T>(path, options)
  } catch (error) {
    if (error instanceof ApiError && error.status === 401 && !isRetry) {
      const refreshed = await tryRefresh()
      if (refreshed) {
        return request<T>(path, options, true)
      }
      redirectToLogin()
    }
    throw error
  }
}

export const api = {
  get: <T>(path: string, options?: HttpRequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, json?: unknown, options?: HttpRequestOptions) =>
    request<T>(path, { ...options, method: 'POST', json }),
  put: <T>(path: string, json?: unknown, options?: HttpRequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', json }),
  patch: <T>(path: string, json?: unknown, options?: HttpRequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', json }),
  delete: <T>(path: string, options?: HttpRequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}

// Re-exported so existing call sites (`import { ApiError } from '@/lib/api-client'`)
// keep working unchanged after the split — only this file's internals moved.
export { ApiError }
