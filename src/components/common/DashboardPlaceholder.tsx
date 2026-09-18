import { EmptyState } from '@/components/common/EmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Blocos da Home Estúdio que dependem de endpoints ainda não expostos pela
 * API (KPIs, telemetria, benchmark, testes recentes). Mantido isolado para
 * não travar o resto da tela, e para trocar por dado real numa única troca
 * de componente quando o backend entregar.
 */
export function DashboardPlaceholder({ title }: { title: string }) {
  return (
    <Card className="bg-surface">
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          icon="dashboard"
          title="Aguardando dados do backend"
          description="Este bloco depende de um endpoint que ainda não existe no contrato da API."
        />
      </CardContent>
    </Card>
  )
}
