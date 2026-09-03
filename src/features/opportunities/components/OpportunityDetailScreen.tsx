import { Link } from '@tanstack/react-router'
import type { Opportunity } from '@/api-types'
import { CoverBanner } from '@/components/common/CoverBanner'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useOpportunities } from '@/features/opportunities/api/use-opportunities'
import { getOpportunityStatusPresentation } from '../lib/opportunity-status'
import { formatReward } from '../lib/reward-format'

type OpportunityDetailScreenProps = {
  opportunityId: string
}

function findOpportunity(opportunities: Opportunity[], id: string): Opportunity | undefined {
  return opportunities.find((item) => item.id === id)
}

/**
 * Player "Testar jogo" destination. There is no GET /opportunities/{id} on
 * the contract, so this reuses the list query (same cache key) and picks
 * the item — still no fetch inside the card (DIP).
 */
export function OpportunityDetailScreen({ opportunityId }: OpportunityDetailScreenProps) {
  const opportunities = useOpportunities()

  return (
    <div>
      <PageHeader
        title="Testar jogo"
        breadcrumbs={[
          { label: 'Início', to: '/player' },
          { label: 'Meus jogos', to: '/player/games' },
          { label: 'Teste' },
        ]}
      />
      <QueryBoundary
        query={opportunities}
        emptyFallback={
          <EmptyState
            icon="opportunities"
            title="Nenhuma oportunidade"
            description="Quando a API listar oportunidades, você poderá iniciar um teste por aqui."
            action={
              <Button asChild size="sm">
                <Link to="/player/games">Voltar aos jogos</Link>
              </Button>
            }
          />
        }
      >
        {(data) => {
          const opportunity = findOpportunity(data, opportunityId)
          if (!opportunity) {
            return (
              <EmptyState
                icon="opportunities"
                title="Oportunidade não encontrada"
                description="Esse título não está na sua lista de testes."
                action={
                  <Button asChild size="sm">
                    <Link to="/player/games">Voltar aos jogos</Link>
                  </Button>
                }
              />
            )
          }

          const status = getOpportunityStatusPresentation(opportunity.status)
          const canTest = opportunity.status === 'open' || opportunity.status === 'in_progress'

          return (
            <Card className="max-w-xl gap-0 overflow-hidden p-0">
              <CoverBanner
                seed={opportunity.gameId ?? opportunity.id}
                title={opportunity.title}
                className="h-36"
                topRight={<StatusBadge label={status.label} tone={status.tone} />}
              />
              <CardContent className="flex flex-col gap-4 px-5 py-5">
                <div>
                  <h2 className="text-lg font-medium text-foreground">{opportunity.title}</h2>
                  <p className="mt-1 text-sm text-muted">
                    Recompensa {formatReward(opportunity.reward)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" disabled={!canTest}>
                    {canTest ? 'Sessão de teste em breve' : 'Indisponível'}
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/player/reports">
                      <Icon name="bug" />
                      Relatar bug
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link to="/player/games">Voltar à biblioteca</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        }}
      </QueryBoundary>
    </div>
  )
}
