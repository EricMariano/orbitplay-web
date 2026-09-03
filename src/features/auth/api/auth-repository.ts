import type { LoginRequest, LoginResponse } from '@/api-types'
import { api } from '@/lib/api-client'

/** Contract `useLogin` depends on (DIP) — same rationale as games-repository.ts. */
export type AuthRepository = {
  login: (credentials: LoginRequest) => Promise<LoginResponse>
}

export const authRepository: AuthRepository = {
  login: (credentials) => api.post<LoginResponse>('/auth/login', credentials),
}
