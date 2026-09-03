import { createFileRoute } from '@tanstack/react-router'
import { TestModelsScreen } from '@/features/tests/components/TestModelsScreen'

export const Route = createFileRoute('/studio/tests/')({
  component: TestModelsScreen,
})
