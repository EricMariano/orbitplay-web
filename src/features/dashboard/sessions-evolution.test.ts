import { describe, expect, it } from 'vitest'
import type { DashboardBlock } from '@/api-types'
import { sessionsEvolutionPoints } from './sessions-evolution'

const block = (overrides: Partial<DashboardBlock>): DashboardBlock => ({
  key: 'sessions_evolution',
  status: 'ready',
  payload: { points: [{ date: '2026-10-01', sessions: 3 }] },
  computedAt: '2026-10-12T00:00:00.000Z',
  ...overrides,
})

describe('sessionsEvolutionPoints', () => {
  it('returns the points of a ready block', () => {
    expect(sessionsEvolutionPoints(block({}))).toEqual([{ date: '2026-10-01', sessions: 3 }])
  })

  it('returns null while the block is not ready', () => {
    expect(sessionsEvolutionPoints(block({ status: 'processing', payload: null }))).toBeNull()
    expect(sessionsEvolutionPoints(block({ status: 'failed', payload: null }))).toBeNull()
  })

  it('returns null for an unexpected payload shape', () => {
    expect(sessionsEvolutionPoints(block({ payload: { points: [{ day: 1 }] } }))).toBeNull()
    expect(sessionsEvolutionPoints(block({ payload: {} }))).toBeNull()
  })

  it('returns null for a block with another key', () => {
    expect(sessionsEvolutionPoints(block({ key: 'benchmark' }))).toBeNull()
  })
})
