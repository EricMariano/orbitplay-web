import { useQuery } from '@tanstack/react-query'
import { gamesKeys } from './games-keys'
import { gamesRepository, type GamesRepository } from './games-repository'

/**
 * List games. Returns no data until the real API is running (expected in setup).
 * Depends on the `GamesRepository` abstraction, defaulting to the real HTTP
 * implementation — tests can pass a fake instead (DIP).
 */
export function useGames(repository: GamesRepository = gamesRepository) {
  return useQuery({
    queryKey: gamesKeys.list(),
    queryFn: () => repository.list(),
  })
}
