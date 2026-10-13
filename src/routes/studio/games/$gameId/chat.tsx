import { useMemo, useRef, useState, type FormEvent } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { EyeOff, Pencil, Plus, Trash2 } from 'lucide-react'
import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useChatChannels,
  useChatMessages,
  useCreateChatChannel,
  useModerateChatMessage,
  useUpdateChatChannel,
} from '@/features/games/api/use-game-chat'
import { useGame } from '@/features/games/api/use-game'
import { chronologicalMessages, type ChatChannel } from '@/features/games/chat-types'
import { gameDetailsErrorMessage, isGameId } from '@/features/games/game-details-utils'

export const Route = createFileRoute('/studio/games/$gameId/chat')({
  component: StudioGameChat,
})

const timestamp = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

function StudioGameChat() {
  const { gameId } = Route.useParams()
  const game = useGame(gameId)
  const channels = useChatChannels(gameId)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [channelForm, setChannelForm] = useState<'create' | 'edit' | null>(null)
  const [name, setName] = useState('')
  const [topic, setTopic] = useState('')
  const [archived, setArchived] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const createKey = useRef<string | null>(null)
  const create = useCreateChatChannel(gameId)
  const update = useUpdateChatChannel(gameId)
  const channelList = channels.data?.pages.flatMap((page) => page.data) ?? []
  const selected = channelList.find((channel) => channel.id === selectedId) ?? channelList[0]

  if (!isGameId(gameId)) {
    return <ErrorState title="Jogo inválido" message="Abra a gestão pelo jogo desejado." />
  }

  function openCreate() {
    setName('')
    setTopic('')
    setArchived(false)
    setFormError(null)
    createKey.current = null
    setChannelForm('create')
  }

  function openEdit(channel: ChatChannel) {
    setName(channel.name)
    setTopic(channel.topic ?? '')
    setArchived(channel.archived)
    setFormError(null)
    setChannelForm('edit')
  }

  async function saveChannel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedTopic = topic.trim()
    if (!trimmedName || trimmedName.length > 60 || trimmedTopic.length > 500) {
      setFormError('Informe um nome de até 60 caracteres e um tópico de até 500 caracteres.')
      return
    }
    setFormError(null)
    try {
      if (channelForm === 'create') {
        createKey.current ??= crypto.randomUUID()
        const created = await create.mutateAsync({
          name: trimmedName,
          topic: trimmedTopic || undefined,
          idempotencyKey: createKey.current,
        })
        setSelectedId(created.id)
        toast.success('Canal criado.')
      } else if (channelForm === 'edit' && selected) {
        await update.mutateAsync({
          channelId: selected.id,
          name: trimmedName,
          topic: trimmedTopic || null,
          archived,
        })
        toast.success('Canal atualizado.')
      }
      setChannelForm(null)
    } catch (error) {
      setFormError(gameDetailsErrorMessage(error))
    }
  }

  return (
    <div>
      <PageHeader
        title={game.data ? `Chat de ${game.data.title}` : 'Chat do jogo'}
        breadcrumbs={[
          { label: 'Estúdio', href: '/studio' },
          { label: 'Jogos', href: '/studio/games' },
          { label: 'Chat' },
        ]}
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus size={16} /> Novo canal
          </Button>
        }
      />
      {game.isError && (
        <ErrorState
          className="mb-5"
          message={gameDetailsErrorMessage(game.error)}
          onRetry={() => void game.refetch()}
        />
      )}
      <div className="grid min-h-[570px] grid-cols-[260px_minmax(0,1fr)] overflow-hidden rounded-lg border border-border bg-surface">
        <aside className="border-r border-border p-4" aria-label="Canais do jogo">
          {channels.isPending ? (
            <Skeleton className="h-10 w-full" />
          ) : channels.isError ? (
            <ErrorState
              message={gameDetailsErrorMessage(channels.error)}
              onRetry={() => void channels.refetch()}
            />
          ) : channelList.length === 0 ? (
            <p className="text-sm text-muted">Nenhum canal criado.</p>
          ) : (
            <nav className="grid gap-1" aria-label="Canais">
              {channelList.map((channel) => (
                <button
                  key={channel.id}
                  type="button"
                  className={`rounded-md px-3 py-2 text-left text-sm ${selected?.id === channel.id ? 'bg-primary/20 text-primary' : 'text-muted hover:bg-white/5 hover:text-white'}`}
                  aria-current={selected?.id === channel.id ? 'true' : undefined}
                  onClick={() => setSelectedId(channel.id)}
                >
                  #{channel.name}
                  {channel.archived && <span className="ml-2 text-xs">(arquivado)</span>}
                </button>
              ))}
              {channels.hasNextPage && (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={channels.isFetchingNextPage}
                  onClick={() => void channels.fetchNextPage()}
                >
                  {channels.isFetchingNextPage ? 'Carregando...' : 'Mais canais'}
                </Button>
              )}
            </nav>
          )}
        </aside>
        {selected ? (
          <ManagedChannel key={selected.id} channel={selected} onEdit={() => openEdit(selected)} />
        ) : (
          <div className="grid place-items-center text-sm text-muted">
            Crie um canal para iniciar a comunidade.
          </div>
        )}
      </div>
      <Dialog
        open={channelForm !== null}
        onOpenChange={(open) => {
          if (!open) setChannelForm(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{channelForm === 'create' ? 'Novo canal' : 'Editar canal'}</DialogTitle>
            <DialogDescription>Nome e tópico exibidos para os jogadores.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(event) => void saveChannel(event)} className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium">
              Nome
              <input
                className="h-10 rounded-md border border-input bg-background px-3"
                value={name}
                maxLength={60}
                required
                onChange={(event) => {
                  setName(event.target.value)
                  createKey.current = null
                }}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Tópico
              <textarea
                className="min-h-20 rounded-md border border-input bg-background p-3"
                value={topic}
                maxLength={500}
                onChange={(event) => {
                  setTopic(event.target.value)
                  createKey.current = null
                }}
              />
            </label>
            {channelForm === 'edit' && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={archived}
                  onChange={(event) => setArchived(event.target.checked)}
                />
                Arquivar canal e bloquear novas mensagens
              </label>
            )}
            {formError && (
              <p className="text-sm text-danger" role="alert">
                {formError}
              </p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setChannelForm(null)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={create.isPending || update.isPending}>
                {create.isPending || update.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <p className="mt-4 text-sm text-muted">
        <Link to="/studio/games" className="text-primary hover:underline">
          Voltar aos jogos
        </Link>
      </p>
    </div>
  )
}

function ManagedChannel({ channel, onEdit }: { channel: ChatChannel; onEdit: () => void }) {
  const messages = useChatMessages(channel.id, false)
  const moderate = useModerateChatMessage(channel.id)
  const [pending, setPending] = useState<{ messageId: string; action: 'hide' | 'remove' } | null>(
    null,
  )
  const [actionError, setActionError] = useState<string | null>(null)
  const sorted = useMemo(() => chronologicalMessages(messages.data?.pages ?? []), [messages.data])

  async function confirmModeration() {
    if (!pending) return
    try {
      await moderate.mutateAsync(pending)
      toast.success(pending.action === 'hide' ? 'Mensagem ocultada.' : 'Mensagem removida.')
      setPending(null)
      setActionError(null)
    } catch (error) {
      setActionError(gameDetailsErrorMessage(error))
    }
  }

  return (
    <section className="min-w-0 p-5" aria-label={`Mensagens de ${channel.name}`}>
      <div className="mb-4 flex items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-semibold">#{channel.name}</h2>
          {channel.topic && <p className="text-sm text-muted">{channel.topic}</p>}
        </div>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil size={15} /> Editar canal
        </Button>
      </div>
      {messages.isPending ? (
        <Skeleton className="h-40 w-full" />
      ) : messages.isError ? (
        <ErrorState
          message={gameDetailsErrorMessage(messages.error)}
          onRetry={() => void messages.refetch()}
        />
      ) : sorted.length === 0 ? (
        <p className="text-sm text-muted">Nenhuma mensagem visível neste canal.</p>
      ) : (
        <>
          {messages.hasNextPage && (
            <Button
              variant="ghost"
              size="sm"
              disabled={messages.isFetchingNextPage}
              onClick={() => void messages.fetchNextPage()}
            >
              {messages.isFetchingNextPage ? 'Carregando...' : 'Mensagens anteriores'}
            </Button>
          )}
          <ol className="divide-y divide-border">
            {sorted.map((message) => (
              <li key={message.id} className="flex items-start justify-between gap-5 py-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <strong className="text-sm">{message.authorDisplayName}</strong>
                    <time className="text-xs text-muted" dateTime={message.createdAt}>
                      {timestamp.format(new Date(message.createdAt))}
                    </time>
                  </div>
                  <p className="mt-2 break-words text-sm text-white/80">{message.body}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="Ocultar mensagem"
                    aria-label="Ocultar mensagem"
                    onClick={() => setPending({ messageId: message.id, action: 'hide' })}
                  >
                    <EyeOff size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="Remover mensagem"
                    aria-label="Remover mensagem"
                    onClick={() => setPending({ messageId: message.id, action: 'remove' })}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </li>
            ))}
          </ol>
        </>
      )}
      <Dialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPending(null)
            setActionError(null)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pending?.action === 'hide' ? 'Ocultar mensagem?' : 'Remover mensagem?'}
            </DialogTitle>
            <DialogDescription>Esta ação será aplicada à mensagem selecionada.</DialogDescription>
          </DialogHeader>
          {actionError && (
            <p className="text-sm text-danger" role="alert">
              {actionError}
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPending(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={moderate.isPending}
              onClick={() => void confirmModeration()}
            >
              {moderate.isPending ? 'Aplicando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
