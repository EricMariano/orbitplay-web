import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Brain,
  ChartColumnDecreasing,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock,
  FileBarChart,
  FileCheckCorner,
  Gamepad2,
  Globe,
  GraduationCap,
  HelpCircle,
  House,
  Inbox,
  Info,
  KeyRound,
  ListChecks,
  Loader2,
  LogOut,
  Mail,
  Menu,
  MoreVertical,
  Plus,
  Search,
  Sparkles,
  Target,
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
  dashboard: House,
  games: Gamepad2,
  gamepad: Gamepad2,
  tests: FileCheckCorner,
  reports: FileBarChart,
  opportunities: Sparkles,
  user: User,
  logout: LogOut,
  menu: Menu,
  plus: Plus,
  search: Search,
  alert: AlertTriangle,
  'arrow-right': ArrowRight,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  loader: Loader2,
  key: KeyRound,
  mail: Mail,
  empty: Inbox,
  wallet: Wallet,
  trophy: Trophy,
  clock: Clock,
  target: Target,
  plug: ChartColumnDecreasing,
  insights: Brain,
  score: CheckCircle2,
  checklist: ClipboardCheck,
  'list-checks': ListChecks,
  info: Info,
  more: MoreVertical,
  help: HelpCircle,
  language: Globe,
  globe: Globe,
  notifications: Bell,
  bell: Bell,
  users: Users,
  'trending-up': TrendingUp,
  home: House,
  'graduation-cap': GraduationCap,
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
