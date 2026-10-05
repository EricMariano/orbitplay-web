export const sessionsKeys = {
  participationResult: (participationId: string) =>
    ['sessions', 'participation-result', participationId] as const,
}
