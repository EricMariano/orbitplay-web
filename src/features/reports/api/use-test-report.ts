import { useQuery } from '@tanstack/react-query'
import type { TestReport } from '@/api-types'
import { api } from '@/lib/api-client'
import { reportsKeys } from './reports-keys'

/** Fetch the report for a test run. */
export function useTestReport(testId: string) {
  return useQuery({
    queryKey: reportsKeys.byTest(testId),
    queryFn: () => api.get<TestReport>(`/tests/${testId}/report`),
    enabled: Boolean(testId),
  })
}
