import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import type { DesignSchemas } from '@/api-types'
import { ErrorState } from '@/components/common/ErrorState'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useBuildCompatibility,
  useBuildDownloadUrl,
  useEnterPlayerTest,
  useParticipationTutorial,
  usePlayerTest,
  useRecordParticipationConsents,
  useStartParticipationSession,
} from '@/features/tests/api/use-player-test-preparation'

export const Route = createFileRoute('/player/tests/$testId/tutorial')({
  component: PlayerTestTutorialPage,
})

function PlayerTestTutorialPage() {
  const { testId } = Route.useParams()
  const testQuery = usePlayerTest(testId)
  const enter = useEnterPlayerTest()

  return (
    <div className="flex min-h-[calc(100dvh-7rem)] items-center justify-center py-8">
      <QueryBoundary
        query={testQuery}
        loadingFallback={<Skeleton className="h-[640px] w-full max-w-[1140px]" />}
      >
        {(test) => {
          const participation = test.participation ?? enter.data
          return (
            <section className="flex w-full max-w-[1140px] flex-col gap-6 rounded-2xl border border-border bg-surface px-6 py-5">
              <header className="flex items-center gap-4">
                <h1 className="flex-1 text-xl font-semibold text-foreground">
                  {participation ? `Tutorial: ${test.title}` : test.title}
                </h1>
                <Link
                  to="/player"
                  aria-label="Fechar tutorial"
                  className="text-muted hover:text-foreground"
                >
                  <Icon name="chevron-left" className="size-6" />
                </Link>
              </header>

              {!participation ? (
                <div className="flex min-h-96 flex-col items-center justify-center gap-4 text-center">
                  <p className="max-w-xl text-muted">
                    Entre neste teste para receber o tutorial do modelo e preparar a build.
                  </p>
                  {enter.isError ? (
                    <ErrorState
                      title="Não foi possível entrar no teste"
                      message="A API não confirmou sua participação. Tente novamente."
                      onRetry={() => enter.mutate(testId)}
                    />
                  ) : null}
                  <Button onClick={() => enter.mutate(testId)} disabled={enter.isPending}>
                    {enter.isPending ? 'Entrando…' : 'Entrar no teste'}
                  </Button>
                </div>
              ) : (
                <PreparationFlow
                  key={participation.id}
                  participation={participation}
                  onRefresh={() => void testQuery.refetch()}
                />
              )}
            </section>
          )
        }}
      </QueryBoundary>
    </div>
  )
}

function PreparationFlow({
  participation,
  onRefresh,
}: {
  participation: DesignSchemas['Participation']
  onRefresh: () => void
}) {
  const build = participation.build
  const tutorialQuery = useParticipationTutorial(participation.id)
  const compatibility = useBuildCompatibility(build?.id ?? '')

  if (!build) {
    return (
      <ErrorState
        title="Build indisponível"
        message="A participação não inclui uma build que possa ser preparada."
      />
    )
  }

  return (
    <QueryBoundary
      query={tutorialQuery}
      loadingFallback={<Skeleton className="h-[520px] w-full" />}
    >
      {(tutorial) => (
        <PreparationContent
          participation={participation}
          build={build}
          tutorial={tutorial}
          compatibility={compatibility}
          onRefresh={onRefresh}
        />
      )}
    </QueryBoundary>
  )
}

function PreparationContent({
  participation,
  build,
  tutorial,
  compatibility,
  onRefresh,
}: {
  participation: DesignSchemas['Participation']
  build: DesignSchemas['Build']
  tutorial: DesignSchemas['Tutorial']
  compatibility: ReturnType<typeof useBuildCompatibility>
  onRefresh: () => void
}) {
  const [stepIndex, setStepIndex] = useState(0)
  const [tutorialComplete, setTutorialComplete] = useState(tutorial.steps.length === 0)
  const [downloadStarted, setDownloadStarted] = useState(false)
  const [forceDownload, setForceDownload] = useState(false)
  const [selectedConsents, setSelectedConsents] = useState<
    Partial<Record<DesignSchemas['ConsentKind'], boolean>>
  >({})
  const consentMutation = useRecordParticipationConsents(participation.id)
  const sessionMutation = useStartParticipationSession(participation.id)
  const versionKey = `orbitplay:build-version:${build.id}`
  const [localVersion, setLocalVersion] = useState(() => {
    try {
      return window.localStorage.getItem(versionKey) ?? undefined
    } catch {
      return undefined
    }
  })
  const download = useBuildDownloadUrl(
    build.id,
    forceDownload ? undefined : localVersion,
    compatibility.data?.compatible === true && build.status === 'validated',
  )
  const requirements = tutorial.requiredConsents
  const allConsentsSelected = requirements.every((kind) => selectedConsents[kind] === true)
  const consentsGranted =
    participation.consentsGranted || consentMutation.data?.allRequiredGranted === true
  const downloadConfirmed =
    download.data?.needsDownload === false ||
    (!forceDownload && localVersion === download.data?.version)
  const ready =
    tutorialComplete &&
    (requirements.length === 0 || consentsGranted) &&
    compatibility.data?.compatible === true &&
    build.status === 'validated' &&
    downloadConfirmed
  const activeStep = tutorial.steps[stepIndex]

  function saveDownloadedVersion() {
    if (!download.data?.version) return
    try {
      window.localStorage.setItem(versionKey, download.data.version)
    } catch {
      // Browser storage may be unavailable; this only affects version reuse.
    }
    setLocalVersion(download.data.version)
    setForceDownload(false)
  }

  function requestConsent() {
    consentMutation.mutate({
      consents: requirements.map((kind) => ({ kind, granted: selectedConsents[kind] === true })),
    })
  }

  function startSession() {
    if (!ready || !download.data) return
    sessionMutation.mutate({ buildVersion: download.data.version, platform: 'web' })
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <span>Modelo</span>
          <span className="rounded-full border border-border bg-surface-raised px-3 py-1 text-foreground">
            {tutorial.modelKey.replaceAll('_', ' ')}
          </span>
          <span className="ml-auto">Build {build.version ?? '—'}</span>
        </div>

        {activeStep && !tutorialComplete ? (
          <article className="min-h-72 rounded-xl border border-border bg-background/60 p-6">
            <h2 className="text-lg font-semibold text-foreground">{activeStep.title}</h2>
            {activeStep.body ? (
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted">
                {activeStep.body}
              </p>
            ) : null}
            {activeStep.mediaUrl ? <TutorialMedia url={activeStep.mediaUrl} /> : null}
          </article>
        ) : (
          <article className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-xl border border-border bg-background/60 p-6 text-center">
            {sessionMutation.data ? (
              <>
                <span className="grid size-16 place-items-center rounded-full bg-success/20 text-success">
                  <Icon name="check" className="size-8" />
                </span>
                <h2 className="text-xl font-semibold text-foreground">Sessão iniciada</h2>
                <p className="text-sm text-muted">A API confirmou o início da sessão.</p>
                <p className="text-xs text-muted">ID da sessão: {sessionMutation.data.sessionId}</p>
              </>
            ) : (
              <>
                <span className="grid size-16 place-items-center rounded-full bg-primary/20 text-primary">
                  <Icon name="check" className="size-8" />
                </span>
                <h2 className="text-xl font-semibold text-foreground">Tudo pronto!</h2>
                <p className="max-w-2xl text-sm text-muted">
                  O tutorial do modelo {tutorial.modelKey.replaceAll('_', ' ')} foi concluído.
                </p>
              </>
            )}
          </article>
        )}

        {requirements.length > 0 ? (
          <section className="rounded-xl border border-border bg-background/40 p-5">
            <h3 className="font-semibold text-foreground">Consentimentos necessários</h3>
            <p className="mt-1 text-sm text-muted">
              Os consentimentos são definidos pelo modelo de teste e serão registrados no servidor.
            </p>
            {consentsGranted ? (
              <p className="mt-4 flex items-center gap-2 text-sm text-success">
                <Icon name="check" /> Consentimentos registrados
              </p>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                {requirements.map((kind) => (
                  <label
                    key={kind}
                    className="flex cursor-pointer items-center gap-3 text-sm text-foreground"
                  >
                    <Checkbox
                      checked={selectedConsents[kind] === true}
                      onCheckedChange={(checked) =>
                        setSelectedConsents((current) => ({ ...current, [kind]: checked === true }))
                      }
                    />
                    Autorizo {consentLabel[kind].toLowerCase()} para este teste
                  </label>
                ))}
                <Button
                  variant="secondary"
                  className="self-start"
                  onClick={requestConsent}
                  disabled={!allConsentsSelected || consentMutation.isPending}
                >
                  {consentMutation.isPending ? 'Registrando…' : 'Registrar consentimentos'}
                </Button>
              </div>
            )}
            {consentMutation.isError ? (
              <p role="alert" className="mt-3 text-sm text-destructive">
                {consentMutation.error.message}
              </p>
            ) : null}
          </section>
        ) : null}

        <section className="rounded-xl border border-border bg-background/40 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground">Preparação da build</h3>
              <p className="mt-1 text-sm text-muted">
                Versão {build.version ?? 'não informada'} · validação do servidor:{' '}
                {build.status === 'validated' ? 'concluída' : build.status}
              </p>
            </div>
            <CompatibilityStatus query={compatibility} />
          </div>

          {compatibility.data?.compatible && build.status === 'validated' ? (
            <DownloadStatus
              query={download}
              confirmed={downloadConfirmed}
              started={downloadStarted}
              onConfirm={saveDownloadedVersion}
              onStarted={() => setDownloadStarted(true)}
              onRedownload={() => setForceDownload(true)}
            />
          ) : null}
          {compatibility.data && !compatibility.data.compatible ? (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 p-4"
            >
              <p className="font-medium text-destructive">Este dispositivo não é compatível</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-muted">
                {compatibility.data.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {build.status !== 'validated' ? (
            <div className="mt-4">
              <p role="status" className="text-sm text-muted">
                O início fica bloqueado até a API informar que a build foi validada.
              </p>
              <Button variant="outline" size="sm" className="mt-3" onClick={onRefresh}>
                Atualizar status da build
              </Button>
            </div>
          ) : null}
        </section>

        {sessionMutation.isError ? (
          <ErrorState
            title="Não foi possível iniciar o teste"
            message={sessionMutation.error.message}
            onRetry={startSession}
          />
        ) : null}
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
        <Button
          variant="ghost"
          onClick={() => {
            if (tutorialComplete) {
              setTutorialComplete(false)
              setStepIndex(Math.max(tutorial.steps.length - 1, 0))
            } else {
              setStepIndex((index) => Math.max(0, index - 1))
            }
          }}
          disabled={stepIndex === 0 && !tutorialComplete}
        >
          Voltar
        </Button>
        <div
          className="flex items-center gap-2"
          aria-label={`Etapa ${tutorial.steps.length ? stepIndex + 1 : 0} de ${tutorial.steps.length}`}
        >
          {tutorial.steps.map((step, index) => (
            <span
              key={`${step.title}-${index}`}
              className={`size-3 rounded-full ${index <= stepIndex && !tutorialComplete ? 'bg-primary' : 'bg-muted/40'}`}
            />
          ))}
        </div>
        {!tutorialComplete ? (
          <Button
            onClick={() => {
              if (stepIndex < tutorial.steps.length - 1) setStepIndex((index) => index + 1)
              else setTutorialComplete(true)
            }}
          >
            {stepIndex < tutorial.steps.length - 1 ? 'Próximo' : 'Concluir tutorial'}
            <Icon name="chevron-right" />
          </Button>
        ) : sessionMutation.data ? (
          <Button asChild variant="secondary">
            <Link to="/player">Voltar para Home</Link>
          </Button>
        ) : (
          <Button onClick={startSession} disabled={!ready || sessionMutation.isPending}>
            {sessionMutation.isPending ? 'Iniciando…' : 'Iniciar Jogo!'}
          </Button>
        )}
      </footer>
    </>
  )
}

function CompatibilityStatus({ query }: { query: ReturnType<typeof useBuildCompatibility> }) {
  if (query.isPending) {
    return <span className="text-sm text-muted">Verificando compatibilidade…</span>
  }
  if (query.isError) {
    return (
      <div role="alert" className="flex items-center gap-2 text-sm text-destructive">
        <Icon name="alert" /> Não foi possível validar o dispositivo
        <Button variant="outline" size="sm" onClick={() => void query.refetch()}>
          Tentar novamente
        </Button>
      </div>
    )
  }
  return (
    <span
      className={`flex items-center gap-2 text-sm ${query.data.compatible ? 'text-success' : 'text-destructive'}`}
    >
      <Icon name={query.data.compatible ? 'check' : 'alert'} />
      {query.data.compatible ? 'Dispositivo compatível' : 'Incompatível'}
    </span>
  )
}

function DownloadStatus({
  query,
  confirmed,
  started,
  onConfirm,
  onStarted,
  onRedownload,
}: {
  query: ReturnType<typeof useBuildDownloadUrl>
  confirmed: boolean
  started: boolean
  onConfirm: () => void
  onStarted: () => void
  onRedownload: () => void
}) {
  if (query.isPending) {
    return (
      <p role="status" className="mt-4 text-sm text-muted">
        Obtendo acesso seguro à build…
      </p>
    )
  }
  if (query.isError) {
    return (
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <p role="alert" className="text-sm text-destructive">
          {query.error.message}
        </p>
        <Button variant="outline" size="sm" onClick={() => void query.refetch()}>
          Renovar link
        </Button>
      </div>
    )
  }
  if (!query.data.needsDownload) {
    return (
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <p role="status" className="text-sm text-success">
          A versão atual já está preparada.
        </p>
        <Button variant="outline" size="sm" onClick={onRedownload}>
          Baixar novamente
        </Button>
      </div>
    )
  }
  if (!query.data.downloadUrl) {
    return (
      <p role="alert" className="mt-4 text-sm text-destructive">
        A API não forneceu um link de download.
      </p>
    )
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      {confirmed ? (
        <p role="status" className="flex items-center gap-2 text-sm text-success">
          <Icon name="check" /> Build {query.data.version} marcada como baixada
        </p>
      ) : (
        <>
          <a
            href={query.data.downloadUrl}
            target="_blank"
            rel="noreferrer"
            onClick={onStarted}
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Baixar build ({formatBytes(query.data.sizeBytes)})
          </a>
          <Button variant="outline" size="sm" onClick={() => void query.refetch()}>
            Renovar link
          </Button>
          <p className="basis-full text-xs text-muted">
            Acompanhe o download no navegador. Ao terminar, confirme abaixo para liberar o início.
          </p>
          {started ? (
            <Button variant="secondary" size="sm" onClick={onConfirm}>
              Confirmar que a build terminou de baixar
            </Button>
          ) : null}
          {query.data.supportsRange ? (
            <span className="text-xs text-muted">
              O servidor aceita retomada pelo gerenciador de downloads.
            </span>
          ) : null}
        </>
      )}
    </div>
  )
}

function TutorialMedia({ url }: { url: string }) {
  let pathname: string
  try {
    pathname = new URL(url).pathname.toLowerCase()
  } catch {
    return null
  }

  if (/\.(mp4|webm|ogg)$/.test(pathname)) {
    return <video className="mt-5 max-h-[360px] w-full rounded-xl bg-black" controls src={url} />
  }
  if (/\.(png|jpe?g|webp|gif|svg)$/.test(pathname)) {
    return <img className="mt-5 max-h-[360px] w-full rounded-xl object-contain" src={url} alt="" />
  }
  return (
    <a
      className="mt-5 inline-flex text-sm text-primary underline"
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      Abrir material desta etapa
    </a>
  )
}

function formatBytes(size: number | null | undefined) {
  if (!size || !Number.isFinite(size)) return 'tamanho não informado'
  const units = ['B', 'KB', 'MB', 'GB']
  let value = size
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`
}

const consentLabel: Record<DesignSchemas['ConsentKind'], string> = {
  screen_recording: 'gravação da tela',
  audio: 'áudio',
  microphone: 'uso do microfone',
  webcam: 'uso da webcam',
}
