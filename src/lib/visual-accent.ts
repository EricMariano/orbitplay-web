export type VisualAccent = {
  gradient: string
  glow: string
}

/** Small string hash (FNV-ish), good enough to spread seeds across the hue
 *  wheel without pulling in a hashing dependency for a purely decorative
 *  feature. */
function hashSeed(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return hash
}

/**
 * Derives a stable gradient + glow color from an id. Cover art isn't part of
 * the API contract yet (`Game.coverUrl` and `Opportunity` are both nullable
 * or absent — see openapi.json), so cards need a placeholder banner. Hashing
 * the seed keeps the same item visually stable across renders/reloads
 * without any server state or design-time color picks, and keeps this
 * pure/testable instead of baking colors into JSX (SRP). Callers pass
 * whichever id makes sense for them (`CoverBanner` doesn't know about games
 * or opportunities — DIP).
 */
export function getVisualAccent(seed: string): VisualAccent {
  const hue = hashSeed(seed) % 360
  const hueEnd = (hue + 46) % 360

  return {
    gradient: `linear-gradient(135deg, hsl(${hue} 45% 18%) 0%, hsl(${hueEnd} 40% 10%) 100%)`,
    glow: `hsl(${hue} 85% 65%)`,
  }
}
