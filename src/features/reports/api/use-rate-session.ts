import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { SessionRating } from '@/api-types'
import { api } from '@/lib/api-client'
import { dashboardKeys } from '@/features/dashboard/api/dashboard-keys'
import { reportsKeys } from './reports-keys'

type RateSessionInput = { rating: number; comment: string | null; markedInvalid: boolean }

/** Avaliação humana do estúdio; a alteração atualiza o detalhe e os relatórios. */
export function useRateSession(testId: string, sessionId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: RateSessionInput) =>
      api.post<SessionRating>(`/sessions/${encodeURIComponent(sessionId)}/rate`, input),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: reportsKeys.sessionDetail(testId, sessionId) }),
        queryClient.invalidateQueries({ queryKey: reportsKeys.byTest(testId) }),
        queryClient.invalidateQueries({ queryKey: dashboardKeys.studio() }),
        queryClient.invalidateQueries({ queryKey: dashboardKeys.benchmark() }),
      ]),
  })
}
