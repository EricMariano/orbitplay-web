import { createFileRoute } from '@tanstack/react-router'
import { TesterIntroduction } from './-components/public/TesterIntroduction'

export const Route = createFileRoute('/tester')({ component: TesterIntroduction })
