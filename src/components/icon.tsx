import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  Inbox,
  House,
  Brain,
  Loader2,
  LogOut,
  Menu,
  ChartColumnDecreasing,
  Plus,
  Search,
  Sparkles,
  Target,
  FileCheckCorner,
  Store,
  User,
  Info,
  Gamepad2,
  ClipboardCheck,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Bell,
  Globe,
  HelpCircle,
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
  dashboard: House,
  games: FileText,
  gamepad: Gamepad2,
  tests: FileCheckCorner,
  reports: Store,
  opportunities: Sparkles,
  user: User,
  logout: LogOut,
  menu: Menu,
  plus: Plus,
  search: Search,
  alert: AlertTriangle,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  loader: Loader2,
  empty: Inbox,
  clock: Clock,
  target: Target,
  plug: ChartColumnDecreasing,
  insights: Brain,
  score: CheckCircle2,
  checklist: ClipboardCheck,
  info: Info,
  more: MoreVertical,
  help: HelpCircle,
  language: Globe,
  notifications: Bell,
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
