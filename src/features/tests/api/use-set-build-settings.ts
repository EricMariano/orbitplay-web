import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { BuildSettingsRequest, TestDetail } from '@/api-types'
import { api } from '@/lib/api-client'
import { testsKeys } from './tests-keys'

/** Grava "Jogável com controle" do rascunho (`PATCH /tests/{id}/build-settings`, wizard passo 3). */
export function useSetBuildSettings(testId: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: BuildSettingsRequest) =>
      api.patch<TestDetail>(`/tests/${encodeURIComponent(testId!)}/build-settings`, payload),
    onSuccess: (test) => {
      queryClient.setQueryData(testsKeys.detail(test.id), test)
    },
  })
}
