import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  CircleHelp,
  Clock,
  Gamepad2,
  Globe,
  GraduationCap,
  House,
  Inbox,
  Info,
  LayoutDashboard,
  ListChecks,
  Loader2,
  LogOut,
  Menu,
  Plus,
  Search,
  Sparkles,
  FlaskConical,
  FileBarChart,
  TrendingUp,
  Trophy,
  User,
  Users,
  Wallet,
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
  wallet: Wallet,
  trophy: Trophy,
  clock: Clock,
  users: Users,
  'list-checks': ListChecks,
  info: Info,
  'arrow-right': ArrowRight,
  'trending-up': TrendingUp,
  home: House,
  'graduation-cap': GraduationCap,
  help: CircleHelp,
  globe: Globe,
  bell: Bell,
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
