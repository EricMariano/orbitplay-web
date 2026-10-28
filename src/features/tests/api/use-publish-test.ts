import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { TestDetail } from '@/api-types'
import { api } from '@/lib/api-client'
import { gamesKeys } from '@/features/games/api/games-keys'
import { testsKeys } from './tests-keys'
import { dashboardKeys } from '@/features/dashboard/api/dashboard-keys'

/**
 * Publica o rascunho (`POST /tests/{id}/publish`). A mesma `Idempotency-Key`
 * por rascunho faz um reenvio (duplo clique, rede caindo) não publicar duas
 * vezes (Tela 10 RN-02).
 */
export function usePublishTest(gameId: string, testId: string | null, idempotencyKey: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      api.post<TestDetail>(`/tests/${encodeURIComponent(testId!)}/publish`, undefined, {
        headers: { 'Idempotency-Key': idempotencyKey },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: testsKeys.byGame(gameId) })
      void queryClient.invalidateQueries({ queryKey: gamesKeys.list() })
      void queryClient.invalidateQueries({ queryKey: gamesKeys.detail(gameId) })
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.studio() })
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.benchmark() })
    },
  })
}
