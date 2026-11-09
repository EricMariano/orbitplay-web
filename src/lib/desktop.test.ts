import { detectPlatform, getDesktopDownloads } from '@/lib/desktop'

const WIN = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
const MAC = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
const LINUX = 'Mozilla/5.0 (X11; Linux x86_64)'
const ANDROID = 'Mozilla/5.0 (Linux; Android 14; Pixel 8)'
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'

const URLS = { win: '/w.exe', mac: '/m.dmg', linux: '/l.AppImage' }

describe('detectPlatform', () => {
  it('reconhece desktop e ignora mobile', () => {
    expect(detectPlatform(WIN)).toBe('win')
    expect(detectPlatform(MAC)).toBe('mac')
    expect(detectPlatform(LINUX)).toBe('linux')
    expect(detectPlatform(ANDROID)).toBeNull()
    expect(detectPlatform(IPHONE)).toBeNull()
  })
})

describe('getDesktopDownloads', () => {
  it('lista as três plataformas com a do visitante primeiro', () => {
    expect(getDesktopDownloads(MAC, URLS).map((d) => d.platform)).toEqual(['mac', 'win', 'linux'])
    expect(getDesktopDownloads(LINUX, URLS).map((d) => d.platform)).toEqual(['linux', 'win', 'mac'])
    expect(getDesktopDownloads(WIN, URLS)[0]).toMatchObject({ platform: 'win', current: true })
  })

  it('omite plataformas sem link', () => {
    const urls = { win: '/w.exe', mac: undefined, linux: '' }
    expect(getDesktopDownloads(WIN, urls).map((d) => d.platform)).toEqual(['win'])
    expect(getDesktopDownloads(WIN, { win: undefined, mac: undefined, linux: undefined })).toEqual(
      [],
    )
  })

  it('não oferece no celular nem dentro do app desktop', () => {
    expect(getDesktopDownloads(ANDROID, URLS)).toEqual([])
    expect(getDesktopDownloads(IPHONE, URLS)).toEqual([])
    window.desktop = { isDesktop: true, platform: 'win32' }
    try {
      expect(getDesktopDownloads(WIN, URLS)).toEqual([])
    } finally {
      delete window.desktop
    }
  })
})
