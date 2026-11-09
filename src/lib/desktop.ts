import { DESKTOP_INSTALLER_FILES, DESKTOP_RELEASE_URL } from '@/lib/desktop-release'

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

/**
 * Link do instalador de uma plataforma. `VITE_DESKTOP_DOWNLOAD_*` sobrescreve,
 * se preenchida. Sem ela: em dev, `/downloads/<arquivo>` — o Vite serve o
 * instalador de `release/` se você gerou um, senão redireciona para a Release
 * (ver vite.config.ts); em produção, direto a Release `desktop-latest`, mantida
 * pelo workflow `desktop-release`. Nenhum dos dois precisa de .env.
 */
export function resolveDownloadUrl(
  platform: DesktopPlatform,
  fromEnv?: string,
  dev: boolean = import.meta.env.DEV,
): string {
  if (fromEnv) return fromEnv
  const file = DESKTOP_INSTALLER_FILES[platform]
  return dev ? `/downloads/${file}` : `${DESKTOP_RELEASE_URL}/${file}`
}

const URLS: Record<DesktopPlatform, string | undefined> = {
  win: resolveDownloadUrl('win', import.meta.env.VITE_DESKTOP_DOWNLOAD_WIN),
  mac: resolveDownloadUrl('mac', import.meta.env.VITE_DESKTOP_DOWNLOAD_MAC),
  linux: resolveDownloadUrl('linux', import.meta.env.VITE_DESKTOP_DOWNLOAD_LINUX),
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
 * visitante primeiro. Vazio quando já está no app ou no celular. Os links
 * apontam para a Release do GitHub (ou para o .env) — nada passa pela API nem
 * pelo banco.
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
