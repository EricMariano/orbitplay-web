import { useState } from 'react'
import { toast } from 'sonner'
import type { Game } from '@/api-types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useUpdateGame } from '@/features/games/api/use-update-game'
import { useRemoveGameCover } from '@/features/games/api/use-remove-game-cover'
import { useUploadGameAsset } from '@/features/games/api/use-upload-game-asset'

export function EditGameDialog({
  game,
  open,
  onOpenChange,
}: {
  game: Game
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [title, setTitle] = useState(game.title)
  const [cover, setCover] = useState<File | null>(null)
  const updateGame = useUpdateGame(game.id)
  const uploadAsset = useUploadGameAsset()
  const removeCover = useRemoveGameCover(game.id)
  const isSaving = updateGame.isPending || uploadAsset.isPending || removeCover.isPending

  async function save() {
    const nextTitle = title.trim()
    if (!nextTitle) {
      toast.error('Informe o nome do jogo.')
      return
    }
    if (cover && !['image/png', 'image/jpeg', 'image/webp'].includes(cover.type)) {
      toast.error('Use uma imagem PNG, JPG ou WebP.')
      return
    }
    if (cover && (cover.size < 1 || cover.size > 5 * 1024 * 1024)) {
      toast.error('A imagem deve ter até 5 MB.')
      return
    }
    try {
      if (nextTitle !== game.title) await updateGame.mutateAsync({ title: nextTitle })
      if (cover) await uploadAsset.mutateAsync({ gameId: game.id, kind: 'cover', file: cover })
      toast.success('Jogo atualizado.')
      onOpenChange(false)
    } catch {
      toast.error('Não foi possível atualizar o jogo.')
    }
  }

  async function removeCurrentCover() {
    try {
      await removeCover.mutateAsync()
      toast.success('Imagem removida.')
      setCover(null)
      onOpenChange(false)
    } catch {
      toast.error('Não foi possível remover a imagem.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar jogo</DialogTitle>
          <DialogDescription>Altere o nome e a imagem de capa exibidos no card.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <label className="block space-y-2 text-sm font-medium">
            Nome do jogo
            <Input
              value={title}
              maxLength={200}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
          <label className="block space-y-2 text-sm font-medium">
            Imagem de capa
            <Input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => setCover(event.target.files?.[0] ?? null)}
            />
            <span className="block text-xs text-muted">PNG, JPG ou WebP, até 5 MB.</span>
          </label>
        </div>
        <DialogFooter>
          {game.coverUrl && (
            <Button
              type="button"
              variant="destructive"
              className="sm:mr-auto"
              onClick={removeCurrentCover}
              disabled={isSaving}
            >
              Remover imagem
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={save} disabled={isSaving}>
            {isSaving ? 'Salvando…' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
