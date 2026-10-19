import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { TagTone } from './TagTones'

const toneClassName: Record<TagTone, string> = {
  yellow: 'bg-tag-yellow-background text-tag-yellow-foreground',
  green: 'bg-tag-green-background text-tag-green-foreground',
  orange: 'bg-tag-orange-background text-tag-orange-foreground',
  blue: 'bg-tag-blue-background text-tag-blue-foreground',
  red: 'bg-tag-red-background text-tag-red-foreground',
  teal: 'bg-tag-teal-background text-tag-teal-foreground',
  violet: 'bg-tag-violet-background text-tag-violet-foreground',
}

type TagProps = {
  tone: TagTone
  children: ReactNode
  className?: string
}

/** "Badge-Tag" do design: canto diagonal, fundo escuro e texto vivo da mesma cor. */
export function Tag({ tone, children, className }: TagProps) {
  return (
    <Badge
      className={cn(
        'px-2 py-1 font-label text-[10px] leading-[1.7] font-bold',
        toneClassName[tone],
        className,
      )}
    >
      {children}
    </Badge>
  )
}
