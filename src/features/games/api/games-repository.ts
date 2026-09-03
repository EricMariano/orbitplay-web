import type { Game } from '@/api-types'
import { api } from '@/lib/api-client'

/**
 * Contract that `useGames`/`useGame` depend on — not the concrete `api`
 * client. Lets tests inject a fake repository instead of mocking fetch or
 * the module internals of `lib/api-client` (DIP), and keeps endpoint/path
 * knowledge in one place per feature (SRP) instead of scattered across hooks.
 */
export type GamesRepository = {
  list: () => Promise<Game[]>
  get: (id: string) => Promise<Game>
}

export const gamesRepository: GamesRepository = {
  list: () => api.get<Game[]>('/games'),
  get: (id) => api.get<Game>(`/games/${id}`),
}
