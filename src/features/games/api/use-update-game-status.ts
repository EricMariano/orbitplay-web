import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Game, GameStatus, UpdateGameRequest } from '@/api-types'
import { api } from '@/lib/api-client'
import { gamesKeys } from './games-keys'
import { dashboardKeys } from '@/features/dashboard/api/dashboard-keys'

/**
 * Muda o status do jogo (`PATCH /games/{id}`). Todo jogo nasce `draft`, e o
 * feed do jogador só lista jogos `active`: sem ativar, o jogo nunca chega a ele.
 */
export function useUpdateGameStatus(gameId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (status: GameStatus) => {
      const payload: UpdateGameRequest = { status }
      return api.patch<Game>(`/games/${encodeURIComponent(gameId)}`, payload)
    },
    onSuccess: () =>
      Promise.all([
        // O resumo fica sob `gamesKeys.detail`, então é invalidado junto.
        queryClient.invalidateQueries({ queryKey: gamesKeys.detail(gameId) }),
        queryClient.invalidateQueries({ queryKey: gamesKeys.list() }),
        queryClient.invalidateQueries({ queryKey: dashboardKeys.studio() }),
        queryClient.invalidateQueries({ queryKey: dashboardKeys.benchmark() }),
      ]),
  })
}
