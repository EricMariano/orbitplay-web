import { useQuery } from '@tanstack/react-query'
import type { PlayerHome } from '@/api-types'
import { api } from '@/lib/api-client'
import { playerKeys } from './player-keys'

/** Tela 13: resumo pessoal composto somente por participações e sessões do jogador autenticado. */
export function usePlayerHome() {
  return useQuery({
    queryKey: playerKeys.home(),
    queryFn: () => api.get<PlayerHome>('/player/home'),
  })
}
