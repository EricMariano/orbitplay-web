/** Centralized query keys for the player profile feature. */
export const playerKeys = {
  all: ['player'] as const,
  progress: () => [...playerKeys.all, 'progress'] as const,
  feed: (limit: number) => [...playerKeys.all, 'feed', { limit }] as const,
}
