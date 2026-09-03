import { parseApiError } from './api-error'

export type HttpRequestOptions = Omit<RequestInit, 'body'> & {
  /** Serialized to JSON automatically. */
  json?: unknown
  /** Attach a generated Idempotency-Key (mutations that require it, e.g. the test wizard). */
  idempotent?: boolean
}

export type HttpClientConfig = {
  baseUrl: string
  /**
   * Injected rather than imported so this module has zero knowledge of *how*
   * auth is stored (Zustand, cookies, whatever) — that's a policy decision
   * made by whoever calls `createHttpClient` (DIP). A plain function keeps
   * the contract as small as possible (ISP): callers don't need to depend on
   * a whole "auth store" interface just to hand over a token getter.
   */
  getAuthToken?: () => string | null | undefined
}

export type HttpClient = {
  get: <T>(path: string, options?: HttpRequestOptions) => Promise<T>
  post: <T>(path: string, json?: unknown, options?: HttpRequestOptions) => Promise<T>
  put: <T>(path: string, json?: unknown, options?: HttpRequestOptions) => Promise<T>
  patch: <T>(path: string, json?: unknown, options?: HttpRequestOptions) => Promise<T>
  delete: <T>(path: string, options?: HttpRequestOptions) => Promise<T>
  /** Low-level escape hatch for callers that layer their own policy on top
   *  (e.g. the session-aware refresh-and-retry wrapper in `lib/api-client.ts`). */
  request: <T>(path: string, options?: HttpRequestOptions) => Promise<T>
}

function buildHeaders(
  options: HttpRequestOptions,
  getAuthToken?: () => string | null | undefined,
): Headers {
  const headers = new Headers(options.headers)
  if (options.json !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const token = getAuthToken?.()
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  if (options.idempotent && !headers.has('Idempotency-Key')) {
    headers.set('Idempotency-Key', crypto.randomUUID())
  }
  return headers
}

/**
 * Framework-agnostic fetch wrapper: header building, JSON (de)serialization,
 * typed errors. Deliberately knows nothing about auth storage, token refresh
 * or redirects — those are app-specific policies layered on top in
 * `src/lib/api-client.ts`. That split is what lets this module be reused or
 * unit-tested (e.g. with a fake `getAuthToken`) without a Zustand store, a
 * router, or a real backend in the picture.
 */
export function createHttpClient(config: HttpClientConfig): HttpClient {
  async function request<T>(path: string, options: HttpRequestOptions = {}): Promise<T> {
    const { json, idempotent, ...init } = options
    void idempotent // consumed in buildHeaders

    const response = await fetch(`${config.baseUrl}${path}`, {
      ...init,
      credentials: 'include',
      headers: buildHeaders(options, config.getAuthToken),
      body: json !== undefined ? JSON.stringify(json) : undefined,
    })

    if (!response.ok) {
      throw await parseApiError(response)
    }
    if (response.status === 204) {
      return undefined as T
    }
    return (await response.json()) as T
  }

  return {
    request,
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
}
