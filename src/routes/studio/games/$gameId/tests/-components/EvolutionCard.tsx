import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import type { ReportBlockOf } from '@/api-types'
import { BlockContent, BlockMessage } from './BlockContent'
import { ReportCard } from './ReportCard'

const AXIS_TICK = { fill: 'var(--chart-axis)', fontSize: 14 }

/** "Evolução dos testes": sessões por semana desde o início do teste. */
export function EvolutionCard({ block }: { block: ReportBlockOf<'evolution'> | undefined }) {
  return (
    <ReportCard
      title="Evolução dos testes"
      info="Sessões iniciadas por semana, contadas a partir do início do teste."
      className="h-96"
    >
      <BlockContent block={block} unavailableMessage="Evolução indisponível.">
        {({ weeks }) =>
          weeks.length === 0 ? (
            <BlockMessage icon="empty">Nenhuma sessão iniciada ainda.</BlockMessage>
          ) : (
            <div className="min-h-0 flex-1" role="img" aria-label={describe(weeks)}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeks.map((w) => ({ label: `Semana ${w.week}`, sessions: w.sessions }))}
                  margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
                >
                  <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
                  <XAxis
                    dataKey="label"
                    tick={{ ...AXIS_TICK, fill: 'var(--foreground-strong)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis allowDecimals={false} tick={AXIS_TICK} axisLine={false} tickLine={false} />
                  <Bar
                    dataKey="sessions"
                    name="Sessões"
                    fill="var(--chart-bar)"
                    radius={[16, 16, 0, 0]}
                    maxBarSize={95}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )
        }
      </BlockContent>
    </ReportCard>
  )
}

function describe(weeks: { week: number; sessions: number }[]): string {
  return `Sessões por semana: ${weeks.map((w) => `semana ${w.week}, ${w.sessions}`).join('; ')}`
}
