/** Centralized query keys for the player profile feature. */
export const playerKeys = {
  all: ['player'] as const,
  library: () => [...playerKeys.all, 'library'] as const,
  catalog: () => [...playerKeys.all, 'catalog'] as const,
  progress: () => [...playerKeys.all, 'progress'] as const,
  feed: (limit: number) => [...playerKeys.all, 'feed', { limit }] as const,
}
