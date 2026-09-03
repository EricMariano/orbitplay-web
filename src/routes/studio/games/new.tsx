import { createFileRoute } from '@tanstack/react-router'
import { NewGameScreen } from '@/features/games/components/NewGameScreen'

export const Route = createFileRoute('/studio/games/new')({
  component: NewGameScreen,
})
