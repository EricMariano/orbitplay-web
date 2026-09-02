import { useMutation } from '@tanstack/react-query'
import type { MessageResponse } from '@/api-types'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/lib/auth'

export function useLogout() {
  const clearSession = useAuthStore((state) => state.clearSession)

  return useMutation({
    mutationFn: () => api.post<MessageResponse>('/auth/logout', undefined, { auth: false }),
    onSettled: clearSession,
  })
}
