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
    // REMOVER — só pra testar o visual sem backend
    initialData: {
      page,
      pageSize,
      totalCount: 2554,
      items: [
        {
          id: '1',
          gameTitle: 'Racha de Rua!',
          testName: 'Pista Terra v1.3',
          testType: 'Demo aberta',
          status: 'in_progress',
          startDate: '2025-08-10',
          endDate: null,
          hasOrbitPlugin: true,
        },
        {
          id: '2',
          gameTitle: 'Racha de Rua!',
          testName: 'Teste Pointer GSX 2',
          testType: 'Demo aberta',
          status: 'completed',
          startDate: '2025-08-10',
          endDate: '2025-08-10',
          hasOrbitPlugin: true,
        },
        {
          id: '3',
          gameTitle: 'Racha de Rua!',
          testName: 'Teste Pointer GSX 2',
          testType: 'Demo aberta',
          status: 'generating_insights',
          startDate: '2025-08-10',
          endDate: '2025-08-10',
          hasOrbitPlugin: true,
        },
        {
          id: '4',
          gameTitle: 'Azura',
          testName: 'Teste Lin 1.6',
          testType: 'Demo aberta',
          status: 'generating_insights',
          startDate: '2025-08-10',
          endDate: '2025-08-10',
          hasOrbitPlugin: false,
        },
        {
          id: '5',
          gameTitle: 'Racha de Rua!',
          testName: 'Pista São Paulo v1.3',
          testType: 'Demo aberta',
          status: 'generating_insights',
          startDate: '2025-08-10',
          endDate: '2025-08-10',
          hasOrbitPlugin: true,
        },
      ],
    },
  })
}
