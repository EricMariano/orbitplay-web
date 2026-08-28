/** Centralized query keys for the opportunities feature. */
export const opportunitiesKeys = {
  all: ['opportunities'] as const,
  list: () => [...opportunitiesKeys.all, 'list'] as const,
}
