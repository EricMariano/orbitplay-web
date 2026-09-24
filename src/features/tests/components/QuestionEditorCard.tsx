import { Checkbox } from '@/components/ui/checkbox'
import { Icon } from '@/components/icon'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { QuestionType, TestFormQuestion } from '../types'

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  short_answer: 'Resposta curta',
  single_choice: 'Escolha',
  multiple_choice: 'Múltipla Escolha',
  linear_scale: 'Escala linear',
}

function createOption(): { id: string; label: string } {
  return { id: crypto.randomUUID(), label: '' }
}

type QuestionEditorCardProps = {
  question: TestFormQuestion
  index: number
  total: number
  onChange: (question: TestFormQuestion) => void
  onMove: (direction: 'up' | 'down') => void
  onDuplicate: () => void
  onDelete: () => void
}

export function QuestionEditorCard({
  question,
  index,
  total,
  onChange,
  onMove,
  onDuplicate,
  onDelete,
}: QuestionEditorCardProps) {
  const hasOptions = question.type === 'single_choice' || question.type === 'multiple_choice'
  const isScale = question.type === 'linear_scale'

  function updateOption(id: string, label: string) {
    onChange({
      ...question,
      options: question.options.map((option) => (option.id === id ? { ...option, label } : option)),
    })
  }

  function removeOption(id: string) {
    onChange({ ...question, options: question.options.filter((option) => option.id !== id) })
  }

  return (
    <div className="rounded-lg border border-white bg-stat-card-background p-5">
      <div className="mb-4 flex flex-wrap items-center gap-4 border-b border-border pb-4">
        <div className="min-w-[200px] flex-1">
          <label className="mb-1 block text-sm font-medium text-foreground-strong">
            Tipo da pergunta*
          </label>
          <Select
            value={question.type}
            onValueChange={(type: QuestionType) =>
              onChange({
                ...question,
                type,
                options:
                  type === 'single_choice' || type === 'multiple_choice'
                    ? [createOption(), createOption(), createOption()]
                    : [],
              })
            }
          >
            <SelectTrigger className="w-full">
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

        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-md border border-border text-foreground-strong"
          title="Anexar imagem à pergunta"
        >
          <Icon name="image" className="size-4" />
        </button>

        <label className="flex items-center gap-2 text-sm text-foreground-strong">
          <Checkbox
            checked={question.required}
            onCheckedChange={(checked) => onChange({ ...question, required: checked === true })}
          />
          Obrigatória
        </label>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-foreground-strong">Pergunta*</label>
        <Input
          value={question.prompt}
          onChange={(e) => onChange({ ...question, prompt: e.target.value })}
          placeholder="Digite..."
        />
      </div>

      {hasOptions ? (
        <div className="mb-4 space-y-2">
          {question.options.map((option) => (
            <div key={option.id} className="flex items-center gap-3">
              <span
                className={cn(
                  'size-4 shrink-0 border border-white/60',
                  question.type === 'single_choice' ? 'rounded-full' : 'rounded-sm',
                )}
              />
              <Input
                value={option.label}
                onChange={(e) => updateOption(option.id, e.target.value)}
                placeholder="Digite..."
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => removeOption(option.id)}
                aria-label="Remover opção"
              >
                <Icon name="trash" className="size-4 text-destructive" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              onChange({ ...question, options: [...question.options, createOption()] })
            }
            className="flex items-center gap-1 text-sm text-primary"
          >
            <Icon name="plus" className="size-4" />
            Adicionar opção
          </button>
        </div>
      ) : null}

      {isScale ? (
        <div className="mb-4 space-y-3">
          <div className="flex items-center gap-3">
            <Select
              value={String(question.scaleMin)}
              onValueChange={(v) => onChange({ ...question, scaleMin: Number(v) })}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[0, 1].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-foreground-strong">a</span>
            <Select
              value={String(question.scaleMax)}
              onValueChange={(v) => onChange({ ...question, scaleMax: Number(v) })}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[3, 4, 5, 7, 10].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm text-foreground-strong">Primeiro marcador</label>
              <Input
                value={question.scaleMinLabel}
                onChange={(e) => onChange({ ...question, scaleMinLabel: e.target.value })}
                placeholder="Digite..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-foreground-strong">Último marcador</label>
              <Input
                value={question.scaleMaxLabel}
                onChange={(e) => onChange({ ...question, scaleMaxLabel: e.target.value })}
                placeholder="Digite..."
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-end gap-4 border-t border-border pt-3 text-sm">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onMove('up')}
          className="flex items-center gap-1 text-[#74ade6]"
        >
          <Icon name="arrow-up" className="size-4 text-[#74ade6]" />
          Subir
        </button>

        <button
          type="button"
          disabled={index === total - 1}
          onClick={() => onMove('down')}
          className="flex items-center gap-1 text-[#74ade6]"
        >
          <Icon name="arrow-down" className="size-4 text-[#74ade6]" />
          Descer
        </button>

        <button
          type="button"
          onClick={onDuplicate}
          className="flex items-center gap-1 text-[#74ade6]"
        >
          <Icon name="copy" className="size-4 text-[#74ade6]" />
          Duplicar
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="flex items-center gap-1 text-destructive"
        >
          <Icon name="trash" className="size-4 text-destructive" />
          Deletar
        </button>
      </div>
    </div>
  )
}
