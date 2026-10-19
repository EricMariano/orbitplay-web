import { useQuery } from '@tanstack/react-query'
import type { DashboardBlock } from '@/api-types'
import { api } from '@/lib/api-client'
import { dashboardKeys } from './dashboard-keys'

/** Bloco "Benchmark de mercado" (Tela 02). Hoje a API sempre responde `unavailable`. */
export function useStudioBenchmark() {
  return useQuery({
    queryKey: dashboardKeys.benchmark(),
    queryFn: () => api.get<DashboardBlock>('/studio/benchmark'),
  })
}
