import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Icon } from '@/components/icon'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useMissionsRanking } from '@/features/missions/api/use-missions-ranking'
import { formatCurrency } from '@/lib/format'
import { GoToLink } from './GoToLink'

const categoryColors = [
  'var(--danger)',
  'var(--warning)',
  'var(--g-violet)',
  'var(--success)',
  'var(--info)',
]

export function MissionsRankingCard() {
  const missions = useMissionsRanking()

  return (
    <Card className="bg-surface">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <CardTitle className="text-sm">Missões e Ranking</CardTitle>
        <Icon name="info" className="size-4 shrink-0 text-muted" />
      </CardHeader>
      <CardContent>
        <QueryBoundary query={missions} loadingFallback={<Skeleton className="h-40 w-full" />}>
          {(data) => (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-8">
                <Metric
                  label="Ranking"
                  value={String(data.rank)}
                  hint={data.rankDelta !== 0 ? `↑ ${data.rankDelta}` : undefined}
                />
                <Metric label="Pendente" value={String(data.pending)} />
                <Metric label="Próx. meta" value={formatCurrency(data.nextGoal)} />
              </div>
              <div className="flex items-center gap-6">
                <div className="size-32 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.categories}
                        dataKey="value"
                        nameKey="label"
                        innerRadius={38}
                        outerRadius={56}
                        paddingAngle={2}
                        strokeWidth={0}
                      >
                        {data.categories.map((entry, i) => (
                          <Cell
                            key={entry.label}
                            fill={categoryColors[i % categoryColors.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="space-y-1.5 text-xs text-muted">
                  {data.categories.map((entry, i) => (
                    <li key={entry.label} className="flex items-center gap-2">
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: categoryColors[i % categoryColors.length] }}
                      />
                      {entry.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </QueryBoundary>
      </CardContent>
      <CardFooter className="justify-end">
        <GoToLink label="Ir para Missões e Ranking" />
      </CardFooter>
    </Card>
  )
}

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="flex items-center gap-1 text-lg font-semibold text-foreground">
        {value}
        {hint ? <span className="text-xs font-medium text-success">{hint}</span> : null}
      </p>
    </div>
  )
}
