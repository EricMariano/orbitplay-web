import { useQuery } from '@tanstack/react-query'
import type { SessionDetail } from '@/api-types'
import { api } from '@/lib/api-client'
import { reportsKeys } from './reports-keys'

/** Todos os blocos disponíveis do detalhe da sessão do teste. */
export function useSessionDetail(testId: string, sessionId: string) {
  return useQuery({
    queryKey: reportsKeys.sessionDetail(testId, sessionId),
    queryFn: () =>
      api.get<SessionDetail>(
        `/tests/${encodeURIComponent(testId)}/report/sessions/${encodeURIComponent(sessionId)}/detail`,
      ),
    enabled: Boolean(testId && sessionId),
  })
}
