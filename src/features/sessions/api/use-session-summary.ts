import { useQuery } from '@tanstack/react-query'
import type { SessionSummary } from '@/api-types'
import { api } from '@/lib/api-client'
import { sessionsKeys } from './sessions-keys'

/** Resumo da sessão do jogador + formulário de avaliação (`GET /sessions/{id}/summary`). */
export function useSessionSummary(sessionId: string) {
  return useQuery({
    queryKey: sessionsKeys.summary(sessionId),
    queryFn: () => api.get<SessionSummary>(`/sessions/${encodeURIComponent(sessionId)}/summary`),
    retry: false,
  })
}
