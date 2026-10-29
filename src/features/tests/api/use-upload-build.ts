import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { BuildUploadUrlResponse, ConfirmBuildRequest, Platform, TestBuild } from '@/api-types'
import { api } from '@/lib/api-client'
import { putToStorage } from '@/lib/storage-upload'
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
        `/tests/${encodeURIComponent(testId)}/build/upload-url`,
        { fileName: file.name, contentType, sizeBytes: file.size, platform },
      )
      if (file.size > maxSizeBytes) throw new Error('Arquivo maior que o limite permitido.')

      await putToStorage(uploadUrl, file, contentType, onProgress, signal)

      const confirm: ConfirmBuildRequest = { storageKey, platform }
      return api.post<TestBuild>(`/tests/${encodeURIComponent(testId)}/build`, confirm, {
        idempotent: true,
      })
    },
    onSettled: () => {
      if (testId) void queryClient.invalidateQueries({ queryKey: testsKeys.detail(testId) })
    },
  })
}
