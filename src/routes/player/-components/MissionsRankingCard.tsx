import { EmptyState } from '@/components/common/EmptyState'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Icon } from '@/components/icon'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { usePlayerMissions } from '@/features/missions/api/use-player-missions'
import { useRankings } from '@/features/missions/api/use-rankings'
import { GoToLink } from './GoToLink'

export function MissionsRankingCard() {
  const missions = usePlayerMissions()
  const rankings = useRankings()

  return (
    <Card className="bg-surface">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <CardTitle className="text-sm">Missões e Ranking</CardTitle>
        <Icon name="info" className="size-4 shrink-0 text-muted" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <QueryBoundary
          query={rankings}
          loadingFallback={<Skeleton className="h-12 w-48" />}
          isEmpty={() => false}
        >
          {(data) => (
            <div className="flex flex-wrap gap-8">
              <Metric
                label="Ranking global (mês)"
                value={data.currentUserEntry ? `#${data.currentUserEntry.position}` : '—'}
              />
              <Metric
                label="Pontuação"
                value={data.currentUserEntry ? String(data.currentUserEntry.score) : '—'}
              />
            </div>
          )}
        </QueryBoundary>

        <QueryBoundary
          query={missions}
          loadingFallback={<Skeleton className="h-24 w-full" />}
          emptyFallback={
            <EmptyState
              icon="target"
              title="Nenhuma missão ativa"
              description="Novas missões aparecem aqui."
            />
          }
        >
          {(data) => (
            <ul className="flex flex-col gap-3">
              {data.map((mission) => (
                <li key={mission.key} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate text-foreground" title={mission.description ?? ''}>
                      {mission.name}
                    </span>
                    {mission.rewardXp ? (
                      <span className="shrink-0 text-xs text-success">+ {mission.rewardXp} XP</span>
                    ) : null}
                  </div>
                  <Progress value={(mission.progress / mission.target) * 100} className="h-2" />
                </li>
              ))}
            </ul>
          )}
        </QueryBoundary>
      </CardContent>
      <CardFooter className="justify-end">
        <GoToLink label="Ir para Missões e Ranking" />
      </CardFooter>
    </Card>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="text-lg font-semibold text-foreground">{value}</p>
    </div>
  )
}
