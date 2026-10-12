import { useQuery } from '@tanstack/react-query'
import type { TestModelList } from '@/api-types'
import { api } from '@/lib/api-client'
import { testsKeys } from './tests-keys'

/** Catálogo de modelos de teste (Tela 06). */
export function useTestModels() {
  return useQuery({
    queryKey: testsKeys.models(),
    queryFn: () => api.get<TestModelList>('/test-models'),
    select: (list) => list.data,
  })
}
