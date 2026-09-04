import { Icon, type IconName } from '@/components/icon'
import type { StudioSummary } from '../types'

type MetricConfig = {
  key: keyof StudioSummary
  label: string
  icon: IconName
  format: (value: number) => string
}

const metrics: MetricConfig[] = [
  { key: 'gamesTestedCount', label: 'Jogos Testados', icon: 'games', format: String },
  { key: 'testsCompletedCount', label: 'Testes Realizados', icon: 'tests', format: String },
  {
    key: 'gameplayHoursTested',
    label: 'Horas de Gameplay Testadas',
    icon: 'clock',
    format: String,
  },
  {
    key: 'averageTestScore',
    label: 'Nota Média dos Testes',
    icon: 'score',
    format: (v) => v.toFixed(1).replace('.', ','),
  },
  {
    key: 'averageEngagementRate',
    label: 'Engajamento Médio',
    icon: 'target',
    format: (v) => `${Math.round(v * 100)}%`,
  },
  {
    key: 'aiInsightsGeneratedCount',
    label: 'Insights Gerados pela IA',
    icon: 'insights',
    format: String,
  },
  {
    key: 'testsWithActivePluginCount',
    label: 'Testes com Plugin Ativo',
    icon: 'plug',
    format: String,
  },
]

/** Tira de KPIs gerais do estúdio (Tela 02). Puramente apresentacional. */
export function StudioMetricsRow({ summary }: { summary: StudioSummary }) {
  return (
    <dl className="flex flex-wrap gap-x-8 gap-y-3">
      {metrics.map((metric) => (
        <div key={metric.key} className="flex items-center gap-2">
          <Icon name={metric.icon} className="size-4 text-muted" />
          <div>
            <dt className="text-xs text-foreground-strong">{metric.label}</dt>
            <dd className="text-base font-semibold text-foreground-strong">
              {metric.format(summary[metric.key])}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  )
}
