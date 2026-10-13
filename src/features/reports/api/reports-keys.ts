import type { InsightCategory } from '@/api-types'

/** Centralized query keys for the reports feature. */
export const reportsKeys = {
  all: ['reports'] as const,
  byTest: (testId: string) => [...reportsKeys.all, 'test', testId] as const,
  sessions: (testId: string, limit: number, cursor: string | null) =>
    [...reportsKeys.byTest(testId), 'sessions', { limit, cursor }] as const,
  insights: (testId: string, q: string, category: InsightCategory | null) =>
    [...reportsKeys.byTest(testId), 'insights', { q, category }] as const,
}
