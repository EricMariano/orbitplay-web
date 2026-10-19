import type { ReactNode } from 'react'
import { Icon } from '@/components/icon'
import { cn } from '@/lib/utils'

type ReportCardProps = {
  title: ReactNode
  /** Ícone antes do título. */
  icon?: ReactNode
  subtitle?: string
  /** Texto do ícone (i) no canto — some quando omitido. */
  info?: string
  /** Conteúdo extra à direita do título (ex.: marca do Orbit Plug-in). */
  headerExtra?: ReactNode
  /** Cartão do Orbit Plug-in: fundo e borda laranja. */
  variant?: 'default' | 'plugin'
  /** "Ir para …" no rodapé. */
  link?: { label: string; onClick: () => void }
  className?: string
  children: ReactNode
}

/** Cartão de vidro do relatório (Tela 11): título, (i) e link "Ir para …". */
export function ReportCard({
  title,
  icon,
  subtitle,
  info,
  headerExtra,
  variant = 'default',
  link,
  className,
  children,
}: ReportCardProps) {
  const isPlugin = variant === 'plugin'
  return (
    <section
      className={cn(
        'flex min-w-0 flex-col gap-4 rounded-3xl border p-6 leading-[normal] text-foreground-strong',
        isPlugin
          ? 'border-plugin-card-border bg-plugin-card-background'
          : 'border-report-card-border bg-stat-card-background',
        className,
      )}
    >
      <header className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {icon}
          <div className="min-w-0">
            <h2 className="text-[20px] font-medium">{title}</h2>
            {subtitle ? <p className="text-[12px]">{subtitle}</p> : null}
          </div>
        </div>
        {headerExtra}
        {info ? (
          <span title={info} className="flex shrink-0">
            <Icon name="info" className="size-6" aria-label={info} />
          </span>
        ) : null}
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-4">{children}</div>

      {link ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={link.onClick}
            className={cn(
              'flex items-center gap-1 text-[16px] font-bold hover:underline',
              isPlugin
                ? 'bg-linear-to-br from-plugin-accent-start to-plugin-accent-end bg-clip-text text-transparent'
                : 'text-primary',
            )}
          >
            {link.label}
            <Icon
              name="arrow-right"
              className={cn('size-5', isPlugin ? 'text-plugin-accent-start' : 'text-primary')}
            />
          </button>
        </div>
      ) : null}
    </section>
  )
}

type ReportFieldProps = {
  label: string
  /** `null` = métrica sem fonte ainda (ex.: depende da IA) → "—". */
  value: string | null
  /** Explica o "—" ao passar o mouse. */
  unavailableHint?: string
}

/** Rótulo + número grande ("Total de testes / 125"). */
export function ReportField({ label, value, unavailableHint }: ReportFieldProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="text-[16px]">{label}</span>
      <span
        className="text-[24px] font-bold whitespace-nowrap"
        title={value === null ? unavailableHint : undefined}
        aria-label={value === null ? `${label}: indisponível` : undefined}
      >
        {value ?? '—'}
      </span>
    </div>
  )
}

/** Linha de campos do topo dos cartões. */
export function ReportFields({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-x-6 gap-y-4">
      {children}
    </div>
  )
}

/** Divisor fino entre o resumo e o detalhe do cartão. */
export function ReportDivider() {
  return <hr className="border-report-card-border" />
}

/** Texto padrão para o "—" de métricas que dependem da IA (deferida). */
export const AI_PENDING_HINT = 'Disponível quando os insights de IA forem gerados.'
