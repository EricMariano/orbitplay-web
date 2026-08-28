import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type Breadcrumb = { label: string; href?: string }

type PageHeaderProps = {
  title: string
  breadcrumbs?: Breadcrumb[]
  actions?: ReactNode
  className?: string
}

/** Page header: title, optional breadcrumb trail and right-aligned actions. */
export function PageHeader({ title, breadcrumbs, actions, className }: PageHeaderProps) {
  return (
    <header className={cn('mb-6 flex flex-col gap-2', className)}>
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <nav aria-label="breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-muted">
            {breadcrumbs.map((crumb, i) => (
              <li key={`${crumb.label}-${i}`} className="flex items-center gap-1">
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-foreground">
                    {crumb.label}
                  </a>
                ) : (
                  <span>{crumb.label}</span>
                )}
                {i < breadcrumbs.length - 1 ? <span aria-hidden>/</span> : null}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  )
}
