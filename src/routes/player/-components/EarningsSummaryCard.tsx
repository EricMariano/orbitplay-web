import { Line, LineChart, ResponsiveContainer } from 'recharts'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Icon } from '@/components/icon'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useEarningsSummary } from '@/features/earnings/api/use-earnings-summary'
import { formatCurrency } from '@/lib/format'

export function EarningsSummaryCard() {
  const earnings = useEarningsSummary()

  return (
    <Card className="bg-surface">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-sm">Meu resumo de ganhos</CardTitle>
          <p className="text-xs text-muted">Ganhos acumulados nos últimos dias</p>
        </div>
        <Icon name="info" className="size-4 shrink-0 text-muted" />
      </CardHeader>
      <CardContent>
        <QueryBoundary query={earnings} loadingFallback={<Skeleton className="h-16 w-full" />}>
          {(data) => (
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-8">
                <Metric label="Últimos 7 dias" value={formatCurrency(data.last7Days)} />
                <Metric label="Total acumulado" value={formatCurrency(data.totalAccumulated)} />
                <Metric label="Próximo saque" value={`${data.nextPayoutInDays} dias`} />
              </div>
              <div className="h-16 w-full sm:w-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.series}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </QueryBoundary>
      </CardContent>
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
