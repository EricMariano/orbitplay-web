import { useId } from 'react'
import { Icon } from '@/components/icon'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { WIZARD_FIELD_CLASS, WizardField } from './WizardField'

type MultiSelectProps<T extends string> = {
  label: string
  options: { value: T; label: string }[]
  value: T[]
  onChange: (value: T[]) => void
  placeholder?: string
  error?: string
}

/** Seleção múltipla em menu com caixas de marcação; mantém a ordem das opções. */
export function MultiSelect<T extends string>({
  label,
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  error,
}: MultiSelectProps<T>) {
  const id = useId()
  const selected = options.filter((option) => value.includes(option.value))

  function toggle(option: T, checked: boolean) {
    const next = checked ? [...value, option] : value.filter((current) => current !== option)
    onChange(options.map((o) => o.value).filter((v) => next.includes(v)))
  }

  return (
    <WizardField label={label} htmlFor={id} error={error}>
      <DropdownMenu>
        <DropdownMenuTrigger
          id={id}
          aria-label={label}
          className={cn(
            WIZARD_FIELD_CLASS,
            'flex items-center justify-between gap-2 border text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
            selected.length === 0 && 'text-foreground-strong/70',
          )}
        >
          <span className="truncate">
            {selected.length === 0 ? placeholder : selected.map((o) => o.label).join(', ')}
          </span>
          <Icon name="chevron-down" className="size-4 opacity-70" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-h-72 min-w-56 overflow-y-auto">
          {options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={value.includes(option.value)}
              onCheckedChange={(checked) => toggle(option.value, checked === true)}
              onSelect={(event) => event.preventDefault()}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </WizardField>
  )
}
