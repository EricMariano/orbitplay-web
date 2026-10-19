import { describe, expect, it } from 'vitest'
import type { TestReport } from '@/api-types'
import { archetypeView, findBlock, playerTierView } from './report-labels'

describe('findBlock', () => {
  const report: TestReport = {
    testId: 't1',
    blocks: [
      { key: 'telemetry', status: 'unavailable', payload: null, computedAt: null },
      {
        key: 'evolution',
        status: 'ready',
        payload: { points: [], weeks: [{ week: 1, startDate: '2026-01-01', sessions: 3 }] },
        computedAt: '2026-01-02T00:00:00.000Z',
      },
    ],
  }

  it('returns the block for the key, with its typed payload', () => {
    expect(findBlock(report, 'evolution')?.payload?.weeks[0]?.sessions).toBe(3)
    expect(findBlock(report, 'telemetry')?.status).toBe('unavailable')
  })

  it('returns undefined for a block the API did not send', () => {
    expect(findBlock(report, 'overview')).toBeUndefined()
  })
})

describe('profile labels', () => {
  it('reuses the audience vocabulary of the test wizard', () => {
    expect(archetypeView('achiever')).toEqual({ label: 'Conquistador', tone: 'teal' })
    expect(playerTierView('qa').label).toBe('QA Profissionais')
  })
})
