import { Icon } from '@/components/icon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  useMarkNotificationRead,
  useNotifications,
} from '@/features/notifications/api/use-notifications'
import { cn } from '@/lib/utils'

type NotificationsMenuProps = {
  className?: string
  iconClassName?: string
}

/** Caixa de entrada compacta presente nas áreas de jogador e estúdio. */
export function NotificationsMenu({ className, iconClassName }: NotificationsMenuProps) {
  const notifications = useNotifications()
  const markRead = useMarkNotificationRead()
  const unreadCount = notifications.data?.unreadCount ?? 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={unreadCount ? `Notificações: ${unreadCount} não lidas` : 'Notificações'}
          className={cn('relative text-primary hover:text-highlight', className)}
        >
          <Icon name="notifications" className={iconClassName} />
          {unreadCount ? (
            <span className="absolute -right-1.5 -top-1.5 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-4 text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          ) : null}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-92 max-w-[calc(100vw-2rem)]">
        <DropdownMenuLabel className="flex items-center justify-between">
          Notificações
          {unreadCount ? (
            <span className="text-xs font-normal text-muted">{unreadCount} novas</span>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.isPending ? (
          <p className="px-2 py-3 text-sm text-muted">Carregando…</p>
        ) : null}
        {notifications.isError ? (
          <p className="px-2 py-3 text-sm text-destructive">
            Não foi possível carregar as notificações.
          </p>
        ) : null}
        {notifications.data && notifications.data.data.length === 0 ? (
          <p className="px-2 py-3 text-sm text-muted">Você está em dia.</p>
        ) : null}
        {notifications.data?.data.slice(0, 8).map((notification) => {
          const content = (
            <>
              <span className="block text-sm font-medium text-foreground">
                {notification.title}
              </span>
              {notification.body ? (
                <span className="mt-0.5 block line-clamp-2 text-xs text-muted">
                  {notification.body}
                </span>
              ) : null}
              <span className="mt-1 block text-[11px] text-muted">
                {new Intl.DateTimeFormat('pt-BR', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                }).format(new Date(notification.createdAt))}
              </span>
            </>
          )
          return (
            <DropdownMenuItem
              key={notification.id}
              asChild={Boolean(notification.link)}
              className={cn('items-start whitespace-normal', !notification.read && 'bg-primary/5')}
              onSelect={() => {
                if (!notification.read) markRead.mutate(notification.id)
              }}
            >
              {notification.link ? (
                <a href={notification.link}>{content}</a>
              ) : (
                <button type="button">{content}</button>
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
