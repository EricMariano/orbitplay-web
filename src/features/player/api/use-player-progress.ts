import { useQuery } from '@tanstack/react-query'
import type { PlayerProgress } from '@/api-types'
import { api } from '@/lib/api-client'
import { playerKeys } from './player-keys'

/** Nível, XP, qualidade de feedback, conquistas e horas do jogador (`GET /player/progress`). */
export function usePlayerProgress() {
  return useQuery({
    queryKey: playerKeys.progress(),
    queryFn: () => api.get<PlayerProgress>('/player/progress'),
  })
}
