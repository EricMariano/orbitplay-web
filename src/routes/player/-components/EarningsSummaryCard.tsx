import { Line, LineChart, ResponsiveContainer } from 'recharts'
import type { PlayerHome } from '@/api-types'
import { Icon } from '@/components/icon'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCents } from '@/lib/format'

type EarningsSummaryCardProps = {
  earnings: PlayerHome['earnings']
}

export function EarningsSummaryCard({ earnings }: EarningsSummaryCardProps) {
  const series = earnings.series.map((point) => ({ ...point, value: point.amountCents / 100 }))
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
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-8">
            <Metric
              label="Últimos 7 dias"
              value={formatCents(earnings.last7DaysCents, earnings.currency)}
            />
            <Metric
              label="Ganhos validados"
              value={formatCents(earnings.totalValidatedCents, earnings.currency)}
            />
          </div>
          <div
            className="h-16 w-full sm:w-48"
            aria-label="Evolução de ganhos validados em sete dias"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
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
