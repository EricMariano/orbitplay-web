import { Link, createFileRoute } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { AcceptInviteRequest, InvitePreview } from '@/api-types'
import { useAcceptInvite, useInvitePreview } from '@/features/auth/api/use-accept-invite'
import { roleLabels } from '@/features/auth/role-labels'
import { ApiError } from '@/lib/api-client'

export const Route = createFileRoute('/accept-invite')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : '',
  }),
  component: AcceptInvitePage,
})

function AcceptInvitePage() {
  const { token } = Route.useSearch()
  const preview = useInvitePreview(token)
  return (
    <main className="flex min-h-dvh items-center justify-center bg-login-page p-6 font-login-body text-login-copy">
      <section className="w-full max-w-md space-y-5 rounded-2xl bg-login-surface p-7 shadow-xl">
        <header>
          <p className="text-sm text-login-muted">OrbitPlay</p>
          <h1 className="mt-1 font-login-display text-3xl">Aceitar convite</h1>
        </header>
        {token ? (
          <QueryBoundary query={preview}>
            {(invite) => <AcceptInviteForm token={token} invite={invite} />}
          </QueryBoundary>
        ) : (
          <p className="text-sm text-destructive">O link do convite não contém um token válido.</p>
        )}
        <Link to="/login" className="block text-center text-sm text-login-accent">
          Voltar para entrar
        </Link>
      </section>
    </main>
  )
}

function AcceptInviteForm({ token, invite }: { token: string; invite: InvitePreview }) {
  const accept = useAcceptInvite()
  const [done, setDone] = useState<string | null>(null)
  const fieldErrors = accept.error instanceof ApiError ? (accept.error.fieldErrors ?? {}) : {}
  const generalError =
    accept.error && !Object.keys(fieldErrors).length
      ? accept.error.message || 'Não foi possível aceitar o convite.'
      : (fieldErrors.token ?? null)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const field = (name: string) => String(form.get(name) ?? '')
    const payload: AcceptInviteRequest = { token }
    // Conta existente prova que é a convidada com a senha atual; só a conta
    // criada pelo convite escolhe a senha aqui.
    if (invite.accountExists) payload.currentPassword = field('currentPassword')
    else payload.password = field('password')
    if (invite.birthdateRequired) payload.birthdate = field('birthdate')
    accept.mutate(payload, { onSuccess: ({ message }) => setDone(message) })
  }

  if (done) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-success">{done}</p>
        <Button asChild className="w-full">
          <Link to="/login">Entrar</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <p className="text-sm">
        Você foi convidado para <strong>{invite.organizationName}</strong> como{' '}
        <strong>{roleLabels[invite.role]}</strong>, com o e-mail <strong>{invite.email}</strong>.
      </p>
      {invite.accountExists ? (
        <label className="grid gap-1 text-sm">
          Senha atual da sua conta
          <Input name="currentPassword" type="password" autoComplete="current-password" required />
          <FieldError message={fieldErrors.currentPassword} />
        </label>
      ) : (
        <label className="grid gap-1 text-sm">
          Crie sua senha
          <Input
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <FieldError message={fieldErrors.password} />
        </label>
      )}
      {invite.birthdateRequired ? (
        <label className="grid gap-1 text-sm">
          Data de nascimento
          <Input name="birthdate" type="date" required />
          <FieldError message={fieldErrors.birthdate} />
        </label>
      ) : null}
      {generalError ? <p className="text-sm text-destructive">{generalError}</p> : null}
      <Button type="submit" className="w-full" disabled={accept.isPending}>
        {accept.isPending ? 'Aceitando…' : 'Aceitar convite'}
      </Button>
    </form>
  )
}

function FieldError({ message }: { message?: string }) {
  return message ? <span className="text-xs text-destructive">{message}</span> : null
}
