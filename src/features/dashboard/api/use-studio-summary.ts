import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { dashboardKeys } from './dashboard-keys'
import type { StudioSummary } from '../types'

export function useStudioSummary() {
  return useQuery({
    queryKey: dashboardKeys.studioSummary(),
    queryFn: () => api.get<StudioSummary>('/studio/summary'),
    // REMOVER — só pra testar o visual sem backend
    initialData: {
      gamesTestedCount: 2,
      testsCompletedCount: 45,
      gameplayHoursTested: 62,
      averageTestScore: 8.4,
      averageEngagementRate: 0.78,
      aiInsightsGeneratedCount: 124,
      testsWithActivePluginCount: 29,
    },
  })
}
