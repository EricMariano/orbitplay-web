import { useQuery } from '@tanstack/react-query'
import type { GameList } from '@/api-types'
import { api } from '@/lib/api-client'
import { gamesKeys } from './games-keys'

/** Jogos da organização (`GET /games`, primeira página do cursor). */
export function useGames() {
  return useQuery({
    queryKey: gamesKeys.list(),
    queryFn: () => api.get<GameList>('/games'),
    select: (page) => page.data,
  })
}
