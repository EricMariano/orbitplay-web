import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import glow from '@/assets/login/glow.png'
import logo from '@/assets/login/orbitplay-logo.png'
import shade from '@/assets/login/shade.png'
import studioVisual from '@/assets/login/studio-visual.png'
import testerVisual from '@/assets/login/tester-visual.png'
import { Icon } from '@/components/icon'
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useForgotPassword } from '@/features/auth/api/use-forgot-password'
import { useLogin } from '@/features/auth/api/use-login'
import { ApiError } from '@/lib/api-client'
import { homeRouteForRole, useAuthStore } from '@/lib/auth'

type AccountType = 'tester' | 'studio'

const accountVisuals: Record<AccountType, string> = {
  tester: testerVisual,
  studio: studioVisual,
}

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Informe seu e-mail').email('Informe um e-mail válido'),
  password: z.string().min(8, 'Use pelo menos 8 caracteres'),
  remember: z.boolean(),
})

type LoginValues = z.infer<typeof loginSchema>

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    const { status, role } = useAuthStore.getState()
    if (status === 'authenticated' && role) {
      throw redirect({ to: homeRouteForRole(role) })
    }
  },
  component: LoginScreen,
})

function isAccountType(value: string): value is AccountType {
  return value === 'tester' || value === 'studio'
}

function hasMappedFieldError(error: unknown) {
  if (!(error instanceof ApiError) || !error.fieldErrors) return false
  return Object.keys(error.fieldErrors).some((field) =>
    ['email', 'identifier', 'password'].includes(field),
  )
}

function loginErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 401) return 'E-mail ou senha inválidos.'
    if (error.status === 429) return 'Muitas tentativas. Aguarde um pouco e tente novamente.'
    if (error.status === 422) return 'Revise os dados informados e tente novamente.'
    if (error.status >= 500) return 'O OrbitPlay está indisponível no momento. Tente novamente.'
  }
  return 'Não foi possível conectar ao OrbitPlay. Verifique a conexão e tente novamente.'
}

function LoginScreen() {
  const navigate = useNavigate()
  const login = useLogin()
  const forgotPassword = useForgotPassword()
  const [accountType, setAccountType] = useState<AccountType>('tester')

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: true },
  })

  function onSubmit(values: LoginValues) {
    login.mutate(
      {
        identifier: values.email,
        password: values.password,
        rememberMe: values.remember,
      },
      {
        onSuccess: ({ user }) => {
          void navigate({ to: homeRouteForRole(user.role) })
        },
        onError: (error) => {
          if (!(error instanceof ApiError) || !error.fieldErrors) return

          for (const [field, message] of Object.entries(error.fieldErrors)) {
            if (field === 'email' || field === 'identifier') {
              form.setError('email', { message })
            }
            if (field === 'password') {
              form.setError('password', { message })
            }
          }
        },
      },
    )
  }

  async function requestPasswordReset() {
    const emailIsValid = await form.trigger('email', { shouldFocus: true })
    if (!emailIsValid) return

    forgotPassword.mutate(
      { email: form.getValues('email') },
      {
        onSuccess: ({ message }) => toast.success(message),
        onError: (error) => toast.error(loginErrorMessage(error)),
      },
    )
  }

  return (
    <main className="flex min-h-dvh min-w-[1024px] items-center justify-center overflow-auto bg-login-page p-8 font-login-body text-login-copy">
      <article
        className="relative h-[619px] w-[926px] shrink-0 overflow-hidden rounded-[24px] bg-login-surface shadow-[0_28px_80px_rgb(0_0_0/45%)]"
        data-account-type={accountType}
        aria-labelledby="login-heading"
      >
        <div className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
          {(Object.keys(accountVisuals) as AccountType[]).map((type) => (
            <img
              key={type}
              src={accountVisuals[type]}
              alt=""
              data-testid={`login-visual-${type}`}
              className={`absolute left-0 top-0 h-[609px] w-[926px] object-fill transition-opacity duration-300 ${
                accountType === type ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <img src={shade} alt="" className="absolute left-0 top-0 h-[609px] w-[822px]" />
          <img src={glow} alt="" className="absolute inset-0 h-[619px] w-[926px]" />
        </div>

        <section className="relative z-10 h-full w-[578px] px-8 pt-8">
          <img src={logo} alt="OrbitPlay" className="h-[30px] w-[131px] object-contain" />

          <Tabs
            value={accountType}
            onValueChange={(value) => {
              if (isAccountType(value)) setAccountType(value)
            }}
            className="mt-[47px] block w-[293px]"
          >
            <TabsList
              variant="line"
              aria-label="Tipo de conta"
              className="h-[50px] w-[293px] justify-start gap-0 rounded-none border-b border-login-field-border p-0"
            >
              <TabsTrigger
                value="tester"
                className="h-[50px] w-[137px] flex-none justify-start rounded-none px-3 text-[16px] font-normal text-login-copy after:bottom-[-1px] after:h-[3px] after:w-[142px] after:bg-login-accent data-[state=active]:font-semibold data-[state=active]:text-login-accent"
              >
                Sou um tester
              </TabsTrigger>
              <TabsTrigger
                value="studio"
                className="h-[50px] w-[156px] flex-none justify-start rounded-none px-3 text-[16px] font-normal text-login-copy after:bottom-[-1px] after:h-[3px] after:bg-login-accent data-[state=active]:font-semibold data-[state=active]:text-login-accent"
              >
                Sou um estúdio
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <h1
            id="login-heading"
            className="mt-[52px] font-login-display text-[32px] leading-[38px] font-normal"
          >
            Bem-vindo!
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-[17px] w-[514px]" noValidate>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="relative gap-[5px]">
                      <FormLabel className="h-[19px] text-[16px] leading-[19px] font-semibold">
                        E-mail
                      </FormLabel>
                      <div className="relative">
                        <Icon
                          name="mail"
                          className="pointer-events-none absolute left-[17px] top-1/2 z-10 size-5 -translate-y-1/2 text-login-copy"
                        />
                        <FormControl>
                          <Input
                            type="email"
                            autoComplete="email"
                            placeholder="Digite..."
                            className="h-[46px] rounded-[12px] border-login-field-border bg-login-field pl-[51px] pr-4 font-login-display text-[16px] text-login-copy shadow-none placeholder:text-login-muted focus-visible:border-login-accent focus-visible:ring-login-accent/35 md:text-[16px]"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="absolute right-0 top-0 max-w-[300px] text-right text-[11px] leading-[19px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative gap-[5px]">
                      <FormLabel className="h-[19px] text-[16px] leading-[19px] font-semibold">
                        Senha
                      </FormLabel>
                      <div className="relative">
                        <Icon
                          name="key"
                          className="pointer-events-none absolute left-[17px] top-1/2 z-10 size-5 -translate-y-1/2 -rotate-45 text-login-copy"
                        />
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="current-password"
                            placeholder="Digite..."
                            className="h-[46px] rounded-[12px] border-login-field-border bg-login-field pl-[51px] pr-4 font-login-display text-[16px] text-login-copy shadow-none placeholder:text-login-muted focus-visible:border-login-accent focus-visible:ring-login-accent/35 md:text-[16px]"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="absolute right-0 top-0 max-w-[300px] text-right text-[11px] leading-[19px]" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4 flex h-6 items-center justify-between">
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked === true)}
                          className="size-6 rounded-[8px] border-login-field-border bg-login-field data-[state=checked]:border-login-accent data-[state=checked]:bg-login-accent"
                        />
                      </FormControl>
                      <FormLabel className="text-[16px] leading-6 font-normal text-login-muted">
                        Lembrar login
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <button
                  type="button"
                  onClick={() => void requestPasswordReset()}
                  disabled={forgotPassword.isPending || login.isPending}
                  className="flex h-6 w-[203px] items-center justify-end gap-1 text-[16px] leading-6 font-semibold text-login-accent outline-none transition-colors hover:text-login-copy focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-login-accent disabled:pointer-events-none disabled:opacity-60"
                >
                  {forgotPassword.isPending ? 'Enviando...' : 'Esqueci minha senha'}
                  <Icon name="arrow-right" className="size-5" />
                </button>
              </div>

              <Button
                type="submit"
                disabled={login.isPending}
                className="mt-4 h-[58px] w-full rounded-[9px] border-b-2 border-white/20 bg-linear-to-r from-login-button-start to-login-button-end font-login-display text-[24px] leading-none font-normal shadow-[0_10px_30px_rgb(22_140_243/18%)] hover:brightness-110"
              >
                {login.isPending ? (
                  <>
                    <Icon name="loader" className="size-5 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar!'
                )}
              </Button>

              <div className="mt-1 min-h-5" aria-live="polite">
                {login.isError && !hasMappedFieldError(login.error) ? (
                  <p role="alert" className="text-[12px] leading-5 text-destructive">
                    {loginErrorMessage(login.error)}
                  </p>
                ) : null}
              </div>
            </form>
          </Form>

          <p className="absolute bottom-8 left-8 flex h-5 items-center gap-[23px] text-[16px] leading-5 text-login-copy">
            <span>Não tem uma conta OrbitPlay?</span>
            <span
              aria-disabled="true"
              className="flex items-center gap-1 font-semibold text-login-accent opacity-80"
            >
              Criar uma conta grátis
              <Icon name="arrow-right" className="size-5" />
            </span>
          </p>
        </section>
      </article>
    </main>
  )
}
