import { useEffect, useLayoutEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Hash, Send } from 'lucide-react'
import { io } from 'socket.io-client'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/lib/auth'
import { ApiError } from '@/lib/api-client'
import { gamesKeys } from '@/features/games/api/games-keys'
import {
  useChatChannels,
  useChatMessages,
  useSendChatMessage,
} from '@/features/games/api/use-game-chat'
import {
  chronologicalMessages,
  type ChatChannel,
  type ChatPresence,
} from '@/features/games/chat-types'
import { gameDetailsErrorMessage } from '@/features/games/game-details-utils'
import './game-chat.css'

const messageDate = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

function formattedDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : messageDate.format(date)
}

function sendErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 403) return 'Você não pode enviar mensagens neste canal.'
    if (error.status === 404) return 'Este canal não está mais disponível.'
    if (error.status === 409) return 'Este canal não aceita novas mensagens.'
    if (error.status === 422) return 'Revise a mensagem antes de enviar.'
    if (error.status === 429) return 'Muitas mensagens seguidas. Aguarde um pouco.'
  }
  return 'Não foi possível enviar. Sua mensagem foi mantida para tentar novamente.'
}

export function GameChat({ gameId }: { gameId: string }) {
  const channels = useChatChannels(gameId)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const channelList = channels.data?.pages.flatMap((page) => page.data) ?? []
  const selected =
    channelList.find((channel) => channel.id === selectedId) ??
    channelList.find((channel) => !channel.archived) ??
    channelList[0]

  function setDraft(channelId: string, value: string) {
    setDrafts((current) => ({ ...current, [channelId]: value }))
  }

  return (
    <section className="game-chat" aria-label="Chat da comunidade">
      <aside className="game-chat-sidebar" aria-label="Canais do jogo">
        {channels.isPending ? (
          <div className="game-chat-sidebar-loading">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-4/5" />
          </div>
        ) : channels.isError ? (
          <div className="game-chat-sidebar-state" role="alert">
            <p>{gameDetailsErrorMessage(channels.error)}</p>
            <button type="button" onClick={() => void channels.refetch()}>
              Tentar novamente
            </button>
          </div>
        ) : channelList.length === 0 ? (
          <p className="game-chat-sidebar-state">Nenhum canal disponível para este jogo.</p>
        ) : (
          <nav aria-label="Canais">
            {channelList.map((channel) => (
              <button
                key={channel.id}
                type="button"
                className="game-chat-channel"
                aria-current={channel.id === selected?.id ? 'true' : undefined}
                onClick={() => setSelectedId(channel.id)}
              >
                <Hash size={18} aria-hidden="true" />
                <span>{channel.name}</span>
                {channel.archived && <small>Arquivado</small>}
              </button>
            ))}
            {channels.hasNextPage && (
              <button
                type="button"
                className="game-chat-more-channels"
                disabled={channels.isFetchingNextPage}
                onClick={() => void channels.fetchNextPage()}
              >
                {channels.isFetchingNextPage ? 'Carregando...' : 'Mais canais'}
              </button>
            )}
          </nav>
        )}
      </aside>
      {selected ? (
        <ChatRoom
          key={selected.id}
          channel={selected}
          draft={drafts[selected.id] ?? ''}
          onDraftChange={(value) => setDraft(selected.id, value)}
        />
      ) : (
        <div className="game-chat-no-channel">Selecione um canal para acompanhar a conversa.</div>
      )}
    </section>
  )
}

function ChatRoom({
  channel,
  draft,
  onDraftChange,
}: {
  channel: ChatChannel
  draft: string
  onDraftChange: (value: string) => void
}) {
  const queryClient = useQueryClient()
  const token = useAuthStore((state) => state.accessToken)
  const userId = useAuthStore((state) => state.user?.userId)
  const [live, setLive] = useState(false)
  const [presence, setPresence] = useState<ChatPresence | null>(null)
  const [sendError, setSendError] = useState<string | null>(null)
  const messages = useChatMessages(channel.id, live)
  const send = useSendChatMessage()
  const sorted = useMemo(() => chronologicalMessages(messages.data?.pages ?? []), [messages.data])
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollSnapshot = useRef<{ height: number; top: number } | null>(null)
  const stickToBottom = useRef(true)
  const pendingKey = useRef<string | null>(null)
  const sending = useRef(false)

  useEffect(() => {
    if (!token) return
    const apiBase = new URL(import.meta.env.VITE_API_URL ?? '/api', window.location.origin)
    const socket = io(`${apiBase.origin}/chat`, {
      path: `${apiBase.pathname.replace(/\/$/, '')}/socket.io`,
      transports: ['websocket'],
      auth: { token },
    })
    socket.on('connect', () => {
      socket.emit(
        'channel:join',
        { channelId: channel.id },
        (ack: { ok: boolean; data?: ChatPresence }) => {
          setLive(ack.ok)
          if (ack.ok && ack.data) setPresence(ack.data)
        },
      )
    })
    socket.on('disconnect', () => {
      setLive(false)
      setPresence(null)
    })
    socket.on('connect_error', () => setLive(false))
    socket.on('channel:presence', (next: ChatPresence) => {
      if (next.channelId === channel.id) setPresence(next)
    })
    socket.on('message:new', (message: { channelId: string }) => {
      if (message.channelId === channel.id) {
        void queryClient.invalidateQueries({ queryKey: gamesKeys.chatMessages(channel.id) })
      }
    })
    socket.on('message:moderated', (message: { channelId: string }) => {
      if (message.channelId === channel.id) {
        void queryClient.invalidateQueries({ queryKey: gamesKeys.chatMessages(channel.id) })
      }
    })
    socket.on('channel:updated', () => {
      void queryClient.invalidateQueries({ queryKey: gamesKeys.chatChannels(channel.gameId) })
    })
    return () => {
      socket.disconnect()
    }
  }, [channel.id, channel.gameId, queryClient, token])

  useLayoutEffect(() => {
    const element = scrollRef.current
    if (!element) return
    if (scrollSnapshot.current) {
      element.scrollTop =
        scrollSnapshot.current.top + element.scrollHeight - scrollSnapshot.current.height
      scrollSnapshot.current = null
    } else if (stickToBottom.current) {
      element.scrollTop = element.scrollHeight
    }
  }, [sorted.length, messages.isPending])

  async function loadOlder() {
    const element = scrollRef.current
    if (element) scrollSnapshot.current = { height: element.scrollHeight, top: element.scrollTop }
    await messages.fetchNextPage()
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const body = draft.trim()
    if (!body || body.length > 2000 || channel.archived || sending.current) return
    sending.current = true
    setSendError(null)
    pendingKey.current ??= crypto.randomUUID()
    try {
      await send.mutateAsync({ channelId: channel.id, body, idempotencyKey: pendingKey.current })
      onDraftChange('')
      pendingKey.current = null
      stickToBottom.current = true
    } catch (error) {
      setSendError(sendErrorMessage(error))
    } finally {
      sending.current = false
    }
  }

  return (
    <div className="game-chat-room">
      <header className="game-chat-room-header">
        <div>
          <h2>
            <Hash size={24} aria-hidden="true" />
            {channel.name}
          </h2>
          {channel.topic && <p>{channel.topic}</p>}
        </div>
        {channel.archived && <span>Somente leitura</span>}
      </header>
      <div
        ref={scrollRef}
        className="game-chat-history"
        role="log"
        aria-label={`Mensagens de ${channel.name}`}
        aria-live="polite"
        onScroll={(event) => {
          const element = event.currentTarget
          stickToBottom.current =
            element.scrollHeight - element.scrollTop - element.clientHeight < 80
        }}
      >
        {messages.isPending ? (
          <div className="game-chat-loading">
            <Skeleton className="h-16 w-3/5" />
            <Skeleton className="ml-auto h-16 w-2/5" />
          </div>
        ) : messages.isError ? (
          <div className="game-chat-history-state" role="alert">
            <p>{gameDetailsErrorMessage(messages.error)}</p>
            <button type="button" onClick={() => void messages.refetch()}>
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            {messages.hasNextPage && (
              <button
                type="button"
                className="game-chat-load-older"
                disabled={messages.isFetchingNextPage}
                onClick={() => void loadOlder()}
              >
                {messages.isFetchingNextPage ? 'Carregando...' : 'Carregar mensagens anteriores'}
              </button>
            )}
            {sorted.length === 0 ? (
              <p className="game-chat-history-state">Ainda não há mensagens neste canal.</p>
            ) : (
              <ol className="game-chat-message-list">
                {sorted.map((message) => {
                  const mine = message.authorUserId === userId
                  const online = presence?.members.some(
                    (member) => member.userId === message.authorUserId,
                  )
                  return (
                    <li key={message.id} className={`game-chat-message ${mine ? 'is-own' : ''}`}>
                      {!mine && (
                        <span className="game-chat-avatar" aria-hidden="true">
                          {message.authorDisplayName.trim().charAt(0).toUpperCase()}
                          {online && <i className="game-chat-online" />}
                        </span>
                      )}
                      <div className="game-chat-bubble">
                        <strong>{message.authorDisplayName}</strong>
                        <p>{message.body}</p>
                        <time dateTime={message.createdAt}>{formattedDate(message.createdAt)}</time>
                      </div>
                      {mine && (
                        <span className="game-chat-avatar" aria-hidden="true">
                          {message.authorDisplayName.trim().charAt(0).toUpperCase()}
                          {online && <i className="game-chat-online" />}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ol>
            )}
          </>
        )}
      </div>
      <form className="game-chat-composer" onSubmit={(event) => void submit(event)}>
        <label className="sr-only" htmlFor={`chat-draft-${channel.id}`}>
          Mensagem para {channel.name}
        </label>
        <input
          id={`chat-draft-${channel.id}`}
          type="text"
          maxLength={2000}
          value={draft}
          onChange={(event) => {
            onDraftChange(event.target.value)
            pendingKey.current = null
            setSendError(null)
          }}
          placeholder={channel.archived ? 'Canal arquivado' : 'Digite uma mensagem...'}
          disabled={channel.archived || send.isPending}
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          aria-label="Enviar mensagem"
          title="Enviar mensagem"
          disabled={!draft.trim() || send.isPending || channel.archived}
        >
          <Send size={19} />
        </Button>
        {sendError && (
          <p className="game-chat-send-error" role="alert">
            {sendError}
          </p>
        )}
      </form>
    </div>
  )
}
