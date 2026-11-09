import type {
  RecordingCompleteRequest,
  RecordingUploadRequest,
  RecordingUploadUrl,
} from '@/api-types'
import { ApiError, api } from '@/lib/api-client'

// Envio multipart da gravação de tela ENQUANTO ela acontece: os chunks do
// MediaRecorder viram partes de ~8 MiB que sobem para o storage assim que
// fecham, e só `{ partNumber, etag }` fica na memória. A última parte (o resto
// no `stop`) pode ser menor; o `complete` fecha o objeto com todas.
// Contrato: orbitplay-api/src/modules/media (media.dto.ts, media.service.ts).

/** S3/MinIO recusam partes abaixo de 5 MiB, exceto a última; 8 MiB dá folga. */
export const RECORDING_PART_BYTES = 8 * 1024 * 1024
/** MAX_RECORDING_BYTES da API (2 GiB). */
export const RECORDING_MAX_BYTES = 2 * 1024 * 1024 * 1024
/** MAX_RECORDING_DURATION_MS da API (4 h): acima disso o `complete` é recusado. */
export const RECORDING_MAX_DURATION_MS = 4 * 60 * 60 * 1000
/** Teto de `partNumber` aceito pela API. Com partes de 8 MiB, 2 GiB usam 256. */
export const RECORDING_MAX_PARTS = 1000
/**
 * Folga antes dos limites: depois do `stop` o MediaRecorder ainda entrega o
 * último chunk, e o pedido de parar só sai no próximo chunk (a cada 1 s).
 */
const RECORDING_LIMIT_MARGIN_BYTES = 64 * 1024 * 1024
const RECORDING_LIMIT_MARGIN_MS = 60_000
/** Espera antes de cada nova tentativa de uma parte (ou do `complete`). */
const RETRY_DELAYS_MS = [1_000, 3_000]

export type RecordingContentType = RecordingUploadRequest['contentType']
type RecordingKind = NonNullable<RecordingUploadRequest['kind']>
type RecordingPart = NonNullable<RecordingCompleteRequest['parts']>[number]

/** Rede da gravação: API (`upload-url`, `complete`) e o PUT direto no storage. */
export type RecordingUploadTransport = {
  requestPartUrl: (body: RecordingUploadRequest) => Promise<RecordingUploadUrl>
  /** Envia a parte para a URL assinada e devolve o ETag que o storage respondeu. */
  putPart: (uploadUrl: string, part: Blob, contentType: RecordingContentType) => Promise<string>
  complete: (body: RecordingCompleteRequest) => Promise<unknown>
}

export type RecordingUploadLimits = {
  partBytes: number
  maxBytes: number
  marginBytes: number
  maxDurationMs: number
  marginMs: number
}

export type RecordingUploadOptions = {
  contentType: RecordingContentType
  kind?: RecordingKind
  transport: RecordingUploadTransport
  /** Uma vez, perto do limite de tamanho ou duração: pare o MediaRecorder. */
  onLimitReached?: () => void
  /** Uma vez, se uma parte falhar mesmo após as novas tentativas, ainda gravando. */
  onError?: (error: unknown) => void
  limits?: Partial<RecordingUploadLimits>
  now?: () => number
  wait?: (ms: number) => Promise<void>
}

export type RecordingUpload = {
  /** Abre o envio multipart (o primeiro `upload-url` devolve o `uploadId`). */
  start: () => Promise<void>
  /** Recebe um chunk do MediaRecorder; sobe uma parte a cada `partBytes`. */
  append: (chunk: Blob) => void
  /** Sobe o resto como última parte e fecha a gravação com o `complete`. */
  finish: () => Promise<unknown>
  /** Uma parte já falhou de vez: a gravação não tem como ser concluída. */
  readonly failed: boolean
}

/** Nada chegou do MediaRecorder (ex.: o compartilhamento parou de cara). */
export class EmptyRecordingError extends Error {
  constructor() {
    super('Nenhum vídeo foi gravado.')
    this.name = 'EmptyRecordingError'
  }
}

/** Falha que outra tentativa não resolve. */
class PermanentUploadError extends Error {}

/** O MediaRecorder do Safari só grava MP4; os demais, WebM. */
export function recordingContentType(mimeType: string | undefined): RecordingContentType {
  return mimeType?.startsWith('video/mp4') ? 'video/mp4' : 'video/webm'
}

export function createRecordingUpload({
  contentType,
  kind = 'screen_recording',
  transport,
  onLimitReached,
  onError,
  limits,
  now = Date.now,
  wait = delay,
}: RecordingUploadOptions): RecordingUpload {
  const { partBytes, maxBytes, marginBytes, maxDurationMs, marginMs } = {
    partBytes: RECORDING_PART_BYTES,
    maxBytes: RECORDING_MAX_BYTES,
    marginBytes: RECORDING_LIMIT_MARGIN_BYTES,
    maxDurationMs: RECORDING_MAX_DURATION_MS,
    marginMs: RECORDING_LIMIT_MARGIN_MS,
    ...limits,
  }
  let upload: { uploadId: string; storageKey: string } | null = null
  let startedAt = 0
  let nextPartNumber = 1
  const parts: RecordingPart[] = []
  let buffer: Blob[] = []
  let bufferedBytes = 0
  let totalBytes = 0
  let full = false
  let limitSignaled = false
  // Uma parte por vez, em ordem; nunca rejeita (a falha fica em `failure`).
  let queue: Promise<void> = Promise.resolve()
  let failure: { error: unknown } | null = null
  let finishing: Promise<unknown> | null = null

  function fail(error: unknown) {
    if (failure) return
    failure = { error }
    buffer = []
    bufferedBytes = 0
    // Ao parar quem avisa é a promessa do `finish`.
    if (!finishing) onError?.(error)
  }

  function signalLimit() {
    if (limitSignaled) return
    limitSignaled = true
    onLimitReached?.()
  }

  /** Fecha o que está no buffer como a próxima parte e a põe na fila de envio. */
  function cutPart(uploadId: string) {
    const part = new Blob(buffer, { type: contentType })
    const partNumber = nextPartNumber++
    buffer = []
    bufferedBytes = 0
    queue = queue.then(async () => {
      if (failure) return
      try {
        parts.push({ partNumber, etag: await sendPart(uploadId, partNumber, part) })
      } catch (error) {
        fail(error)
      }
    })
  }

  function sendPart(uploadId: string, partNumber: number, part: Blob): Promise<string> {
    if (partNumber > RECORDING_MAX_PARTS) {
      return Promise.reject(new PermanentUploadError('A gravação passou do número de partes.'))
    }
    // URL nova a cada tentativa: a anterior pode ter expirado.
    return withRetry(async () => {
      const { uploadUrl } = await transport.requestPartUrl({
        contentType,
        sizeBytes: part.size,
        partNumber,
        uploadId,
        kind,
      })
      return transport.putPart(uploadUrl, part, contentType)
    }, wait)
  }

  return {
    get failed() {
      return failure !== null
    },

    async start() {
      if (upload) return
      // O primeiro pedido só abre o envio; o tamanho da parte 1 ainda não
      // existe, então vai o tamanho planejado e a URL é descartada — cada parte
      // pede a sua, com o tamanho real, quando fecha.
      const first = await withRetry(
        () => transport.requestPartUrl({ contentType, sizeBytes: partBytes, partNumber: 1, kind }),
        wait,
      )
      if (!first.uploadId) throw new Error('A API não abriu o envio multipart da gravação.')
      upload = { uploadId: first.uploadId, storageKey: first.storageKey }
      startedAt = now()
    },

    append(chunk) {
      if (!upload) throw new Error('Chame start() antes de enviar chunks da gravação.')
      if (failure || finishing || full) return
      if (totalBytes + chunk.size > maxBytes) {
        // Descarta daqui em diante: um buraco no meio corromperia o vídeo.
        full = true
        signalLimit()
        return
      }
      if (chunk.size > 0) {
        totalBytes += chunk.size
        buffer.push(chunk)
        bufferedBytes += chunk.size
        if (bufferedBytes >= partBytes) cutPart(upload.uploadId)
      }
      if (totalBytes >= maxBytes - marginBytes || now() - startedAt >= maxDurationMs - marginMs) {
        signalLimit()
      }
    },

    finish() {
      finishing ??= (async () => {
        if (!upload) throw new Error('A gravação não foi iniciada.')
        const { uploadId, storageKey } = upload
        if (!failure && bufferedBytes > 0) cutPart(uploadId)
        await queue
        if (failure) throw failure.error
        if (!parts.length) throw new EmptyRecordingError()
        const durationMs = Math.min(Math.max(0, now() - startedAt), maxDurationMs)
        return withRetry(
          () =>
            transport.complete({
              storageKey,
              uploadId,
              durationMs,
              parts: [...parts].sort((a, b) => a.partNumber - b.partNumber),
            }),
          wait,
        )
      })()
      return finishing
    },
  }
}

/** Liga o envio à API real (`api`) e ao PUT direto na URL assinada do storage. */
export function recordingUploadTransport(sessionId: string): RecordingUploadTransport {
  const base = `/sessions/${encodeURIComponent(sessionId)}/recordings`
  return {
    requestPartUrl: (body) => api.post<RecordingUploadUrl>(`${base}/upload-url`, body),
    complete: (body) => api.post<unknown>(`${base}/complete`, body),
    async putPart(uploadUrl, part, contentType) {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': contentType },
        body: part,
      })
      if (!response.ok) throw new Error('O armazenamento recusou uma parte da gravação.')
      // Só legível se o CORS do bucket expuser o header `ETag`.
      const etag = response.headers.get('etag')
      if (!etag) throw new PermanentUploadError('O armazenamento não confirmou a parte enviada.')
      return etag
    },
  }
}

/** Erro de rede ou 5xx/408/429 vale outra tentativa; 4xx da API, não. */
function isRetryable(error: unknown): boolean {
  if (error instanceof PermanentUploadError) return false
  if (error instanceof ApiError) {
    return error.status >= 500 || error.status === 408 || error.status === 429
  }
  return true
}

async function withRetry<T>(run: () => Promise<T>, wait: (ms: number) => Promise<void>) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await run()
    } catch (error) {
      const retryDelay = RETRY_DELAYS_MS[attempt]
      if (retryDelay === undefined || !isRetryable(error)) throw error
      await wait(retryDelay)
    }
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
