import { describe, expect, it } from 'vitest'
import { formatDecimal, formatDuration, formatPercent } from './format'

describe('formatDuration', () => {
  it('formats minutes and zero-padded seconds', () => {
    expect(formatDuration(1_974_000)).toBe('32m 54s')
    expect(formatDuration(1_502_000)).toBe('25m 02s')
    expect(formatDuration(0)).toBe('0m 00s')
  })

  it('switches to hours and minutes from one hour on', () => {
    expect(formatDuration(3_900_000)).toBe('1h 05m')
  })
})

describe('formatDecimal / formatPercent', () => {
  it('uses the pt-BR decimal comma with one digit', () => {
    expect(formatDecimal(4.66)).toBe('4,7')
    expect(formatDecimal(9)).toBe('9,0')
  })

  it('rounds ratios to whole percentages', () => {
    expect(formatPercent(0.783)).toBe('78%')
    expect(formatPercent(0.1)).toBe('10%')
  })
})
