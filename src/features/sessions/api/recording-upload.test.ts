import { afterEach, describe, expect, it, vi } from 'vitest'
import type { RecordingCompleteRequest, RecordingUploadRequest } from '@/api-types'
import { ApiError } from '@/lib/api-client'
import {
  createRecordingUpload,
  EmptyRecordingError,
  RECORDING_MAX_BYTES,
  RECORDING_MAX_PARTS,
  RECORDING_PART_BYTES,
  recordingContentType,
  recordingUploadTransport,
  type RecordingUploadOptions,
  type RecordingUploadTransport,
} from './recording-upload'

const chunk = (size: number) => new Blob(['x'.repeat(size)])
/** Deixa a fila de envio (promessas já resolvidas) andar. */
const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

function fakeTransport() {
  return {
    requestPartUrl: vi.fn(async (body: RecordingUploadRequest) => ({
      uploadUrl: `https://storage.test/part-${body.partNumber}`,
      storageKey: 'org/session/screen/obj.webm',
      expiresAt: '2026-11-09T12:00:00.000Z',
      uploadId: 'upload-1',
    })),
    putPart: vi.fn(
      async (url: string, _part: Blob, _contentType: string) => `"etag-${url.split('-').pop()}"`,
    ),
    complete: vi.fn(async (_body: RecordingCompleteRequest) => ({ id: 'recording-1' })),
  } satisfies RecordingUploadTransport
}

function setup(overrides: Partial<RecordingUploadOptions> = {}) {
  const transport = fakeTransport()
  let clock = 1_000
  const options = {
    contentType: 'video/webm',
    transport,
    limits: { partBytes: 10, maxBytes: 100, marginBytes: 20, maxDurationMs: 60_000, marginMs: 0 },
    now: () => clock,
    wait: vi.fn(async () => undefined),
    onError: vi.fn(),
    onLimitReached: vi.fn(),
    ...overrides,
  } satisfies RecordingUploadOptions
  return {
    upload: createRecordingUpload(options),
    transport,
    options,
    advance: (ms: number) => {
      clock += ms
    },
  }
}

describe('recording multipart upload', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('opens the multipart upload when recording starts', async () => {
    const { upload, transport } = setup()
    await upload.start()
    expect(transport.requestPartUrl).toHaveBeenCalledTimes(1)
    expect(transport.requestPartUrl).toHaveBeenCalledWith({
      contentType: 'video/webm',
      sizeBytes: 10,
      partNumber: 1,
      kind: 'screen_recording',
    })
    expect(transport.putPart).not.toHaveBeenCalled()
  })

  it('uploads each part while recording and completes with the smaller remainder', async () => {
    const { upload, transport, advance } = setup()
    await upload.start()

    upload.append(chunk(4))
    upload.append(chunk(4))
    await flush()
    expect(transport.putPart).not.toHaveBeenCalled()

    upload.append(chunk(4))
    await flush()
    // A parte 1 sobe durante a gravação, com a URL e o tamanho dela.
    expect(transport.requestPartUrl).toHaveBeenLastCalledWith({
      contentType: 'video/webm',
      sizeBytes: 12,
      partNumber: 1,
      uploadId: 'upload-1',
      kind: 'screen_recording',
    })
    expect(transport.putPart).toHaveBeenCalledTimes(1)
    expect(transport.putPart.mock.calls[0]?.[0]).toBe('https://storage.test/part-1')
    expect(transport.putPart.mock.calls[0]?.[1].size).toBe(12)

    upload.append(chunk(3))
    advance(42_000)
    await expect(upload.finish()).resolves.toEqual({ id: 'recording-1' })

    expect(transport.requestPartUrl).toHaveBeenLastCalledWith(
      expect.objectContaining({ partNumber: 2, sizeBytes: 3, uploadId: 'upload-1' }),
    )
    expect(transport.putPart.mock.calls[1]?.[1].size).toBe(3)
    expect(transport.complete).toHaveBeenCalledWith({
      storageKey: 'org/session/screen/obj.webm',
      uploadId: 'upload-1',
      durationMs: 42_000,
      parts: [
        { partNumber: 1, etag: '"etag-1"' },
        { partNumber: 2, etag: '"etag-2"' },
      ],
    })
  })

  it('does not send an empty last part when the recording ends on a part boundary', async () => {
    const { upload, transport } = setup()
    await upload.start()
    upload.append(chunk(10))
    await upload.finish()
    expect(transport.putPart).toHaveBeenCalledTimes(1)
    expect(transport.complete).toHaveBeenCalledWith(
      expect.objectContaining({ parts: [{ partNumber: 1, etag: '"etag-1"' }] }),
    )
  })

  it('retries a failed part with a fresh URL before giving up', async () => {
    const { upload, transport, options } = setup()
    transport.putPart.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    await upload.start()
    upload.append(chunk(10))
    await upload.finish()

    expect(options.wait).toHaveBeenCalledTimes(1)
    // start + 2 tentativas da parte 1
    expect(transport.requestPartUrl).toHaveBeenCalledTimes(3)
    expect(transport.putPart).toHaveBeenCalledTimes(2)
    expect(options.onError).not.toHaveBeenCalled()
    expect(transport.complete).toHaveBeenCalledTimes(1)
  })

  it('reports a part that keeps failing once and refuses to complete the recording', async () => {
    const { upload, transport, options } = setup()
    const error = new TypeError('Failed to fetch')
    transport.putPart.mockRejectedValue(error)
    await upload.start()
    upload.append(chunk(10))
    await flush()

    expect(transport.putPart).toHaveBeenCalledTimes(3)
    expect(options.onError).toHaveBeenCalledTimes(1)
    expect(options.onError).toHaveBeenCalledWith(error)
    expect(upload.failed).toBe(true)

    upload.append(chunk(10))
    await expect(upload.finish()).rejects.toBe(error)
    expect(transport.putPart).toHaveBeenCalledTimes(3)
    expect(transport.complete).not.toHaveBeenCalled()
    expect(options.onError).toHaveBeenCalledTimes(1)
  })

  it('does not retry a request the API rejected', async () => {
    const { upload, transport } = setup()
    transport.requestPartUrl.mockRejectedValueOnce(
      new ApiError(400, { message: 'Consentimento de gravação ausente' }, 'Bad Request'),
    )
    await expect(upload.start()).rejects.toThrow('Consentimento de gravação ausente')
    expect(transport.requestPartUrl).toHaveBeenCalledTimes(1)
  })

  it('retries the completion when the API is temporarily unavailable', async () => {
    const { upload, transport } = setup()
    transport.complete.mockRejectedValueOnce(new ApiError(502, null, 'Bad Gateway'))
    await upload.start()
    upload.append(chunk(5))
    await expect(upload.finish()).resolves.toEqual({ id: 'recording-1' })
    expect(transport.complete).toHaveBeenCalledTimes(2)
  })

  it('rejects a recording with no data without completing it', async () => {
    const { upload, transport } = setup()
    await upload.start()
    upload.append(new Blob([]))
    await expect(upload.finish()).rejects.toBeInstanceOf(EmptyRecordingError)
    expect(transport.complete).not.toHaveBeenCalled()
  })

  it('asks to stop before the size limit and drops data past it', async () => {
    const { upload, transport, options } = setup()
    await upload.start()
    for (let i = 0; i < 7; i++) upload.append(chunk(10))
    expect(options.onLimitReached).not.toHaveBeenCalled()
    upload.append(chunk(10)) // 80 = maxBytes - marginBytes
    expect(options.onLimitReached).toHaveBeenCalledTimes(1)

    upload.append(chunk(15)) // 95: ainda cabe
    upload.append(chunk(10)) // passaria de 100: descartado, e tudo depois dele
    upload.append(chunk(1))
    await upload.finish()

    const sent = transport.putPart.mock.calls.reduce((sum, [, part]) => sum + part.size, 0)
    expect(sent).toBe(95)
    expect(options.onLimitReached).toHaveBeenCalledTimes(1)
  })

  it('asks to stop before the duration limit and never reports more than it', async () => {
    const { upload, transport, options, advance } = setup()
    await upload.start()
    upload.append(chunk(1))
    advance(60_000)
    upload.append(new Blob([]))
    expect(options.onLimitReached).toHaveBeenCalledTimes(1)
    advance(5_000)
    await upload.finish()
    expect(transport.complete).toHaveBeenCalledWith(expect.objectContaining({ durationMs: 60_000 }))
  })

  it('keeps every part but the last above the S3 minimum and within the API part cap', () => {
    expect(RECORDING_PART_BYTES).toBeGreaterThanOrEqual(5 * 1024 * 1024)
    expect(Math.ceil(RECORDING_MAX_BYTES / RECORDING_PART_BYTES)).toBeLessThan(RECORDING_MAX_PARTS)
  })

  it('labels Safari MP4 recordings and defaults to WebM', () => {
    expect(recordingContentType('video/mp4;codecs=avc1')).toBe('video/mp4')
    expect(recordingContentType('video/webm;codecs=vp9,opus')).toBe('video/webm')
    expect(recordingContentType(undefined)).toBe('video/webm')
  })

  describe('API and storage transport', () => {
    const fetchMock = vi.fn<typeof fetch>()

    function routeFetch(putResponse: () => Response) {
      fetchMock.mockReset()
      fetchMock.mockImplementation(async (input) => {
        const url = String(input)
        if (url.endsWith('/recordings/upload-url')) {
          return Response.json({
            uploadUrl: 'https://storage.test/part',
            storageKey: 'org/session/screen/obj.webm',
            expiresAt: '2026-11-09T12:00:00.000Z',
            uploadId: 'upload-1',
          })
        }
        if (url.endsWith('/recordings/complete')) return Response.json({ id: 'recording-1' })
        return putResponse()
      })
      vi.stubGlobal('fetch', fetchMock)
    }

    const realUpload = () =>
      createRecordingUpload({
        contentType: 'video/webm',
        transport: recordingUploadTransport('session/1'),
        limits: { partBytes: 10 },
        wait: async () => undefined,
      })

    it('PUTs each part to the signed URL and completes with the storage ETags', async () => {
      routeFetch(() => new Response(null, { status: 200, headers: { ETag: '"abc"' } }))
      const upload = realUpload()
      await upload.start()
      upload.append(chunk(10))
      await upload.finish()

      const put = fetchMock.mock.calls.find(([, init]) => init?.method === 'PUT')
      expect(put?.[0]).toBe('https://storage.test/part')
      expect(new Headers(put?.[1]?.headers).get('Content-Type')).toBe('video/webm')
      const complete = fetchMock.mock.calls.find(([url]) => String(url).endsWith('/complete'))
      expect(String(complete?.[0])).toContain('/sessions/session%2F1/recordings/complete')
      expect(JSON.parse(String(complete?.[1]?.body))).toMatchObject({
        uploadId: 'upload-1',
        parts: [{ partNumber: 1, etag: '"abc"' }],
      })
    })

    it('does not re-upload a part when the storage hides the ETag', async () => {
      routeFetch(() => new Response(null, { status: 200 }))
      const upload = realUpload()
      await upload.start()
      upload.append(chunk(10))
      await expect(upload.finish()).rejects.toThrow('não confirmou')
      expect(fetchMock.mock.calls.filter(([, init]) => init?.method === 'PUT')).toHaveLength(1)
    })
  })
})
