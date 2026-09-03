import { useQuery } from '@tanstack/react-query'
import type { MissionsRanking } from '@/api-types'
import { api } from '@/lib/api-client'
import { missionsKeys } from './missions-keys'

/** Get the current player's missions and ranking overview. */
export function useMissionsRanking() {
  return useQuery({
    queryKey: missionsKeys.ranking(),
    queryFn: () => api.get<MissionsRanking>('/missions/ranking'),
  })
}
