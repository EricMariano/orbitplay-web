import { Link } from '@tanstack/react-router'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useTestReport } from '@/features/reports/api/use-test-report'

type ReportsScreenProps = {
  audience: 'studio' | 'player'
  testId?: string
}

function ReportBody({ testId }: { testId: string }) {
  const report = useTestReport(testId)

  return (
    <QueryBoundary
      query={report}
      emptyFallback={
        <EmptyState
          icon="reports"
          title="Relatório vazio"
          description="A API respondeu, mas este teste ainda não tem conteúdo."
        />
      }
    >
      {(data) => (
        <Card className="max-w-2xl">
          <CardContent className="flex flex-col gap-4 px-5 py-5">
            <div>
              <h2 className="text-lg font-medium text-foreground">Relatório {data.id}</h2>
              <p className="mt-1 text-sm text-muted">Teste {data.testId}</p>
            </div>
            <p className="text-sm text-foreground">{data.summary}</p>
            {data.score != null ? (
              <p className="text-sm text-muted">Pontuação {data.score}</p>
            ) : null}
            {data.sections?.map((section) => (
              <div key={section.title} className="space-y-1">
                <h3 className="text-sm font-medium text-foreground">{section.title}</h3>
                <p className="text-sm text-muted">{section.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </QueryBoundary>
  )
}

/**
 * Relatórios de bugs. The contract only exposes GET /tests/{id}/report, so
 * without `?testId=` this is an empty state with a path back to the library.
 */
export function ReportsScreen({ audience, testId }: ReportsScreenProps) {
  const homeTo = audience === 'studio' ? '/studio' : '/player'
  const homeLabel = audience === 'studio' ? 'Painel' : 'Início'

  return (
    <div>
      <PageHeader
        title={audience === 'studio' ? 'Relatórios de bugs' : 'Relatórios enviados'}
        breadcrumbs={[{ label: homeLabel, to: homeTo }, { label: 'Relatórios' }]}
      />
      {testId ? (
        <ReportBody testId={testId} />
      ) : (
        <EmptyState
          icon="reports"
          title="Nenhum relatório selecionado"
          description="A API só entrega um relatório por id de teste (GET /tests/{id}/report). Abra um relatório a partir de um teste, ou volte à biblioteca."
          action={
            <Button asChild size="sm">
              {audience === 'studio' ? (
                <Link to="/studio/games">Ir para jogos</Link>
              ) : (
                <Link to="/player/games">Ir para meus jogos</Link>
              )}
            </Button>
          }
        />
      )}
    </div>
  )
}
