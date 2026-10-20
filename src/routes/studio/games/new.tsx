import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import type { Game } from '@/api-types'
import { Stepper } from '@/components/common/Stepper'
import { WizardFooter } from '@/components/common/WizardFooter'
import { Icon } from '@/components/icon'
import { useSetGameAccess } from '@/features/access/api/use-set-game-access'
import {
  ALL_PERMISSIONS,
  toSetGameAccessRequest,
  type AccessDraftEntry,
} from '@/features/access/access-draft'
import { GameAccessStep } from '@/features/access/components/GameAccessStep'
import { useCreateGame } from '@/features/games/api/use-create-game'
import { useUploadGameAsset } from '@/features/games/api/use-upload-game-asset'
import {
  IMAGE_SLOTS,
  createNewGameDraft,
  firstStepWithError,
  hasErrors,
  mapApiFieldErrors,
  toCreateGameRequest,
  validateInfo,
  validateMedia,
  type DraftErrors,
  type ImageSlotKind,
  type NewGameImages,
} from '@/features/games/new-game'
import { ApiError } from '@/lib/api-client'
import { useAuthStore } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { NewGameCreated } from './-components/NewGameCreated'
import { NewGameInfoStep } from './-components/NewGameInfoStep'
import { NewGameMediaStep } from './-components/NewGameMediaStep'

export const Route = createFileRoute('/studio/games/new')({
  component: NewGameWizard,
})

const WIZARD_STEPS = ['Informações', 'Mídias', 'Permissões']
const STEP_INFO = 0
const STEP_MEDIA = 1
const STEP_ACCESS = 2
const STEP_DONE = 3

const STEP_COPY = [
  {
    title: 'Informações gerais',
    description: 'Cadastre os dados principais que identificarão o projeto dentro da OrbitPlay.',
  },
  {
    title: 'Imagens e mídias',
    description:
      'Adicione os materiais que serão utilizados na apresentação e identificação do jogo dentro da plataforma.',
  },
  {
    title: 'Responsáveis e permissões',
    description:
      'Defina quem será responsável pelo jogo e quais membros poderão visualizar ou editar suas informações.',
  },
]

function NewGameWizard() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const createGame = useCreateGame()
  const uploadAsset = useUploadGameAsset()
  const setAccess = useSetGameAccess()

  const [step, setStep] = useState(STEP_INFO)
  const [draft, setDraft] = useState(createNewGameDraft)
  const [errors, setErrors] = useState<DraftErrors>({})
  const [images, setImages] = useState<NewGameImages>({})
  // Quem cria o jogo já entra com todas as permissões.
  const [access, setAccessEntries] = useState<AccessDraftEntry[]>(() =>
    user && user.role !== 'player'
      ? [
          {
            subjectType: 'member',
            subjectId: user.id,
            name: user.displayName,
            email: user.email,
            memberCount: null,
            permissions: ALL_PERMISSIONS,
          },
        ]
      : [],
  )

  // O jogo é criado uma única vez; se um envio posterior falhar, "tentar de novo" só refaz o que faltou.
  const [created, setCreated] = useState<Game | null>(null)
  const [sentKinds, setSentKinds] = useState<ReadonlySet<ImageSlotKind>>(new Set())
  const accessSaved = useRef(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate(): boolean {
    const found = { ...validateInfo(draft), ...validateMedia(draft) }
    setErrors(found)
    const target = firstStepWithError(found)
    if (target === null) return true
    setStep(target)
    toast.error('Revise os campos destacados.')
    return false
  }

  function handleNext(from: number) {
    const found = from === STEP_INFO ? validateInfo(draft) : validateMedia(draft)
    setErrors(found)
    if (!hasErrors(found)) setStep(from + 1)
  }

  /** Cria o jogo, envia as imagens escolhidas e grava as permissões. Retorna o jogo, ou `null` se algo falhou. */
  async function persist(): Promise<Game | null> {
    if (!validate()) return null
    setIsSubmitting(true)
    let game = created
    try {
      if (!game) {
        game = await createGame.mutateAsync(toCreateGameRequest(draft))
        setCreated(game)
      }
    } catch (error) {
      const fieldErrors = error instanceof ApiError ? mapApiFieldErrors(error.fieldErrors) : {}
      if (hasErrors(fieldErrors)) {
        setErrors(fieldErrors)
        setStep(firstStepWithError(fieldErrors) ?? STEP_INFO)
      }
      toast.error(
        error instanceof Error ? error.message : 'Não foi possível criar o jogo. Tente novamente.',
      )
      setIsSubmitting(false)
      return null
    }

    try {
      const sent = new Set(sentKinds)
      for (const slot of IMAGE_SLOTS) {
        const file = images[slot.kind]
        if (!file || sent.has(slot.kind)) continue
        await uploadAsset.mutateAsync({ gameId: game.id, kind: slot.kind, file })
        sent.add(slot.kind)
        setSentKinds(new Set(sent))
      }
      if (!accessSaved.current) {
        await setAccess.mutateAsync({ gameId: game.id, ...toSetGameAccessRequest(access) })
        accessSaved.current = true
      }
    } catch (error) {
      toast.error('O jogo foi criado, mas nem tudo foi salvo.', {
        description:
          (error instanceof Error ? error.message : undefined) ??
          'Confira as imagens e as permissões e tente de novo.',
      })
      setIsSubmitting(false)
      return null
    }
    setIsSubmitting(false)
    return game
  }

  async function handleFinish() {
    const game = await persist()
    if (game) setStep(STEP_DONE)
  }

  async function handleSaveDraft() {
    const game = await persist()
    if (!game) return
    toast.success('Rascunho salvo.')
    void navigate({ to: '/studio/games/$gameId', params: { gameId: game.id } })
  }

  const saveButton = (
    <Button
      type="button"
      variant="ghost"
      disabled={isSubmitting}
      onClick={() => void handleSaveDraft()}
      className="gap-1 text-base font-bold text-primary"
    >
      Salvar
      <Icon name="save" className="size-5" />
    </Button>
  )
  const copy = STEP_COPY[Math.min(step, STEP_ACCESS)]

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
        › <span className="text-foreground-strong">Novo jogo</span>
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
        <h1 className="text-2xl font-bold text-foreground-strong">Novo jogo</h1>
      </div>

      <div className="min-w-0 rounded-lg border border-white bg-stat-card-background p-6">
        {step === STEP_DONE && created ? (
          <NewGameCreated gameId={created.id} title={created.title} />
        ) : (
          <>
            <Stepper steps={WIZARD_STEPS} currentStep={step} />

            <div className="mt-6 mb-6 space-y-1">
              <h2 className="text-3xl font-bold text-foreground-strong">{copy?.title}</h2>
              <p className="text-base text-foreground-strong">{copy?.description}</p>
              {created ? (
                <p role="status" className="text-sm text-foreground-strong/80">
                  O jogo já foi criado como rascunho. Para ajustar informações, abra a página do
                  jogo.
                </p>
              ) : null}
            </div>

            {step === STEP_INFO ? (
              <>
                <NewGameInfoStep
                  draft={draft}
                  errors={errors}
                  onChange={setDraft}
                  disabled={Boolean(created)}
                />
                <WizardFooter
                  onBack={() => navigate({ to: '/studio/games' })}
                  onNext={() => handleNext(STEP_INFO)}
                  canAdvance
                  isSaving={isSubmitting}
                >
                  {saveButton}
                </WizardFooter>
              </>
            ) : null}

            {step === STEP_MEDIA ? (
              <>
                <NewGameMediaStep
                  draft={draft}
                  errors={errors}
                  images={images}
                  sentKinds={sentKinds}
                  trailerLocked={Boolean(created)}
                  onDraftChange={setDraft}
                  onImagesChange={setImages}
                />
                <WizardFooter
                  onBack={() => setStep(STEP_INFO)}
                  onNext={() => handleNext(STEP_MEDIA)}
                  canAdvance
                  isSaving={isSubmitting}
                >
                  {saveButton}
                </WizardFooter>
              </>
            ) : null}

            {step === STEP_ACCESS ? (
              <>
                <GameAccessStep entries={access} onChange={setAccessEntries} />
                <WizardFooter
                  onBack={() => setStep(STEP_MEDIA)}
                  onNext={() => void handleFinish()}
                  canAdvance
                  isSaving={isSubmitting}
                  nextLabel={created ? 'Tentar de novo' : 'Finalizar'}
                >
                  {saveButton}
                </WizardFooter>
              </>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
