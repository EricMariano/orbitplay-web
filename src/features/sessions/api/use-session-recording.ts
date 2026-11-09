import { useCallback } from 'react'
import {
  createRecordingUpload,
  recordingUploadTransport,
  type RecordingUploadOptions,
} from './recording-upload'

/**
 * Abre o envio multipart de uma gravação da sessão. Cada gravação (inclusive o
 * "gravar novamente") cria o seu: as partes sobem enquanto o vídeo é gravado.
 */
export function useSessionRecordingUpload(sessionId: string) {
  return useCallback(
    (options: Omit<RecordingUploadOptions, 'transport'>) =>
      createRecordingUpload({ ...options, transport: recordingUploadTransport(sessionId) }),
    [sessionId],
  )
}
