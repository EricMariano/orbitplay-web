import { useQuery } from '@tanstack/react-query'
import type { TestForm } from '@/api-types'
import { api } from '@/lib/api-client'

export function useTestFormPreview(testId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ['tests', testId, 'form-preview'],
    enabled: Boolean(testId && enabled),
    queryFn: () => api.get<TestForm>(`/tests/${encodeURIComponent(testId!)}/form/preview`),
  })
}
