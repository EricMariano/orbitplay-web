import { useMutation } from '@tanstack/react-query'
import type { PutTestFormRequest, TestForm } from '@/api-types'
import { api } from '@/lib/api-client'

/**
 * Salva o formulário de avaliação inteiro (`PUT /tests/{id}/form`, wizard
 * passo 2). A API substitui o conjunto de perguntas e avança o rascunho para
 * a etapa de build.
 */
export function useSaveTestForm(testId: string | null) {
  return useMutation({
    mutationFn: (payload: PutTestFormRequest) => {
      if (!testId) throw new Error('Crie o rascunho do teste antes de salvar o formulário.')
      return api.put<TestForm>(`/tests/${testId}/form`, payload)
    },
  })
}
