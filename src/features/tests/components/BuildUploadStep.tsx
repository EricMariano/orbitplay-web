import { useId, useRef, useState, type DragEvent, type ReactNode } from 'react'
import { toast } from 'sonner'
import type { Platform, TestBuild } from '@/api-types'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useDeleteBuild } from '../api/use-delete-build'
import { useTest } from '../api/use-test'
import { useUploadBuild } from '../api/use-upload-build'
import {
  ACCEPTED_BUILD_EXTENSIONS,
  PLATFORM_LABELS,
  VALIDATION_STEP_LABELS,
  formatBytes,
  platformFromFileName,
} from '../build-upload'

type BuildUploadStepProps = {
  testId: string
  gamepadSupported: boolean
  onGamepadSupportedChange: (value: boolean) => void
}

/** Wizard "Novo teste", passo 3 (Tela 08): envio da build e "Jogável com controle". */
export function BuildUploadStep({
  testId,
  gamepadSupported,
  onGamepadSupportedChange,
}: BuildUploadStepProps) {
  const gamepadId = useId()
  const test = useTest(testId)
  const uploadBuild = useUploadBuild(testId)
  const deleteBuild = useDeleteBuild(testId)
  const [pending, setPending] = useState<{ file: File; platform: Platform | null } | null>(null)
  const [uploading, setUploading] = useState<{ file: File; progress: number } | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  function startUpload(file: File, platform: Platform) {
    const controller = new AbortController()
    abortRef.current = controller
    setPending(null)
    setUploading({ file, progress: 0 })
    uploadBuild.mutate(
      {
        file,
        platform,
        signal: controller.signal,
        onProgress: (progress) => setUploading({ file, progress }),
      },
      {
        onSuccess: () => toast.success('Build enviada. Estamos validando o arquivo.'),
        onError: (error) => {
          if (error.name !== 'AbortError') {
            toast.error(error.message || 'Não foi possível enviar a build.')
          }
        },
        onSettled: () => setUploading(null),
      },
    )
  }

  function handleFile(file: File | undefined) {
    if (!file) return
    const platform = platformFromFileName(file.name)
    if (platform) startUpload(file, platform)
    else setPending({ file, platform: null })
  }

  function handleRemove() {
    deleteBuild.mutate(undefined, {
      onError: (error) => toast.error(error.message || 'Não foi possível remover a build.'),
    })
  }

  const build = test.data?.build ?? null

  let content
  if (test.isPending) {
    content = <Skeleton className="h-[251px] w-full rounded-2xl" />
  } else if (uploading) {
    content = (
      <FileCard file={uploading.file}>
        <Progress value={uploading.progress * 100} aria-label="Progresso do envio" />
        <div className="flex items-center justify-between text-sm text-muted">
          <span>Enviando… {Math.round(uploading.progress * 100)}%</span>
          <button
            type="button"
            onClick={() => abortRef.current?.abort()}
            className="font-bold text-primary hover:opacity-80"
          >
            Cancelar
          </button>
        </div>
      </FileCard>
    )
  } else if (build && build.status !== 'failed') {
    content = (
      <BuildStatusCard build={build} onRemove={handleRemove} isRemoving={deleteBuild.isPending} />
    )
  } else if (pending) {
    content = (
      <FileCard file={pending.file}>
        <p className="text-sm text-muted">
          Não identificamos a plataforma pela extensão do arquivo. Para qual plataforma é esta
          build?
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Select
            value={pending.platform ?? undefined}
            onValueChange={(platform) =>
              setPending({ file: pending.file, platform: platform as Platform })
            }
          >
            <SelectTrigger aria-label="Plataforma" className="h-[46px] w-56 rounded-xl">
              <SelectValue placeholder="Plataforma" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PLATFORM_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            disabled={!pending.platform}
            onClick={() => pending.platform && startUpload(pending.file, pending.platform)}
          >
            Enviar build
          </Button>
          <button
            type="button"
            onClick={() => setPending(null)}
            className="font-bold text-primary hover:opacity-80"
          >
            Escolher outro arquivo
          </button>
        </div>
      </FileCard>
    )
  } else {
    content = (
      <div className="space-y-3">
        {build?.status === 'failed' ? (
          <p role="alert" className="flex items-center gap-2 text-sm text-destructive">
            <Icon name="alert" className="size-4 shrink-0" />
            {failureMessage(build.failureReason)}
          </p>
        ) : null}
        <BuildDropzone onFile={handleFile} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {content}

      <div className="flex items-center gap-2">
        <Switch
          id={gamepadId}
          checked={gamepadSupported}
          onCheckedChange={onGamepadSupportedChange}
          className="h-6 w-11 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-cta-configure-from data-[state=checked]:to-cta-configure-to [&>span]:size-5 [&>span]:bg-foreground-strong [&>span]:data-[state=checked]:translate-x-5 dark:[&>span]:data-[state=checked]:bg-foreground-strong"
        />
        <label htmlFor={gamepadId} className="text-base font-bold text-foreground-strong">
          Jogável com controle*
        </label>
      </div>
    </div>
  )
}

function failureMessage(reason: string | null) {
  const detail = reason ? `: ${reason.replace(/\.?$/, '.')}` : '.'
  return `A última build não passou na validação${detail} Envie outra versão.`
}

function BuildDropzone({ onFile }: { onFile: (file: File | undefined) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)
    onFile(event.dataTransfer.files[0])
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'flex min-h-[251px] w-full flex-col items-center justify-center gap-6 rounded-2xl border-2 border-dashed border-foreground-strong p-6 text-center transition-colors',
        isDragging && 'border-primary bg-primary/10',
      )}
    >
      <span className="flex size-[72px] items-center justify-center rounded-2xl bg-gradient-to-br from-cta-configure-from to-cta-configure-to text-foreground-strong">
        <Icon name="folder-upload" className="size-10" />
      </span>
      <div>
        <p className="text-base font-bold text-foreground-strong">
          Arraste e solte a sua build aqui
        </p>
        <p className="text-xs text-muted">
          Tipos de arquivo aceitos ({ACCEPTED_BUILD_EXTENSIONS.join(', ')})
        </p>
      </div>
      <Button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="h-12 bg-gradient-to-br from-cta-configure-from to-cta-configure-to px-8 text-base font-bold"
      >
        Importar
        <Icon name="upload" className="size-6" />
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_BUILD_EXTENSIONS.join(',')}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(event) => {
          onFile(event.target.files?.[0])
          event.target.value = ''
        }}
      />
    </div>
  )
}

function FileCard({ file, children }: { file: File; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border-2 border-dashed border-foreground-strong p-6">
      <div className="flex items-center gap-3">
        <Icon name="gamepad" className="size-6 text-primary" />
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-foreground-strong">{file.name}</p>
          <p className="text-xs text-muted">{formatBytes(file.size)}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function BuildStatusCard({
  build,
  onRemove,
  isRemoving,
}: {
  build: TestBuild
  onRemove: () => void
  isRemoving: boolean
}) {
  const isValidated = build.status === 'validated'

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-2xl border-2 p-6',
        isValidated ? 'border-success' : 'border-dashed border-foreground-strong',
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Icon
          name={isValidated ? 'score' : 'loader'}
          className={cn('size-6', isValidated ? 'text-success' : 'animate-spin text-primary')}
        />
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-foreground-strong">
            {isValidated ? 'Build validada' : 'Validando a build…'}
          </p>
          <p className="text-xs text-muted">
            {[
              build.platform ? PLATFORM_LABELS[build.platform] : null,
              build.version,
              build.sizeBytes != null ? formatBytes(build.sizeBytes) : null,
            ]
              .filter(Boolean)
              .join(' · ')}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          disabled={isRemoving}
          className="flex items-center gap-1 text-base font-bold text-destructive hover:opacity-80 disabled:opacity-50"
        >
          Trocar build
          <Icon name="trash" className="size-5" />
        </button>
      </div>

      {build.validationSteps.length > 0 ? (
        <ul className="grid gap-2 sm:grid-cols-2">
          {build.validationSteps.map((step) => (
            <li key={step.key} className="flex items-center gap-2 text-sm text-foreground">
              <Icon
                name={
                  step.status === 'ready'
                    ? 'check'
                    : step.status === 'failed'
                      ? 'close'
                      : step.status === 'processing'
                        ? 'loader'
                        : 'info'
                }
                className={cn(
                  'size-4',
                  step.status === 'ready' && 'text-success',
                  step.status === 'failed' && 'text-destructive',
                  step.status === 'processing' && 'animate-spin text-primary',
                  step.status === 'unavailable' && 'text-muted',
                )}
              />
              {VALIDATION_STEP_LABELS[step.key]}
              {step.status === 'unavailable' ? (
                <span className="text-muted">(indisponível)</span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
