import { useMutation } from '@tanstack/react-query'
import type {
  RecordingCompleteRequest,
  RecordingUploadRequest,
  RecordingUploadUrl,
} from '@/api-types'
import { api } from '@/lib/api-client'

type UploadSessionRecordingInput = {
  sessionId: string
  recording: Blob
  durationMs: number
}

/** Sends one browser-recorded WebM as the first multipart object part. */
export function useUploadSessionRecording() {
  return useMutation({
    mutationFn: async ({ sessionId, recording, durationMs }: UploadSessionRecordingInput) => {
      const upload = await api.post<RecordingUploadUrl>(
        `/sessions/${encodeURIComponent(sessionId)}/recordings/upload-url`,
        {
          contentType: 'video/webm',
          sizeBytes: recording.size,
          kind: 'screen_recording',
        } satisfies RecordingUploadRequest,
      )

      const response = await fetch(upload.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'video/webm' },
        body: recording,
      })
      if (!response.ok) throw new Error('Não foi possível enviar a gravação para o armazenamento.')

      const etag = response.headers.get('etag')
      if (!upload.uploadId || !etag) {
        throw new Error('O armazenamento não confirmou a gravação. Tente enviar novamente.')
      }

      return api.post<unknown>(`/sessions/${encodeURIComponent(sessionId)}/recordings/complete`, {
        storageKey: upload.storageKey,
        durationMs,
        sizeBytes: recording.size,
        uploadId: upload.uploadId,
        parts: [{ partNumber: 1, etag }],
      } satisfies RecordingCompleteRequest)
    },
  })
}
