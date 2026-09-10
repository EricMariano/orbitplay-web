import { useQuery } from '@tanstack/react-query'
import type { PlayerStats } from '@/api-types'
import { api } from '@/lib/api-client'
import { playerKeys } from './player-keys'

/** Get the current player's profile stats (level, feedback quality, achievements, hours played). */
export function usePlayerStats() {
  return useQuery({
    queryKey: playerKeys.profileStats(),
    queryFn: () => api.get<PlayerStats>('/player/profile-stats'),
  })
}
