import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { SetTestModelRequest, Test } from '@/api-types'
import { api } from '@/lib/api-client'
import { testsKeys } from './tests-keys'

/** Troca o modelo de um rascunho já criado (`PATCH /tests/{id}/model`, wizard passo 1). */
export function useSetTestModel(gameId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ testId, ...payload }: SetTestModelRequest & { testId: string }) =>
      api.patch<Test>(`/tests/${encodeURIComponent(testId)}/model`, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: testsKeys.byGame(gameId) })
    },
  })
}
