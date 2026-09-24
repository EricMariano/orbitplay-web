import { useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, createFileRoute, useBlocker } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { ArrowLeft, Check, Clock3, Gift, Play, Send } from 'lucide-react'
import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { ApiError } from '@/lib/api-client'
import { formatCountdown } from '@/lib/format'
import {
  getSessionSummary,
  orderedQuestions,
  questionConfigurationError,
  submitSessionForm,
  validateAnswers,
  type AnswerValue,
  type Answers,
  type FormQuestion,
  type SessionSummary,
} from '@/features/sessions/session-summary'
import './summary.css'

export const Route = createFileRoute('/player/sessions/$sessionId/summary')({
  component: SessionSummaryPage,
})

function SessionSummaryPage() {
  const { sessionId } = Route.useParams()
  const query = useQuery({
    queryKey: ['session-summary', sessionId],
    queryFn: () => getSessionSummary(sessionId),
    retry: false,
  })

  return (
    <div className="session-page">
      <div className="session-breadcrumb">Home &gt; Meus testes &gt; Resumo da sessão</div>
      <div className="session-page-heading">
        <Link to="/player" aria-label="Voltar para Home" className="session-back">
          <ArrowLeft size={28} />
        </Link>
        <h1>Resumo da sessão</h1>
      </div>
      {query.isPending ? (
        <div className="session-loading" aria-label="Carregando resumo da sessão">
          <Skeleton className="h-[700px] w-full" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      ) : query.isError ? (
        <ErrorState
          className="mt-6 min-h-80"
          title="Não foi possível carregar a sessão"
          message={
            query.error instanceof ApiError && query.error.status === 403
              ? 'Você não tem acesso a esta sessão.'
              : 'Os dados da sessão estão indisponíveis. Tente novamente mais tarde.'
          }
          onRetry={() => void query.refetch()}
        />
      ) : query.data.session.id !== sessionId ||
        (query.data.session.testId && query.data.session.testId !== query.data.test.testId) ||
        query.data.form.testId !== query.data.test.testId ||
        query.data.test.gameId !== query.data.game.id ? (
        <ErrorState
          className="mt-6 min-h-80"
          title="Dados da sessão inconsistentes"
          message="Não foi possível confirmar os dados desta sessão."
        />
      ) : (
        <SessionContent key={sessionId} sessionId={sessionId} summary={query.data} />
      )}
    </div>
  )
}

function SessionContent({ sessionId, summary }: { sessionId: string; summary: SessionSummary }) {
  const queryClient = useQueryClient()
  const questions = useMemo(
    () => orderedQuestions(summary.form.questions),
    [summary.form.questions],
  )
  const { control, setValue, handleSubmit, formState } = useForm<{ answers: Answers }>({
    defaultValues: { answers: {} },
  })
  const answers = useWatch({ control, name: 'answers' }) ?? {}
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [alreadySubmitted, setAlreadySubmitted] = useState(Boolean(summary.alreadySubmitted))
  const pendingKey = useRef<string | null>(null)
  const submitting = useRef(false)
  const mutation = useMutation({
    mutationFn: ({ key, values }: { key: string; values: Answers }) =>
      submitSessionForm(sessionId, values, key),
  })
  const hasDraft = formState.isDirty && !submitted && !alreadySubmitted
  const blocker = useBlocker({
    shouldBlockFn: () => hasDraft,
    enableBeforeUnload: hasDraft,
    disabled: !hasDraft,
    withResolver: true,
  })

  function updateAnswer(id: string, value: AnswerValue) {
    setValue(`answers.${id}`, value, { shouldDirty: true })
    setErrors((current) => {
      const next = { ...current }
      delete next[id]
      return next
    })
    setGeneralError(null)
    pendingKey.current = null
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    void handleSubmit(async ({ answers: currentAnswers }) => {
      if (submitting.current || submitted || alreadySubmitted) return
      const validationErrors = validateAnswers(questions, currentAnswers)
      if (Object.keys(validationErrors).length) {
        setErrors(validationErrors)
        document.getElementById(`question-${Object.keys(validationErrors)[0]}`)?.focus()
        return
      }
      submitting.current = true
      setGeneralError(null)
      pendingKey.current ??= crypto.randomUUID()
      try {
        await mutation.mutateAsync({ key: pendingKey.current, values: currentAnswers })
        setSubmitted(true)
        void queryClient.invalidateQueries({ queryKey: ['session-summary', sessionId] })
      } catch (error) {
        if (error instanceof ApiError && error.status === 422 && error.fieldErrors) {
          setErrors(error.fieldErrors)
          setGeneralError('Revise as respostas destacadas antes de enviar.')
        } else if (error instanceof ApiError && error.status === 409) {
          setAlreadySubmitted(true)
          setGeneralError(null)
          void queryClient.invalidateQueries({ queryKey: ['session-summary', sessionId] })
        } else if (error instanceof ApiError && error.status === 403) {
          setGeneralError('Você não tem permissão para enviar esta avaliação.')
        } else if (error instanceof ApiError && error.status === 404) {
          setGeneralError('Esta sessão não está mais disponível.')
        } else {
          setGeneralError(
            'Não foi possível enviar a avaliação. Suas respostas foram mantidas; tente novamente.',
          )
        }
      } finally {
        submitting.current = false
      }
    })(event)
  }

  return (
    <>
      <SessionOverview summary={summary} />
      <section className="session-panel session-form-panel" aria-labelledby="session-form-title">
        <div className="session-form-head">
          <h2 id="session-form-title">Sua avaliação</h2>
          <p>Conte como foi sua experiência neste teste.</p>
        </div>
        {submitted || alreadySubmitted ? (
          <div className="session-complete" role="status">
            <span className="session-complete-icon">
              <Check size={26} />
            </span>
            <div>
              <h3>{submitted ? 'Avaliação enviada' : 'Avaliação já enviada'}</h3>
              <p>Esta sessão não aceita um novo envio.</p>
            </div>
            <Link to="/player" className="session-home-link">
              Voltar para Home
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            {questions.length === 0 && (
              <div className="session-empty-form">
                O formulário deste teste não possui perguntas.
              </div>
            )}
            <div className="session-questions">
              {questions.map((question) => (
                <QuestionField
                  key={question.id}
                  question={question}
                  value={answers[question.id]}
                  error={errors[question.id]}
                  onChange={(value) => updateAnswer(question.id, value)}
                />
              ))}
            </div>
            <div className="session-form-actions">
              {generalError && (
                <p className="session-submit-error" role="alert">
                  {generalError}
                </p>
              )}
              <Button className="session-submit" type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Enviando...' : 'Enviar'} <Send size={18} />
              </Button>
            </div>
          </form>
        )}
      </section>
      <Dialog
        open={blocker.status === 'blocked'}
        onOpenChange={(open) => {
          if (!open && blocker.status === 'blocked') blocker.reset()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sair sem enviar?</DialogTitle>
            <DialogDescription>
              Suas respostas ainda não foram enviadas e serão perdidas ao sair desta página.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => blocker.status === 'blocked' && blocker.reset()}
            >
              Continuar respondendo
            </Button>
            <Button onClick={() => blocker.status === 'blocked' && blocker.proceed()}>
              Sair da página
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function SessionOverview({ summary }: { summary: SessionSummary }) {
  const [imageFailed, setImageFailed] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const imageUrl = summary.game.bannerUrl || summary.game.coverUrl
  const recording = summary.recording
  const hasVideo = recording?.status === 'ready' && Boolean(recording.url) && !videoFailed
  const countdown = summary.test.expiresAt ? formatCountdown(summary.test.expiresAt) : null

  return (
    <section className="session-panel session-overview" aria-label="Dados da sessão">
      <div className="session-game">
        <div className="session-game-image">
          {imageUrl && !imageFailed ? (
            <img src={imageUrl} alt="" onError={() => setImageFailed(true)} />
          ) : (
            <span>Imagem indisponível</span>
          )}
        </div>
        <div className="session-game-info">
          <div className="session-game-title-row">
            <h2>{summary.game.title}</h2>
            {!summary.test.disabled && <span className="session-available">Disponível</span>}
            {countdown && (
              <span className="session-countdown">
                <Clock3 size={14} /> Termina em {countdown}
              </span>
            )}
          </div>
          <p className="session-test-title">{summary.test.title}</p>
          <div className="session-game-stats">
            {summary.test.rewardCents != null && (
              <span className="session-metric">
                <strong>
                  <Gift size={20} />{' '}
                  {(summary.test.rewardCents / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </strong>
                <small>Prêmio</small>
              </span>
            )}
            {summary.session.durationMs != null && (
              <span>
                <Clock3 size={20} /> Duração: {Math.round(summary.session.durationMs / 60000)} min
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="session-divider" />
      <h2 className="session-record-heading">
        Sua sessão <span>#{summary.session.id}</span>
      </h2>
      <div className="session-record-grid">
        <div className="session-media">
          {hasVideo ? (
            <video
              controls
              preload="metadata"
              poster={recording?.thumbnailUrl ?? undefined}
              onError={() => setVideoFailed(true)}
            >
              <source src={recording?.url ?? undefined} />
              Seu navegador não conseguiu reproduzir este vídeo.
            </video>
          ) : (
            <div className="session-media-state">
              <Play size={36} strokeWidth={1.5} />
              <span>
                {recording?.status === 'processing'
                  ? 'A gravação está em processamento'
                  : 'Gravação indisponível'}
              </span>
            </div>
          )}
        </div>
        <div className="session-transcript">
          <h3>Transcrição</h3>
          <div className="session-transcript-state">Transcrição indisponível para esta sessão.</div>
        </div>
      </div>
    </section>
  )
}

function QuestionField({
  question,
  value,
  error,
  onChange,
}: {
  question: FormQuestion
  value: AnswerValue | undefined
  error?: string
  onChange: (value: AnswerValue) => void
}) {
  const configurationError = questionConfigurationError(question)
  const options = [...(question.options ?? [])].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0),
  )
  const describedBy = error
    ? `error-${question.id}`
    : question.helpText
      ? `help-${question.id}`
      : undefined

  return (
    <fieldset
      id={`question-${question.id}`}
      className="session-question"
      tabIndex={-1}
      aria-describedby={describedBy}
    >
      <legend>
        {question.prompt}{' '}
        {question.required && (
          <span className="session-required" aria-label="obrigatória">
            *
          </span>
        )}
      </legend>
      {question.helpText && (
        <p className="session-question-help" id={`help-${question.id}`}>
          {question.helpText}
        </p>
      )}
      {configurationError ? (
        <p className="session-field-error" id={`error-${question.id}`}>
          {configurationError}
        </p>
      ) : question.type === 'short_text' ? (
        <input
          className="session-text-input"
          type="text"
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          placeholder="Digite sua resposta"
        />
      ) : question.type === 'long_text' ? (
        <textarea
          className="session-text-input session-textarea"
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          placeholder="Digite sua resposta"
          rows={4}
        />
      ) : question.type === 'single_choice' || question.type === 'multiple_choice' ? (
        <div className="session-choice-list">
          {options.map((option) => (
            <label className="session-choice" key={option.id}>
              <input
                type={question.type === 'single_choice' ? 'radio' : 'checkbox'}
                name={question.id}
                checked={
                  question.type === 'single_choice'
                    ? value === option.id
                    : Array.isArray(value) && value.includes(option.id!)
                }
                onChange={() => {
                  if (question.type === 'single_choice') onChange(option.id!)
                  else {
                    const selected = Array.isArray(value) ? value : []
                    onChange(
                      selected.includes(option.id!)
                        ? selected.filter((id) => id !== option.id)
                        : [...selected, option.id!],
                    )
                  }
                }}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      ) : question.type === 'boolean' ? (
        <div className="session-choice-list session-boolean-list">
          {[
            { label: 'Sim', value: true },
            { label: 'Não', value: false },
          ].map((option) => (
            <label className="session-choice" key={option.label}>
              <input
                type="radio"
                name={question.id}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      ) : (
        <div
          className={`session-scale ${question.type === 'rating' ? 'session-rating' : ''}`}
          role="group"
          aria-label={question.prompt}
        >
          {Array.from(
            { length: question.scaleMax! - question.scaleMin! + 1 },
            (_, offset) => question.scaleMin! + offset,
          ).map((number) => (
            <label className="session-scale-option" key={number}>
              <input
                type="radio"
                name={question.id}
                checked={value === number}
                onChange={() => onChange(number)}
              />
              <span>{number}</span>
            </label>
          ))}
        </div>
      )}
      {error && !configurationError && (
        <p className="session-field-error" id={`error-${question.id}`} role="alert">
          {error}
        </p>
      )}
    </fieldset>
  )
}
