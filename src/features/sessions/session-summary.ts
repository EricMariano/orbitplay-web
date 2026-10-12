import type { FormQuestion, FormResponseRequest } from '@/api-types'

/** NPS sem escala configurada usa o intervalo padrão 0–10. */
const NPS_RANGE = { min: 0, max: 10 }

export type AnswerValue = FormResponseRequest['answers'][number]['value']
export type Answers = Record<string, AnswerValue | undefined>

export function scaleRange(question: FormQuestion): { min: number; max: number } | null {
  if (question.type === 'nps' && question.scaleMin == null && question.scaleMax == null) {
    return NPS_RANGE
  }
  if (
    !Number.isInteger(question.scaleMin) ||
    !Number.isInteger(question.scaleMax) ||
    (question.scaleMin ?? 0) > (question.scaleMax ?? 0)
  ) {
    return null
  }
  return { min: question.scaleMin!, max: question.scaleMax! }
}

export function orderedQuestions(questions: FormQuestion[]) {
  return [...questions].sort((a, b) => a.position - b.position)
}

export function questionConfigurationError(question: FormQuestion): string | null {
  if ((question.type === 'scale' || question.type === 'nps') && !scaleRange(question)) {
    return 'A escala desta pergunta não foi configurada.'
  }
  if (
    (question.type === 'single_choice' || question.type === 'multiple_choice') &&
    !question.options.length
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
    if (question.type === 'open_text' && typeof value !== 'string') {
      errors[question.id] = 'Resposta inválida.'
    }
    if (question.type === 'scale' || question.type === 'nps') {
      const range = scaleRange(question)!
      if (typeof value !== 'number' || value < range.min || value > range.max) {
        errors[question.id] = 'Selecione um valor da escala.'
      }
    }
    if (question.type === 'boolean' && typeof value !== 'boolean')
      errors[question.id] = 'Selecione uma opção.'
    if (
      question.type === 'single_choice' &&
      !question.options.some((option) => option.id === value)
    ) {
      errors[question.id] = 'Selecione uma opção válida.'
    }
    if (
      question.type === 'multiple_choice' &&
      (!Array.isArray(value) ||
        value.some((id) => !question.options.some((option) => option.id === id)))
    ) {
      errors[question.id] = 'Selecione opções válidas.'
    }
  }
  return errors
}

/** Monta o corpo de POST /sessions/{id}/form-response, descartando respostas vazias. */
export function toFormResponseRequest(answers: Answers): FormResponseRequest {
  return {
    answers: Object.entries(answers)
      .filter(
        (entry): entry is [string, AnswerValue] =>
          entry[1] !== undefined &&
          (typeof entry[1] !== 'string' || Boolean(entry[1].trim())) &&
          (!Array.isArray(entry[1]) || entry[1].length > 0),
      )
      .map(([questionId, value]) => ({ questionId, value })),
  }
}
