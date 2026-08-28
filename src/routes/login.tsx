import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { Role, User } from '@/api-types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLogin } from '@/features/auth/api/use-login'
import { ApiError } from '@/lib/api-client'
import { useAuthStore } from '@/lib/auth'

export const Route = createFileRoute('/login')({
  component: LoginScreen,
})

const loginSchema = z.object({
  email: z.string().email('Informe um e-mail válido'),
  password: z.string().min(1, 'Informe sua senha'),
  remember: z.boolean(),
})

type LoginValues = z.infer<typeof loginSchema>

function routeForRole(role: Role) {
  return role === 'studio' ? '/studio' : '/player'
}

function LoginScreen() {
  const navigate = useNavigate()
  const login = useLogin()

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  })

  function onSubmit(values: LoginValues) {
    login.mutate(values, {
      onSuccess: ({ user }) => {
        // RN-03: the backend-decided role drives routing, not the selected tab.
        void navigate({ to: routeForRole(user.role) })
      },
      onError: (error) => {
        if (error instanceof ApiError && error.fieldErrors) {
          // Preserve what the user typed; surface per-field errors from the API.
          for (const [field, message] of Object.entries(error.fieldErrors)) {
            if (field === 'email' || field === 'password') {
              form.setError(field, { message })
            }
          }
        }
      },
    })
  }

  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-surface">
        <CardHeader>
          <CardTitle>Entrar no OrbitPlay</CardTitle>
          <CardDescription>Acesse sua conta para continuar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tabs are informational only — RN-03: they do not decide the role. */}
          <Tabs defaultValue="tester">
            <TabsList className="w-full">
              <TabsTrigger value="tester" className="flex-1">
                Sou um tester
              </TabsTrigger>
              <TabsTrigger value="studio" className="flex-1">
                Sou um estúdio
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="voce@exemplo.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="current-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    {/* TODO(remember-me): persistence comes from the API's httpOnly cookie. */}
                    <FormLabel className="font-normal text-muted">Lembrar login</FormLabel>
                  </FormItem>
                )}
              />
              {login.isError && !(login.error instanceof ApiError && login.error.fieldErrors) ? (
                <p className="text-sm text-destructive">
                  {login.error instanceof ApiError
                    ? login.error.message
                    : 'Não foi possível entrar. Tente novamente.'}
                </p>
              ) : null}
              <Button type="submit" className="w-full" disabled={login.isPending}>
                {login.isPending ? 'Entrando…' : 'Entrar'}
              </Button>
            </form>
          </Form>

          {import.meta.env.DEV ? <DevLogin /> : null}
        </CardContent>
      </Card>
    </main>
  )
}

/**
 * DEV-only shortcut to seed a session without the API (the API doesn't exist
 * yet in this setup phase). Mirrors "session filled manually in the store" from
 * the acceptance criteria and powers the E2E smoke test. Never rendered in prod.
 * See DECISIONS.md.
 */
function DevLogin() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)

  function devLogin(role: Role) {
    const user: User = {
      id: `dev-${role}`,
      name: role === 'studio' ? 'Estúdio Dev' : 'Jogador Dev',
      email: `${role}@dev.local`,
      role,
    }
    setSession({ user, accessToken: 'dev-token' })
    void navigate({ to: routeForRole(role) })
  }

  return (
    <div className="space-y-2">
      <Separator />
      <p className="text-xs text-muted">Atalhos de desenvolvimento (sem API)</p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => devLogin('studio')}
          data-testid="dev-login-studio"
        >
          Entrar como estúdio
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => devLogin('player')}
          data-testid="dev-login-player"
        >
          Entrar como jogador
        </Button>
      </div>
    </div>
  )
}
