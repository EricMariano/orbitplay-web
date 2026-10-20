import { useId, useState, type KeyboardEvent } from 'react'
import { Icon } from '@/components/icon'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { WIZARD_FIELD_CLASS, WizardField } from './WizardField'

type TagPickerProps = {
  label: string
  value: string[]
  onChange: (value: string[]) => void
  suggestions: string[]
  max: number
  required?: boolean
  error?: string
  placeholder?: string
}

/**
 * Escolha de várias etiquetas por busca: as escolhidas viram chips removíveis e
 * as sugestões restantes ficam como chips clicáveis. Enter adiciona o texto
 * digitado mesmo fora das sugestões.
 */
export function TagPicker({
  label,
  value,
  onChange,
  suggestions,
  max,
  required,
  error,
  placeholder = 'Pesquise...',
}: TagPickerProps) {
  const id = useId()
  const [query, setQuery] = useState('')
  const isFull = value.length >= max
  const term = query.trim().toLowerCase()
  const available = suggestions.filter(
    (tag) => !value.includes(tag) && (!term || tag.toLowerCase().includes(term)),
  )

  function add(tag: string) {
    const clean = tag.trim()
    if (!clean || isFull) return
    if (value.some((current) => current.toLowerCase() === clean.toLowerCase())) return
    onChange([...value, clean])
    setQuery('')
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      add(available.find((tag) => tag.toLowerCase() === term) ?? query)
    }
  }

  return (
    <WizardField label={label} htmlFor={id} required={required} error={error}>
      <Input
        id={id}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isFull}
        aria-invalid={Boolean(error)}
        className={cn(WIZARD_FIELD_CLASS, 'max-w-md')}
      />
      <p className="text-sm text-foreground-strong/70">
        {value.length} de {max} selecionados
      </p>

      {value.length > 0 ? (
        <ul aria-label={`${label} selecionados`} className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <li
              key={tag}
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cta-configure-from to-cta-configure-to px-3 py-1 text-sm font-bold text-foreground-strong"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((current) => current !== tag))}
                aria-label={`Remover ${tag}`}
                className="rounded-full hover:opacity-80"
              >
                <Icon name="close" className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {available.length > 0 ? (
        <ul aria-label={`Sugestões de ${label.toLowerCase()}`} className="flex flex-wrap gap-2">
          {available.slice(0, 14).map((tag) => (
            <li key={tag}>
              <button
                type="button"
                onClick={() => add(tag)}
                disabled={isFull}
                aria-label={`Adicionar ${tag}`}
                className="flex items-center gap-1 rounded-full bg-foreground/90 px-3 py-1 text-xs font-bold text-background hover:bg-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {tag}
                <Icon name="plus" className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </WizardField>
  )
}
