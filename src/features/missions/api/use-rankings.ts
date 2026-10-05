import { useQuery } from '@tanstack/react-query'
import type { RankingList } from '@/api-types'
import { api } from '@/lib/api-client'
import { missionsKeys } from './missions-keys'

/** Ranking global do mês (`GET /rankings`, defaults da API). */
export function useRankings() {
  return useQuery({
    queryKey: missionsKeys.rankings(),
    queryFn: () => api.get<RankingList>('/rankings'),
  })
}
