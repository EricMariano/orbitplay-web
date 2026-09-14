/** Centralized query keys for the player profile feature. */
export const playerKeys = {
  all: ['player'] as const,
  profileStats: () => [...playerKeys.all, 'profile-stats'] as const,
}
