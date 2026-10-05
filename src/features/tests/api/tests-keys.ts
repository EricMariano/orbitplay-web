/** Centralized query keys for the tests feature. */
export const testsKeys = {
  all: ['tests'] as const,
  models: () => [...testsKeys.all, 'models'] as const,
  recent: (page: number, pageSize: number) =>
    [...testsKeys.all, 'recent', { page, pageSize }] as const,
  continue: () => [...testsKeys.all, 'continue'] as const,
  mine: () => [...testsKeys.all, 'mine'] as const,
  playerDetail: (testId: string) => [...testsKeys.all, 'player-detail', testId] as const,
  tutorial: (participationId: string) =>
    [...testsKeys.all, 'participation-tutorial', participationId] as const,
  buildCompatibility: (buildId: string) =>
    [...testsKeys.all, 'build-compatibility', buildId] as const,
  buildDownload: (buildId: string, localVersion?: string) =>
    [...testsKeys.all, 'build-download', buildId, localVersion] as const,
}
