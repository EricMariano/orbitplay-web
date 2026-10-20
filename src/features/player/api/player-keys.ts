/** Centralized query keys for the player profile feature. */
export const playerKeys = {
  all: ['player'] as const,
  library: (userId?: string) =>
    [...playerKeys.all, 'library', ...(userId ? [userId] : [])] as const,
  catalog: (userId?: string) =>
    [...playerKeys.all, 'catalog', ...(userId ? [userId] : [])] as const,
  progress: () => [...playerKeys.all, 'progress'] as const,
  feed: (limit: number) => [...playerKeys.all, 'feed', { limit }] as const,
}
