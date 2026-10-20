import { useQuery } from '@tanstack/react-query'
import type { PlaybackUrl } from '@/api-types'
import { api } from '@/lib/api-client'
import { reportsKeys } from './reports-keys'

/** URL assinada temporária; só é consultada para uma gravação pronta. */
export function useRecordingPlayback(
  sessionId: string,
  recordingId: string | null,
  enabled: boolean,
) {
  return useQuery({
    queryKey: reportsKeys.recordingPlayback(sessionId, recordingId ?? ''),
    queryFn: () =>
      api.get<PlaybackUrl>(
        `/sessions/${encodeURIComponent(sessionId)}/recordings/${encodeURIComponent(recordingId ?? '')}/playback-url`,
      ),
    enabled: Boolean(sessionId && recordingId && enabled),
  })
}
