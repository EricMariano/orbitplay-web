import { useInfiniteQuery } from '@tanstack/react-query'
import type { StudioBenchmark } from '@/api-types'
import { api } from '@/lib/api-client'
import { dashboardKeys } from './dashboard-keys'

/** Comparativo paginado, restrito aos jogos da organização autenticada. */
export function useStudioBenchmark() {
  return useInfiniteQuery({
    queryKey: dashboardKeys.benchmarkPages(),
    initialPageParam: null as string | null,
    queryFn: ({ signal, pageParam }) => {
      const params = new URLSearchParams({ limit: '5' })
      if (pageParam) params.set('cursor', pageParam)
      return api.get<StudioBenchmark>(`/studio/benchmark?${params}`, { signal })
    },
    getNextPageParam: (page, _pages, cursor) => {
      const next = page.status === 'ready' ? page.payload?.nextCursor : null
      return next && next !== cursor ? next : undefined
    },
  })
}
