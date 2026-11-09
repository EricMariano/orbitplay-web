import { describe, expect, it } from 'vitest'
import { notificationHref } from './notification-link'

describe('notificationHref', () => {
  it.each([
    '/player/tests/01930000-0000-7000-8000-0000000000a1',
    '/studio/games?tab=all#testes',
    'https://orbitplay.example/novidades',
    'http://localhost:5173/player',
  ])('keeps the internal path or http(s) URL %s', (link) => {
    expect(notificationHref(link)).toBe(link)
  })

  it.each([
    'javascript:alert(document.cookie)',
    ' JavaScript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'mailto:time@orbitplay.example',
    '//evil.example/login',
    '/\\evil.example/login',
    '/\t/evil.example/login',
    'player/tests/relative',
    '',
    null,
  ])('drops %j', (link) => {
    expect(notificationHref(link)).toBeNull()
  })
})
