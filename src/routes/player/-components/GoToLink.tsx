import { Link } from '@tanstack/react-router'
import { Icon } from '@/components/icon'

export function GoToLink({ label, to }: { label: string; to?: string }) {
  const content = (
    <>
      {label}
      <Icon name="arrow-right" className="size-3" />
    </>
  )
  const className = 'flex shrink-0 items-center gap-1 text-xs font-medium text-primary'
  return to ? (
    <Link to={to} className={className}>
      {content}
    </Link>
  ) : (
    <span className={className}>{content}</span>
  )
}
