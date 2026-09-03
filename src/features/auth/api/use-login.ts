import { useMutation } from '@tanstack/react-query'
import type { LoginRequest } from '@/api-types'
import { useAuthStore } from '@/lib/auth'
import { authRepository, type AuthRepository } from './auth-repository'

/**
 * Log in. On success the backend-decided role (RN-03) is what drives routing —
 * the login tab the user picked is NOT used to set the role.
 */
export function useLogin(repository: AuthRepository = authRepository) {
  const setSession = useAuthStore((s) => s.setSession)

  return useMutation({
    mutationFn: (credentials: LoginRequest) => repository.login(credentials),
    onSuccess: ({ user, accessToken }) => {
      setSession({ user, accessToken })
    },
  })
}
