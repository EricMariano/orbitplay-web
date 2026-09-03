import { useQuery } from '@tanstack/react-query'
import type { ContinueTest } from '@/api-types'
import { api } from '@/lib/api-client'
import { testsKeys } from './tests-keys'

/** Get the in-progress test the player was last working on, if any. */
export function useContinueTest() {
  return useQuery({
    queryKey: testsKeys.continue(),
    queryFn: () => api.get<ContinueTest | null>('/tests/continue'),
  })
}
