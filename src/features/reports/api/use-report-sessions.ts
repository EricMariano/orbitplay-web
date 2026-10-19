import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { ReportSessionList } from '@/api-types'
import { api } from '@/lib/api-client'
import { reportsKeys } from './reports-keys'

type UseReportSessionsParams = {
  testId: string
  limit: number
  /** Cursor opaco da página; `null` = primeira página. */
  cursor: string | null
}

/** Sessões do teste, paginadas por cursor (`GET /tests/{id}/report/sessions`). */
export function useReportSessions({ testId, limit, cursor }: UseReportSessionsParams) {
  return useQuery({
    queryKey: reportsKeys.sessions(testId, limit, cursor),
    queryFn: () => {
      const params = new URLSearchParams({ limit: String(limit) })
      if (cursor) params.set('cursor', cursor)
      return api.get<ReportSessionList>(
        `/tests/${encodeURIComponent(testId)}/report/sessions?${params.toString()}`,
      )
    },
    enabled: Boolean(testId),
    placeholderData: keepPreviousData,
  })
}
