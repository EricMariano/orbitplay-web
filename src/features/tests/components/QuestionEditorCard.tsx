import { useId } from 'react'
import { Icon, type IconName } from '@/components/icon'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  QUESTION_TYPE_LABELS,
  SCALE_MAX_VALUES,
  SCALE_MIN_VALUES,
  changeQuestionType,
  createOptionDraft,
  isChoiceType,
  type EditableQuestionType,
  type QuestionDraft,
} from '../test-form'

/** Campo do wizard (Figma: 46px, raio 12, fundo claro a 20%). */
const fieldClassName =
  'h-[46px] w-full rounded-xl border-field-border bg-field px-4 text-base text-foreground-strong shadow-none placeholder:text-foreground-strong/70 data-[size=default]:h-[46px] md:text-base dark:bg-field'

type QuestionEditorCardProps = {
  question: QuestionDraft
  isFirst: boolean
  isLast: boolean
  onChange: (question: QuestionDraft) => void
  onMove: (direction: 'up' | 'down') => void
  onDuplicate: () => void
  onDelete: () => void
}

/** Uma pergunta do formulário de avaliação (wizard "Novo teste", passo 2). */
export function QuestionEditorCard({
  question,
  isFirst,
  isLast,
  onChange,
  onMove,
  onDuplicate,
  onDelete,
}: QuestionEditorCardProps) {
  const id = useId()

  function updateOption(key: string, label: string) {
    onChange({
      ...question,
      options: question.options.map((option) =>
        option.key === key ? { ...option, label } : option,
      ),
    })
  }

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-foreground-strong p-6">
      <div className="flex flex-wrap items-end gap-6">
        <div className="flex w-full max-w-[390px] flex-col gap-1">
          <Label htmlFor={`${id}-type`} className="text-base font-bold text-foreground-strong">
            Tipo da pergunta*
          </Label>
          <Select
            value={question.type}
            onValueChange={(type) =>
              onChange(changeQuestionType(question, type as EditableQuestionType))
            }
          >
            <SelectTrigger id={`${id}-type`} className={fieldClassName}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(QUESTION_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Imagem na pergunta está no design, mas a API ainda não tem campo para ela. */}
        <button
          type="button"
          disabled
          title="Anexar imagem (em breve)"
          aria-label="Anexar imagem (em breve)"
          className="mb-[5px] flex size-9 items-center justify-center rounded-lg bg-foreground text-background disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Icon name="image-plus" className="size-5" />
        </button>

        <label className="flex h-[46px] items-center gap-2 text-base text-foreground-strong">
          <Checkbox
            checked={question.required}
            onCheckedChange={(checked) => onChange({ ...question, required: checked === true })}
            className="size-6 rounded-lg border-2 border-muted bg-foreground-strong data-[state=checked]:border-primary"
          />
          Obrigatória
        </label>
      </div>

      <Separator />

      <div className="flex w-full max-w-[390px] flex-col gap-1">
        <Label htmlFor={`${id}-prompt`} className="text-base font-bold text-foreground-strong">
          Pergunta*
        </Label>
        <Input
          id={`${id}-prompt`}
          value={question.prompt}
          onChange={(event) => onChange({ ...question, prompt: event.target.value })}
          placeholder="Digite..."
          maxLength={1000}
          className={fieldClassName}
        />
      </div>

      {isChoiceType(question.type) ? (
        <div className="flex flex-col gap-4">
          {question.options.map((option, index) => (
            <div key={option.key} className="flex items-center gap-2">
              <span
                aria-hidden
                className={cn(
                  'size-6 shrink-0 border-2 border-muted bg-foreground-strong',
                  question.type === 'single_choice' ? 'rounded-full' : 'rounded-lg',
                )}
              />
              <Input
                value={option.label}
                onChange={(event) => updateOption(option.key, event.target.value)}
                placeholder="Digite..."
                aria-label={`Opção ${index + 1}`}
                maxLength={300}
                className={cn(fieldClassName, 'max-w-[390px]')}
              />
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...question,
                    options: question.options.filter((o) => o.key !== option.key),
                  })
                }
                aria-label={`Remover opção ${index + 1}`}
                className="text-destructive hover:opacity-80"
              >
                <Icon name="trash" className="size-6" />
              </button>
            </div>
          ))}
          <LinkAction
            icon="plus"
            label="Adicionar opção"
            onClick={() =>
              onChange({ ...question, options: [...question.options, createOptionDraft()] })
            }
          />
        </div>
      ) : null}

      {question.type === 'scale' ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 sm:gap-6">
            <ScaleSelect
              label="Início da escala"
              value={question.scaleMin}
              values={SCALE_MIN_VALUES}
              onChange={(scaleMin) => onChange({ ...question, scaleMin })}
            />
            <span className="text-base font-bold text-foreground-strong">a</span>
            <ScaleSelect
              label="Fim da escala"
              value={question.scaleMax}
              values={SCALE_MAX_VALUES}
              onChange={(scaleMax) => onChange({ ...question, scaleMax })}
            />
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex min-w-[200px] flex-1 flex-col gap-1 sm:max-w-[390px]">
              <Label
                htmlFor={`${id}-min-label`}
                className="text-base font-bold text-foreground-strong"
              >
                Primeiro marcador
              </Label>
              <Input
                id={`${id}-min-label`}
                value={question.scaleMinLabel}
                onChange={(event) => onChange({ ...question, scaleMinLabel: event.target.value })}
                placeholder="Digite..."
                maxLength={300}
                className={fieldClassName}
              />
            </div>
            <div className="flex min-w-[200px] flex-1 flex-col gap-1 sm:max-w-[390px]">
              <Label
                htmlFor={`${id}-max-label`}
                className="text-base font-bold text-foreground-strong"
              >
                Último marcador
              </Label>
              <Input
                id={`${id}-max-label`}
                value={question.scaleMaxLabel}
                onChange={(event) => onChange({ ...question, scaleMaxLabel: event.target.value })}
                placeholder="Digite..."
                maxLength={300}
                className={fieldClassName}
              />
            </div>
          </div>
        </div>
      ) : null}

      <Separator />

      <div className="flex flex-wrap items-center justify-end gap-6">
        <LinkAction icon="arrow-up" label="Subir" disabled={isFirst} onClick={() => onMove('up')} />
        <LinkAction
          icon="arrow-down"
          label="Descer"
          disabled={isLast}
          onClick={() => onMove('down')}
        />
        <LinkAction icon="copy" label="Duplicar" onClick={onDuplicate} />
        <LinkAction icon="trash" label="Deletar" tone="destructive" onClick={onDelete} />
      </div>
    </div>
  )
}

function ScaleSelect({
  label,
  value,
  values,
  onChange,
}: {
  label: string
  value: number
  values: number[]
  onChange: (value: number) => void
}) {
  return (
    <Select value={String(value)} onValueChange={(next) => onChange(Number(next))}>
      <SelectTrigger
        aria-label={label}
        className={cn(fieldClassName, 'min-w-0 flex-1 sm:max-w-[390px]')}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {values.map((n) => (
          <SelectItem key={n} value={String(n)}>
            {n}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/** Ação em texto + ícone à direita, como os links do design ("Subir ↑", "Adicionar opção +"). */
export function LinkAction({
  icon,
  label,
  onClick,
  disabled,
  tone = 'primary',
}: {
  icon: IconName
  label: string
  onClick?: () => void
  disabled?: boolean
  tone?: 'primary' | 'destructive'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-1 text-base font-bold hover:opacity-80 disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:opacity-100',
        tone === 'primary' ? 'text-primary' : 'text-destructive',
      )}
    >
      {label}
      <Icon name={icon} className="size-6" />
    </button>
  )
}
