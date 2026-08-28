import { useQuery } from '@tanstack/react-query'
import type { Opportunity } from '@/api-types'
import { api } from '@/lib/api-client'
import { opportunitiesKeys } from './opportunities-keys'

/** List opportunities for the current user. */
export function useOpportunities() {
  return useQuery({
    queryKey: opportunitiesKeys.list(),
    queryFn: () => api.get<Opportunity[]>('/opportunities'),
  })
}
