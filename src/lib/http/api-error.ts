import type { ApiError as ApiErrorShape } from '@/api-types'

/** Typed error thrown for any non-ok response. Preserves per-field errors so
 *  forms can show them without losing what the user typed (handoff requirement).
 *  Lives on its own — both the generic http client and the session-aware
 *  wrapper around it need to throw/catch this shape without depending on
 *  the rest of api-client.ts. */
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

export async function parseApiError(response: Response): Promise<ApiError> {
  let body: Partial<ApiErrorShape> | null = null
  try {
    body = (await response.json()) as Partial<ApiErrorShape>
  } catch {
    // non-JSON error body — fall back to status text
  }
  return new ApiError(response.status, body, response.statusText || 'Request failed')
}
