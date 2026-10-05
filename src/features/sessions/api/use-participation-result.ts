import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { sessionsKeys } from './sessions-keys'
import type { ParticipationResult } from '../session-summary'

/** Reads the server-owned result and polls only while the participation is in review. */
export function useParticipationResult(participationId: string) {
  return useQuery({
    queryKey: sessionsKeys.participationResult(participationId),
    queryFn: () =>
      api.get<ParticipationResult>(`/participations/${encodeURIComponent(participationId)}/result`),
    enabled: Boolean(participationId),
    retry: false,
    refetchInterval: (query) => (query.state.data?.status === 'in_review' ? 5000 : false),
    refetchIntervalInBackground: false,
  })
}
