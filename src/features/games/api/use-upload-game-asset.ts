import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AssetUploadUrlResponse, GameAsset, GameAssetKind } from '@/api-types'
import { api } from '@/lib/api-client'
import { putToStorage } from '@/lib/storage-upload'
import { gamesKeys } from './games-keys'

type UploadGameAssetVariables = {
  gameId: string
  kind: GameAssetKind
  file: File
  onProgress?: (fraction: number) => void
  signal?: AbortSignal
}

/**
 * Envia uma imagem do jogo (capa, logo, ícone…) em três passos: URL assinada
 * (`POST /games/{id}/assets/upload-url`), PUT direto no storage e confirmação
 * (`POST /games/{id}/assets`), que registra a imagem corrente do tipo.
 */
export function useUploadGameAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ gameId, kind, file, onProgress, signal }: UploadGameAssetVariables) => {
      const { uploadUrl, storageKey, maxSizeBytes } = await api.post<AssetUploadUrlResponse>(
        `/games/${gameId}/assets/upload-url`,
        { kind, contentType: file.type, sizeBytes: file.size, fileName: file.name },
      )
      if (file.size > maxSizeBytes) throw new Error('Imagem maior que o limite permitido.')

      await putToStorage(uploadUrl, file, file.type, onProgress, signal)
      return api.post<GameAsset>(`/games/${gameId}/assets`, { kind, storageKey })
    },
    onSettled: (_data, _error, { gameId }) => {
      void queryClient.invalidateQueries({ queryKey: gamesKeys.list() })
      void queryClient.invalidateQueries({ queryKey: gamesKeys.detail(gameId) })
    },
  })
}
