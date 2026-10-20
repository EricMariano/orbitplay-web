import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSignup } from '@/features/auth/api/use-signup'
import { homeRouteForRole } from '@/lib/auth'

export const Route = createFileRoute('/signup')({ component: SignupPage })

function SignupPage() {
  const navigate = useNavigate()
  const signup = useSignup()
  const [accountType, setAccountType] = useState<'player' | 'studio'>('player')
  const [error, setError] = useState<string | null>(null)
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const common = {
      displayName: String(form.get('displayName')),
      email: String(form.get('email')),
      password: String(form.get('password')),
      birthdate: String(form.get('birthdate')),
      acceptedTerms: true,
    }
    const payload =
      accountType === 'studio'
        ? { ...common, organizationName: String(form.get('organizationName')) }
        : common
    signup.mutate({ accountType, payload } as Parameters<typeof signup.mutate>[0], {
      onSuccess: ({ user }) => void navigate({ to: homeRouteForRole(user.role) }),
      onError: (nextError) => setError(nextError.message || 'Não foi possível criar sua conta.'),
    })
  }
  return (
    <main className="flex min-h-dvh items-center justify-center bg-login-page p-6 font-login-body text-login-copy">
      <form
        onSubmit={submit}
        className="w-full max-w-md space-y-5 rounded-2xl bg-login-surface p-7 shadow-xl"
      >
        <header>
          <p className="text-sm text-login-muted">OrbitPlay</p>
          <h1 className="mt-1 font-login-display text-3xl">Criar uma conta</h1>
        </header>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={accountType === 'player' ? 'default' : 'outline'}
            onClick={() => setAccountType('player')}
          >
            Sou tester
          </Button>
          <Button
            type="button"
            variant={accountType === 'studio' ? 'default' : 'outline'}
            onClick={() => setAccountType('studio')}
          >
            Sou estúdio
          </Button>
        </div>
        <label className="grid gap-1 text-sm">
          Nome
          <Input name="displayName" required />
        </label>
        {accountType === 'studio' ? (
          <label className="grid gap-1 text-sm">
            Nome do estúdio
            <Input name="organizationName" required />
          </label>
        ) : null}
        <label className="grid gap-1 text-sm">
          E-mail
          <Input name="email" type="email" required />
        </label>
        <label className="grid gap-1 text-sm">
          Data de nascimento
          <Input name="birthdate" type="date" required />
        </label>
        <label className="grid gap-1 text-sm">
          Senha
          <Input name="password" type="password" minLength={8} required />
        </label>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={signup.isPending}>
          {signup.isPending ? 'Criando…' : 'Criar conta'}
        </Button>
        <p className="text-center text-sm text-login-muted">
          Já tem conta?{' '}
          <Link to="/login" className="text-login-accent">
            Entrar
          </Link>
        </p>
      </form>
    </main>
  )
}
