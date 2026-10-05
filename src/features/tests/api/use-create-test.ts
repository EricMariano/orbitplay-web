import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateTestRequest, Test } from '@/api-types'
import { api } from '@/lib/api-client'
import { gamesKeys } from '@/features/games/api/games-keys'
import { testsKeys } from './tests-keys'

/** Cria o rascunho de um teste no jogo (`POST /games/{gameId}/tests`, wizard passo 1). */
export function useCreateTest(gameId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateTestRequest) =>
      api.post<Test>(`/games/${gameId}/tests`, payload, { idempotent: true }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: testsKeys.byGame(gameId) })
      // testsTotal/testsActive do card vêm de GET /games.
      void queryClient.invalidateQueries({ queryKey: gamesKeys.list() })
    },
  })
}
