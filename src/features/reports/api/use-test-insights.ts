import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { InsightCategory, TestInsights } from '@/api-types'
import { api } from '@/lib/api-client'
import { reportsKeys } from './reports-keys'

type UseTestInsightsParams = {
  testId: string
  /** Busca textual — filtrada no servidor. */
  q: string
  category: InsightCategory | null
}

/** Insights de IA do teste (`GET /tests/{id}/insights?q=&category=`). */
export function useTestInsights({ testId, q, category }: UseTestInsightsParams) {
  return useQuery({
    queryKey: reportsKeys.insights(testId, q, category),
    queryFn: () => {
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      if (category) params.set('category', category)
      const query = params.toString()
      return api.get<TestInsights>(
        `/tests/${encodeURIComponent(testId)}/insights${query ? `?${query}` : ''}`,
      )
    },
    enabled: Boolean(testId),
    placeholderData: keepPreviousData,
  })
}
