import type { ReactNode } from 'react'
import { Icon, type IconName } from '@/components/icon'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  icon?: IconName
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

/** Empty state: icon, title, description and an optional call-to-action slot. */
export function EmptyState({
  icon = 'empty',
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-surface/40 px-6 py-12 text-center',
        className,
      )}
    >
      <Icon name={icon} className="size-8 text-muted" />
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        {description ? <p className="text-sm text-muted">{description}</p> : null}
      </div>
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  )
}
