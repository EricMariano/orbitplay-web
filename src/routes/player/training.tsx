import { Link, createFileRoute } from '@tanstack/react-router'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { EmptyState } from '@/components/common/EmptyState'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { usePlayerHome } from '@/features/player/api/use-player-home'

export const Route = createFileRoute('/player/training')({ component: PlayerTrainingPage })

function PlayerTrainingPage() {
  const home = usePlayerHome()
  return (
    <QueryBoundary query={home}>
      {(data) => (
        <div className="mx-auto max-w-4xl space-y-6 font-login-body">
          <header>
            <p className="text-sm text-white/55">Prepare-se para participar</p>
            <h1 className="mt-1 font-login-display text-3xl">Tutorial e formação</h1>
          </header>
          <section className="rounded-2xl border border-white/15 bg-white/5 p-6">
            <Icon name="graduation-cap" className="size-9 text-[#168cf3]" />
            <h2 className="mt-4 text-xl font-semibold">Como funciona um playtest</h2>
            <ol className="mt-3 grid gap-2 text-sm text-white/70">
              <li>1. Reserve uma vaga em um teste disponível.</li>
              <li>2. Siga o tutorial e aceite os consentimentos solicitados.</li>
              <li>3. Jogue, responda à avaliação e acompanhe a validação.</li>
            </ol>
          </section>
          {data.continuing ? (
            <section className="rounded-2xl border border-[#168cf3]/40 bg-[#168cf3]/10 p-5">
              <h2 className="font-semibold">Próximo passo disponível</h2>
              <p className="mt-1 text-sm text-white/70">{data.continuing.title}</p>
              <Button asChild className="mt-4">
                <Link
                  to="/player/tests/$testId/tutorial"
                  params={{ testId: data.continuing.testId }}
                >
                  Abrir tutorial
                </Link>
              </Button>
            </section>
          ) : (
            <EmptyState
              icon="graduation-cap"
              title="Reserve um teste para começar"
              description="O tutorial de cada teste aparece aqui quando você tiver uma participação ativa."
            />
          )}
        </div>
      )}
    </QueryBoundary>
  )
}
