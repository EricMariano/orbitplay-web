import { createFileRoute, Link } from '@tanstack/react-router'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useTest } from '@/features/tests/api/use-test'

const NEXT_STEPS = [
  'Revise as configurações do teste.',
  'Compartilhe o convite com os jogadores, se necessário.',
  'Acompanhe os participantes recrutados.',
  'Monitore o andamento das sessões.',
  'Analise feedbacks e telemetria após o início dos testes.',
]

export const Route = createFileRoute('/studio/tests/$testId/completed')({
  component: TestPublishedPage,
})

function TestPublishedPage() {
  const { testId } = Route.useParams()
  const test = useTest(testId)

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <nav className="text-sm text-muted" aria-label="breadcrumb">
        <Link to="/studio" className="hover:text-primary">
          Home
        </Link>{' '}
        &gt;{' '}
        <Link to="/studio/games" className="hover:text-primary">
          Jogos
        </Link>{' '}
        &gt; <span>Teste publicado</span>
      </nav>

      <QueryBoundary query={test} loadingFallback={<Skeleton className="h-[34rem] w-full" />}>
        {(data) => (
          <section className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm sm:p-10">
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
                <Icon name="score" className="size-8" />
              </div>
              <h1 className="text-3xl font-bold text-foreground-strong">Teste publicado!</h1>
              <p className="mt-2 text-muted">
                O teste foi publicado com sucesso e já pode receber participantes.
              </p>

              <div className="mt-8 w-full rounded-lg border border-border bg-surface/50 p-5 text-left">
                <h2 className="text-lg font-semibold text-foreground-strong">Próximos passos</h2>
                <ol className="mt-4 space-y-3">
                  {NEXT_STEPS.map((step) => (
                    <li key={step} className="flex items-start gap-3 text-sm text-muted">
                      <Icon name="check" className="mt-0.5 size-4 text-success" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-4 w-full rounded-lg border border-border p-5 text-left">
                <h2 className="text-lg font-semibold text-foreground-strong">Resumo do teste</h2>
                <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-muted">Jogo</dt>
                    <dd className="font-medium text-foreground-strong">{data.gameId}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Teste</dt>
                    <dd className="font-medium text-foreground-strong">
                      {data.title ?? 'Teste sem nome'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted">Participantes</dt>
                    <dd className="font-medium text-foreground-strong">
                      {data.audience?.quantity ?? data.spotsTotal ?? '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted">Duração</dt>
                    <dd className="font-medium text-foreground-strong">
                      {data.audience?.durationDays != null
                        ? `${data.audience.durationDays} dias`
                        : '—'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8 flex w-full flex-col-reverse justify-between gap-3 sm:flex-row">
                <Button asChild variant="outline">
                  <Link to="/studio/games">Voltar para meus jogos</Link>
                </Button>
                <Button asChild>
                  <Link
                    to="/studio/games/$gameId/tests/$testId"
                    params={{ gameId: data.gameId, testId }}
                  >
                    Ver relatório do teste
                    <Icon name="arrow-right" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}
      </QueryBoundary>
    </div>
  )
}
