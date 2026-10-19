import { useQuery } from '@tanstack/react-query'
import type { TestDetail } from '@/api-types'
import { api } from '@/lib/api-client'
import { testsKeys } from './tests-keys'

const BUILD_POLL_MS = 3000

/**
 * Rascunho do teste com a build atual (`GET /tests/{id}`). Enquanto a build
 * está sendo validada pelo worker, consulta de novo a cada 3s.
 */
export function useTest(testId: string | null) {
  return useQuery({
    queryKey: testsKeys.detail(testId ?? ''),
    queryFn: () => api.get<TestDetail>(`/tests/${testId}`),
    enabled: Boolean(testId),
    refetchInterval: (query) => {
      const status = query.state.data?.build?.status
      return status === 'uploading' || status === 'processing' ? BUILD_POLL_MS : false
    },
  })
}
