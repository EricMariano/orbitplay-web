import { useQuery } from '@tanstack/react-query'
import type { Game, GameList } from '@/api-types'
import { api } from '@/lib/api-client'
import { gamesKeys } from './games-keys'

// O OpenAPI gerado tipa `nextCursor` como string[], mas a API devolve
// `string | null` (GameListDto no orbitplay-api). Corrigir no contrato.
type GamePage = Omit<GameList, 'nextCursor'> & { nextCursor: string | null }

/** Jogos da organização (`GET /games`), percorrendo todas as páginas do cursor. */
export function useGames() {
  return useQuery({
    queryKey: gamesKeys.list(),
    queryFn: async ({ signal }) => {
      const games: Game[] = []
      const visited = new Set<string>()
      let cursor: string | null = null
      do {
        const params = new URLSearchParams({ limit: '100' })
        if (cursor) params.set('cursor', cursor)
        const page: GamePage = await api.get(`/games?${params}`, { signal })
        games.push(...page.data)
        cursor = page.nextCursor
        if (cursor && visited.has(cursor)) throw new Error('Repeated pagination cursor')
        if (cursor) visited.add(cursor)
      } while (cursor)
      return games
    },
  })
}
