import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import type { TestModelKey } from '@/api-types'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Stepper } from '@/components/common/Stepper'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGame } from '@/features/games/api/use-game'
import { TestFormBuilder } from '@/features/tests/components/TestFormBuilder'
import { TestModelCard } from '@/features/tests/components/TestModelCard'
import { useCreateTest } from '@/features/tests/api/use-create-test'
import { useSaveTestForm } from '@/features/tests/api/use-save-test-form'
import { useSetTestModel } from '@/features/tests/api/use-set-test-model'
import { useTestModels } from '@/features/tests/api/use-test-models'
import {
  createQuestionDraft,
  isTestFormValid,
  toPutFormRequest,
  type QuestionDraft,
} from '@/features/tests/test-form'

export const Route = createFileRoute('/studio/games/$gameId/tests/new')({
  component: NewTestWizard,
})

const CARD_ORDER: TestModelKey[] = [
  'free_exploration_telemetry',
  'free_exploration',
  'ab_test',
  'ab_test_images',
]
const WIZARD_STEPS = ['Tipo', 'Avaliação', 'Build', 'Orçamento']

function NewTestWizard() {
  const { gameId } = Route.useParams()
  const navigate = useNavigate()
  const game = useGame(gameId)
  const testModels = useTestModels()
  const createTest = useCreateTest(gameId)
  const setTestModel = useSetTestModel(gameId)
  const [step, setStep] = useState(0)
  const [selectedKey, setSelectedKey] = useState<TestModelKey | null>(null)
  // Rascunho criado no passo 1; voltar e trocar o modelo atualiza o mesmo teste.
  const [draft, setDraft] = useState<{ id: string; modelKey: TestModelKey } | null>(null)
  const [questions, setQuestions] = useState<QuestionDraft[]>(() => [createQuestionDraft()])
  const saveTestForm = useSaveTestForm(draft?.id ?? null)

  function handleModelNext() {
    if (!selectedKey) return
    const onError = (error: Error) =>
      toast.error(error.message || 'Não foi possível salvar o tipo do teste.')

    if (!draft) {
      createTest.mutate(
        { testModelKey: selectedKey },
        {
          onSuccess: (test) => {
            setDraft({ id: test.id, modelKey: selectedKey })
            setStep(1)
          },
          onError,
        },
      )
    } else if (draft.modelKey !== selectedKey) {
      setTestModel.mutate(
        { testId: draft.id, testModelKey: selectedKey },
        {
          onSuccess: () => {
            setDraft({ id: draft.id, modelKey: selectedKey })
            setStep(1)
          },
          onError,
        },
      )
    } else {
      setStep(1)
    }
  }

  function handleFormNext() {
    saveTestForm.mutate(toPutFormRequest(questions), {
      // Passos 3–4 (build, orçamento) ainda não têm tela: o rascunho fica
      // salvo na API e o estúdio volta para os jogos.
      onSuccess: () => {
        toast.success('Avaliação do teste salva.')
        void navigate({ to: '/studio/games' })
      },
      onError: (error) => toast.error(error.message || 'Não foi possível salvar a avaliação.'),
    })
  }

  const isSavingModel = createTest.isPending || setTestModel.isPending

  return (
    <div className="space-y-6">
      <nav className="text-sm text-muted">
        <Link to="/studio" className="hover:text-primary">
          Home
        </Link>{' '}
        ›{' '}
        <Link to="/studio/games" className="hover:text-primary">
          Jogos
        </Link>{' '}
        › <span>{game.data?.title ?? '…'}</span> ›{' '}
        <span className="text-foreground-strong">Novo teste</span>
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
        <Stepper steps={WIZARD_STEPS} currentStep={step} />

        {step === 0 ? (
          <>
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

            <div className="mt-10 flex justify-end">
              <Button disabled={!selectedKey || isSavingModel} onClick={handleModelNext}>
                {isSavingModel ? 'Salvando...' : 'Próximo'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mt-6 mb-6 space-y-1">
              <h2 className="text-3xl font-bold text-foreground-strong">
                A avaliação do seu teste
              </h2>
              <p className="text-base text-foreground-strong">
                Monte formulários inteligentes, combinando perguntas objetivas, feedback aberto e
                análises automáticas por IA.
              </p>
            </div>

            <TestFormBuilder questions={questions} onChange={setQuestions} />

            <div className="mt-6 flex flex-wrap items-center justify-end gap-6">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="mr-auto flex items-center gap-1 text-base font-bold text-primary hover:opacity-80"
              >
                <Icon name="arrow-left" className="size-6" />
                Voltar
              </button>
              {/* Pré-visualização está no design, mas ainda não tem tela. */}
              <button
                type="button"
                disabled
                title="Pré-visualizar (em breve)"
                className="flex items-center gap-1 text-base font-bold text-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                Pré-visualizar
                <Icon name="eye" className="size-6" />
              </button>
              <Button
                size="lg"
                disabled={!isTestFormValid(questions) || saveTestForm.isPending}
                onClick={handleFormNext}
                className="h-12 bg-gradient-to-br from-cta-configure-from to-cta-configure-to px-8 text-base font-bold"
              >
                {saveTestForm.isPending ? 'Salvando...' : 'Próximo'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
