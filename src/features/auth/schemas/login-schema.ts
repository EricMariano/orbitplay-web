import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Informe um e-mail válido'),
  password: z.string().min(1, 'Informe sua senha'),
  remember: z.boolean(),
})

export type LoginValues = z.infer<typeof loginSchema>
