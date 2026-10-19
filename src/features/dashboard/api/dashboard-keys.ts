export const dashboardKeys = {
  all: ['dashboard'] as const,
  studio: () => [...dashboardKeys.all, 'studio'] as const,
  benchmark: () => [...dashboardKeys.all, 'benchmark'] as const,
}
