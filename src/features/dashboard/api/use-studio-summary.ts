import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { dashboardKeys } from './dashboard-keys'
import type { StudioSummary } from '../types'

export function useStudioSummary() {
  return useQuery({
    queryKey: dashboardKeys.studioSummary(),
    queryFn: () => api.get<StudioSummary>('/studio/summary'),
  })
}
