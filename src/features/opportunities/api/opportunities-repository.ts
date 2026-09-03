import type { Opportunity } from '@/api-types'
import { api } from '@/lib/api-client'
import { mockOpportunities } from './opportunities-mock-data'

/** Contract `useOpportunities` depends on — see games-repository.ts for the
 *  rationale (DIP). */
export type OpportunitiesRepository = {
  list: () => Promise<Opportunity[]>
}

/** Real implementation, talking to `GET /opportunities`. Not wired up as the
 *  default yet — there's no backend to answer it — but kept ready so
 *  switching back is a one-line change in `opportunitiesRepository` below. */
export const httpOpportunitiesRepository: OpportunitiesRepository = {
  list: () => api.get<Opportunity[]>('/opportunities'),
}

/** In-memory stand-in used until the backend exists. Simulates network
 *  latency so loading states stay visible/testable. Swap back to
 *  `httpOpportunitiesRepository` once `/opportunities` is live. */
export const mockOpportunitiesRepository: OpportunitiesRepository = {
  list: () => new Promise((resolve) => setTimeout(() => resolve(mockOpportunities), 400)),
}

// TODO(backend): swap to `httpOpportunitiesRepository` once `/opportunities` exists.
export const opportunitiesRepository: OpportunitiesRepository = mockOpportunitiesRepository
