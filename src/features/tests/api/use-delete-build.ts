import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { testsKeys } from './tests-keys'

/** Remove a build do rascunho para o estúdio enviar outra (`DELETE /tests/{id}/build`). */
export function useDeleteBuild(testId: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => api.delete<void>(`/tests/${encodeURIComponent(testId!)}/build`),
    onSettled: () => {
      if (testId) void queryClient.invalidateQueries({ queryKey: testsKeys.detail(testId) })
    },
  })
}
