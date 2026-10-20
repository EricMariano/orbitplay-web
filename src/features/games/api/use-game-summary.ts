import { useQuery } from '@tanstack/react-query'
import type { GameSummary } from '@/api-types'
import { api } from '@/lib/api-client'
import { gamesKeys } from './games-keys'

/** Resumo restrito à organização, incluindo a permissão de edição do backend. */
export function useGameSummary(gameId: string) {
  return useQuery({
    queryKey: gamesKeys.summary(gameId),
    queryFn: ({ signal }) =>
      api.get<GameSummary>(`/games/${encodeURIComponent(gameId)}/summary`, { signal }),
    enabled: Boolean(gameId),
  })
}
