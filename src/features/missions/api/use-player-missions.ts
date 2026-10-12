import { useQuery } from '@tanstack/react-query'
import type { PlayerMissionList } from '@/api-types'
import { api } from '@/lib/api-client'
import { missionsKeys } from './missions-keys'

/** Missões ativas do jogador (`GET /player/missions`). `progress` é uma fração 0–1. */
export function usePlayerMissions() {
  return useQuery({
    queryKey: missionsKeys.list(),
    queryFn: () => api.get<PlayerMissionList>('/player/missions'),
    select: (list) => list.data,
  })
}
