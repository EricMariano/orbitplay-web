import { createFileRoute } from '@tanstack/react-router'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useOpportunities } from '@/features/opportunities/api/use-opportunities'

export const Route = createFileRoute('/player/')({
  component: PlayerHome,
})

function PlayerHome() {
  const opportunities = useOpportunities()

  return (
    <div>
      <PageHeader title="Início do Jogador" />
      <QueryBoundary
        query={opportunities}
        emptyFallback={
          <EmptyState
            icon="opportunities"
            title="Nenhuma oportunidade ainda"
            description="Quando a API estiver no ar, as oportunidades aparecerão aqui."
          />
        }
      >
        {(data) => (
          <Card className="bg-surface">
            <CardHeader>
              <CardTitle>Oportunidades</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted">
              {data.length} oportunidade(s) disponível(is).
            </CardContent>
          </Card>
        )}
      </QueryBoundary>
    </div>
  )
}
