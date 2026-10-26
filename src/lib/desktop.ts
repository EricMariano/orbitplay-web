export type DesktopPlatform = 'win' | 'mac' | 'linux'

// Exposto pelo preload do Electron (electron/preload.cts). Fora do app desktop
// não existe.
declare global {
  interface Window {
    desktop?: { isDesktop: boolean; platform: string }
  }
  interface ImportMetaEnv {
    readonly VITE_DESKTOP_DOWNLOAD_WIN?: string
    readonly VITE_DESKTOP_DOWNLOAD_MAC?: string
    readonly VITE_DESKTOP_DOWNLOAD_LINUX?: string
  }
}

const LABELS: Record<DesktopPlatform, string> = {
  win: 'Windows',
  mac: 'macOS',
  linux: 'Linux',
}

const URLS: Record<DesktopPlatform, string | undefined> = {
  win: import.meta.env.VITE_DESKTOP_DOWNLOAD_WIN,
  mac: import.meta.env.VITE_DESKTOP_DOWNLOAD_MAC,
  linux: import.meta.env.VITE_DESKTOP_DOWNLOAD_LINUX,
}

/** true quando o front roda dentro do app desktop (Electron). */
export function isDesktopApp(): boolean {
  return typeof window !== 'undefined' && window.desktop?.isDesktop === true
}

export function detectPlatform(userAgent: string): DesktopPlatform | null {
  if (/Android|iPhone|iPad|iPod/i.test(userAgent)) return null
  if (/Windows/i.test(userAgent)) return 'win'
  if (/Macintosh|Mac OS X/i.test(userAgent)) return 'mac'
  if (/Linux|X11/i.test(userAgent)) return 'linux'
  return null
}

/**
 * Link de download do app desktop para o sistema do visitante, ou null quando
 * não há o que oferecer (já está no app, sistema não suportado ou link não
 * configurado). Os links vêm do .env — nada passa pela API nem pelo banco.
 */
export function getDesktopDownload(
  userAgent: string = typeof navigator === 'undefined' ? '' : navigator.userAgent,
): { label: string; url: string } | null {
  if (isDesktopApp()) return null
  const platform = detectPlatform(userAgent)
  const url = platform ? URLS[platform] : undefined
  return platform && url ? { label: LABELS[platform], url } : null
}
