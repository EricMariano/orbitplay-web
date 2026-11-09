import { describe, expect, it } from 'vitest'
import type { TestReport } from '@/api-types'
import { archetypeView, findBlock, formAnswerText, playerTierView } from './report-labels'

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

describe('formAnswerText', () => {
  const blank = {
    questionId: 'q1',
    prompt: 'Pergunta',
    type: 'scale',
    valueText: null,
    valueNumber: null,
    valueBoolean: null,
    optionLabels: [],
  }

  it('shows a zero rating and a "no" answer instead of "Não respondida"', () => {
    expect(formAnswerText({ ...blank, valueNumber: 0 })).toBe('0')
    expect(formAnswerText({ ...blank, valueBoolean: false })).toBe('Não')
  })

  it('shows text, numbers, yes and selected options as given', () => {
    expect(formAnswerText({ ...blank, valueText: 'A pista final.' })).toBe('A pista final.')
    expect(formAnswerText({ ...blank, valueNumber: 4 })).toBe('4')
    expect(formAnswerText({ ...blank, valueBoolean: true })).toBe('Sim')
    expect(formAnswerText({ ...blank, optionLabels: ['Fácil', 'Curto'] })).toBe('Fácil, Curto')
  })

  it('falls back to "Não respondida" only when no field has a value', () => {
    expect(formAnswerText(blank)).toBe('Não respondida')
    expect(formAnswerText({ ...blank, valueText: '   ' })).toBe('Não respondida')
  })
})
