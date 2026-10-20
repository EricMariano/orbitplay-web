import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Tag } from '@/components/common/Tag'
import { Icon } from '@/components/icon'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTestReport } from '@/features/reports/api/use-test-report'
import { findBlock, TEST_STATUS } from '@/features/reports/report-labels'
import { useGame } from '@/features/games/api/use-game'
import { useTest } from '@/features/tests/api/use-test'
import { useTestModels } from '@/features/tests/api/use-test-models'
import { ReportExportMenu } from '@/features/reports/components/ReportExportMenu'
import { AllEvaluationsCard, EvaluationsCard } from './-components/EvaluationsCard'
import { EvolutionCard } from './-components/EvolutionCard'
import { InsightsCard } from './-components/InsightsCard'
import { OverviewCard } from './-components/OverviewCard'
import { SessionsTableCard } from './-components/SessionsTableCard'
import { TelemetryCard } from './-components/TelemetryCard'
import { TestersCard } from './-components/TestersCard'

const TABS = [
  { key: 'geral', label: 'Geral' },
  { key: 'testes', label: 'Todos os testes' },
  { key: 'avaliacoes', label: 'Todas as Avaliações' },
  { key: 'insights', label: 'Insights de IA' },
  { key: 'plugin', label: 'Orbit Plug-in' },
] as const

type ReportTab = (typeof TABS)[number]['key']

function isReportTab(value: unknown): value is ReportTab {
  return TABS.some((tab) => tab.key === value)
}

export const Route = createFileRoute('/studio/games/$gameId/tests/$testId')({
  validateSearch: (search: Record<string, unknown>): { tab?: ReportTab } =>
    isReportTab(search.tab) ? { tab: search.tab } : {},
  component: TestReportPage,
})

/** Relatório do teste (Tela 11): blocos independentes, cada um com o próprio status. */
function TestReportPage() {
  const { gameId, testId } = Route.useParams()
  const isSessionDetail = useRouterState({
    select: (state) => state.location.pathname.includes(`/tests/${testId}/sessions/`),
  })

  if (isSessionDetail) return <Outlet />

  return <TestReportContent gameId={gameId} testId={testId} />
}

function TestReportContent({ gameId, testId }: { gameId: string; testId: string }) {
  const { tab = 'geral' } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const game = useGame(gameId)
  const test = useTest(testId)
  const report = useTestReport(testId)

  const goToTab = (next: ReportTab) =>
    void navigate({ search: next === 'geral' ? {} : { tab: next } })

  return (
    <div className="mx-auto flex max-w-[1792px] flex-col gap-6 font-brand leading-[normal] text-foreground-strong lg:px-10">
      <nav className="text-[12px]" aria-label="breadcrumb">
        <Link to="/studio" className="hover:text-primary">
          Home
        </Link>{' '}
        &gt;{' '}
        <Link to="/studio/games" className="hover:text-primary">
          Jogos
        </Link>{' '}
        &gt;{' '}
        <Link to="/studio/games/$gameId" params={{ gameId }} className="hover:text-primary">
          {game.data?.title ?? '…'}
        </Link>{' '}
        &gt; <span>{test.data?.title ?? '…'}</span>
      </nav>

      <div className="flex items-center gap-6">
        <Link to="/studio/games" aria-label="Voltar para Meus jogos" className="hover:text-primary">
          <Icon name="arrow-left" className="size-9" />
        </Link>
        <h1 className="text-[32px] font-bold">Meu teste</h1>
      </div>

      <hr className="border-report-card-border" />

      <TestHeading testId={testId} />

      <Tabs value={tab} onValueChange={(v) => isReportTab(v) && goToTab(v)} className="gap-6">
        <div className="flex items-end overflow-x-auto">
          <TabsList variant="line" className="h-auto! gap-0 rounded-none p-0">
            {TABS.map(({ key, label }) => (
              <TabsTrigger
                key={key}
                value={key}
                className="flex-none rounded-none border-0 border-b border-foreground-strong px-3 pt-3 pb-4 text-[16px] font-normal text-foreground-strong after:hidden data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:pb-[15px] data-[state=active]:font-bold data-[state=active]:text-primary"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="h-px min-w-6 flex-1 bg-foreground-strong" />
        </div>

        <QueryBoundary query={report} loadingFallback={<ReportSkeleton />}>
          {(data) => (
            <>
              <TabsContent value="geral" className="flex flex-col gap-6">
                <OverviewCard block={findBlock(data, 'overview')} />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <EvolutionCard block={findBlock(data, 'evolution')} />
                  <EvaluationsCard
                    block={findBlock(data, 'evaluations')}
                    onSeeAll={() => goToTab('avaliacoes')}
                  />
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <TelemetryCard
                    block={findBlock(data, 'telemetry')}
                    onSeePlugin={() => goToTab('plugin')}
                  />
                  <TestersCard block={findBlock(data, 'tester_profile')} />
                </div>
                <SessionsTableCard
                  gameId={gameId}
                  testId={testId}
                  onSeeAll={() => goToTab('testes')}
                />
                <InsightsCard testId={testId} onSeeAll={() => goToTab('insights')} />
              </TabsContent>

              <TabsContent value="testes">
                <SessionsTableCard gameId={gameId} testId={testId} defaultPageSize={10} />
              </TabsContent>

              <TabsContent value="avaliacoes">
                <AllEvaluationsCard block={findBlock(data, 'evaluations')} />
              </TabsContent>

              <TabsContent value="insights">
                <InsightsCard testId={testId} />
              </TabsContent>

              <TabsContent value="plugin">
                <TelemetryCard block={findBlock(data, 'telemetry')} />
              </TabsContent>
            </>
          )}
        </QueryBoundary>
      </Tabs>
    </div>
  )
}

/** Nome do teste, modelo e status, com a descrição do modelo. */
function TestHeading({ testId }: { testId: string }) {
  const test = useTest(testId)
  const models = useTestModels()
  const model = models.data?.find((m) => m.key === test.data?.testModelKey)

  if (!test.data) {
    return test.isError ? null : <Skeleton className="h-16 w-1/2 bg-white/10" />
  }

  const status = TEST_STATUS[test.data.status]
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center gap-6">
        <h2 className="text-[32px] font-bold">{test.data.title ?? 'Teste sem nome'}</h2>
        {model ? <Tag tone="yellow">{model.name.toUpperCase()}</Tag> : null}
        <Tag tone={status.tone}>{status.label}</Tag>
        <div className="flex-1" />
        <ReportExportMenu testId={testId} />
        {/* Filtros do relatório ainda não têm definição de produto. */}
        <button
          type="button"
          disabled
          title="Filtros do relatório (em breve)"
          aria-label="Filtros do relatório"
          className="flex size-9 items-center justify-center rounded-lg bg-report-icon-button text-report-icon-button-foreground shadow-[inset_-2px_-2px_1px_0_rgb(255_255_255/25%)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Icon name="sliders" className="size-6" />
        </button>
      </div>
      {model ? <p className="text-[16px]">{model.description}</p> : null}
    </div>
  )
}

function ReportSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <Skeleton className="h-39 rounded-3xl bg-white/10" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Skeleton className="h-96 rounded-3xl bg-white/10" />
        <Skeleton className="h-96 rounded-3xl bg-white/10" />
      </div>
    </div>
  )
}
