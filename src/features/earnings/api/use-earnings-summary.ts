import { useQuery } from '@tanstack/react-query'
import type { EarningsSummary } from '@/api-types'
import { api } from '@/lib/api-client'
import { earningsKeys } from './earnings-keys'

/** Get the current player's earnings summary. */
export function useEarningsSummary() {
  return useQuery({
    queryKey: earningsKeys.summary(),
    queryFn: () => api.get<EarningsSummary>('/earnings/summary'),
  })
}
