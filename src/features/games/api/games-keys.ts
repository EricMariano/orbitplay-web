/** Centralized query keys for the games feature. */
export const gamesKeys = {
  all: ['games'] as const,
  list: () => [...gamesKeys.all, 'list'] as const,
  detail: (id: string) => [...gamesKeys.all, 'detail', id] as const,
  highlighted: () => [...gamesKeys.all, 'highlighted'] as const,
  playerDetail: (id: string) => [...gamesKeys.all, 'player-detail', id] as const,
  playerTests: (id: string) => [...gamesKeys.all, 'player-tests', id] as const,
  achievements: (id: string) => [...gamesKeys.all, 'achievements', id] as const,
  community: (id: string) => [...gamesKeys.all, 'community', id] as const,
  reviews: (id: string) => [...gamesKeys.all, 'reviews', id] as const,
  specs: (id: string) => [...gamesKeys.all, 'specs', id] as const,
}
