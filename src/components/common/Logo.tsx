import logoSrc from '@/assets/orbitplay-logo.svg'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <img src={logoSrc} alt="OrbitPlay" className={cn('h-15 w-25', className)} />
    </div>
  )
}
