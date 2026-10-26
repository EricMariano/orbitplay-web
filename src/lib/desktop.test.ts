import { detectPlatform } from '@/lib/desktop'

describe('detectPlatform', () => {
  it('reconhece desktop e ignora mobile', () => {
    expect(detectPlatform('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')).toBe('win')
    expect(detectPlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')).toBe('mac')
    expect(detectPlatform('Mozilla/5.0 (X11; Linux x86_64)')).toBe('linux')
    expect(detectPlatform('Mozilla/5.0 (Linux; Android 14; Pixel 8)')).toBeNull()
    expect(detectPlatform('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)')).toBeNull()
  })
})
