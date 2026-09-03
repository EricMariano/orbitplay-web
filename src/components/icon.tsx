import {
  AlertTriangle,
  Bug,
  Check,
  ChevronDown,
  Gamepad2,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Plus,
  Search,
  Sparkles,
  FlaskConical,
  FileBarChart,
  User,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Single icon wrapper for the whole app.
 *
 * Screens MUST use `<Icon name="..." />` and never import from an icon library
 * directly. The design handoff calls for MingCute SVGs; when that lands, only
 * this registry changes — screens stay untouched. See DESIGN.md.
 */
const registry = {
  dashboard: LayoutDashboard,
  games: Gamepad2,
  tests: FlaskConical,
  reports: FileBarChart,
  bug: Bug,
  opportunities: Sparkles,
  user: User,
  logout: LogOut,
  menu: Menu,
  plus: Plus,
  search: Search,
  alert: AlertTriangle,
  check: Check,
  'chevron-down': ChevronDown,
  loader: Loader2,
  empty: Inbox,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof registry

type IconProps = {
  name: IconName
  className?: string
  'aria-label'?: string
}

export function Icon({ name, className, ...rest }: IconProps) {
  const Glyph = registry[name]
  return (
    <Glyph
      className={cn('size-4 shrink-0', className)}
      aria-hidden={rest['aria-label'] ? undefined : true}
      {...rest}
    />
  )
}
