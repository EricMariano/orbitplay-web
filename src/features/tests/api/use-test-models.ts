import { useQuery } from '@tanstack/react-query'
import type { TestModel } from '@/api-types'
import { api } from '@/lib/api-client'
import { testsKeys } from './tests-keys'

/** List reusable test models. */
export function useTestModels() {
  return useQuery({
    queryKey: testsKeys.models(),
    queryFn: () => api.get<TestModel[]>('/test-models'),
  })
}
