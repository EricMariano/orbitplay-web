import type { DashboardKpis } from '@/api-types'
import { Icon, type IconName } from '@/components/icon'
import { formatDecimal, formatPercent } from '@/lib/format'

const countFormatter = new Intl.NumberFormat('pt-BR')
const kpis: { key: string; label: string; icon: IconName; format: (value: number) => string }[] = [
  { key: 'gamesTotal', label: 'Jogos cadastrados', icon: 'gamepad', format: countFormatter.format },
  { key: 'testsTotal', label: 'Testes no total', icon: 'tests', format: countFormatter.format },
  { key: 'testsActive', label: 'Testes ativos', icon: 'checklist', format: countFormatter.format },
  { key: 'sessionsValid', label: 'Sessões válidas', icon: 'clock', format: countFormatter.format },
  { key: 'playersTotal', label: 'Jogadores', icon: 'users', format: countFormatter.format },
  { key: 'averageRating', label: 'Nota média', icon: 'star', format: formatDecimal },
  { key: 'completionRate', label: 'Taxa de conclusão', icon: 'target', format: formatPercent },
]

/** KPIs consolidados pelo backend: zero é um valor, null permanece indisponível. */
export function StudioMetricsRow({ values }: { values: DashboardKpis }) {
  return (
    <dl
      aria-label="Indicadores do estúdio"
      className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 xl:grid-cols-7"
    >
      {kpis.map((kpi) => {
        const value = values[kpi.key]?.value
        return (
          <div key={kpi.key} className="flex min-w-0 items-start gap-2.5">
            <Icon name={kpi.icon} className="mt-1 size-4 text-primary" />
            <div className="flex min-w-0 flex-col gap-1">
              <dt className="text-xs leading-5 text-muted">{kpi.label}</dt>
              <dd className="order-first font-label text-2xl font-semibold tabular-nums text-foreground-strong">
                {value == null ? (
                  <span title="Ainda não há dados suficientes">—</span>
                ) : (
                  kpi.format(value)
                )}
              </dd>
            </div>
          </div>
        )
      })}
    </dl>
  )
}
