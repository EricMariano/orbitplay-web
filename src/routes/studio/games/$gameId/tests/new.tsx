import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import type { TestModelKey } from '@/api-types'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Stepper } from '@/components/common/Stepper'
import { WizardFooter } from '@/components/common/WizardFooter'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useGame } from '@/features/games/api/use-game'
import { TestFormBuilder } from '@/features/tests/components/TestFormBuilder'
import { TestModelCard } from '@/features/tests/components/TestModelCard'
import { useCreateTest } from '@/features/tests/api/use-create-test'
import { useSaveTestForm } from '@/features/tests/api/use-save-test-form'
import { usePublishTest } from '@/features/tests/api/use-publish-test'
import { useSetAudience } from '@/features/tests/api/use-set-audience'
import { useSetBuildSettings } from '@/features/tests/api/use-set-build-settings'
import { useSetTestModel } from '@/features/tests/api/use-set-test-model'
import { useTest } from '@/features/tests/api/use-test'
import { useTestModels } from '@/features/tests/api/use-test-models'
import { useTestFormPreview } from '@/features/tests/api/use-test-form-preview'
import {
  computeBudget,
  createAudienceDraft,
  isAudienceValid,
  toAudienceRequest,
} from '@/features/tests/audience'
import { AudienceStep } from '@/features/tests/components/AudienceStep'
import { BuildUploadStep } from '@/features/tests/components/BuildUploadStep'
import { PurchaseSummary } from '@/features/tests/components/PurchaseSummary'
import { ApiError } from '@/lib/api-client'
import { cn } from '@/lib/utils'
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
  const [previewOpen, setPreviewOpen] = useState(false)
  const saveTestForm = useSaveTestForm(draft?.id ?? null)
  const preview = useTestFormPreview(draft?.id ?? null, previewOpen)
  const test = useTest(step === 2 ? (draft?.id ?? null) : null)
  const setBuildSettings = useSetBuildSettings(draft?.id ?? null)
  const [gamepadSupported, setGamepadSupported] = useState<boolean | null>(null)
  const [audience, setAudience] = useState(createAudienceDraft)
  const saveAudience = useSetAudience(draft?.id ?? null)
  // Uma chave por rascunho: reenviar "Pagar e finalizar!" nunca publica duas vezes.
  const [publishKey] = useState(() => crypto.randomUUID())
  const publishTest = usePublishTest(gameId, draft?.id ?? null, publishKey)
  const requiresBuild =
    testModels.data?.find((model) => model.key === draft?.modelKey)?.requiresBuild ?? true

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
      onSuccess: () => setStep(2),
      onError: (error) => toast.error(error.message || 'Não foi possível salvar a avaliação.'),
    })
  }

  function handlePreview() {
    saveTestForm.mutate(toPutFormRequest(questions), {
      onSuccess: () => setPreviewOpen(true),
      onError: (error) =>
        toast.error(error.message || 'Não foi possível salvar a avaliação para pré-visualizar.'),
    })
  }

  function handleBuildNext() {
    setBuildSettings.mutate(
      { gamepadSupported: gamepadValue },
      {
        onSuccess: () => setStep(3),
        onError: (error) => toast.error(error.message || 'Não foi possível salvar a build.'),
      },
    )
  }

  // Sem cobrança: a API ainda não tem preço nem pagamento (DECISIONS.md).
  function handleFinish() {
    if (!draft) return
    const publishedTestId = draft.id

    saveAudience.mutate(toAudienceRequest(audience), {
      onSuccess: () =>
        publishTest.mutate(undefined, {
          onSuccess: () => {
            toast.success('Teste publicado!')
            void navigate({
              to: '/studio/tests/$testId/completed',
              params: { testId: publishedTestId },
            })
          },
          onError: (error) => {
            const pending =
              error instanceof ApiError && error.fieldErrors
                ? Object.values(error.fieldErrors).join(' · ')
                : undefined
            toast.error('O rascunho foi salvo, mas ainda não dá para publicar.', {
              description: pending ?? error.message,
            })
          },
        }),
      onError: (error) => toast.error(error.message || 'Não foi possível salvar o público.'),
    })
  }

  const gamepadValue = gamepadSupported ?? test.data?.gamepadSupported ?? false
  const buildStatus = test.data?.build?.status
  // A validação continua no worker; o estúdio pode seguir enquanto ela roda.
  const canLeaveBuildStep =
    !requiresBuild || buildStatus === 'processing' || buildStatus === 'validated'

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
        ›{' '}
        <Link to="/studio/games/$gameId" params={{ gameId }} className="hover:text-primary">
          {game.data?.title ?? '…'}
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

      <div
        className={cn(
          step === 3 && 'grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]',
        )}
      >
        <div className="min-w-0 rounded-lg border border-white bg-stat-card-background p-6">
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
          ) : null}

          {step === 1 ? (
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

              <WizardFooter
                onBack={() => setStep(0)}
                onNext={handleFormNext}
                canAdvance={isTestFormValid(questions)}
                isSaving={saveTestForm.isPending}
              >
                <button
                  type="button"
                  disabled={!isTestFormValid(questions) || saveTestForm.isPending}
                  onClick={handlePreview}
                  className="flex items-center gap-1 text-base font-bold text-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Pré-visualizar
                  <Icon name="eye" className="size-6" />
                </button>
              </WizardFooter>
              <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Pré-visualização da avaliação</DialogTitle>
                  </DialogHeader>
                  {preview.isPending ? <Skeleton className="h-40 w-full" /> : null}
                  {preview.isError ? (
                    <p className="text-sm text-destructive">
                      Não foi possível carregar a pré-visualização.
                    </p>
                  ) : null}
                  {preview.data ? (
                    <ol className="space-y-5">
                      {preview.data.questions.map((question, index) => (
                        <li key={question.id} className="rounded-lg border border-border p-4">
                          <p className="font-medium">
                            {index + 1}. {question.prompt}
                            {question.required ? (
                              <span className="text-destructive"> *</span>
                            ) : null}
                          </p>
                          {question.helpText ? (
                            <p className="mt-1 text-sm text-muted">{question.helpText}</p>
                          ) : null}
                          {question.options.length ? (
                            <div className="mt-3 space-y-2">
                              {question.options.map((option) => (
                                <label key={option.id} className="flex items-center gap-2 text-sm">
                                  <input
                                    type={
                                      question.type === 'multiple_choice' ? 'checkbox' : 'radio'
                                    }
                                    disabled
                                  />
                                  {option.label}
                                </label>
                              ))}
                            </div>
                          ) : question.type === 'open_text' ? (
                            <div className="mt-3 h-16 rounded border border-border bg-surface-raised" />
                          ) : question.scaleMin != null && question.scaleMax != null ? (
                            <div className="mt-3 flex justify-between text-xs text-muted">
                              <span>{question.scaleMinLabel ?? question.scaleMin}</span>
                              <span>{question.scaleMaxLabel ?? question.scaleMax}</span>
                            </div>
                          ) : null}
                        </li>
                      ))}
                    </ol>
                  ) : null}
                </DialogContent>
              </Dialog>
            </>
          ) : null}

          {step === 2 && draft ? (
            <>
              <div className="mt-6 mb-6 space-y-1">
                <h2 className="text-3xl font-bold text-foreground-strong">
                  Envie a versão que será testada
                </h2>
                <p className="text-base text-foreground-strong">
                  Faça upload da build e configure a telemetria. Se o plugin estiver ativo, você
                  terá acesso a dados avançados de comportamento e performance.
                </p>
              </div>

              {requiresBuild ? (
                <BuildUploadStep
                  testId={draft.id}
                  gamepadSupported={gamepadValue}
                  onGamepadSupportedChange={setGamepadSupported}
                />
              ) : (
                <p className="text-base text-muted">
                  Este tipo de teste compara imagens e não precisa de build. Siga para o próximo
                  passo.
                </p>
              )}

              <WizardFooter
                onBack={() => setStep(1)}
                onNext={handleBuildNext}
                canAdvance={canLeaveBuildStep}
                isSaving={setBuildSettings.isPending}
              />
            </>
          ) : null}

          {step === 3 && draft ? (
            <>
              <div className="mt-6 mb-6 space-y-1">
                <h2 className="text-3xl font-bold text-foreground-strong">
                  Público, Quantidade &amp; Duração
                </h2>
                <p className="text-base text-foreground-strong">
                  Defina quem vai testar, por quanto tempo e quanto investir
                </p>
              </div>
              <AudienceStep draft={audience} onChange={setAudience} />
            </>
          ) : null}
        </div>

        {step === 3 && draft ? (
          <PurchaseSummary
            model={testModels.data?.find((model) => model.key === draft.modelKey)}
            draft={audience}
            budget={computeBudget(draft.modelKey, audience)}
            canFinish={isAudienceValid(audience)}
            isFinishing={saveAudience.isPending || publishTest.isPending}
            onBack={() => setStep(2)}
            onFinish={handleFinish}
          />
        ) : null}
      </div>
    </div>
  )
}
