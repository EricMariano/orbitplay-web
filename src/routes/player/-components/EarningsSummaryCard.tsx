import type { PlayerHome } from '@/api-types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCents } from '@/lib/format'

type EarningsSummaryCardProps = {
  earnings: PlayerHome['earnings']
}

export function EarningsSummaryCard({ earnings }: EarningsSummaryCardProps) {
  return (
    <Card className="rounded-2xl! border border-white bg-white/20">
      <CardHeader className="gap-0">
        <CardTitle className="text-sm">Meu resumo de ganhos</CardTitle>
        <p className="text-xs text-muted">Ganhos acumulados nos últimos dias</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Metric
            label="Últimos 7 dias"
            value={formatCents(earnings.last7DaysCents, earnings.currency)}
          />
          <Metric
            label="Total acumulado"
            value={formatCents(earnings.totalValidatedCents, earnings.currency)}
          />
          {/* Sem campo de próximo saque na API ainda. */}
          <Metric label="Próximo saque" value="—" />
        </div>
      </CardContent>
    </Card>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted">{label}</p>
      <p className="text-xl font-bold text-foreground">{value}</p>
    </div>
  )
}
