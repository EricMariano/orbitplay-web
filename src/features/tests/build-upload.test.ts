import { describe, expect, it } from 'vitest'
import { formatBytes, platformFromFileName } from './build-upload'

describe('build upload', () => {
  it('infers the platform from unambiguous extensions', () => {
    expect(platformFromFileName('Nebula Drift.EXE')).toBe('windows')
    expect(platformFromFileName('nebula.pkg')).toBe('macos')
    expect(platformFromFileName('nebula-1.2.apk')).toBe('android')
  })

  it('asks the studio when the extension does not say the platform', () => {
    expect(platformFromFileName('nebula.zip')).toBeNull()
    expect(platformFromFileName('nebula')).toBeNull()
  })

  it('formats file sizes for the upload card', () => {
    expect(formatBytes(512)).toBe('512 B')
    expect(formatBytes(1536)).toBe('1,5 KB')
    expect(formatBytes(3 * 1024 ** 3)).toBe('3 GB')
  })
})
