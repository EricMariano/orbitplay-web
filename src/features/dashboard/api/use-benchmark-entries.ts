import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { dashboardKeys } from './dashboard-keys'
import type { BenchmarkEntry } from '../types'

export function useBenchmarkEntries() {
  return useQuery({
    queryKey: dashboardKeys.benchmark(),
    queryFn: () => api.get<BenchmarkEntry[]>('/studio/benchmark'),
    initialData: [
      {
        id: '1',
        gameTitle: 'Mombo Quest',
        progressPercent: 57,
        priceDeltaCents: 55,
        status: 'continue',
      },
      {
        id: '2',
        gameTitle: '171',
        progressPercent: 100,
        priceDeltaCents: 55,
        status: 'complete',
      },
      {
        id: '3',
        gameTitle: 'DragonFable',
        progressPercent: 21,
        priceDeltaCents: 55,
        status: 'continue',
      },
      {
        id: '4',
        gameTitle: 'Feelings',
        progressPercent: 0,
        priceDeltaCents: 55,
        status: 'start',
      },
      {
        id: '5',
        gameTitle: 'Feelings 2',
        progressPercent: 0,
        priceDeltaCents: 55,
        status: 'start',
      },
    ] satisfies BenchmarkEntry[],
  })
}
