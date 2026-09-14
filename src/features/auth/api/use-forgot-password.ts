import { useMutation } from '@tanstack/react-query'
import type { ForgotPasswordRequest, MessageResponse } from '@/api-types'
import { api } from '@/lib/api-client'

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordRequest) =>
      api.post<MessageResponse>('/auth/password/forgot', payload, { auth: false }),
  })
}
