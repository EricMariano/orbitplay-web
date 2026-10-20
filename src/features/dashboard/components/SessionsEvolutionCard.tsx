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
import { EmptyState } from '@/components/common/EmptyState'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { sessionsEvolutionPoints } from '../sessions-evolution'

const formatDay = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })

export function SessionsEvolutionCard({ block }: { block: DashboardBlock }) {
  const points = sessionsEvolutionPoints(block)
  return (
    <Card className="min-w-0 gap-4 rounded-xl border-field-border/30 bg-field shadow-none">
      <CardHeader>
        <h3 className="font-label text-lg font-medium">Evolução de sessões válidas</h3>
        <p className="text-xs leading-5 text-muted">Últimos 30 dias · dias com sessões válidas</p>
      </CardHeader>
      <CardContent className="min-w-0">
        {points === null ? (
          <BlockState status={block.status === 'ready' ? 'unavailable' : block.status} />
        ) : points.length === 0 ? (
          <EmptyState
            icon="reports"
            title="Nenhuma sessão válida no período"
            description="A evolução aparecerá quando os jogadores concluírem sessões válidas."
          />
        ) : (
          <>
            <div
              className="h-64 min-w-0 w-full"
              role="img"
              aria-label="Gráfico de sessões válidas por dia"
            >
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart data={points} margin={{ top: 12, right: 12, bottom: 24, left: 0 }}>
                  <CartesianGrid
                    stroke="var(--field-border)"
                    strokeOpacity={0.15}
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDay}
                    stroke="var(--muted)"
                    fontSize={11}
                    label={{
                      value: 'Dia',
                      position: 'insideBottom',
                      offset: -15,
                      fill: 'var(--muted)',
                    }}
                  />
                  <YAxis
                    allowDecimals={false}
                    stroke="var(--muted)"
                    width={48}
                    fontSize={11}
                    label={{
                      value: 'Sessões',
                      angle: -90,
                      position: 'insideLeft',
                      fill: 'var(--muted)',
                    }}
                  />
                  <Tooltip
                    labelFormatter={(label) => formatDay(String(label))}
                    formatter={(value) => [value, 'Sessões válidas']}
                    contentStyle={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--field-border)',
                      color: 'var(--foreground)',
                    }}
                  />
                  <Line
                    type="linear"
                    dataKey="sessions"
                    name="Sessões válidas"
                    stroke="var(--primary)"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <table className="sr-only">
              <caption>Sessões válidas por dia nos últimos 30 dias</caption>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Sessões válidas</th>
                </tr>
              </thead>
              <tbody>
                {points.map((point) => (
                  <tr key={point.date}>
                    <td>{formatDay(point.date)}</td>
                    <td>{point.sessions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {block.computedAt && Number.isFinite(Date.parse(block.computedAt)) && (
              <p className="mt-2 text-xs text-muted">
                Calculado em {new Date(block.computedAt).toLocaleString('pt-BR')}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
