/** Centralized query keys for the missions feature. */
export const missionsKeys = {
  all: ['missions'] as const,
  ranking: () => [...missionsKeys.all, 'ranking'] as const,
}
