import { useQuery } from '@tanstack/react-query'
import type { HighlightedGame } from '@/api-types'
import { api } from '@/lib/api-client'
import { gamesKeys } from './games-keys'

/** List games highlighted for the current player. */
export function useHighlightedGames() {
  return useQuery({
    queryKey: gamesKeys.highlighted(),
    queryFn: () => api.get<HighlightedGame[]>('/games/highlighted'),
  })
}
