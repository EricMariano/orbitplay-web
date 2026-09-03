import type { Game } from '@/api-types'
import type { StatusTone } from '@/components/common/StatusBadge'

type StatusPresentation = {
  label: string
  tone: StatusTone
}

// One place to update when the backend adds/renames a status, so every
// place that shows a game's status (this card grid today, the games table
// or a filter dropdown tomorrow) stays in sync automatically (OCP).
const presentation: Record<Game['status'], StatusPresentation> = {
  draft: { label: 'Rascunho', tone: 'muted' },
  in_review: { label: 'Em revisão', tone: 'warning' },
  published: { label: 'Publicado', tone: 'success' },
}

export function getGameStatusPresentation(status: Game['status']): StatusPresentation {
  return presentation[status]
}
