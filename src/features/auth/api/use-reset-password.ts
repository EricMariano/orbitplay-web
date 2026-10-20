import { useMutation } from '@tanstack/react-query'
import type { MessageResponse, ResetPasswordRequest } from '@/api-types'
import { api } from '@/lib/api-client'

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordRequest) =>
      api.post<MessageResponse>('/auth/password/reset', payload, { auth: false }),
  })
}
