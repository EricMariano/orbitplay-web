/** Centralized query keys for the sessions feature. */
export const sessionsKeys = {
  all: ['sessions'] as const,
  summary: (sessionId: string) => [...sessionsKeys.all, 'summary', sessionId] as const,
}
