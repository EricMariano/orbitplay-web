import { useId } from 'react'
import { WIZARD_FIELD_CLASS, WizardField } from '@/components/common/WizardField'
import { Input } from '@/components/ui/input'
import { ImageDropzone } from '@/features/games/components/ImageDropzone'
import {
  IMAGE_SLOTS,
  type DraftErrors,
  type ImageSlotKind,
  type NewGameDraft,
  type NewGameImages,
} from '@/features/games/new-game'

type NewGameMediaStepProps = {
  draft: NewGameDraft
  errors: DraftErrors
  images: NewGameImages
  /** Tipos de imagem que já foram enviados à API e não podem mais ser trocados aqui. */
  sentKinds: ReadonlySet<ImageSlotKind>
  trailerLocked: boolean
  onDraftChange: (draft: NewGameDraft) => void
  onImagesChange: (images: NewGameImages) => void
}

/** Wizard "Novo jogo", etapa 2 (Tela 04): capa, logo, ícone e trailer. */
export function NewGameMediaStep({
  draft,
  errors,
  images,
  sentKinds,
  trailerLocked,
  onDraftChange,
  onImagesChange,
}: NewGameMediaStepProps) {
  const trailerId = useId()

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-3">
        {IMAGE_SLOTS.map((slot) => (
          <ImageDropzone
            key={slot.kind}
            label={slot.label}
            hint={slot.hint}
            file={images[slot.kind]}
            disabled={sentKinds.has(slot.kind)}
            onChange={(file) => onImagesChange({ ...images, [slot.kind]: file })}
          />
        ))}
      </div>

      <WizardField
        label="Trailer / vídeo"
        htmlFor={trailerId}
        error={errors.trailerUrl}
        className="max-w-md"
      >
        <Input
          id={trailerId}
          type="url"
          value={draft.trailerUrl}
          disabled={trailerLocked}
          onChange={(event) => onDraftChange({ ...draft, trailerUrl: event.target.value })}
          placeholder="Digite a URL do vídeo..."
          aria-invalid={Boolean(errors.trailerUrl)}
          className={WIZARD_FIELD_CLASS}
        />
      </WizardField>
    </div>
  )
}
