/**
 * PUT para a URL assinada do storage. Não passa pelo `api` (não é a API, e a
 * URL já carrega a autorização); usa XHR porque `fetch` não informa o
 * progresso do envio.
 */
export function putToStorage(
  url: string,
  file: File,
  contentType: string,
  onProgress?: (fraction: number) => void,
  signal?: AbortSignal,
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', url)
    xhr.setRequestHeader('Content-Type', contentType)
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(event.loaded / event.total)
    }
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error('O envio do arquivo falhou. Tente de novo.'))
    xhr.onerror = () => reject(new Error('O envio do arquivo falhou. Verifique a conexão.'))
    xhr.onabort = () => reject(new DOMException('Envio cancelado.', 'AbortError'))
    signal?.addEventListener('abort', () => xhr.abort(), { once: true })
    xhr.send(file)
  })
}
