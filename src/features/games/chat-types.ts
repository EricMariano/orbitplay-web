export type ChatChannel = {
  id: string
  gameId: string
  slug: string
  name: string
  topic: string | null
  archived: boolean
  createdAt: string
}

export type ChatMessage = {
  id: string
  channelId: string
  authorUserId: string
  authorDisplayName: string
  body: string
  status: 'visible' | 'hidden' | 'removed'
  createdAt: string
}

export type ChatPage<T> = {
  data: T[]
  nextCursor: string | null
}

export type ChatPresence = {
  channelId: string
  members: { userId: string; displayName: string }[]
}

export function chronologicalMessages(pages: ChatPage<ChatMessage>[]): ChatMessage[] {
  const seen = new Set<string>()
  return pages
    .flatMap((page) => page.data)
    .filter((message) => {
      if (seen.has(message.id)) return false
      seen.add(message.id)
      return message.status === 'visible'
    })
    .reverse()
}
