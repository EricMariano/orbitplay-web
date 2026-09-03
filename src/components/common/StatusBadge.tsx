import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type StatusTone = 'muted' | 'info' | 'warning' | 'success' | 'danger'

// Maps a tone to the semantic tokens from styles/globals.css (--success,
// --warning, --danger, --info) instead of one-off hex values, so status
// colors stay consistent with the rest of the app and follow the theme if
// those tokens ever change (OCP — add a tone here, nothing else moves).
const toneClassName: Record<StatusTone, string> = {
  muted: 'border-border bg-surface-raised text-muted',
  info: 'border-info/30 bg-info/10 text-info',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  success: 'border-success/30 bg-success/10 text-success',
  danger: 'border-danger/30 bg-danger/10 text-danger',
}

type StatusBadgeProps = {
  label: string
  tone: StatusTone
  className?: string
}

/**
 * Badge with a semantic tone rather than a domain-specific status enum, so
 * both `games` and `opportunities` (different status values entirely) can
 * depend on this one component instead of each rolling its own badge
 * styling (DIP — each feature's `*-status.ts` maps its own enum to a tone).
 */
export function StatusBadge({ label, tone, className }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(toneClassName[tone], className)}>
      {label}
    </Badge>
  )
}
