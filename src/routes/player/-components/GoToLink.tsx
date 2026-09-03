import { Icon } from '@/components/icon'

/**
 * Visual "go to X" affordance used across the player home sections. Renders as
 * plain text (not a router `Link`) because the destination screens don't
 * exist yet — see the other player-home cards for the same pattern.
 */
export function GoToLink({ label }: { label: string }) {
  return (
    <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
      {label}
      <Icon name="arrow-right" className="size-3" />
    </span>
  )
}
