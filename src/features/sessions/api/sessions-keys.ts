/** Centralized query keys for the sessions feature. */
export const sessionsKeys = {
  all: ['sessions'] as const,
  gameplay: (sessionId: string) => [...sessionsKeys.all, 'gameplay', sessionId] as const,
  summary: (sessionId: string) => [...sessionsKeys.all, 'summary', sessionId] as const,
  participationResult: (participationId: string) =>
    [...sessionsKeys.all, 'participation-result', participationId] as const,
}
