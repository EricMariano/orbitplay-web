import { useMutation, useQuery } from '@tanstack/react-query'
import type { AcceptInviteRequest, AcceptInviteResponse, InvitePreview } from '@/api-types'
import { api } from '@/lib/api-client'
import { authKeys } from './auth-keys'

/** Prévia pública do convite — o token vai no corpo, nunca na URL da API. */
export function useInvitePreview(token: string) {
  return useQuery({
    queryKey: authKeys.invitePreview(token),
    enabled: token.length > 0,
    // Token inválido ou expirado é definitivo: não insista.
    retry: false,
    queryFn: () => api.post<InvitePreview>('/auth/invite/preview', { token }, { auth: false }),
  })
}

export function useAcceptInvite() {
  return useMutation({
    mutationFn: (payload: AcceptInviteRequest) =>
      api.post<AcceptInviteResponse>('/auth/invite/accept', payload, { auth: false }),
  })
}
