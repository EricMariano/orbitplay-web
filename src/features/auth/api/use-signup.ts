import { useMutation } from '@tanstack/react-query'
import type { LoginResponse, SignupPlayerRequest, SignupStudioRequest } from '@/api-types'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/lib/auth'

export function useSignup() {
  const setSession = useAuthStore((state) => state.setSession)
  return useMutation({
    mutationFn: ({
      accountType,
      payload,
    }:
      | { accountType: 'player'; payload: SignupPlayerRequest }
      | { accountType: 'studio'; payload: SignupStudioRequest }) =>
      api.post<LoginResponse>(`/auth/signup/${accountType}`, payload, { auth: false }),
    onSuccess: ({ user, accessToken }) => setSession({ user, accessToken }),
  })
}
