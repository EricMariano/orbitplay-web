import type { Role } from '@/api-types'

export const roleLabels: Record<Role, string> = {
  owner: 'Proprietário',
  admin: 'Administrador',
  studio: 'Desenvolvedor',
  player: 'Jogador',
}
