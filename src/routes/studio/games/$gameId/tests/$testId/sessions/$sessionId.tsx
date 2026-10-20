import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, type ReactNode } from 'react'
import type { SessionDetail } from '@/api-types'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { BlockState } from '@/components/common/BlockState'
import { EmptyState } from '@/components/common/EmptyState'
import { Tag } from '@/components/common/Tag'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useRecordingPlayback } from '@/features/reports/api/use-recording-playback'
import { useRateSession } from '@/features/reports/api/use-rate-session'
import { useSessionDetail } from '@/features/reports/api/use-session-detail'
import { archetypeView, playerTierView } from '@/features/reports/report-labels'
import { formatDuration } from '@/lib/format'

export const Route = createFileRoute('/studio/games/$gameId/tests/$testId/sessions/$sessionId')({
  component: StudioSessionDetailPage,
})

function StudioSessionDetailPage() {
  const { gameId, testId, sessionId } = Route.useParams()
  const detail = useSessionDetail(testId, sessionId)

  return (
    <main className="mx-auto max-w-[1600px] space-y-6 pb-12 font-brand text-foreground-strong">
      <nav className="text-xs text-muted" aria-label="Breadcrumb">
        <Link to="/studio" className="hover:text-primary">
          Home
        </Link>{' '}
        <span aria-hidden>›</span>{' '}
        <Link to="/studio/games" className="hover:text-primary">
          Jogos
        </Link>{' '}
        <span aria-hidden>›</span>{' '}
        <Link to="/studio/games/$gameId" params={{ gameId }} className="hover:text-primary">
          Jogo
        </Link>{' '}
        <span aria-hidden>›</span>{' '}
        <Link
          to="/studio/games/$gameId/tests/$testId"
          params={{ gameId, testId }}
          className="hover:text-primary"
        >
          Relatório
        </Link>{' '}
        <span aria-hidden>›</span> Sessão
      </nav>

      <div className="flex flex-wrap items-center gap-4 border-b border-primary/40 pb-5">
        <Link
          to="/studio/games/$gameId/tests/$testId"
          params={{ gameId, testId }}
          aria-label="Voltar para o relatório"
          className="rounded text-primary outline-offset-4 hover:text-highlight focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Icon name="arrow-left" className="size-6" />
        </Link>
        <div>
          <p className="text-xs text-muted">Detalhamento individual</p>
          <h1 className="font-label text-2xl font-medium">Sessão de teste</h1>
        </div>
      </div>

      <QueryBoundary query={detail} loadingFallback={<SessionSkeleton />}>
        {(data) => (
          <SessionContent gameId={gameId} testId={testId} sessionId={sessionId} detail={data} />
        )}
      </QueryBoundary>
    </main>
  )
}

function SessionContent({
  gameId,
  testId,
  sessionId,
  detail,
}: {
  gameId: string
  testId: string
  sessionId: string
  detail: SessionDetail
}) {
  const { session } = detail
  const archetype = session.archetype ? archetypeView(session.archetype) : null
  const tier = session.playerTier ? playerTierView(session.playerTier) : null
  const recording =
    detail.recordings.find((item) => item.kind === 'screen') ?? detail.recordings[0] ?? null
  return (
    <div className="space-y-6">
      <section
        aria-label="Resumo da sessão"
        className="flex flex-wrap items-start gap-x-8 gap-y-4 rounded-xl border border-field-border/40 bg-field px-5 py-4"
      >
        <div className="min-w-45">
          <p className="text-xs text-muted">Testador</p>
          <p className="mt-1 font-label text-lg font-medium">{session.testerName}</p>
        </div>
        <SessionFact label="Início" value={new Date(session.startedAt).toLocaleString('pt-BR')} />
        <SessionFact
          label="Duração"
          value={session.durationMs === null ? 'Não concluída' : formatDuration(session.durationMs)}
        />
        <SessionFact
          label="Validação"
          value={
            session.valid === true ? 'Válida' : session.valid === false ? 'Inválida' : 'Pendente'
          }
        />
        {archetype && <Tag tone={archetype.tone}>{archetype.label}</Tag>}
        {tier && <Tag tone={tier.tone}>{tier.label}</Tag>}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,1fr)]">
        <RecordingCard sessionId={sessionId} recording={recording} />
        <StudioRatingCard testId={testId} sessionId={sessionId} rating={detail.studioRating} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <TranscriptCard transcript={detail.transcript} />
        <EvaluationCard
          submittedAt={detail.evaluation.submittedAt}
          answers={detail.evaluation.answers}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <TelemetryCard telemetry={detail.telemetry} />
        <InsightsCard insights={detail.insights} gameId={gameId} testId={testId} />
      </div>
    </div>
  )
}

function SessionFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  )
}

function RecordingCard({
  sessionId,
  recording,
}: {
  sessionId: string
  recording: SessionDetail['recordings'][number] | null
}) {
  const playback = useRecordingPlayback(
    sessionId,
    recording?.id ?? null,
    recording?.status === 'ready',
  )
  return (
    <Card className="overflow-hidden gap-0 border-field-border/40 bg-field shadow-none">
      <CardHeader className="border-b border-field-border/30">
        <h2 className="flex items-center gap-2 font-label text-lg font-medium">
          <Icon name="play" className="text-primary" /> Gravação da gameplay
        </h2>
      </CardHeader>
      <CardContent className="p-0">
        {!recording ? (
          <MediaState
            icon="monitor"
            title="Nenhuma gravação enviada"
            description="O restante dos dados desta sessão continua disponível."
          />
        ) : recording.status !== 'ready' ? (
          <MediaState
            icon={recording.status === 'failed' ? 'alert' : 'loader'}
            title={
              recording.status === 'failed'
                ? 'A gravação não pôde ser processada'
                : 'Processando gravação'
            }
            description="A mídia é processada separadamente dos demais dados da sessão."
          />
        ) : playback.isPending ? (
          <Skeleton className="aspect-video w-full rounded-none" />
        ) : playback.data?.url ? (
          <video
            className="aspect-video w-full bg-black"
            controls
            preload="metadata"
            src={playback.data.url}
          >
            Seu navegador não suporta a reprodução de vídeo.
          </video>
        ) : (
          <MediaState
            icon="alert"
            title="Não foi possível carregar a gravação"
            description="Tente atualizar a página para gerar um novo acesso à mídia."
          />
        )}
      </CardContent>
    </Card>
  )
}

function MediaState({
  icon,
  title,
  description,
}: {
  icon: 'monitor' | 'loader' | 'alert'
  title: string
  description: string
}) {
  return (
    <div className="flex aspect-video flex-col items-center justify-center gap-2 bg-surface px-6 text-center">
      <Icon
        name={icon}
        className={icon === 'loader' ? 'animate-spin text-primary' : 'text-muted'}
      />
      <h3 className="font-medium">{title}</h3>
      <p className="max-w-sm text-sm text-muted">{description}</p>
    </div>
  )
}

function StudioRatingCard({
  testId,
  sessionId,
  rating,
}: {
  testId: string
  sessionId: string
  rating: { rating: number; comment: string | null; markedInvalid: boolean } | null
}) {
  const mutation = useRateSession(testId, sessionId)
  const [score, setScore] = useState(rating?.rating ?? 0)
  const [comment, setComment] = useState(rating?.comment ?? '')
  const [markedInvalid, setMarkedInvalid] = useState(rating?.markedInvalid ?? false)
  const canSave = score >= 1 && !mutation.isPending
  return (
    <Card className="border-field-border/40 bg-field shadow-none">
      <CardHeader>
        <h2 className="flex items-center gap-2 font-label text-lg font-medium">
          <Icon name="star" className="text-highlight" /> Avaliação do estúdio
        </h2>
        <p className="text-sm text-muted">Registre a qualidade desta sessão para a equipe.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-1" role="group" aria-label="Nota da sessão">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              aria-label={`${value} estrela${value > 1 ? 's' : ''}`}
              aria-pressed={score === value}
              onClick={() => setScore(value)}
              className="rounded p-1 text-highlight outline-offset-2 hover:scale-110 focus-visible:outline-2 focus-visible:outline-primary"
            >
              <Icon name="star" filled={value <= score} className="size-6" />
            </button>
          ))}
        </div>
        <label className="block text-sm font-medium" htmlFor="session-rating-comment">
          Comentário interno
        </label>
        <textarea
          id="session-rating-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          maxLength={1000}
          rows={3}
          className="w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          placeholder="O que a equipe deve observar nesta sessão?"
        />
        <label className="flex items-center gap-2 text-sm">
          <Input
            type="checkbox"
            checked={markedInvalid}
            onChange={(event) => setMarkedInvalid(event.target.checked)}
            className="size-4"
          />{' '}
          Marcar sessão como inválida
        </label>
        {mutation.isError && (
          <p role="alert" className="text-sm text-destructive">
            Não foi possível salvar a avaliação.
          </p>
        )}
        <Button
          disabled={!canSave}
          onClick={() =>
            mutation.mutate({ rating: score, comment: comment.trim() || null, markedInvalid })
          }
        >
          {mutation.isPending ? 'Salvando…' : rating ? 'Atualizar avaliação' : 'Salvar avaliação'}
        </Button>
      </CardContent>
    </Card>
  )
}

function TranscriptCard({
  transcript,
}: {
  transcript: {
    status: 'processing' | 'ready' | 'failed' | 'unavailable'
    data: { tMs: number; text: string }[]
  }
}) {
  return (
    <DataCard title="Transcrição" icon="message-circle">
      {transcript.status !== 'ready' ? (
        <BlockState status={transcript.status} />
      ) : transcript.data.length === 0 ? (
        <EmptyState title="Nenhuma fala transcrita" />
      ) : (
        <ol className="space-y-3">
          {transcript.data.map((item) => (
            <li key={`${item.tMs}-${item.text}`} className="flex gap-3">
              <span className="shrink-0 font-mono text-xs text-primary">
                {formatDuration(item.tMs)}
              </span>
              <p className="text-sm">{item.text}</p>
            </li>
          ))}
        </ol>
      )}
    </DataCard>
  )
}

function EvaluationCard({
  submittedAt,
  answers,
}: {
  submittedAt: string | null
  answers: {
    questionId: string
    prompt: string
    type: string
    valueText: string | null
    valueNumber: number | null
    valueBoolean: boolean | null
    optionLabels: string[]
  }[]
}) {
  return (
    <DataCard
      title="Avaliação do testador"
      icon="checklist"
      subtitle={
        submittedAt ? `Enviada em ${new Date(submittedAt).toLocaleString('pt-BR')}` : undefined
      }
    >
      {answers.length === 0 ? (
        <EmptyState
          title="Avaliação não enviada"
          description="Este testador não respondeu ao formulário da sessão."
        />
      ) : (
        <dl className="space-y-4">
          {answers.map((answer) => (
            <div
              key={answer.questionId}
              className="border-b border-field-border/30 pb-3 last:border-0"
            >
              <dt className="text-sm text-muted">{answer.prompt}</dt>
              <dd className="mt-1 font-medium">
                {(answer.valueText ??
                  answer.valueNumber ??
                  (answer.valueBoolean === null ? null : answer.valueBoolean ? 'Sim' : 'Não') ??
                  answer.optionLabels.join(', ')) ||
                  'Não respondida'}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </DataCard>
  )
}

function TelemetryCard({
  telemetry,
}: {
  telemetry: {
    status: 'processing' | 'ready' | 'failed' | 'unavailable'
    data: {
      id: string
      triggerKey: string
      type: string
      valueNum: number | null
      valueJson: unknown
      tMs: number | null
    }[]
  }
}) {
  return (
    <DataCard title="Eventos de telemetria" icon="plug">
      {telemetry.status !== 'ready' ? (
        <BlockState status={telemetry.status} />
      ) : telemetry.data.length === 0 ? (
        <EmptyState
          title="Nenhum evento recebido"
          description="O Orbit Plug-in foi conectado, mas não enviou eventos nesta sessão."
        />
      ) : (
        <ol className="space-y-2">
          {telemetry.data.map((event) => (
            <li
              key={event.id}
              className="grid grid-cols-[5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-field-border/30 px-3 py-2 text-sm"
            >
              <span className="font-mono text-xs text-primary">
                {event.tMs === null ? '—' : formatDuration(event.tMs)}
              </span>
              <span className="truncate font-medium">{event.triggerKey}</span>
              <span className="text-xs text-muted">{event.valueNum ?? event.type}</span>
            </li>
          ))}
        </ol>
      )}
    </DataCard>
  )
}

function InsightsCard({
  insights,
  gameId,
  testId,
}: {
  insights: {
    status: 'processing' | 'ready' | 'failed' | 'unavailable'
    data: { id: string; title: string; body: string; tMs: number | null }[]
  }
  gameId: string
  testId: string
}) {
  return (
    <DataCard title="Insights" icon="insights">
      {insights.status !== 'ready' ? (
        <BlockState status={insights.status} />
      ) : insights.data.length === 0 ? (
        <EmptyState title="Nenhum insight para esta sessão" />
      ) : (
        <ol className="space-y-3">
          {insights.data.map((insight) => (
            <li key={insight.id}>
              <h3 className="font-medium">{insight.title}</h3>
              <p className="text-sm text-muted">{insight.body}</p>
            </li>
          ))}
        </ol>
      )}
      <Link
        to="/studio/games/$gameId/tests/$testId"
        params={{ gameId, testId }}
        search={{ tab: 'insights' }}
        className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
      >
        Ver insights do teste <Icon name="arrow-right" />
      </Link>
    </DataCard>
  )
}

function DataCard({
  title,
  icon,
  subtitle,
  children,
}: {
  title: string
  icon: 'message-circle' | 'checklist' | 'plug' | 'insights'
  subtitle?: string
  children: ReactNode
}) {
  return (
    <Card className="min-w-0 border-field-border/40 bg-field shadow-none">
      <CardHeader>
        <h2 className="flex items-center gap-2 font-label text-lg font-medium">
          <Icon name={icon} className="text-primary" /> {title}
        </h2>
        {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function SessionSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="grid gap-6 xl:grid-cols-2">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </div>
  )
}
