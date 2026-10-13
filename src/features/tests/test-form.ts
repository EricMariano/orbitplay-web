import type { PutTestFormRequest, QuestionType } from '@/api-types'

/** Tipos de pergunta que a Tela 07 oferece (a API aceita também `boolean` e `nps`). */
export type EditableQuestionType = Extract<
  QuestionType,
  'open_text' | 'single_choice' | 'multiple_choice' | 'scale'
>

export const QUESTION_TYPE_LABELS: Record<EditableQuestionType, string> = {
  open_text: 'Resposta curta',
  single_choice: 'Escolha',
  multiple_choice: 'Múltipla escolha',
  scale: 'Escala linear',
}

export const SCALE_MIN_VALUES = [0, 1]
export const SCALE_MAX_VALUES = [2, 3, 4, 5, 6, 7, 8, 9, 10]

export type QuestionOptionDraft = {
  /** Só identifica a linha na tela (key do React); a API gera o id real. */
  key: string
  label: string
}

/** Estado de edição de uma pergunta. Vira payload da API só ao salvar (`toPutFormRequest`). */
export type QuestionDraft = {
  key: string
  type: EditableQuestionType
  prompt: string
  required: boolean
  options: QuestionOptionDraft[]
  scaleMin: number
  scaleMax: number
  scaleMinLabel: string
  scaleMaxLabel: string
}

export function isChoiceType(type: EditableQuestionType) {
  return type === 'single_choice' || type === 'multiple_choice'
}

export function createOptionDraft(): QuestionOptionDraft {
  return { key: crypto.randomUUID(), label: '' }
}

export function createQuestionDraft(): QuestionDraft {
  return {
    key: crypto.randomUUID(),
    type: 'open_text',
    prompt: '',
    required: false,
    options: [],
    scaleMin: 1,
    scaleMax: 5,
    scaleMinLabel: '',
    scaleMaxLabel: '',
  }
}

/** Troca o tipo mantendo o enunciado; tipos de escolha começam com 3 opções vazias (Tela 07). */
export function changeQuestionType(question: QuestionDraft, type: EditableQuestionType) {
  const keepOptions = isChoiceType(type) && question.options.length > 0
  return {
    ...question,
    type,
    options: keepOptions
      ? question.options
      : isChoiceType(type)
        ? [createOptionDraft(), createOptionDraft(), createOptionDraft()]
        : [],
  }
}

export function duplicateQuestionDraft(question: QuestionDraft): QuestionDraft {
  return {
    ...question,
    key: crypto.randomUUID(),
    options: question.options.map((option) => ({ ...option, key: crypto.randomUUID() })),
  }
}

export function hasQuestionContent(question: QuestionDraft) {
  return (
    question.prompt.trim() !== '' ||
    question.options.some((option) => option.label.trim() !== '') ||
    question.scaleMinLabel.trim() !== '' ||
    question.scaleMaxLabel.trim() !== ''
  )
}

/** RN-01/RN-02 (Tela 07): toda pergunta tem enunciado; escolhas têm ao menos 2 opções preenchidas. */
export function isTestFormValid(questions: QuestionDraft[]) {
  if (questions.length === 0) return false
  return questions.every((question) => {
    if (!question.prompt.trim()) return false
    if (isChoiceType(question.type)) {
      return question.options.filter((option) => option.label.trim()).length >= 2
    }
    if (question.type === 'scale') return question.scaleMin < question.scaleMax
    return true
  })
}

/** Converte o estado da tela no corpo do `PUT /tests/{id}/form`; a ordem da lista vira `position`. */
export function toPutFormRequest(questions: QuestionDraft[]): PutTestFormRequest {
  return {
    questions: questions.map((question, position) => {
      const base = {
        type: question.type,
        prompt: question.prompt.trim(),
        required: question.required,
        position,
      }
      if (isChoiceType(question.type)) {
        return {
          ...base,
          options: question.options
            .map((option) => option.label.trim())
            .filter(Boolean)
            .map((label, optionPosition) => ({ label, position: optionPosition })),
        }
      }
      if (question.type === 'scale') {
        return {
          ...base,
          scaleMin: question.scaleMin,
          scaleMax: question.scaleMax,
          ...(question.scaleMinLabel.trim() && { scaleMinLabel: question.scaleMinLabel.trim() }),
          ...(question.scaleMaxLabel.trim() && { scaleMaxLabel: question.scaleMaxLabel.trim() }),
        }
      }
      return base
    }),
  }
}
