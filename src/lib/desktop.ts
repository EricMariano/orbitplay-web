export type DesktopPlatform = 'win' | 'mac' | 'linux'

export type DesktopDownload = {
  platform: DesktopPlatform
  label: string
  url: string
  /** true para o sistema de quem está acessando. */
  current: boolean
}

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

const PLATFORMS: DesktopPlatform[] = ['win', 'mac', 'linux']

const LABELS: Record<DesktopPlatform, string> = {
  win: 'Windows',
  mac: 'macOS',
  linux: 'Linux',
}

// Em dev o Vite serve o que estiver em `release/` nestes caminhos (ver
// vite.config.ts), então não é preciso configurar .env.local. Em produção os
// links vêm do .env (VITE_DESKTOP_DOWNLOAD_*).
const DEV_URLS: Record<DesktopPlatform, string> = {
  win: '/downloads/OrbitPlay-Setup.exe',
  mac: '/downloads/OrbitPlay.dmg',
  linux: '/downloads/OrbitPlay.AppImage',
}

function resolveUrl(fromEnv: string | undefined, platform: DesktopPlatform): string | undefined {
  return fromEnv || (import.meta.env.DEV ? DEV_URLS[platform] : undefined)
}

const URLS: Record<DesktopPlatform, string | undefined> = {
  win: resolveUrl(import.meta.env.VITE_DESKTOP_DOWNLOAD_WIN, 'win'),
  mac: resolveUrl(import.meta.env.VITE_DESKTOP_DOWNLOAD_MAC, 'mac'),
  linux: resolveUrl(import.meta.env.VITE_DESKTOP_DOWNLOAD_LINUX, 'linux'),
}

const MOBILE = /Android|iPhone|iPad|iPod/i

/** true quando o front roda dentro do app desktop (Electron). */
export function isDesktopApp(): boolean {
  return typeof window !== 'undefined' && window.desktop?.isDesktop === true
}

export function detectPlatform(userAgent: string): DesktopPlatform | null {
  if (MOBILE.test(userAgent)) return null
  if (/Windows/i.test(userAgent)) return 'win'
  if (/Macintosh|Mac OS X/i.test(userAgent)) return 'mac'
  if (/Linux|X11/i.test(userAgent)) return 'linux'
  return null
}

/**
 * Instaladores do app desktop que podem ser oferecidos, com o sistema do
 * visitante primeiro. Vazio quando já está no app, no celular ou quando
 * nenhum link está configurado. Os links vêm do .env — nada passa pela API
 * nem pelo banco.
 */
export function getDesktopDownloads(
  userAgent: string = typeof navigator === 'undefined' ? '' : navigator.userAgent,
  urls: Record<DesktopPlatform, string | undefined> = URLS,
): DesktopDownload[] {
  if (isDesktopApp() || MOBILE.test(userAgent)) return []
  const current = detectPlatform(userAgent)
  return PLATFORMS.flatMap((platform) => {
    const url = urls[platform]
    return url ? [{ platform, label: LABELS[platform], url, current: platform === current }] : []
  }).sort((a, b) => Number(b.current) - Number(a.current))
}
