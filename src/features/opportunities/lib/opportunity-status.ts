import type { Opportunity } from '@/api-types'
import type { StatusTone } from '@/components/common/StatusBadge'

type StatusPresentation = {
  label: string
  tone: StatusTone
}

// Mirrors games/lib/game-status.ts — same rationale, different enum
// (an opportunity's status values don't overlap with a game's).
const presentation: Record<Opportunity['status'], StatusPresentation> = {
  open: { label: 'Aberta', tone: 'success' },
  in_progress: { label: 'Em andamento', tone: 'info' },
  closed: { label: 'Encerrada', tone: 'muted' },
}

export function getOpportunityStatusPresentation(
  status: Opportunity['status'],
): StatusPresentation {
  return presentation[status]
}
