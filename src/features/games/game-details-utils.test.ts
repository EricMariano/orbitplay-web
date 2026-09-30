import { describe, expect, it } from 'vitest'
import { ApiError } from '@/lib/api-client'
import {
  gameDetailsErrorMessage,
  isGameId,
  remainingTime,
  testProgress,
} from './game-details-utils'

describe('game details contract boundaries', () => {
  it('rejects route placeholders before requesting a game', () => {
    expect(isGameId('$gameId')).toBe(false)
    expect(isGameId('%24gameId')).toBe(false)
    expect(isGameId('01920000-0000-7000-8000-0000000000d1')).toBe(true)
  })

  it('does not invent partial progress for running or downloading tests', () => {
    expect(testProgress({ cta: 'continue' })).toBeNull()
    expect(testProgress({ cta: 'downloading' })).toBeNull()
    expect(testProgress({ cta: 'unavailable' })).toBeNull()
    expect(testProgress({ cta: 'start' })).toBe(0)
    expect(testProgress({ cta: 'completed' })).toBe(100)
    expect(testProgress({ cta: 'in_review' })).toBe(100)
  })

  it('handles elapsed, missing and invalid deadlines', () => {
    const now = Date.parse('2026-09-14T12:00:00Z')
    expect(remainingTime('2026-09-14T13:02:03Z', now)).toBe('1h 2m 3s')
    expect(remainingTime('2026-09-14T12:00:00Z', now)).toBe('Expirado')
    expect(remainingTime(undefined, now)).toBe('Sem prazo')
    expect(remainingTime('invalid', now)).toBe('Não informado')
  })

  it('does not expose internal error messages', () => {
    for (const status of [403, 404, 409, 429, 500]) {
      const error = new ApiError(status, { message: 'Cannot GET /private/internal' }, '')
      expect(gameDetailsErrorMessage(error)).not.toContain('/private/internal')
    }
  })
})
