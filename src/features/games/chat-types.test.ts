import { describe, expect, it } from 'vitest'
import { chronologicalMessages, type ChatMessage } from './chat-types'

function message(id: string, status: ChatMessage['status'] = 'visible'): ChatMessage {
  return {
    id,
    channelId: 'channel',
    authorUserId: 'user',
    authorDisplayName: 'User',
    body: id,
    status,
    createdAt: '2026-09-30T12:00:00.000Z',
  }
}

describe('chronologicalMessages', () => {
  it('reverses newest-first pages, removes overlaps and hides moderated messages', () => {
    const result = chronologicalMessages([
      { data: [message('new'), message('middle')], nextCursor: 'older' },
      { data: [message('middle'), message('hidden', 'hidden'), message('old')], nextCursor: null },
    ])
    expect(result.map(({ id }) => id)).toEqual(['old', 'middle', 'new'])
  })
})
