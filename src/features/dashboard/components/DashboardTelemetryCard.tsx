import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { Test, ReportBlockOf } from '@/api-types'
import { BlockState } from '@/components/common/BlockState'
import { EmptyState } from '@/components/common/EmptyState'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTestReport } from '@/features/reports/api/use-test-report'
import { findBlock } from '@/features/reports/report-labels'

/** O resumo é de um teste recente, nunca apresentado como agregado da organização. */
export function DashboardTelemetryCard({ tests }: { tests: Test[] }) {
  const available = tests.filter((test) => test.status !== 'draft')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = available.find((test) => test.id === selectedId) ?? available[0]
  const report = useTestReport(selected?.id ?? '')

  return (
    <Card
      role="region"
      aria-label="Telemetria / Orbit Plug-in"
      className="h-full gap-4 rounded-xl border-plugin-card-border/50 bg-plugin-card-background shadow-none"
    >
      <CardHeader>
        <h3 className="flex items-center gap-2 font-label text-lg font-medium">
          <Icon name="plug" className="size-5 text-highlight" />
          Telemetria / Orbit Plug-in
        </h3>
        <p className="text-xs leading-5 text-muted">
          Acompanhe a telemetria de um dos seus testes recentes.
        </p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5">
        {selected ? (
          <>
            <Select value={selected.id} onValueChange={setSelectedId}>
              <SelectTrigger
                aria-label="Teste de telemetria"
                className="w-full min-w-0 border-field-border/30 bg-field"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {available.map((test) => (
                  <SelectItem key={test.id} value={test.id}>
                    {test.title ?? 'Teste sem nome'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <QueryBoundary query={report} isEmpty={() => false}>
              {(data) => <TelemetrySummary block={findBlock(data, 'telemetry')} />}
            </QueryBoundary>
            <div className="mt-auto flex justify-end">
              <Button asChild variant="outline" size="sm">
                <Link
                  to="/studio/games/$gameId/tests/$testId"
                  params={{ gameId: selected.gameId, testId: selected.id }}
                  search={{ tab: 'plugin' }}
                >
                  Abrir telemetria do teste
                  <Icon name="arrow-right" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <EmptyState
            icon="plug"
            title="Publique um teste para acompanhar a telemetria"
            description="Os dados do Orbit Plug-in aparecerão aqui quando houver sessões de uma build integrada."
          />
        )}
      </CardContent>
    </Card>
  )
}

function TelemetrySummary({ block }: { block: ReportBlockOf<'telemetry'> | undefined }) {
  if (block?.status === 'processing' || block?.status === 'failed')
    return <BlockState status={block.status} />
  if (block?.status !== 'ready' || !block.payload)
    return (
      <EmptyState
        icon="plug"
        title="Sem telemetria neste teste"
        description="Integre o Orbit Plug-in à build do jogo para acompanhar sessões e gatilhos."
      />
    )
  const telemetry = block.payload
  return (
    <dl className="grid grid-cols-2 gap-5 sm:grid-cols-3">
      {[
        ['Sessões analisadas', telemetry.sessionsAnalyzed],
        ['Gatilhos ativos', telemetry.activeTriggers],
        ['Descobertas de IA', telemetry.discoveries?.length ?? null],
      ].map(([label, value]) => (
        <div key={label} className="flex flex-col gap-2">
          <dt className="text-xs text-muted">{label}</dt>
          <dd className="font-label text-2xl font-semibold tabular-nums">
            {value == null ? (
              <span title="Análise ainda não disponível">—</span>
            ) : (
              value.toLocaleString('pt-BR')
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}
