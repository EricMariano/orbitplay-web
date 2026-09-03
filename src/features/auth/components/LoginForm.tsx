import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
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
import { useLogin } from '@/features/auth/api/use-login'
import { routeForRole } from '@/features/auth/lib/route-for-role'
import { loginSchema, type LoginValues } from '@/features/auth/schemas/login-schema'
import { ApiError } from '@/lib/api-client'

/**
 * Email/password form. Owns validation, submission and field-level API
 * errors. Previously this lived inline inside the `/login` route component
 * together with the dev-only shortcut and the schema — now the route only
 * wires this component up (SRP).
 */
export function LoginForm() {
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
  )
}
