import { useEffect, useId, useRef, useState, type DragEvent } from 'react'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ACCEPTED_IMAGE_TYPES, validateImageFile } from '../new-game'

type ImageDropzoneProps = {
  label: string
  hint: string
  file: File | undefined
  onChange: (file: File | undefined) => void
  disabled?: boolean
}

/** Área de envio de imagem (arrastar e soltar ou "Importar"), com pré-visualização local. */
export function ImageDropzone({ label, hint, file, onChange, disabled }: ImageDropzoneProps) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // A URL de pré-visualização nasce nos handlers (não num efeito) e é revogada ao trocar/remover/desmontar.
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const previewRef = useRef<string | null>(null)

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    },
    [],
  )

  function replacePreview(next: File | undefined) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    previewRef.current = next ? URL.createObjectURL(next) : null
    setPreviewUrl(previewRef.current)
  }

  function accept(candidate: File | undefined) {
    if (!candidate) return
    const problem = validateImageFile(candidate)
    setError(problem)
    if (problem) return
    replacePreview(candidate)
    onChange(candidate)
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(false)
    if (!disabled) accept(event.dataTransfer.files[0])
  }

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-base font-bold text-foreground-strong">
        {label}
      </label>
      <p className="text-sm text-foreground-strong/80">{hint}</p>
      <div
        onDragOver={(event) => {
          event.preventDefault()
          if (!disabled) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-field-border/80 p-4 text-center',
          dragging && 'border-primary bg-primary/10',
        )}
      >
        {previewUrl && file ? (
          <>
            <img
              src={previewUrl}
              alt={`Pré-visualização de ${label.toLowerCase()}`}
              className="max-h-32 max-w-full rounded-md object-contain"
            />
            <p className="max-w-full truncate text-sm text-foreground-strong">{file.name}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => {
                setError(null)
                replacePreview(undefined)
                onChange(undefined)
              }}
            >
              <Icon name="trash" />
              Remover
            </Button>
          </>
        ) : (
          <>
            <Icon name="folder-upload" className="size-10 text-primary" />
            <div>
              <p className="text-sm font-bold text-foreground-strong">
                Arraste e solte a sua imagem aqui
              </p>
              <p className="text-xs text-foreground-strong/70">
                Tipos de arquivo aceitos: .png, .jpg, .webp (até 5 MB)
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
              className="bg-gradient-to-br from-cta-configure-from to-cta-configure-to font-bold"
            >
              Importar
              <Icon name="upload" />
            </Button>
          </>
        )}
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          disabled={disabled}
          className="sr-only"
          onChange={(event) => {
            accept(event.target.files?.[0])
            event.target.value = ''
          }}
        />
      </div>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
