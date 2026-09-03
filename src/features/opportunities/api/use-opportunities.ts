import { useQuery } from '@tanstack/react-query'
import { opportunitiesKeys } from './opportunities-keys'
import {
  opportunitiesRepository,
  type OpportunitiesRepository,
} from './opportunities-repository'

/** List opportunities for the current user. */
export function useOpportunities(repository: OpportunitiesRepository = opportunitiesRepository) {
  return useQuery({
    queryKey: opportunitiesKeys.list(),
    queryFn: () => repository.list(),
  })
}
