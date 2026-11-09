/** Origem fictícia, só para resolver o link como o navegador resolveria. */
const BASE = 'http://orbitplay.invalid'

/**
 * Destino de uma notificação, se for seguro como `href`: path interno (começa com
 * `/` e não sai da origem) ou URL http(s). Qualquer outra coisa (`javascript:`,
 * `data:`, `//outro-host`…) devolve `null`, e o item aparece sem link.
 */
export function notificationHref(link: string | null): string | null {
  if (!link) return null
  try {
    // `//host`, `/\host` e `/<tab>/host` começam com `/`, mas levam a outro domínio.
    if (link.startsWith('/')) return new URL(link, BASE).origin === BASE ? link : null
    const { protocol } = new URL(link)
    return protocol === 'http:' || protocol === 'https:' ? link : null
  } catch {
    return null
  }
}
