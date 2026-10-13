import { useQuery } from '@tanstack/react-query'
import type { TestReport } from '@/api-types'
import { api } from '@/lib/api-client'
import { reportsKeys } from './reports-keys'

const PROCESSING_POLL_MS = 5000

/**
 * Blocos do relatório do teste (`GET /tests/{id}/report`). Cada bloco tem o
 * próprio `status`; enquanto algum está `processing`, consulta de novo.
 */
export function useTestReport(testId: string) {
  return useQuery({
    queryKey: reportsKeys.byTest(testId),
    queryFn: () => api.get<TestReport>(`/tests/${encodeURIComponent(testId)}/report`),
    enabled: Boolean(testId),
    refetchInterval: (query) =>
      query.state.data?.blocks.some((block) => block.status === 'processing')
        ? PROCESSING_POLL_MS
        : false,
  })
}
