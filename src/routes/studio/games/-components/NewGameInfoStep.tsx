import { useId } from 'react'
import { MultiSelect } from '@/components/common/MultiSelect'
import { TagPicker } from '@/components/common/TagPicker'
import { WIZARD_FIELD_CLASS, WizardField } from '@/components/common/WizardField'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AGE_RATING_OPTIONS,
  DEVELOPMENT_STAGE_OPTIONS,
  ENGINE_OPTIONS,
  GAME_MODE_OPTIONS,
  GENRES_MAX,
  GENRE_SUGGESTIONS,
  LANGUAGE_OPTIONS,
  PLATFORM_OPTIONS,
  SUBGENRES_MAX,
  SUBGENRE_SUGGESTIONS,
  type DraftErrors,
  type NewGameDraft,
} from '@/features/games/new-game'

type NewGameInfoStepProps = {
  draft: NewGameDraft
  errors: DraftErrors
  onChange: (draft: NewGameDraft) => void
  disabled?: boolean
}

/** Wizard "Novo jogo", etapa 1 (Tela 04): informações gerais do jogo. */
export function NewGameInfoStep({ draft, errors, onChange, disabled }: NewGameInfoStepProps) {
  const id = useId()
  const set = <K extends keyof NewGameDraft>(key: K, value: NewGameDraft[K]) =>
    onChange({ ...draft, [key]: value })

  return (
    <fieldset disabled={disabled} className="flex min-w-0 flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <WizardField label="Nome do jogo" htmlFor={`${id}-title`} required error={errors.title}>
          <Input
            id={`${id}-title`}
            value={draft.title}
            onChange={(event) => set('title', event.target.value)}
            placeholder="Digite..."
            aria-invalid={Boolean(errors.title)}
            className={WIZARD_FIELD_CLASS}
          />
        </WizardField>
        <WizardField label="Subtítulo / tagline" htmlFor={`${id}-tagline`} error={errors.tagline}>
          <Input
            id={`${id}-tagline`}
            value={draft.tagline}
            onChange={(event) => set('tagline', event.target.value)}
            placeholder="Digite... Ex: Strategic battles beyond the end of the world"
            aria-invalid={Boolean(errors.tagline)}
            className={WIZARD_FIELD_CLASS}
          />
        </WizardField>
        <WizardField
          label="Descrição curta"
          htmlFor={`${id}-description`}
          error={errors.description}
        >
          <Input
            id={`${id}-description`}
            value={draft.description}
            onChange={(event) => set('description', event.target.value)}
            placeholder="Digite..."
            aria-invalid={Boolean(errors.description)}
            className={WIZARD_FIELD_CLASS}
          />
        </WizardField>
      </div>

      <TagPicker
        label="Gênero"
        required
        value={draft.genres}
        onChange={(genres) => set('genres', genres)}
        suggestions={GENRE_SUGGESTIONS}
        max={GENRES_MAX}
        error={errors.genres}
      />
      <TagPicker
        label="Sub-Gênero"
        value={draft.subgenres}
        onChange={(subgenres) => set('subgenres', subgenres)}
        suggestions={SUBGENRE_SUGGESTIONS}
        max={SUBGENRES_MAX}
        error={errors.subgenres}
      />

      <Separator />

      <div className="grid gap-4 md:grid-cols-3">
        <MultiSelect
          label="Plataformas"
          options={PLATFORM_OPTIONS}
          value={draft.platforms}
          onChange={(platforms) => set('platforms', platforms)}
          error={errors.platforms}
        />
        <MultiSelect
          label="Modo de jogo"
          options={GAME_MODE_OPTIONS}
          value={draft.gameModes}
          onChange={(gameModes) => set('gameModes', gameModes)}
          error={errors.gameModes}
        />
        <SingleSelect
          label="Engine"
          options={ENGINE_OPTIONS}
          value={draft.engine}
          onChange={(engine) => set('engine', engine)}
          error={errors.engine}
        />
        <SingleSelect
          label="Estágio de desenvolvimento"
          options={DEVELOPMENT_STAGE_OPTIONS}
          value={draft.developmentStage}
          onChange={(stage) => set('developmentStage', stage)}
          error={errors.developmentStage}
        />
        <SingleSelect
          label="Classificação indicativa"
          options={AGE_RATING_OPTIONS}
          value={draft.ageRating}
          onChange={(rating) => set('ageRating', rating)}
          error={errors.ageRating}
        />
        <MultiSelect
          label="Idiomas disponíveis"
          options={LANGUAGE_OPTIONS}
          value={draft.languages}
          onChange={(languages) => set('languages', languages)}
          error={errors.languages}
        />
      </div>
    </fieldset>
  )
}

type SingleSelectProps<T extends string> = {
  label: string
  options: { value: T; label: string }[]
  value: T | ''
  onChange: (value: T) => void
  error?: string
}

function SingleSelect<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
}: SingleSelectProps<T>) {
  const id = useId()
  return (
    <WizardField label={label} htmlFor={id} error={error}>
      <Select value={value} onValueChange={(next) => onChange(next as T)}>
        <SelectTrigger id={id} aria-label={label} className={WIZARD_FIELD_CLASS}>
          <SelectValue placeholder="Selecione..." />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </WizardField>
  )
}
