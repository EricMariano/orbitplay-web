import { useMutation, useQuery } from '@tanstack/react-query'
import type { ReportExport, ReportExportRequest } from '@/api-types'
import { api } from '@/lib/api-client'
import { reportsKeys } from './reports-keys'

export function useCreateReportExport(testId: string) {
  return useMutation({
    mutationFn: (payload: ReportExportRequest) =>
      api.post<ReportExport>(`/tests/${encodeURIComponent(testId)}/report/exports`, payload),
  })
}

export function useReportExport(testId: string, exportId: string | null) {
  return useQuery({
    queryKey: [...reportsKeys.byTest(testId), 'export', exportId],
    enabled: Boolean(testId && exportId),
    queryFn: () =>
      api.get<ReportExport>(
        `/tests/${encodeURIComponent(testId)}/report/exports/${encodeURIComponent(exportId!)}`,
      ),
    refetchInterval: (query) => (query.state.data?.status === 'processing' ? 3_000 : false),
  })
}
