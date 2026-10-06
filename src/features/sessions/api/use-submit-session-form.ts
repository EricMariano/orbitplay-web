import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { FormResponse } from '@/api-types'
import { api } from '@/lib/api-client'
import { toFormResponseRequest, type Answers } from '../session-summary'
import { sessionsKeys } from './sessions-keys'

type SubmitVariables = {
  values: Answers
  /** Reusada entre tentativas do mesmo rascunho, para o retry não duplicar o envio. */
  idempotencyKey: string
}

/** Envia a avaliação da sessão (`POST /sessions/{id}/form-response`). */
export function useSubmitSessionForm(sessionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ values, idempotencyKey }: SubmitVariables) =>
      api.post<FormResponse>(
        `/sessions/${encodeURIComponent(sessionId)}/form-response`,
        toFormResponseRequest(values),
        { headers: { 'Idempotency-Key': idempotencyKey } },
      ),
    onSettled: () => queryClient.invalidateQueries({ queryKey: sessionsKeys.summary(sessionId) }),
  })
}
