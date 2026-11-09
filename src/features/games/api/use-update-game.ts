import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Game, UpdateGameRequest } from '@/api-types'
import { api } from '@/lib/api-client'
import { gamesKeys } from './games-keys'
import { dashboardKeys } from '@/features/dashboard/api/dashboard-keys'

export function useUpdateGame(gameId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateGameRequest) =>
      api.patch<Game>(`/games/${encodeURIComponent(gameId)}`, payload),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: gamesKeys.list() }),
        queryClient.invalidateQueries({ queryKey: gamesKeys.detail(gameId) }),
        queryClient.invalidateQueries({ queryKey: dashboardKeys.studio() }),
      ]),
  })
}
