import { api } from '@/lib/api-client'

export type QuestionType =
  'short_text' | 'long_text' | 'single_choice' | 'multiple_choice' | 'scale' | 'rating' | 'boolean'

export type FormQuestion = {
  id: string
  type: QuestionType
  prompt: string
  helpText?: string | null
  required: boolean
  position: number
  options?: { id?: string; label: string; position?: number }[]
  scaleMin?: number | null
  scaleMax?: number | null
}

export type SessionSummary = {
  session: {
    id: string
    participationId: string
    testId?: string
    status: string
    startedAt: string
    endedAt?: string | null
    durationMs?: number | null
  }
  test: {
    testId: string
    gameId: string
    title: string
    disabled: boolean
    rewardCents?: number | null
    durationMinutes?: number | null
    expiresAt?: string | null
  }
  game: {
    id: string
    title: string
    coverUrl?: string | null
    bannerUrl?: string | null
  }
  recording?: {
    status: 'processing' | 'ready' | 'failed' | 'unavailable'
    url?: string | null
    thumbnailUrl?: string | null
    expiresAt?: string | null
  }
  form: { testId: string; questions: FormQuestion[] }
  alreadySubmitted?: boolean
}

export type AnswerValue = string | number | boolean | string[]
export type Answers = Record<string, AnswerValue | undefined>

export function orderedQuestions(questions: FormQuestion[]) {
  return [...questions].sort((a, b) => a.position - b.position)
}

export function questionConfigurationError(question: FormQuestion): string | null {
  if (question.type === 'scale' || question.type === 'rating') {
    if (
      !Number.isInteger(question.scaleMin) ||
      !Number.isInteger(question.scaleMax) ||
      (question.scaleMin ?? 0) > (question.scaleMax ?? 0)
    ) {
      return 'A escala desta pergunta não foi configurada.'
    }
  }
  if (
    (question.type === 'single_choice' || question.type === 'multiple_choice') &&
    (!question.options?.length || question.options.some((option) => !option.id))
  ) {
    return 'As opções desta pergunta não foram configuradas.'
  }
  return null
}

export function validateAnswers(questions: FormQuestion[], answers: Answers) {
  const errors: Record<string, string> = {}
  for (const question of questions) {
    const configurationError = questionConfigurationError(question)
    if (configurationError) {
      errors[question.id] = configurationError
      continue
    }
    const value = answers[question.id]
    const empty =
      value === undefined ||
      (typeof value === 'string' && !value.trim()) ||
      (Array.isArray(value) && value.length === 0)
    if (question.required && empty) errors[question.id] = 'Esta pergunta é obrigatória.'
    if (empty) continue
    if (
      (question.type === 'short_text' || question.type === 'long_text') &&
      typeof value !== 'string'
    ) {
      errors[question.id] = 'Resposta inválida.'
    }
    if (
      (question.type === 'scale' || question.type === 'rating') &&
      (typeof value !== 'number' || value < question.scaleMin! || value > question.scaleMax!)
    ) {
      errors[question.id] = 'Selecione um valor da escala.'
    }
    if (question.type === 'boolean' && typeof value !== 'boolean')
      errors[question.id] = 'Selecione uma opção.'
    if (
      question.type === 'single_choice' &&
      !question.options?.some((option) => option.id === value)
    ) {
      errors[question.id] = 'Selecione uma opção válida.'
    }
    if (
      question.type === 'multiple_choice' &&
      (!Array.isArray(value) ||
        value.some((id) => !question.options?.some((option) => option.id === id)))
    ) {
      errors[question.id] = 'Selecione opções válidas.'
    }
  }
  return errors
}

export function getSessionSummary(sessionId: string) {
  return api.get<SessionSummary>(`/sessions/${encodeURIComponent(sessionId)}/summary`)
}

export function submitSessionForm(sessionId: string, answers: Answers, idempotencyKey: string) {
  return api.post<{ id: string; sessionId: string; submittedAt: string }>(
    `/sessions/${encodeURIComponent(sessionId)}/form-response`,
    {
      answers: Object.entries(answers)
        .filter(
          (entry): entry is [string, AnswerValue] =>
            entry[1] !== undefined &&
            (typeof entry[1] !== 'string' || Boolean(entry[1].trim())) &&
            (!Array.isArray(entry[1]) || entry[1].length > 0),
        )
        .map(([questionId, value]) => ({ questionId, value })),
    },
    { headers: { 'Idempotency-Key': idempotencyKey } },
  )
}
