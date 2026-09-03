import { describe, expect, it } from 'vitest'
import { getInitials } from './initials'

describe('getInitials', () => {
  it('takes the first letter of up to two words', () => {
    expect(getInitials('Racha de Rua')).toBe('RD')
  })

  it('uppercases a single-word title', () => {
    expect(getInitials('azure')).toBe('A')
  })
})
