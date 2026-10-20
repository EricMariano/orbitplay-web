import type { DashboardKpis } from '@/api-types'
import { Icon } from '@/components/icon'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { formatDecimal, formatPercent } from '@/lib/format'

export function StudioResultsCard({ values }: { values: DashboardKpis }) {
  const completion = values.completionRate?.value
  const rating = values.averageRating?.value
  return (
    <Card
      role="region"
      aria-label="Resultados dos testes"
      className="h-full gap-5 rounded-xl border-field-border/30 bg-field shadow-none"
    >
      <CardHeader>
        <h3 className="font-label text-lg font-medium">Resultados dos testes</h3>
        <p className="text-xs leading-5 text-muted">
          Indicadores consolidados de todos os seus jogos.
        </p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-around gap-6">
        <div>
          <div className="mb-3 flex items-end justify-between gap-3">
            <span className="flex items-center gap-2 text-sm">
              <Icon name="target" className="text-primary" />
              Taxa de conclusão
            </span>
            <strong className="font-label text-2xl tabular-nums">
              {completion == null ? '—' : formatPercent(completion)}
            </strong>
          </div>
          {completion != null && (
            <div
              role="meter"
              aria-label="Taxa de conclusão"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(completion * 100)}
              className="h-2 overflow-hidden rounded-full bg-surface-raised"
            >
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.min(100, Math.max(0, completion * 100))}%` }}
              />
            </div>
          )}
          <p className="mt-2 text-xs leading-5 text-muted">
            {completion == null
              ? 'Disponível após as primeiras participações.'
              : 'Sessões concluídas em relação às participações.'}
          </p>
        </div>
        <div className="border-t border-field-border/20 pt-5">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm">
              <Icon name="star" className="text-warning" />
              Nota média dos jogos
            </span>
            <strong className="font-label text-2xl tabular-nums">
              {rating == null ? '—' : `${formatDecimal(rating)} / 5`}
            </strong>
          </div>
          <p className="mt-2 text-xs leading-5 text-muted">
            {rating == null
              ? 'Disponível quando os jogadores enviarem avaliações.'
              : 'Média das avaliações recebidas pelos seus jogos.'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
