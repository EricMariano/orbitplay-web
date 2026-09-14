import { useMutation } from '@tanstack/react-query'
import type { LoginRequest, LoginResponse } from '@/api-types'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/lib/auth'

/**
 * Log in. On success the backend-decided role (RN-03) is what drives routing —
 * the login tab the user picked is NOT used to set the role.
 */
export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession)

  return useMutation({
    mutationFn: (credentials: LoginRequest) =>
      api.post<LoginResponse>('/auth/login', credentials, { auth: false }),
    onSuccess: ({ user, accessToken }) => {
      setSession({ user, accessToken })
    },
  })
}
