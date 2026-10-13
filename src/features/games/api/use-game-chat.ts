import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { gamesKeys } from './games-keys'
import type { ChatChannel, ChatMessage, ChatPage } from '../chat-types'

function pageQuery(cursor: string | null) {
  const params = new URLSearchParams({ limit: '50' })
  if (cursor) params.set('cursor', cursor)
  return params.toString()
}

export function useChatChannels(gameId: string) {
  return useInfiniteQuery({
    queryKey: gamesKeys.chatChannels(gameId),
    queryFn: ({ pageParam, signal }) =>
      api.get<ChatPage<ChatChannel>>(
        `/games/${encodeURIComponent(gameId)}/chat/channels?${pageQuery(pageParam)}`,
        { signal },
      ),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })
}

export function useChatMessages(channelId: string | null, live: boolean) {
  return useInfiniteQuery({
    queryKey: gamesKeys.chatMessages(channelId ?? ''),
    queryFn: ({ pageParam, signal }) =>
      api.get<ChatPage<ChatMessage>>(
        `/chat/channels/${encodeURIComponent(channelId!)}/messages?${pageQuery(pageParam)}`,
        { signal },
      ),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: Boolean(channelId),
    refetchInterval: live ? false : 5000,
  })
}

export function useSendChatMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      channelId,
      body,
      idempotencyKey,
    }: {
      channelId: string
      body: string
      idempotencyKey: string
    }) =>
      api.post<ChatMessage>(
        `/chat/channels/${encodeURIComponent(channelId)}/messages`,
        { body },
        { headers: { 'Idempotency-Key': idempotencyKey } },
      ),
    onSuccess: (_message, { channelId }) =>
      queryClient.invalidateQueries({ queryKey: gamesKeys.chatMessages(channelId) }),
  })
}

export function useCreateChatChannel(gameId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      name,
      topic,
      idempotencyKey,
    }: {
      name: string
      topic?: string
      idempotencyKey: string
    }) =>
      api.post<ChatChannel>(
        `/games/${encodeURIComponent(gameId)}/chat/channels`,
        { name, ...(topic ? { topic } : {}) },
        { headers: { 'Idempotency-Key': idempotencyKey } },
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: gamesKeys.chatChannels(gameId) }),
  })
}

export function useUpdateChatChannel(gameId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      channelId,
      name,
      topic,
      archived,
    }: {
      channelId: string
      name: string
      topic: string | null
      archived: boolean
    }) =>
      api.patch<ChatChannel>(`/chat/channels/${encodeURIComponent(channelId)}`, {
        name,
        topic,
        archived,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: gamesKeys.chatChannels(gameId) }),
  })
}

export function useModerateChatMessage(channelId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ messageId, action }: { messageId: string; action: 'hide' | 'remove' }) =>
      api.patch<ChatMessage>(`/chat/messages/${encodeURIComponent(messageId)}/moderate`, {
        action,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: gamesKeys.chatMessages(channelId) }),
  })
}
