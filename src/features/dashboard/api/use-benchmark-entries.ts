import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { dashboardKeys } from './dashboard-keys'
import type { BenchmarkEntry } from '../types'

export function useBenchmarkEntries() {
  return useQuery({
    queryKey: dashboardKeys.benchmark(),
    queryFn: () => api.get<BenchmarkEntry[]>('/studio/benchmark'),
  })
}
