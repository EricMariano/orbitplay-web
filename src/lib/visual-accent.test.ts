import { describe, expect, it } from 'vitest'
import { getVisualAccent } from './visual-accent'

describe('getVisualAccent', () => {
  it('is deterministic for the same seed', () => {
    expect(getVisualAccent('game-1')).toEqual(getVisualAccent('game-1'))
  })

  it('varies across different seeds', () => {
    expect(getVisualAccent('game-1')).not.toEqual(getVisualAccent('game-2'))
  })
})
