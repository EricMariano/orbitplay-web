import { useQuery } from '@tanstack/react-query'
import type { MyTestProgress } from '@/api-types'
import { api } from '@/lib/api-client'
import { testsKeys } from './tests-keys'

/** List the current player's tests with progress. */
export function useMyTests() {
  return useQuery({
    queryKey: testsKeys.mine(),
    queryFn: () => api.get<MyTestProgress[]>('/tests/mine'),
  })
}
