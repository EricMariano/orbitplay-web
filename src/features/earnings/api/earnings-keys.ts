/** Centralized query keys for the earnings feature. */
export const earningsKeys = {
  all: ['earnings'] as const,
  summary: () => [...earningsKeys.all, 'summary'] as const,
}
