import {
  AlertTriangle,
  ArrowLeft,
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
  Eye,
  EyeOff,
  FileBarChart,
  FileCheckCorner,
  Gamepad2,
  Globe,
  Gift,
  GraduationCap,
  HelpCircle,
  House,
  Inbox,
  Info,
  LockKeyhole,
  Monitor,
  KeyRound,
  ListChecks,
  Loader2,
  LogOut,
  Mail,
  Menu,
  MoreVertical,
  Play,
  Plus,
  Search,
  Send,
  Star,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  User,
  Users,
  Wallet,
  Compass,
  Image as ImageIcon,
  ArrowDown,
  ArrowUp,
  Copy,
  Download,
  FileSpreadsheet,
  FileText,
  SlidersHorizontal,
  ImagePlus,
  Pencil,
  Trash2,
  FolderUp,
  Upload,
  X,
  Barcode,
  Camera,
  Bug,
  Coins,
  CreditCard,
  MapPin,
  MessageCircle,
  Mountain,
  Mic,
  QrCode,
  Rocket,
  RefreshCw,
  Save,
  Skull,
  Tag,
  UserCheck,
  PersonStanding,
  Laugh,
  PiggyBank,
  TvMinimalPlay,
  CircleDollarSign,
  Presentation,
  PanelsTopLeft,
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
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  loader: Loader2,
  key: KeyRound,
  mail: Mail,
  eye: Eye,
  'eye-off': EyeOff,
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
  lock: LockKeyhole,
  monitor: Monitor,
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
  star: Star,
  compass: Compass,
  gift: Gift,
  play: Play,
  send: Send,
  'ab-test': Users,
  'ab-test-images': ImageIcon,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  copy: Copy,
  trash: Trash2,
  'image-plus': ImagePlus,
  edit: Pencil,
  'folder-upload': FolderUp,
  upload: Upload,
  close: X,
  barcode: Barcode,
  camera: Camera,
  bug: Bug,
  coins: Coins,
  'credit-card': CreditCard,
  'map-pin': MapPin,
  'message-circle': MessageCircle,
  mountain: Mountain,
  microphone: Mic,
  'qr-code': QrCode,
  rocket: Rocket,
  refresh: RefreshCw,
  skull: Skull,
  tag: Tag,
  'user-check': UserCheck,
  download: Download,
  'file-pdf': FileText,
  'file-sheet': FileSpreadsheet,
  sliders: SlidersHorizontal,
  sparkles: Sparkles,
  save: Save,
  'person-standing': PersonStanding,
  laugh: Laugh,
  'piggy-bank': PiggyBank,
  'tv-play': TvMinimalPlay,
  'circle-dollar-sign': CircleDollarSign,
  presentation: Presentation,
  'panels-top-left': PanelsTopLeft,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof registry | 'windows'

type IconProps = {
  name: IconName
  className?: string
  'aria-label'?: string
  filled?: boolean
}

export function Icon({ name, className, filled = false, ...rest }: IconProps) {
  if (name === 'windows') {
    return (
      <svg
        viewBox="0 0 24 24"
        className={cn('size-4 shrink-0', className)}
        fill="currentColor"
        aria-hidden={rest['aria-label'] ? undefined : true}
        {...rest}
      >
        <path d="M2 4.7 10.5 3.5v8H2Zm10-1.4L22 2v9.5H12ZM2 13h8.5v8L2 19.8Zm10 0h10v9l-10-1.3Z" />
      </svg>
    )
  }
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
