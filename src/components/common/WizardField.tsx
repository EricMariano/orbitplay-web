import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Campo do wizard (Figma: 46px, raio 12, fundo claro a 20%). Serve a Input, SelectTrigger e botões de menu. */
export const WIZARD_FIELD_CLASS =
  'h-[46px] w-full rounded-xl border-field-border bg-field px-4 text-base text-foreground-strong shadow-none placeholder:text-foreground-strong/70 data-[size=default]:h-[46px] md:text-base dark:bg-field'

type WizardFieldProps = {
  label: string
  htmlFor?: string
  required?: boolean
  hint?: string
  error?: string
  className?: string
  children: ReactNode
}

/** Rótulo + controle + mensagem de erro de um campo de formulário do wizard. */
export function WizardField({
  label,
  htmlFor,
  required,
  hint,
  error,
  className,
  children,
}: WizardFieldProps) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-base font-bold text-foreground-strong">
        {label}
        {required ? <span className="text-highlight">*</span> : null}
      </label>
      {hint ? <p className="text-sm text-foreground-strong/80">{hint}</p> : null}
      {children}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
