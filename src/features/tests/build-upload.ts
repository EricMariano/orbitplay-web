import type { Platform, TestBuild } from '@/api-types'

/**
 * Tipos aceitos na área de upload (Tela 08) — os mesmos que o worker de
 * validação reconhece pela assinatura do arquivo (FORMAT_SIGNATURES em
 * orbitplay-api/src/workers/build.processor.ts); qualquer outro é reprovado.
 */
export const ACCEPTED_BUILD_EXTENSIONS = [
  '.exe',
  '.msi',
  '.zip',
  '.pkg',
  '.apk',
  '.ipa',
  '.deb',
  '.appimage',
  '.gz',
  '.tgz',
]

export const PLATFORM_LABELS: Record<Platform, string> = {
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
  android: 'Android',
  ios: 'iOS',
  web: 'Web',
}

const PLATFORM_BY_EXTENSION: Record<string, Platform> = {
  exe: 'windows',
  msi: 'windows',
  pkg: 'macos',
  apk: 'android',
  ipa: 'ios',
  deb: 'linux',
  appimage: 'linux',
}

/** A API exige a plataforma; quando a extensão não deixa claro (ex.: `.zip`), o estúdio escolhe. */
export function platformFromFileName(fileName: string): Platform | null {
  const extension = fileName.split('.').pop()?.toLowerCase() ?? ''
  return PLATFORM_BY_EXTENSION[extension] ?? null
}

export const VALIDATION_STEP_LABELS: Record<TestBuild['validationSteps'][number]['key'], string> = {
  checksum: 'Integridade do arquivo',
  malware_scan: 'Verificação de segurança',
  metadata: 'Metadados da build',
  plugin_manifest: 'Orbit Plug-in',
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} ${units[unit]}`
}
