import { createFileRoute } from '@tanstack/react-router'
import { LandingPage } from './-components/public/LandingPage'

export const Route = createFileRoute('/')({
  component: LandingPage,
})
