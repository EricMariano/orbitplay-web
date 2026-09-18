export const dashboardKeys = {
  all: ['dashboard'] as const,
  studioSummary: () => [...dashboardKeys.all, 'studio-summary'] as const,
  benchmark: () => [...dashboardKeys.all, 'benchmark'] as const,
}
