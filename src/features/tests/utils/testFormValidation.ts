import type { TestFormQuestion } from '../types'

/** RN-01/RN-02 (Tela 07): pergunta precisa de enunciado, e tipos com opção precisam de pelo menos 2 preenchidas. */
export function isTestFormValid(questions: TestFormQuestion[]) {
  if (questions.length === 0) return false
  return questions.every((question) => {
    if (!question.prompt.trim()) return false
    if (question.type === 'single_choice' || question.type === 'multiple_choice') {
      return question.options.filter((option) => option.label.trim()).length >= 2
    }
    return true
  })
}
