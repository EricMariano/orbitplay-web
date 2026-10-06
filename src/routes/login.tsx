import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import glow from '@/assets/login/glow.png'
import logo from '@/assets/login/orbitplay-logo.png'
import shade from '@/assets/login/shade.png'
import studioCode from '@/assets/login/studio-code.webp'
import studioGamedev from '@/assets/login/studio-gamedev.webp'
import studioNeonCode from '@/assets/login/studio-neon-code.webp'
import studioRetro from '@/assets/login/studio-retro.webp'
import testerArcade from '@/assets/login/tester-arcade.webp'
import testerController from '@/assets/login/tester-controller.webp'
import testerEsports from '@/assets/login/tester-esports.webp'
import testerNeonController from '@/assets/login/tester-neon-controller.webp'
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
import { cn } from '@/lib/utils'

type AccountType = 'tester' | 'studio'

const accountTypes: AccountType[] = ['tester', 'studio']

/**
 * Showcase photos per account type. The `.webp` files come from Unsplash (free
 * license): photo-1612287230202, photo-1542751371, photo-1586182987320,
 * photo-1511512578047, photo-1607799279861, photo-1556438064, photo-1555066931
 * and photo-1550745165.
 */
const accountSlides: Record<AccountType, string[]> = {
  tester: [testerNeonController, testerEsports, testerController, testerArcade],
  studio: [studioNeonCode, studioGamedev, studioCode, studioRetro],
}

/** Keep in sync with `--animate-login-progress` in globals.css. */
const SLIDE_INTERVAL_MS = 5000

const accountTypeLabels: Record<AccountType, string> = {
  tester: 'Sou um tester',
  studio: 'Sou um estúdio',
}

const accountTaglines: Record<AccountType, string> = {
  tester: 'Entre para testar jogos e ganhar recompensas.',
  studio: 'Entre para acompanhar os testes dos seus jogos.',
}

const fieldClassName =
  'h-[46px] rounded-[12px] border-login-field-border/60 bg-login-field pl-[51px] font-login-display text-[16px] text-login-copy shadow-none transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-login-muted/70 hover:border-login-field-border focus-visible:border-login-accent focus-visible:ring-[4px] focus-visible:ring-login-accent/25 md:text-[16px]'

const fieldMessageClassName =
  'absolute right-0 top-0 max-w-[300px] text-right text-[12px] leading-[19px] motion-safe:animate-login-rise'

/** Entrance delay for the staggered `animate-login-rise` sequence. */
function stagger(step: number) {
  return { animationDelay: `${150 + step * 70}ms` }
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
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: true },
  })

  function onSubmit(values: LoginValues) {
    login.mutate(
      {
        email: values.email,
        password: values.password,
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
    <main className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden bg-login-page px-4 py-8 font-login-body text-login-copy sm:p-8">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -left-40 -top-40 size-[560px] rounded-full bg-login-button-start/20 blur-[120px] motion-safe:animate-login-float" />
        <div className="absolute -bottom-48 -right-32 size-[620px] rounded-full bg-login-button-end/15 blur-[140px] motion-safe:animate-login-float motion-safe:[animation-delay:-7s]" />
      </div>

      <article
        className="relative w-full max-w-[926px] overflow-hidden rounded-[24px] bg-login-surface shadow-[0_28px_80px_rgb(0_0_0/45%)] ring-1 ring-login-copy/10 motion-safe:animate-login-card md:h-[619px]"
        data-account-type={accountType}
        aria-labelledby="login-heading"
      >
        <LoginShowcase accountType={accountType} />

        <section className="relative z-10 flex h-full flex-col px-6 py-8 sm:px-8 md:w-[578px]">
          <img
            src={logo}
            alt="OrbitPlay"
            className="h-[30px] w-[131px] object-contain motion-safe:animate-login-rise"
            style={stagger(0)}
          />

          <Tabs
            value={accountType}
            onValueChange={(value) => {
              if (isAccountType(value)) setAccountType(value)
            }}
            className="mx-auto mt-8 block w-full max-w-[320px] motion-safe:animate-login-rise"
            style={stagger(1)}
          >
            <TabsList
              variant="line"
              aria-label="Tipo de conta"
              className="relative grid h-[50px] w-full grid-cols-2 gap-0 rounded-none border-b border-login-field-border/40 p-0"
            >
              {accountTypes.map((type) => (
                <TabsTrigger
                  key={type}
                  value={type}
                  className="h-[50px] rounded-none px-3 text-[16px] font-normal text-login-muted transition-colors duration-300 after:hidden hover:text-login-copy data-[state=active]:font-semibold data-[state=active]:text-login-accent"
                >
                  {accountTypeLabels[type]}
                </TabsTrigger>
              ))}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute bottom-[-1px] left-0 h-[3px] w-1/2 rounded-full bg-linear-to-r from-login-button-start to-login-button-end shadow-[0_0_12px_rgb(22_140_243/60%)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                  accountType === 'studio' && 'translate-x-full',
                )}
              />
            </TabsList>
          </Tabs>

          <div className="mt-8 text-center motion-safe:animate-login-rise" style={stagger(2)}>
            <h1
              id="login-heading"
              className="font-login-display text-[32px] leading-[38px] font-normal"
            >
              Bem-vindo!
            </h1>
            <p
              key={accountType}
              className="mt-1 text-[15px] leading-6 text-login-muted motion-safe:animate-login-rise"
            >
              {accountTaglines[accountType]}
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-6 w-full md:w-[514px]"
              noValidate
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem
                      className="relative gap-[5px] motion-safe:animate-login-rise"
                      style={stagger(3)}
                    >
                      <FormLabel className="h-[19px] text-[16px] leading-[19px] font-semibold">
                        E-mail
                      </FormLabel>
                      <div className="group relative">
                        <Icon
                          name="mail"
                          className="pointer-events-none absolute left-[17px] top-1/2 z-10 size-5 -translate-y-1/2 text-login-copy transition-colors duration-300 group-focus-within:text-login-accent"
                        />
                        <FormControl>
                          <Input
                            type="email"
                            autoComplete="email"
                            placeholder="voce@exemplo.com"
                            className={cn(fieldClassName, 'pr-4')}
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage className={fieldMessageClassName} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem
                      className="relative gap-[5px] motion-safe:animate-login-rise"
                      style={stagger(4)}
                    >
                      <FormLabel className="h-[19px] text-[16px] leading-[19px] font-semibold">
                        Senha
                      </FormLabel>
                      <div className="group relative">
                        <Icon
                          name="key"
                          className="pointer-events-none absolute left-[17px] top-1/2 z-10 size-5 -translate-y-1/2 -rotate-45 text-login-copy transition-colors duration-300 group-focus-within:text-login-accent"
                        />
                        <FormControl>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            placeholder="Sua senha"
                            className={cn(fieldClassName, 'pr-12')}
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword((visible) => !visible)}
                          aria-pressed={showPassword}
                          className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-login-muted outline-none transition-colors hover:text-login-copy focus-visible:ring-2 focus-visible:ring-login-accent"
                        >
                          <Icon name={showPassword ? 'eye-off' : 'eye'} className="size-5" />
                          <span className="sr-only">
                            {showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                          </span>
                        </button>
                      </div>
                      <FormMessage className={fieldMessageClassName} />
                    </FormItem>
                  )}
                />
              </div>

              <div
                className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 motion-safe:animate-login-rise"
                style={stagger(5)}
              >
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked === true)}
                          className="size-6 rounded-[8px] border-login-field-border bg-login-field transition-colors duration-200 data-[state=checked]:border-login-accent data-[state=checked]:bg-login-accent"
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
                  className="group/forgot flex h-6 items-center gap-1 text-[16px] leading-6 font-semibold text-login-accent outline-none transition-colors hover:text-login-copy focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-login-accent disabled:pointer-events-none disabled:opacity-60"
                >
                  {forgotPassword.isPending ? 'Enviando...' : 'Esqueci minha senha'}
                  <Icon
                    name="arrow-right"
                    className="size-5 transition-transform duration-300 group-hover/forgot:translate-x-1"
                  />
                </button>
              </div>

              <div className="motion-safe:animate-login-rise" style={stagger(6)}>
                <Button
                  type="submit"
                  disabled={login.isPending}
                  className="group/submit relative mt-5 h-[58px] w-full overflow-hidden rounded-[12px] border-b-2 border-login-copy/20 bg-linear-to-r from-login-button-start to-login-button-end font-login-display text-[24px] leading-none font-normal shadow-[0_10px_30px_rgb(22_140_243/18%)] transition-[transform,box-shadow,filter] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgb(22_140_243/32%)] hover:brightness-110 active:translate-y-0 active:scale-[0.99]"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-linear-to-r from-transparent via-login-copy/35 to-transparent transition-transform duration-700 ease-out group-hover/submit:translate-x-[520%]"
                  />
                  {login.isPending ? (
                    <>
                      <Icon name="loader" className="size-5 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    'Entrar!'
                  )}
                </Button>
              </div>

              <div className="mt-2 min-h-5" aria-live="polite">
                {login.isError && !hasMappedFieldError(login.error) ? (
                  <p
                    key={login.submittedAt}
                    role="alert"
                    className="flex items-center gap-1.5 text-[13px] leading-5 text-destructive motion-safe:animate-login-shake"
                  >
                    <Icon name="alert" className="size-4 shrink-0" />
                    {loginErrorMessage(login.error)}
                  </p>
                ) : null}
              </div>
            </form>
          </Form>

          <p
            className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 text-[15px] leading-5 text-login-copy motion-safe:animate-login-rise"
            style={stagger(7)}
          >
            <span>Não tem uma conta OrbitPlay?</span>
            <span
              aria-disabled="true"
              className="flex items-center gap-1 font-semibold text-login-accent/80"
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

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Right-hand photo slider. Each account type has its own looping track; the
 * first slide is cloned at the end so the loop always slides forward, then
 * snaps back to the start without a transition.
 */
function LoginShowcase({ accountType }: { accountType: AccountType }) {
  const [positions, setPositions] = useState<Record<AccountType, number>>({
    tester: 0,
    studio: 0,
  })
  const [animated, setAnimated] = useState(true)

  const slides = accountSlides[accountType]
  const position = positions[accountType]
  const activeSlide = position % slides.length

  function goTo(type: AccountType, next: number) {
    setAnimated(true)
    setPositions((current) => ({ ...current, [type]: next }))
  }

  useEffect(() => {
    if (prefersReducedMotion()) return
    const timer = window.setTimeout(() => goTo(accountType, position + 1), SLIDE_INTERVAL_MS)
    return () => window.clearTimeout(timer)
  }, [accountType, position])

  function handleTrackEnd(type: AccountType, event: React.TransitionEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || event.propertyName !== 'transform') return
    if (positions[type] < accountSlides[type].length) return
    setAnimated(false)
    setPositions((current) => ({ ...current, [type]: 0 }))
  }

  return (
    <>
      <div className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
        <div className="absolute inset-y-0 right-0 hidden w-[48%] overflow-hidden md:block">
          {accountTypes.map((type) => (
            <div
              key={type}
              data-testid={`login-visual-${type}`}
              className={cn(
                'absolute inset-0 transition-opacity duration-700 ease-out',
                accountType === type ? 'opacity-100' : 'opacity-0',
              )}
            >
              <div
                className={cn(
                  'flex h-full ease-[cubic-bezier(0.65,0,0.35,1)] motion-safe:duration-1000',
                  animated ? 'transition-transform' : 'transition-none',
                )}
                style={{ transform: `translateX(-${positions[type] * 100}%)` }}
                onTransitionEnd={(event) => handleTrackEnd(type, event)}
              >
                {[...accountSlides[type], accountSlides[type][0]].map((src, index) => (
                  <div key={index} className="relative h-full w-full shrink-0 overflow-hidden">
                    <img
                      src={src}
                      alt=""
                      className="size-full object-cover object-right motion-safe:animate-login-drift"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-login-surface to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-login-surface/80 to-transparent" />
        </div>
        <img
          src={shade}
          alt=""
          className="absolute inset-y-0 left-0 hidden h-full w-[89%] md:block"
        />
        <img src={glow} alt="" className="absolute inset-0 size-full object-cover" />
      </div>

      <div
        className="absolute bottom-7 right-8 z-20 hidden items-center gap-2 md:flex"
        role="group"
        aria-label="Fotos em destaque"
      >
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goTo(accountType, index)}
            aria-label={`Mostrar foto ${index + 1} de ${slides.length}`}
            aria-current={index === activeSlide}
            className={cn(
              'relative h-1.5 overflow-hidden rounded-full bg-login-copy/30 outline-none transition-[width,background-color] duration-500 hover:bg-login-copy/60 focus-visible:ring-2 focus-visible:ring-login-accent',
              index === activeSlide ? 'w-9' : 'w-1.5',
            )}
          >
            {index === activeSlide ? (
              <span
                key={`${accountType}-${position}`}
                className="absolute inset-0 origin-left rounded-full bg-login-copy motion-safe:animate-login-progress"
              />
            ) : null}
          </button>
        ))}
      </div>
    </>
  )
}
