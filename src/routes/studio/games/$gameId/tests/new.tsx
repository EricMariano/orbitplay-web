import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Stepper } from '@/components/common/Stepper'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { TestModelCard } from '@/features/tests/components/TestModelCard'
import { useTestModels } from '@/features/tests/api/use-test-models'
import type { TestModelView } from '@/features/tests/types'

export const Route = createFileRoute('/studio/games/$gameId/tests/new')({
  component: NewTestWizard,
})

const CARD_ORDER: TestModelView['key'][] = [
  'free_exploration_telemetry',
  'free_exploration',
  'ab_test',
  'ab_test_images',
]
const WIZARD_STEPS = ['Tipo', 'Avaliação', 'Build', 'Orçamento']

function NewTestWizard() {
  const { gameId } = Route.useParams()
  void gameId // TODO: usar quando a rota /studio/games/$gameId existir de verdade
  const navigate = useNavigate()
  const testModels = useTestModels()
  const [selectedKey, setSelectedKey] = useState<TestModelView['key'] | null>(null)

  return (
    <div className="space-y-6">
      <nav className="text-sm text-muted">
        <Link to="/studio" className="hover:text-primary">
          Home
        </Link>{' '}
        › <span>jogos</span> ›{' '}
        <Link to="/studio/games" className="hover:text-primary">
          Configuração
        </Link>{' '}
        › <span className="text-foreground-strong">Novo teste</span>
      </nav>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate({ to: '/studio/games' })}
          aria-label="Voltar"
          className="text-primary hover:text-highlight"
        >
          <Icon name="chevron-left" className="size-6" />
        </button>
        <h1 className="text-2xl font-bold text-foreground-strong">Novo teste</h1>
      </div>

      <div className="rounded-lg border border-white bg-stat-card-background p-6">
        <Stepper steps={WIZARD_STEPS} currentStep={0} />

        <div className="mt-8 space-y-1">
          <h2 className="text-xl font-bold text-foreground-strong">Tipo de teste</h2>
          <p className="text-sm text-stat-card-muted">
            Escolha o formato ideal para validar sua hipótese: dados quantitativos, feedback
            qualitativo, comparação A/B ou exploração livre do jogo.
          </p>
        </div>

        <QueryBoundary
          query={testModels}
          loadingFallback={<Skeleton className="mt-6 h-96 w-full" />}
          emptyFallback={null}
        >
          {(models) => (
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
              {[...models]
                .sort((a, b) => CARD_ORDER.indexOf(a.key) - CARD_ORDER.indexOf(b.key))
                .map((model) => (
                  <TestModelCard
                    key={model.key}
                    model={model}
                    isRecommended={model.key === 'free_exploration_telemetry'}
                    selected={selectedKey === model.key}
                    onSelect={() => setSelectedKey(model.key)}
                  />
                ))}
            </div>
          )}
        </QueryBoundary>

        <div className="mt-6 flex justify-end">
          <Button disabled={!selectedKey}>Próximo</Button>
        </div>
      </div>
    </div>
  )
}
