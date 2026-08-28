/** Centralized query keys for the games feature. */
export const gamesKeys = {
  all: ['games'] as const,
  list: () => [...gamesKeys.all, 'list'] as const,
  detail: (id: string) => [...gamesKeys.all, 'detail', id] as const,
}
