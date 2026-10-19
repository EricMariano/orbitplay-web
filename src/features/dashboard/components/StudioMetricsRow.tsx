import type { DashboardKpis } from '@/api-types'
import { Icon, type IconName } from '@/components/icon'

type KpiConfig = {
  key: string
  label: string
  icon: IconName
  format: (value: number) => string
}

const formatRating = (value: number) => value.toFixed(1).replace('.', ',')
const formatRatio = (value: number) => `${Math.round(value * 100)}%`

/** Ordem e rótulos dos KPIs que a API calcula (RN-02). */
const kpis: KpiConfig[] = [
  { key: 'gamesTotal', label: 'Jogos', icon: 'gamepad', format: String },
  { key: 'testsTotal', label: 'Testes no total', icon: 'tests', format: String },
  { key: 'testsActive', label: 'Testes ativos', icon: 'checklist', format: String },
  { key: 'sessionsValid', label: 'Sessões válidas', icon: 'clock', format: String },
  { key: 'playersTotal', label: 'Jogadores', icon: 'users', format: String },
  { key: 'averageRating', label: 'Nota média', icon: 'score', format: formatRating },
  { key: 'completionRate', label: 'Taxa de conclusão', icon: 'target', format: formatRatio },
]

/** Tira de KPIs gerais do estúdio (Tela 02). Valor ausente (`null`) aparece como "—". */
export function StudioMetricsRow({ values }: { values: DashboardKpis }) {
  return (
    <dl className="flex flex-wrap gap-x-8 gap-y-3">
      {kpis.map((kpi) => {
        const value = values[kpi.key]?.value ?? null
        return (
          <div key={kpi.key} className="flex items-center gap-2">
            <Icon name={kpi.icon} className="size-4 text-muted" />
            <div>
              <dt className="text-xs text-foreground-strong">{kpi.label}</dt>
              <dd className="text-base font-semibold text-foreground-strong">
                {value === null ? '—' : kpi.format(value)}
              </dd>
            </div>
          </div>
        )
      })}
    </dl>
  )
}
