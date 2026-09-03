import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DevLoginShortcut } from './DevLoginShortcut'
import { LoginForm } from './LoginForm'

/**
 * `/login` screen: layout only. Form logic lives in `LoginForm`, the dev
 * shortcut in `DevLoginShortcut` — this component just arranges them, so the
 * route module (`src/routes/login.tsx`) has nothing left to do but point to it.
 */
export function LoginScreen() {
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

          <LoginForm />

          {import.meta.env.DEV ? <DevLoginShortcut /> : null}
        </CardContent>
      </Card>
    </main>
  )
}
