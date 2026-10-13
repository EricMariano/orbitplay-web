import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { BuildUploadUrlResponse, ConfirmBuildRequest, Platform, TestBuild } from '@/api-types'
import { api } from '@/lib/api-client'
import { testsKeys } from './tests-keys'

type UploadBuildVariables = {
  file: File
  platform: Platform
  onProgress?: (fraction: number) => void
  signal?: AbortSignal
}

/**
 * Envia a build em três passos (wizard passo 3): pede a URL assinada
 * (`POST /tests/{id}/build/upload-url`), manda o arquivo direto para o
 * storage e confirma (`POST /tests/{id}/build`), o que dispara a validação.
 */
export function useUploadBuild(testId: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ file, platform, onProgress, signal }: UploadBuildVariables) => {
      if (!testId) throw new Error('Crie o rascunho do teste antes de enviar a build.')
      const contentType = file.type || 'application/octet-stream'
      const { uploadUrl, storageKey, maxSizeBytes } = await api.post<BuildUploadUrlResponse>(
        `/tests/${testId}/build/upload-url`,
        { fileName: file.name, contentType, sizeBytes: file.size, platform },
      )
      if (file.size > maxSizeBytes) throw new Error('Arquivo maior que o limite permitido.')

      await putToStorage(uploadUrl, file, contentType, onProgress, signal)

      const confirm: ConfirmBuildRequest = { storageKey, platform }
      return api.post<TestBuild>(`/tests/${testId}/build`, confirm, { idempotent: true })
    },
    onSettled: () => {
      if (testId) void queryClient.invalidateQueries({ queryKey: testsKeys.detail(testId) })
    },
  })
}

/**
 * PUT para a URL assinada do storage. Não passa pelo `api` (não é a API, e a
 * URL já carrega a autorização); usa XHR porque `fetch` não informa o
 * progresso do envio.
 */
function putToStorage(
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
        : reject(new Error('O envio da build falhou. Tente de novo.'))
    xhr.onerror = () => reject(new Error('O envio da build falhou. Verifique a conexão.'))
    xhr.onabort = () => reject(new DOMException('Envio cancelado.', 'AbortError'))
    signal?.addEventListener('abort', () => xhr.abort(), { once: true })
    xhr.send(file)
  })
}
