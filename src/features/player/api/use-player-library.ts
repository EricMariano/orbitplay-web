import { useQuery } from '@tanstack/react-query'
import type { FeedList, Game, ParticipationList, PlayerGame } from '@/api-types'
import { api, ApiError } from '@/lib/api-client'
import { useAuthStore } from '@/lib/auth'
import { playerKeys } from './player-keys'

/** Biblioteca pessoal: somente jogos com participação do jogador autenticado. */
export function usePlayerLibrary() {
  const userId = useAuthStore((state) => state.user?.id)
  return useQuery({
    queryKey: playerKeys.library(userId),
    enabled: Boolean(userId),
    queryFn: async ({ signal }) => {
      const gameIds = new Set<string>()
      const visited = new Set<string>()
      let cursor: string | null = null
      do {
        const params = new URLSearchParams({ limit: '100' })
        if (cursor) params.set('cursor', cursor)
        const page: ParticipationList = await api.get(`/player/participations?${params}`, {
          signal,
        })
        for (const participation of page.data) gameIds.add(participation.gameId)
        cursor = page.nextCursor
        if (cursor && visited.has(cursor)) throw new Error('Repeated pagination cursor')
        if (cursor) visited.add(cursor)
      } while (cursor)
      const games = await Promise.all(
        [...gameIds].map(async (id) => {
          try {
            const details = await api.get<PlayerGame>(`/player/games/${encodeURIComponent(id)}`, {
              signal,
            })
            return details.game
          } catch (error) {
            // Jogos removidos deixam de ser visíveis, sem esconder os demais.
            if (error instanceof ApiError && error.status === 404) return null
            throw error
          }
        }),
      )
      return games.filter((game): game is Game => game !== null)
    },
  })
}

/** Percorre o catálogo preservando o snapshot de ranking entre as páginas. */
export function usePlayerCatalog() {
  const userId = useAuthStore((state) => state.user?.id)
  return useQuery({
    queryKey: playerKeys.catalog(userId),
    enabled: Boolean(userId),
    queryFn: async ({ signal }) => {
      const games = new Map<string, Game>()
      const visited = new Set<string>()
      let cursor: string | null = null
      let seed: string | null = null
      do {
        const params = new URLSearchParams({ limit: '100' })
        if (cursor) params.set('cursor', cursor)
        if (seed) params.set('seed', seed)
        const page: FeedList = await api.get(`/player/feed?${params}`, { signal })
        for (const game of page.data) games.set(game.id, game)
        seed = page.seed
        cursor = page.nextCursor
        if (cursor && visited.has(cursor)) throw new Error('Repeated pagination cursor')
        if (cursor) visited.add(cursor)
      } while (cursor)
      return [...games.values()]
    },
  })
}
