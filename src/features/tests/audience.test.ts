import { describe, expect, it } from 'vitest'
import {
  computeBudget,
  createAudienceDraft,
  isAudienceValid,
  toAudienceRequest,
  toggleLocation,
  type AudienceDraft,
} from './audience'

const draft = (overrides: Partial<AudienceDraft> = {}): AudienceDraft => ({
  ...createAudienceDraft(),
  locations: ['BR'],
  ...overrides,
})

describe('audience step', () => {
  it('treats Global as exclusive with the countries', () => {
    expect(toggleLocation(['BR'], 'US')).toEqual(['BR', 'US'])
    expect(toggleLocation(['BR', 'US'], 'GLOBAL')).toEqual(['GLOBAL'])
    expect(toggleLocation(['GLOBAL'], 'BR')).toEqual(['BR'])
    expect(toggleLocation(['BR'], 'BR')).toEqual([])
  })

  it('requires a location and a duration between 1 and 365 days', () => {
    expect(isAudienceValid(draft({ locations: [] }))).toBe(false)
    expect(isAudienceValid(draft({ durationDays: 0 }))).toBe(false)
    expect(isAudienceValid(draft({ durationDays: 400 }))).toBe(false)
    expect(isAudienceValid(draft())).toBe(true)
  })

  it('matches the design budget: telemetry + experienced + boost × 750', () => {
    const budget = computeBudget(
      'free_exploration_telemetry',
      draft({ playerTier: 'experienced', boosted: true, quantity: 750 }),
    )
    expect(budget.perTestCents).toBe(94)
    expect(budget.totalCents).toBe(70500)
  })

  it('has no closed total while the test stays active until disabled', () => {
    expect(computeBudget('free_exploration', draft({ keepActive: true })).totalCents).toBeNull()
  })

  it('maps the draft to the audience request', () => {
    expect(
      toAudienceRequest(
        draft({ archetype: 'explorer', ageRange: [20, 99], playerTier: 'qa', boosted: true }),
      ),
    ).toEqual({
      locations: ['BR'],
      archetypes: ['explorer'],
      ageMin: 20,
      ageMax: 120,
      quantity: 100,
      durationDays: 30,
      keepActive: false,
      playerTier: 'qa',
      boosted: true,
    })
    expect(toAudienceRequest(draft()).archetypes).toEqual([])
  })
})
