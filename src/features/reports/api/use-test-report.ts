import { useQuery } from '@tanstack/react-query'
import { reportsKeys } from './reports-keys'
import { reportsRepository, type ReportsRepository } from './reports-repository'

/** Fetch the report for a test run. */
export function useTestReport(testId: string, repository: ReportsRepository = reportsRepository) {
  return useQuery({
    queryKey: reportsKeys.byTest(testId),
    queryFn: () => repository.byTest(testId),
    enabled: Boolean(testId),
  })
}
