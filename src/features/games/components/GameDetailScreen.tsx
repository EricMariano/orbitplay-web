import { Link } from '@tanstack/react-router'
import { CoverBanner } from '@/components/common/CoverBanner'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useGame } from '@/features/games/api/use-game'
import { getGameStatusPresentation } from '../lib/game-status'

type GameDetailScreenProps = {
  gameId: string
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

/**
 * Studio "Gerenciar" destination. Fetches one game via `useGame` (GET /games/{id})
 * and links onward to reports — the card itself never fetches (DIP).
 */
export function GameDetailScreen({ gameId }: GameDetailScreenProps) {
  const game = useGame(gameId)

  return (
    <div>
      <PageHeader
        title="Gerenciar jogo"
        breadcrumbs={[
          { label: 'Painel', to: '/studio' },
          { label: 'Jogos', to: '/studio/games' },
          { label: 'Detalhe' },
        ]}
      />
      <QueryBoundary
        query={game}
        emptyFallback={
          <EmptyState
            icon="games"
            title="Jogo não encontrado"
            description="Esse título não está na biblioteca do estúdio."
            action={
              <Button asChild size="sm">
                <Link to="/studio/games">Voltar aos jogos</Link>
              </Button>
            }
          />
        }
      >
        {(data) => {
          const status = getGameStatusPresentation(data.status)
          return (
            <Card className="max-w-xl gap-0 overflow-hidden p-0">
              <CoverBanner
                seed={data.id}
                title={data.title}
                imageUrl={data.coverUrl}
                topRight={<StatusBadge label={status.label} tone={status.tone} />}
              />
              <CardContent className="flex flex-col gap-4 px-5 py-5">
                <div>
                  <h2 className="text-lg font-medium text-foreground">{data.title}</h2>
                  <p className="mt-1 text-sm text-muted">
                    Cadastrado em {dateFormatter.format(new Date(data.createdAt))}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <Link to="/studio/reports">
                      <Icon name="bug" />
                      Relatórios de bugs
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/studio/tests">Ver testes</Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link to="/studio/games">Voltar à biblioteca</Link>
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
