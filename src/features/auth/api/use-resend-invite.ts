import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { MessageResponse } from '@/api-types'
import { accessKeys } from '@/features/access/api/access-keys'
import { api } from '@/lib/api-client'

/** "Reenviar convite" (Tela 20): novo link de aceite; o anterior deixa de valer. */
export function useResendInvite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) =>
      api.post<MessageResponse>(`/orgs/members/${encodeURIComponent(userId)}/invite/resend`),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: accessKeys.auditLogs() }),
  })
}
