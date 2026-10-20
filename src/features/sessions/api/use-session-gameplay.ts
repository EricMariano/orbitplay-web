import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  DeviceEventRequest,
  FinishSessionRequest,
  HeartbeatRequest,
  SessionGameplay,
  SessionSummary,
} from '@/api-types'
import { api } from '@/lib/api-client'
import { sessionsKeys } from './sessions-keys'

/** Reads the player-owned session and configuration required by the gameplay overlay. */
export function useSessionGameplay(sessionId: string) {
  return useQuery({
    queryKey: sessionsKeys.gameplay(sessionId),
    queryFn: () => api.get<SessionGameplay>(`/sessions/${encodeURIComponent(sessionId)}/gameplay`),
    enabled: Boolean(sessionId),
    retry: false,
  })
}

export function useRecordSessionDevice(sessionId: string) {
  return useMutation({
    mutationFn: (payload: DeviceEventRequest) =>
      api.patch<void>(`/sessions/${encodeURIComponent(sessionId)}/devices`, payload),
  })
}

export function useSessionHeartbeat(sessionId: string) {
  return useMutation({
    mutationFn: (payload: HeartbeatRequest) =>
      api.post<void>(`/sessions/${encodeURIComponent(sessionId)}/heartbeat`, payload),
  })
}

export function useFinishSession(sessionId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: FinishSessionRequest) =>
      api.post<SessionSummary['session']>(
        `/sessions/${encodeURIComponent(sessionId)}/finish`,
        payload,
        {
          idempotent: true,
        },
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sessionsKeys.gameplay(sessionId) })
      void queryClient.invalidateQueries({ queryKey: sessionsKeys.summary(sessionId) })
    },
  })
}
