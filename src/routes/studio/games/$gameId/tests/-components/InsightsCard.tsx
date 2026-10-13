import { useEffect, useState } from 'react'
import type { Insight, InsightCategory } from '@/api-types'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Tag } from '@/components/common/Tag'
import { Icon, type IconName } from '@/components/icon'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useTestInsights } from '@/features/reports/api/use-test-insights'
import { INSIGHT_CATEGORIES } from '@/features/reports/report-labels'
import { BlockMessage } from './BlockContent'
import { ReportCard } from './ReportCard'

const SEARCH_DEBOUNCE_MS = 300
const ALL_CATEGORIES = 'all'

function useDebounced(value: string, delayMs: number): string {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])
  return debounced
}

type InsightsCardProps = {
  testId: string
  onSeeAll?: () => void
}

/** "Insights de IA": busca e filtro no servidor (`GET /tests/{id}/insights`). */
export function InsightsCard({ testId, onSeeAll }: InsightsCardProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<InsightCategory | null>(null)
  const q = useDebounced(search.trim(), SEARCH_DEBOUNCE_MS)
  const insights = useTestInsights({ testId, q, category })

  return (
    <ReportCard
      title="Insights de IA"
      icon={<Icon name="insights" className="size-6" />}
      subtitle={insights.data?.model ? `Powered by ${insights.data.model}` : undefined}
      info="Cada insight é gerado por IA a partir das sessões e aponta a evidência de origem. Não substitui o dado bruto."
      link={onSeeAll ? { label: 'Ir para Todos os insights de IA', onClick: onSeeAll } : undefined}
    >
      <div className="flex flex-wrap items-end gap-6">
        <label className="flex w-full max-w-104 flex-col gap-1">
          <span className="text-[16px] font-bold">Buscar</span>
          <span className="flex h-11.5 items-center gap-3 rounded-xl border border-report-card-border bg-field px-4 focus-within:ring-2 focus-within:ring-ring">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Digite..."
              className="min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-foreground-strong"
            />
            <Icon name="search" className="size-6" />
          </span>
        </label>

        <div className="hidden flex-1 md:block" />

        {/* Exportar insights depende da geração por IA (deferida). */}
        <div className="flex gap-6">
          <ExportButton icon="file-pdf" label="Exportar insights em PDF" />
          <ExportButton icon="file-sheet" label="Exportar insights em planilha" />
          <ExportButton icon="download" label="Baixar insights" />
        </div>

        <label className="flex w-full max-w-104 flex-col gap-1">
          <span className="text-[16px] font-bold">Filtrar por categoria</span>
          <Select
            value={category ?? ALL_CATEGORIES}
            onValueChange={(v) => setCategory(v === ALL_CATEGORIES ? null : (v as InsightCategory))}
          >
            <SelectTrigger className="h-11.5! w-full rounded-xl border-report-card-border bg-field! px-4 text-[16px] text-foreground-strong">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_CATEGORIES}>Todas as categorias</SelectItem>
              {INSIGHT_CATEGORIES.map((c) => (
                <SelectItem key={c.key} value={c.key}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      </div>

      <QueryBoundary query={insights} isEmpty={() => false} loadingFallback={<InsightsSkeleton />}>
        {(result) =>
          result.status === 'unavailable' ? (
            <BlockMessage>
              Os insights de IA ainda não estão disponíveis para este teste. Eles aparecem aqui
              assim que a geração por IA for ativada.
            </BlockMessage>
          ) : result.status === 'processing' ? (
            <BlockMessage>Gerando insights a partir das sessões…</BlockMessage>
          ) : result.status === 'failed' ? (
            <BlockMessage icon="alert">
              Não foi possível gerar os insights deste teste.
            </BlockMessage>
          ) : result.data.length === 0 ? (
            <BlockMessage icon="empty">Nenhum insight encontrado com esses filtros.</BlockMessage>
          ) : (
            <ul className="grid grid-cols-1 gap-6 pt-3.5 sm:grid-cols-2 xl:grid-cols-4">
              {result.data.map((insight) => (
                <InsightTile key={insight.id} insight={insight} />
              ))}
            </ul>
          )
        }
      </QueryBoundary>
    </ReportCard>
  )
}

function ExportButton({ icon, label }: { icon: IconName; label: string }) {
  return (
    <button
      type="button"
      disabled
      title={`${label} (disponível quando houver insights)`}
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-lg bg-report-icon-button text-report-icon-button-foreground shadow-[inset_-2px_-2px_1px_0_rgb(255_255_255/25%)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Icon name={icon} className="size-6" />
    </button>
  )
}

function InsightTile({ insight }: { insight: Insight }) {
  const category = INSIGHT_CATEGORIES.find((c) => c.key === insight.category)
  return (
    <li className="relative flex h-50 flex-col gap-2 rounded-tl-[8px] rounded-br-[8px] border-2 border-report-icon-button p-4">
      <h3 className="pe-24 text-[16px] font-bold">{insight.title}</h3>
      {category ? (
        <Tag tone={category.tone} className="absolute top-0 right-0">
          {category.label}
        </Tag>
      ) : null}
      <p className="line-clamp-5 text-[16px]">{insight.body}</p>
    </li>
  )
}

function InsightsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-50 bg-white/10" />
      ))}
    </div>
  )
}
