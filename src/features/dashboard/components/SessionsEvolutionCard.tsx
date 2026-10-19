import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DashboardBlock } from '@/api-types'
import { BlockState } from '@/components/common/BlockState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { sessionsEvolutionPoints } from '../sessions-evolution'

const formatDay = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })

/** Estatísticas (Tela 02): sessões válidas por dia, vindas do bloco `stats` do dashboard. */
export function SessionsEvolutionCard({ block }: { block: DashboardBlock }) {
  const points = sessionsEvolutionPoints(block)

  return (
    <Card className="rounded-lg border border-white bg-stat-card-background py-4">
      <CardHeader className="px-4">
        <CardTitle className="text-sm font-medium text-stat-card-foreground">
          Sessões válidas por dia
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        {points === null ? (
          <BlockState status={block.status === 'ready' ? 'unavailable' : block.status} />
        ) : points.length === 0 ? (
          <BlockState status="unavailable" />
        ) : (
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={points}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDay}
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                />
                <YAxis allowDecimals={false} stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  labelFormatter={(label) => formatDay(String(label))}
                  formatter={(value) => [value, 'Sessões']}
                />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
