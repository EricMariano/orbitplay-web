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
      activeTestsCount: 5,
      activeTestersCount: 124,
      testsPerHour: 24.3,
      funFactorScore: 5,
      bugsAndGlitchesCount: 124,
      retentionRate: 0.71,
      telemetryActivePointsCount: 15,
      telemetryTriggersCount: 566,
    },
  })
}
