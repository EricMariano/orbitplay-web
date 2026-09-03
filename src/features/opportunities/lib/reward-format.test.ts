import { describe, expect, it } from 'vitest'
import { formatReward } from './reward-format'

describe('formatReward', () => {
  it('groups digits using pt-BR formatting', () => {
    expect(formatReward(1500)).toBe('1.500')
  })
})
