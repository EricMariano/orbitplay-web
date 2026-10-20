import { useQuery } from '@tanstack/react-query'
import type { GameAccessList } from '@/api-types'
import { api } from '@/lib/api-client'
import { accessKeys } from './access-keys'

/** Matriz de permissões de um jogo (`GET /games/{id}/access`). */
export function useGameAccess(gameId: string | null) {
  return useQuery({
    queryKey: accessKeys.game(gameId ?? ''),
    enabled: gameId !== null,
    queryFn: async ({ signal }) => {
      const list: GameAccessList = await api.get(`/games/${gameId}/access`, { signal })
      return list.data
    },
  })
}
