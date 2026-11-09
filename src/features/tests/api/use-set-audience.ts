import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AudienceRequest, TestDetail } from '@/api-types'
import { api } from '@/lib/api-client'
import { testsKeys } from './tests-keys'

/** Grava público, quantidade e duração do rascunho (`PATCH /tests/{id}/audience`, wizard passo 4). */
export function useSetAudience(testId: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AudienceRequest) =>
      api.patch<TestDetail>(`/tests/${encodeURIComponent(testId!)}/audience`, payload),
    onSuccess: (test) => {
      queryClient.setQueryData(testsKeys.detail(test.id), test)
    },
  })
}
