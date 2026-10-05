import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateGameRequest, Game } from '@/api-types'
import { api } from '@/lib/api-client'
import { gamesKeys } from './games-keys'

/** Cadastra um jogo na organização do token (`POST /games`). */
export function useCreateGame() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateGameRequest) => api.post<Game>('/games', payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: gamesKeys.list() }),
  })
}
