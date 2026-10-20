import { GoToLink } from './GoToLink'

type SectionHeaderProps = {
  title: string
  linkTo?: string
  linkLabel?: string
}

export function SectionHeader({ title, linkLabel, linkTo }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {linkLabel ? <GoToLink label={linkLabel} to={linkTo} /> : null}
    </div>
  )
}
