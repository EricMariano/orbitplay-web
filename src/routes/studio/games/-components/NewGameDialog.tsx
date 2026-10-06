import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCreateGame } from '@/features/games/api/use-create-game'
import { ApiError } from '@/lib/api-client'

// Espelha os limites de CreateGameDto (orbitplay-api); a validação final é da API.
const newGameSchema = z.object({
  title: z.string().trim().min(1, 'Informe o título').max(200),
  genre: z.string().trim().max(100),
  platform: z.string().trim().max(100),
})

type NewGameValues = z.infer<typeof newGameSchema>

const fields = ['title', 'genre', 'platform'] as const

export function NewGameDialog() {
  const [open, setOpen] = useState(false)
  const createGame = useCreateGame()
  const form = useForm<NewGameValues>({
    resolver: zodResolver(newGameSchema),
    defaultValues: { title: '', genre: '', platform: '' },
  })

  function onSubmit(values: NewGameValues) {
    createGame.mutate(
      {
        title: values.title,
        genre: values.genre || undefined,
        platform: values.platform || undefined,
      },
      {
        onSuccess: (game) => {
          toast.success(`"${game.title}" cadastrado.`)
          form.reset()
          setOpen(false)
        },
        onError: (error) => {
          const fieldErrors = error instanceof ApiError ? error.fieldErrors : undefined
          for (const field of fields) {
            const message = fieldErrors?.[field]
            if (message) form.setError(field, { message })
          }
          if (!fieldErrors) toast.error(error.message || 'Não foi possível cadastrar o jogo.')
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Icon name="plus" />
          Novo jogo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo jogo</DialogTitle>
          <DialogDescription>
            O jogo entra como rascunho na sua organização. Capa e detalhes podem ser ajustados
            depois.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: Nebula Drift" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gênero</FormLabel>
                    <FormControl>
                      <Input placeholder="Opcional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plataforma</FormLabel>
                    <FormControl>
                      <Input placeholder="Opcional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createGame.isPending}>
                {createGame.isPending ? 'Criando...' : 'Criar jogo'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
