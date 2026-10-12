import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { testsKeys } from './tests-keys'
import type { PaginatedRecentTests } from '../types'

type UseRecentTestsParams = {
  page: number
  pageSize: number
}

/** Testes recentes do estúdio, paginado. Sem dado até `/tests/recent` existir na API. */
export function useRecentTests({ page, pageSize }: UseRecentTestsParams) {
  return useQuery({
    queryKey: testsKeys.recent(page, pageSize),
    queryFn: () => api.get<PaginatedRecentTests>(`/tests/recent?page=${page}&pageSize=${pageSize}`),
  })
}
