/** Chaves de query da feature de autenticação. */
export const authKeys = {
  all: ['auth'] as const,
  invitePreview: (token: string) => [...authKeys.all, 'invite-preview', token] as const,
}
