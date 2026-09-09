import logoSrc from '@/assets/orbitplay-logo.svg'

export function Logo() {
  return (
    <div className="flex items-center gap-1">
      <img src={logoSrc} alt="OrbitPlay" className="h-15 w-25" />
    </div>
  )
}
