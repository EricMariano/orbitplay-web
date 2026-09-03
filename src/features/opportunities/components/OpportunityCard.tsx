import { Link } from '@tanstack/react-router'
import type { Opportunity } from '@/api-types'
import { CoverBanner } from '@/components/common/CoverBanner'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatReward } from '../lib/reward-format'
import { getOpportunityStatusPresentation } from '../lib/opportunity-status'

type OpportunityCardProps = {
  opportunity: Opportunity
}

/**
 * Presentational: renders a single opportunity as a library card. Mirrors
 * `GameCard` — plain prop, no fetching (SRP).
 */
export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const status = getOpportunityStatusPresentation(opportunity.status)
  const canTest = opportunity.status === 'open' || opportunity.status === 'in_progress'

  return (
    <Card className="gap-0 overflow-hidden p-0">
      <CoverBanner
        seed={opportunity.gameId ?? opportunity.id}
        title={opportunity.title}
        className="h-36"
        topRight={<StatusBadge label={status.label} tone={status.tone} />}
      />
      <CardContent className="flex flex-col gap-3 px-4 py-4">
        <p className="truncate text-sm font-medium text-foreground">{opportunity.title}</p>
        <div className="flex items-start justify-between gap-2 text-xs">
          <div>
            <p className="text-muted">Recompensa</p>
            <p className="mt-0.5 font-medium text-foreground">{formatReward(opportunity.reward)}</p>
          </div>
          <div className="text-right">
            <p className="text-muted">Status</p>
            <p className="mt-0.5 font-medium text-foreground">{status.label}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {canTest ? (
            <Button asChild size="sm" className="flex-1">
              <Link to="/player/games/$id" params={{ id: opportunity.id }}>
                Testar jogo
              </Link>
            </Button>
          ) : (
            <Button size="sm" className="flex-1" disabled>
              Indisponível
            </Button>
          )}
          <Button asChild size="sm" variant="outline" aria-label="Reportar bug">
            <Link to="/player/reports">
              <Icon name="bug" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
