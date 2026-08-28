import { useQuery } from '@tanstack/react-query'
import type { Game } from '@/api-types'
import { api } from '@/lib/api-client'
import { gamesKeys } from './games-keys'

/** Fetch a single game by id. */
export function useGame(id: string) {
  return useQuery({
    queryKey: gamesKeys.detail(id),
    queryFn: () => api.get<Game>(`/games/${id}`),
    enabled: Boolean(id),
  })
}
