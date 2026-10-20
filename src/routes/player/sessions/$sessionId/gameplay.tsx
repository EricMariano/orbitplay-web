import { useEffect, useRef, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import type { DeviceEventRequest, SessionGameplay } from '@/api-types'
import { ErrorState } from '@/components/common/ErrorState'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Icon, type IconName } from '@/components/icon'
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
import { formatDuration } from '@/lib/format'
import {
  useFinishSession,
  useRecordSessionDevice,
  useSessionGameplay,
  useSessionHeartbeat,
} from '@/features/sessions/api/use-session-gameplay'
import { useUploadSessionRecording } from '@/features/sessions/api/use-session-recording'

export const Route = createFileRoute('/player/sessions/$sessionId/gameplay')({
  component: SessionGameplayPage,
})

function SessionGameplayPage() {
  const { sessionId } = Route.useParams()
  const gameplay = useSessionGameplay(sessionId)

  return (
    <QueryBoundary
      query={gameplay}
      loadingFallback={<GameplaySkeleton />}
      emptyFallback={<ErrorState title="Sessão não encontrada" />}
    >
      {(data) =>
        data.session.status === 'active' ? (
          <GameplayContent sessionId={sessionId} gameplay={data} />
        ) : (
          <InactiveSession sessionId={sessionId} status={data.session.status} />
        )
      }
    </QueryBoundary>
  )
}

function GameplaySkeleton() {
  return (
    <div className="min-h-[calc(100dvh-5rem)] bg-background p-6" aria-label="Carregando gameplay">
      <Skeleton className="mx-auto h-[calc(100dvh-8rem)] max-w-7xl" />
    </div>
  )
}

function InactiveSession({ sessionId, status }: { sessionId: string; status: string }) {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-[calc(100dvh-5rem)] items-center justify-center bg-background p-6">
      <ErrorState
        title="Esta sessão não está mais em gameplay"
        message={
          status === 'in_review'
            ? 'Seu teste foi encerrado. Continue para preencher a avaliação.'
            : 'A sessão foi encerrada e não pode mais receber atividade.'
        }
        onRetry={() =>
          void navigate({ to: '/player/sessions/$sessionId/summary', params: { sessionId } })
        }
      />
    </div>
  )
}

function GameplayContent({
  sessionId,
  gameplay,
}: {
  sessionId: string
  gameplay: SessionGameplay
}) {
  const navigate = useNavigate()
  const { mutate: sendHeartbeat } = useSessionHeartbeat(sessionId)
  const deviceEvent = useRecordSessionDevice(sessionId)
  const finish = useFinishSession(sessionId)
  const uploadRecording = useUploadSessionRecording()
  const [elapsedMs, setElapsedMs] = useState(() => elapsedSince(gameplay.session.startedAt))
  const [devices, setDevices] = useState<Record<DeviceEventRequest['kind'], boolean>>({
    microphone: false,
    webcam: false,
  })
  const [heartbeatState, setHeartbeatState] = useState<'connected' | 'reconnecting'>('connected')
  const [deviceError, setDeviceError] = useState<string | null>(null)
  const [finishError, setFinishError] = useState<string | null>(null)
  const [finishOpen, setFinishOpen] = useState(false)
  const [recordingState, setRecordingState] = useState<
    'idle' | 'recording' | 'uploading' | 'ready' | 'error'
  >('idle')
  const [recordingError, setRecordingError] = useState<string | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recordingStartedAtRef = useRef<number | null>(null)

  useEffect(() => {
    const timer = window.setInterval(
      () => setElapsedMs(elapsedSince(gameplay.session.startedAt)),
      1_000,
    )
    return () => window.clearInterval(timer)
  }, [gameplay.session.startedAt])

  useEffect(() => {
    let active = true
    const pulse = () => {
      sendHeartbeat(
        { tMs: elapsedSince(gameplay.session.startedAt) },
        {
          onSuccess: () => active && setHeartbeatState('connected'),
          onError: () => active && setHeartbeatState('reconnecting'),
        },
      )
    }
    pulse()
    const interval = window.setInterval(pulse, gameplay.heartbeatIntervalMs)
    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [gameplay.heartbeatIntervalMs, gameplay.session.startedAt, sendHeartbeat])

  useEffect(
    () => () => {
      recorderRef.current?.stop()
      streamRef.current?.getTracks().forEach((track) => track.stop())
    },
    [],
  )

  const backgroundImage = gameplay.game.bannerUrl ?? gameplay.game.coverUrl
  const sessionTitle = gameplay.test.title ?? gameplay.game.title
  const deviceCards: Array<{
    kind: DeviceEventRequest['kind']
    label: string
    description: string
    icon: IconName
  }> = [
    {
      kind: 'microphone',
      label: 'Microfone',
      description: 'Registrar comentários durante a sessão',
      icon: 'microphone',
    },
    {
      kind: 'webcam',
      label: 'Webcam',
      description: 'Registrar suas reações durante o teste',
      icon: 'camera',
    },
  ]

  async function toggleDevice(kind: DeviceEventRequest['kind']) {
    const previous = devices[kind]
    const enabled = !previous
    setDevices((current) => ({ ...current, [kind]: enabled }))
    setDeviceError(null)
    try {
      await deviceEvent.mutateAsync({ kind, enabled, tMs: elapsedMs })
    } catch {
      setDevices((current) => ({ ...current, [kind]: previous }))
      setDeviceError('Não foi possível atualizar este dispositivo. Tente novamente.')
    }
  }

  async function startScreenRecording() {
    if (!navigator.mediaDevices?.getDisplayMedia || typeof MediaRecorder === 'undefined') {
      setRecordingState('error')
      setRecordingError(
        'Este navegador não oferece gravação de tela. Use uma versão atual do Chrome, Edge ou Firefox.',
      )
      return
    }

    setRecordingError(null)
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : MediaRecorder.isTypeSupported('video/webm')
          ? 'video/webm'
          : undefined
      const chunks: BlobPart[] = []
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data)
      }
      recorder.onstop = () => {
        const startedAt = recordingStartedAtRef.current ?? Date.now()
        const recording = new Blob(chunks, { type: 'video/webm' })
        stream.getTracks().forEach((track) => track.stop())
        recorderRef.current = null
        streamRef.current = null
        recordingStartedAtRef.current = null
        if (!recording.size) {
          setRecordingState('error')
          setRecordingError(
            'Nenhum vídeo foi gravado. Inicie novamente e compartilhe uma tela ou janela.',
          )
          return
        }
        setRecordingState('uploading')
        void uploadRecording
          .mutateAsync({ sessionId, recording, durationMs: Date.now() - startedAt })
          .then(() => setRecordingState('ready'))
          .catch(() => {
            setRecordingState('error')
            setRecordingError(
              'Não foi possível enviar a gravação. Você pode gravar novamente antes de encerrar.',
            )
          })
      }
      stream.getVideoTracks()[0]?.addEventListener('ended', () => {
        if (recorder.state !== 'inactive') recorder.stop()
      })
      streamRef.current = stream
      recorderRef.current = recorder
      recordingStartedAtRef.current = Date.now()
      recorder.start(1_000)
      setRecordingState('recording')
    } catch {
      setRecordingState('error')
      setRecordingError(
        'Não foi possível iniciar a gravação. Autorize o compartilhamento de tela e tente novamente.',
      )
    }
  }

  function stopScreenRecording() {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') recorderRef.current.stop()
  }

  async function finishSession() {
    setFinishError(null)
    try {
      await finish.mutateAsync({ tMs: elapsedMs, confirmed: true, reason: 'completed' })
      await navigate({ to: '/player/sessions/$sessionId/summary', params: { sessionId } })
    } catch (error) {
      setFinishError(
        error instanceof ApiError && error.status === 409
          ? 'Esta sessão já foi encerrada em outro dispositivo.'
          : 'Não foi possível encerrar a sessão. Continue jogando e tente novamente.',
      )
    }
  }

  return (
    <main className="relative min-h-[calc(100dvh-5rem)] overflow-hidden bg-background text-foreground">
      {backgroundImage ? (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-25 blur-[2px]"
        />
      ) : null}
      <div className="absolute inset-0 bg-background/85" />

      <div className="relative mx-auto flex min-h-[calc(100dvh-5rem)] max-w-7xl flex-col p-4 sm:p-6">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface/90 px-4 py-3 backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <span className="relative flex size-3" aria-label="Gravação de sessão ativa">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive/70" />
              <span className="relative inline-flex size-3 rounded-full bg-destructive" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium tracking-[0.12em] text-muted uppercase">
                Gameplay em andamento
              </p>
              <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">
                {sessionTitle}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="font-mono font-semibold text-foreground">
              {formatDuration(elapsedMs)}
            </span>
            <span
              className="flex items-center gap-1.5 text-muted"
              aria-live="polite"
              title={heartbeatState === 'connected' ? 'Heartbeat conectado' : 'Tentando reconectar'}
            >
              <span
                className={`size-2 rounded-full ${
                  heartbeatState === 'connected' ? 'bg-success' : 'bg-highlight'
                }`}
              />
              {heartbeatState === 'connected' ? 'Conectado' : 'Reconectando'}
            </span>
          </div>
        </header>

        <section
          className="flex flex-1 items-center justify-center py-10 text-center"
          aria-label="Área do jogo"
        >
          <div className="max-w-lg rounded-2xl border border-border bg-surface/85 p-7 shadow-2xl backdrop-blur">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Icon name="gamepad" className="size-7" />
            </span>
            <h2 className="mt-4 text-xl font-semibold text-foreground">
              Seu jogo está em execução
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Jogue na build aberta no seu dispositivo. Esta sobreposição mantém a sessão ativa e
              registra os dispositivos que você escolheu usar.
            </p>
            {gameplay.recordingRequired ? (
              <div className="mt-5 rounded-xl border border-border bg-background/60 p-4 text-left">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Gravação de tela</p>
                    <p className="mt-1 text-xs text-success">
                      Gravação de tela autorizada para este teste
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Compartilhe a janela ou a tela usada no teste. O arquivo é enviado ao parar.
                    </p>
                  </div>
                  {recordingState === 'recording' ? (
                    <Button size="sm" variant="destructive" onClick={stopScreenRecording}>
                      <Icon name="close" /> Parar e enviar
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      disabled={recordingState === 'uploading'}
                      onClick={() => void startScreenRecording()}
                    >
                      <Icon name="monitor" />{' '}
                      {recordingState === 'uploading'
                        ? 'Enviando…'
                        : recordingState === 'ready'
                          ? 'Gravar novamente'
                          : 'Iniciar gravação'}
                    </Button>
                  )}
                </div>
                {recordingState === 'recording' ? (
                  <p className="mt-3 flex items-center gap-2 text-xs text-destructive">
                    <span className="size-2 animate-pulse rounded-full bg-destructive" /> Gravação
                    em andamento
                  </p>
                ) : null}
                {recordingState === 'ready' ? (
                  <p className="mt-3 flex items-center gap-2 text-xs text-success">
                    <Icon name="check" /> Gravação enviada e em processamento.
                  </p>
                ) : null}
                {recordingError ? (
                  <p className="mt-3 text-xs text-destructive">{recordingError}</p>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>

        <section className="grid gap-3 rounded-2xl border border-border bg-surface/95 p-4 shadow-xl backdrop-blur lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <h2 className="font-semibold text-foreground">Dispositivos da sessão</h2>
              <p className="text-xs text-muted">As alterações ficam marcadas na linha do tempo.</p>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {deviceCards.map((device) => {
                const enabled = devices[device.kind]
                return (
                  <button
                    key={device.kind}
                    type="button"
                    aria-pressed={enabled}
                    disabled={deviceEvent.isPending}
                    onClick={() => void toggleDevice(device.kind)}
                    className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3 text-left transition-colors hover:bg-surface-raised aria-pressed:border-primary aria-pressed:bg-primary/10 disabled:cursor-not-allowed"
                  >
                    <span
                      className={`flex size-9 items-center justify-center rounded-lg bg-surface-raised ${
                        enabled ? 'text-primary' : 'text-muted'
                      }`}
                    >
                      <Icon name={device.icon} className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-foreground">
                        {device.label}
                      </span>
                      <span className="block truncate text-xs text-muted">
                        {device.description}
                      </span>
                    </span>
                    <span
                      className={`text-xs font-medium ${enabled ? 'text-success' : 'text-muted'}`}
                    >
                      {enabled ? 'Ligado' : 'Desligado'}
                    </span>
                  </button>
                )
              })}
            </div>
            {deviceError ? <p className="mt-3 text-sm text-destructive">{deviceError}</p> : null}
          </div>
          <div className="flex flex-col gap-2 lg:min-w-44">
            <Button variant="destructive" onClick={() => setFinishOpen(true)}>
              Encerrar teste
            </Button>
            <p className="text-center text-xs text-muted">Você confirmará antes de encerrar.</p>
          </div>
        </section>
      </div>

      <Dialog open={finishOpen} onOpenChange={setFinishOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Encerrar este teste?</DialogTitle>
            <DialogDescription>
              A sessão será enviada para validação. Depois disso, você seguirá para a sua avaliação.
            </DialogDescription>
          </DialogHeader>
          {finishError ? <p className="text-sm text-destructive">{finishError}</p> : null}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFinishOpen(false)}
              disabled={finish.isPending}
            >
              Continuar jogando
            </Button>
            <Button
              variant="destructive"
              onClick={() => void finishSession()}
              disabled={finish.isPending}
            >
              {finish.isPending ? 'Encerrando...' : 'Encerrar e avaliar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}

function elapsedSince(startedAt: string): number {
  return Math.max(0, Date.now() - new Date(startedAt).getTime())
}
