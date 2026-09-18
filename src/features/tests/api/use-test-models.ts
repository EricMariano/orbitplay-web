import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { testsKeys } from './tests-keys'
import type { TestModelOption, TestModelView } from '../types'

/** Preço por teste, em centavos — decorado localmente (ver types.ts). */
const PRICE_BY_KEY: Record<TestModelView['key'], number> = {
  free_exploration_telemetry: 69,
  free_exploration: 59,
  ab_test: 39,
  ab_test_images: 19,
}

/** Catálogo de modelos de teste (Tela 06), com preço decorado no front. */
export function useTestModels() {
  return useQuery({
    queryKey: testsKeys.models(),
    queryFn: async () => {
      const response = await api.get<{ data: TestModelView[] }>('/test-models')
      const options: TestModelOption[] = response.data.map((model) => ({
        ...model,
        priceCents: PRICE_BY_KEY[model.key],
      }))
      return options
    },
  })
}
