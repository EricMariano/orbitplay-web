import type { ReactNode } from 'react'
import type { Role } from '@/api-types'
import { useAuthStore } from '@/lib/auth'
import { cn } from '@/lib/utils'

type RoleGateProps = {
  allow: Role | Role[]
  /** 'hide' removes the content; 'disable' keeps it visible but inert. */
  mode?: 'hide' | 'disable'
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Gates an action by role. Unauthorized actions are hidden or disabled —
 * never rendered broken (handoff requirement).
 */
export function RoleGate({ allow, mode = 'hide', children, fallback = null }: RoleGateProps) {
  const role = useAuthStore((s) => s.role)
  const allowed = Array.isArray(allow) ? (role ? allow.includes(role) : false) : role === allow

  if (allowed) return <>{children}</>

  if (mode === 'disable') {
    // <fieldset disabled> natively disables descendant form controls (buttons,
    // inputs), so the action stays visible but cannot be triggered.
    return (
      <fieldset
        disabled
        aria-disabled
        className={cn('m-0 border-0 p-0 opacity-50', 'cursor-not-allowed')}
      >
        {children}
      </fieldset>
    )
  }

  return <>{fallback}</>
}
