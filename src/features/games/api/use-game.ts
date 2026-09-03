import { useQuery } from '@tanstack/react-query'
import { gamesKeys } from './games-keys'
import { gamesRepository, type GamesRepository } from './games-repository'

/** Fetch a single game by id. */
export function useGame(id: string, repository: GamesRepository = gamesRepository) {
  return useQuery({
    queryKey: gamesKeys.detail(id),
    queryFn: () => repository.get(id),
    enabled: Boolean(id),
  })
}
