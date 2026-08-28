import { useQuery } from '@tanstack/react-query'
import type { Game } from '@/api-types'
import { api } from '@/lib/api-client'
import { gamesKeys } from './games-keys'

/** List games. Returns no data until the real API is running (expected in setup). */
export function useGames() {
  return useQuery({
    queryKey: gamesKeys.list(),
    queryFn: () => api.get<Game[]>('/games'),
  })
}
