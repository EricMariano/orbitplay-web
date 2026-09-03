import type { TestReport } from '@/api-types'
import { api } from '@/lib/api-client'

/** Contract `useTestReport` depends on (DIP). */
export type ReportsRepository = {
  byTest: (testId: string) => Promise<TestReport>
}

export const reportsRepository: ReportsRepository = {
  byTest: (testId) => api.get<TestReport>(`/tests/${testId}/report`),
}
