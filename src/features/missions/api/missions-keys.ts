/** Centralized query keys for the missions feature. */
export const missionsKeys = {
  all: ['missions'] as const,
  list: () => [...missionsKeys.all, 'list'] as const,
  rankings: () => [...missionsKeys.all, 'rankings'] as const,
}
