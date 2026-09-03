import type { ReactNode } from 'react'
import { getInitials } from '@/lib/initials'
import { getVisualAccent } from '@/lib/visual-accent'
import { cn } from '@/lib/utils'

type CoverBannerProps = {
  /** Id used to derive the deterministic fallback gradient/glow. */
  seed: string
  title: string
  imageUrl?: string | null
  /** Slot for a status badge or similar, pinned to the top-right corner. */
  topRight?: ReactNode
  className?: string
}

/**
 * Card banner shared by `GameCard` and `OpportunityCard`. Renders real cover
 * art when the API provides one; otherwise falls back to a deterministic
 * gradient + monogram (see lib/visual-accent.ts and lib/initials.ts) so
 * cards stay visually distinct without needing designer-picked colors per
 * item. Neither card needs to know which branch is taken (SRP) — this is
 * the one place that changes if cover art becomes mandatory later (OCP).
 */
export function CoverBanner({ seed, title, imageUrl, topRight, className }: CoverBannerProps) {
  const accent = getVisualAccent(seed)

  return (
    <div
      className={cn('relative flex h-32 items-center justify-center overflow-hidden', className)}
      style={imageUrl ? undefined : { background: accent.gradient }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="" className="size-full object-cover" />
      ) : (
        <>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${accent.glow}33, transparent 60%)`,
            }}
          />
          <span
            className="z-10 text-2xl font-medium"
            style={{ color: accent.glow, textShadow: `0 0 18px ${accent.glow}99` }}
          >
            {getInitials(title)}
          </span>
        </>
      )}
      {topRight ? <div className="absolute top-2.5 right-2.5">{topRight}</div> : null}
    </div>
  )
}
