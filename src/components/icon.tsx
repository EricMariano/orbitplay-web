import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Gamepad2,
  Inbox,
  LayoutDashboard,
  Lightbulb,
  Loader2,
  LogOut,
  Menu,
  Plug,
  Plus,
  Search,
  Sparkles,
  Target,
  FlaskConical,
  FileBarChart,
  User,
  ClipboardCheck,
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
  clock: Clock,
  target: Target,
  plug: Plug,
  insights: Lightbulb,
  score: CheckCircle2,
  checklist: ClipboardCheck,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof registry

type IconProps = {
  name: IconName
  className?: string
  'aria-label'?: string
  filled?: boolean
}

export function Icon({ name, className, filled = false, ...rest }: IconProps) {
  const Glyph = registry[name]
  return (
    <Glyph
      className={cn('size-4 shrink-0', className)}
      fill={filled ? 'currentColor' : 'none'}
      aria-hidden={rest['aria-label'] ? undefined : true}
      {...rest}
    />
  )
}
