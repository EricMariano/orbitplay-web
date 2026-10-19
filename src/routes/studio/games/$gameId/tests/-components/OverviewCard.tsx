import type { ReportBlockOf } from '@/api-types'
import { formatDecimal, formatDuration, formatPercent } from '@/lib/format'
import { BlockContent } from './BlockContent'
import { AI_PENDING_HINT, ReportCard, ReportField, ReportFields } from './ReportCard'

const orNull = <T, R>(value: T | null, format: (value: T) => R): R | null =>
  value === null ? null : format(value)

/** Cartão "Geral": KPIs do teste (bloco `overview`). */
export function OverviewCard({ block }: { block: ReportBlockOf<'overview'> | undefined }) {
  return (
    <ReportCard
      title="Geral"
      subtitle="Resumo de todas as sessões do teste"
      info="Retenção = sessões concluídas ÷ participações. Nota da IA, fator diversão e bugs vêm dos insights de IA."
    >
      <BlockContent block={block} unavailableMessage="Resumo indisponível.">
        {(overview) => (
          <ReportFields>
            <ReportField
              label="Total de testes"
              value={overview.totalParticipations.toLocaleString('pt-BR')}
            />
            <ReportField
              label="Tempo médio da sessão"
              value={orNull(overview.averageDurationMs, formatDuration)}
              unavailableHint="Ainda não há sessões concluídas."
            />
            <ReportField
              label="Nota média da IA"
              value={orNull(overview.aiScore, formatDecimal)}
              unavailableHint={AI_PENDING_HINT}
            />
            <ReportField
              label="Testadores envolvidos"
              value={overview.testersCount.toLocaleString('pt-BR')}
            />
            <ReportField
              label="Fator diversão"
              value={orNull(overview.funFactor, formatDecimal)}
              unavailableHint={AI_PENDING_HINT}
            />
            <ReportField
              label="Bugs e Glitches"
              value={orNull(overview.bugsCount, (n) => n.toLocaleString('pt-BR'))}
              unavailableHint={AI_PENDING_HINT}
            />
            <ReportField
              label="Retenção"
              value={orNull(overview.completionRate, formatPercent)}
              unavailableHint="Ainda não há participações."
            />
          </ReportFields>
        )}
      </BlockContent>
    </ReportCard>
  )
}
