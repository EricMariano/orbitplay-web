export type RecentTestStatus = 'in_progress' | 'completed' | 'generating_insights'

/**
 * Linha da tabela "Testes recentes" (Tela 02 / Tela 05). Endpoint ainda não
 * existe no contrato — mover para src/api-types quando o backend expuser
 * `/tests/recent` (paginado).
 */
export type RecentTest = {
  id: string
  gameTitle: string
  testName: string
  testType: string
  status: RecentTestStatus
  startDate: string
  endDate: string | null
  hasOrbitPlugin: boolean
}

export type PaginatedRecentTests = {
  items: RecentTest[]
  page: number
  pageSize: number
  totalCount: number
}
