import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { GameAccessList, SetGameAccessRequest } from '@/api-types'
import { api } from '@/lib/api-client'
import { accessKeys } from './access-keys'

/** Substitui a matriz de permissões do jogo (`PUT /games/{id}/access`). */
export function useSetGameAccess() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ gameId, ...payload }: SetGameAccessRequest & { gameId: string }) =>
      api.put<GameAccessList>(`/games/${encodeURIComponent(gameId)}/access`, payload),
    onSuccess: (_data, { gameId }) => {
      void queryClient.invalidateQueries({ queryKey: accessKeys.game(gameId) })
    },
  })
}
