import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Notification, NotificationList } from '@/api-types'
import { api } from '@/lib/api-client'
import { notificationsKeys } from './notifications-keys'

/** Carrega a caixa de entrada inteira para o menu global, seguindo o cursor da API. */
export function useNotifications() {
  return useQuery({
    queryKey: notificationsKeys.inbox(),
    queryFn: async ({ signal }) => {
      const data: Notification[] = []
      const visited = new Set<string>()
      let cursor: string | null = null
      do {
        const params = new URLSearchParams({ limit: '50' })
        if (cursor) params.set('cursor', cursor)
        const page: NotificationList = await api.get(`/notifications?${params}`, { signal })
        data.push(...page.data)
        cursor = page.nextCursor
        if (cursor && visited.has(cursor)) throw new Error('Repeated notification cursor')
        if (cursor) visited.add(cursor)
      } while (cursor)
      return { data, unreadCount: data.filter((notification) => !notification.read).length }
    },
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.patch<void>(`/notifications/${encodeURIComponent(id)}/read`),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: notificationsKeys.inbox() }),
  })
}
