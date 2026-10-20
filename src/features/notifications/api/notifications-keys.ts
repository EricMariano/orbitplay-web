/** Chaves compartilhadas da caixa de entrada autenticada. */
export const notificationsKeys = {
  all: ['notifications'] as const,
  inbox: () => [...notificationsKeys.all, 'inbox'] as const,
}
