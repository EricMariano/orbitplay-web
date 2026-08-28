import { describe, expect, it } from 'vitest'
import { gamesKeys } from './games-keys'

describe('gamesKeys', () => {
  it('namespaces list and detail keys under "games"', () => {
    expect(gamesKeys.list()).toEqual(['games', 'list'])
    expect(gamesKeys.detail('abc')).toEqual(['games', 'detail', 'abc'])
  })
})
