import { useQuery } from '@tanstack/react-query'
import type { StudioDashboard } from '@/api-types'
import { api } from '@/lib/api-client'
import { dashboardKeys } from './dashboard-keys'

/**
 * Home do estúdio (Tela 02): KPIs, jogos e testes mais recentes e o bloco de
 * estatísticas num único payload. RN-02: os KPIs vêm prontos da API — a UI não
 * recalcula nada.
 */
export function useStudioDashboard() {
  return useQuery({
    queryKey: dashboardKeys.studio(),
    queryFn: () => api.get<StudioDashboard>('/studio/dashboard'),
  })
}
