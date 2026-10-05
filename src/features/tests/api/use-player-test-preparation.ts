import { useMutation, useQuery } from '@tanstack/react-query'
import type { DesignSchemas } from '@/api-types'
import { api } from '@/lib/api-client'
import { testsKeys } from './tests-keys'

const platform: DesignSchemas['Platform'] = 'web'

export function usePlayerTest(testId: string) {
  return useQuery({
    queryKey: testsKeys.playerDetail(testId),
    queryFn: () => api.get<DesignSchemas['PlayerTest']>(`/player/tests/${testId}`),
    retry: false,
  })
}

export function useEnterPlayerTest() {
  return useMutation({
    mutationFn: (testId: string) =>
      api.post<DesignSchemas['Participation']>(
        `/player/tests/${testId}/participations`,
        undefined,
        { idempotent: true },
      ),
  })
}

export function useParticipationTutorial(participationId: string) {
  return useQuery({
    queryKey: testsKeys.tutorial(participationId),
    queryFn: () =>
      api.get<DesignSchemas['Tutorial']>(`/participations/${participationId}/tutorial`),
    retry: false,
  })
}

export function useBuildCompatibility(buildId: string) {
  return useQuery({
    queryKey: testsKeys.buildCompatibility(buildId),
    queryFn: () =>
      api.get<DesignSchemas['CompatibilityReport']>(
        `/builds/${buildId}/compatibility?platform=${platform}`,
      ),
    enabled: Boolean(buildId),
    retry: false,
  })
}

export function useBuildDownloadUrl(buildId: string, localVersion?: string, enabled = true) {
  const query = new URLSearchParams()
  if (localVersion) query.set('localVersion', localVersion)
  const suffix = query.size ? `?${query.toString()}` : ''

  return useQuery({
    queryKey: testsKeys.buildDownload(buildId, localVersion),
    queryFn: () =>
      api.get<DesignSchemas['DownloadUrlResponse']>(`/builds/${buildId}/download-url${suffix}`),
    enabled,
    retry: false,
  })
}

export function useRecordParticipationConsents(participationId: string) {
  return useMutation({
    mutationFn: (payload: DesignSchemas['ConsentRequest']) =>
      api.post<DesignSchemas['ConsentRecord']>(
        `/participations/${participationId}/consents`,
        payload,
      ),
  })
}

export function useStartParticipationSession(participationId: string) {
  return useMutation({
    mutationFn: (payload: DesignSchemas['StartSessionRequest']) =>
      api.post<DesignSchemas['SessionStarted']>(
        `/participations/${participationId}/sessions`,
        payload,
        { idempotent: true },
      ),
  })
}
