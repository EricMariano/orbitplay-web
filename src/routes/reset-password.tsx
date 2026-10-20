import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useResetPassword } from '@/features/auth/api/use-reset-password'

export const Route = createFileRoute('/reset-password')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : '',
  }),
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const { token } = Route.useSearch()
  const navigate = useNavigate()
  const reset = useResetPassword()
  const [message, setMessage] = useState<string | null>(null)
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const password = String(new FormData(event.currentTarget).get('password'))
    reset.mutate(
      { token, password },
      {
        onSuccess: ({ message: nextMessage }) => {
          setMessage(nextMessage)
          window.setTimeout(() => void navigate({ to: '/login' }), 1200)
        },
      },
    )
  }
  return (
    <main className="flex min-h-dvh items-center justify-center bg-login-page p-6 font-login-body text-login-copy">
      <form
        onSubmit={submit}
        className="w-full max-w-md space-y-5 rounded-2xl bg-login-surface p-7 shadow-xl"
      >
        <header>
          <p className="text-sm text-login-muted">OrbitPlay</p>
          <h1 className="mt-1 font-login-display text-3xl">Redefinir senha</h1>
        </header>
        {token ? (
          <>
            <label className="grid gap-1 text-sm">
              Nova senha
              <Input name="password" type="password" minLength={8} required />
            </label>
            {reset.isError ? (
              <p className="text-sm text-destructive">
                {reset.error.message || 'Não foi possível redefinir a senha.'}
              </p>
            ) : null}
            {message ? <p className="text-sm text-success">{message}</p> : null}
            <Button type="submit" className="w-full" disabled={reset.isPending}>
              {reset.isPending ? 'Salvando…' : 'Salvar nova senha'}
            </Button>
          </>
        ) : (
          <p className="text-sm text-destructive">
            O link de recuperação não contém um token válido.
          </p>
        )}
        <Link to="/login" className="block text-center text-sm text-login-accent">
          Voltar para entrar
        </Link>
      </form>
    </main>
  )
}
