import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { gamesKeys } from './games-keys'

export function useRemoveGameCover(gameId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => api.delete<void>(`/games/${encodeURIComponent(gameId)}/assets/current/cover`),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: gamesKeys.list() })
      void queryClient.invalidateQueries({ queryKey: gamesKeys.detail(gameId) })
    },
  })
}
