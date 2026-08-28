/** Centralized query keys for the reports feature. */
export const reportsKeys = {
  all: ['reports'] as const,
  byTest: (testId: string) => [...reportsKeys.all, 'test', testId] as const,
}
