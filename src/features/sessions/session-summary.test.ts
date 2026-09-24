import { describe, expect, it } from 'vitest'
import { orderedQuestions, validateAnswers, type FormQuestion } from './session-summary'

const question = (overrides: Partial<FormQuestion> = {}): FormQuestion => ({
  id: 'question-1',
  type: 'short_text',
  prompt: 'Pergunta',
  position: 1,
  required: true,
  ...overrides,
})

describe('session form', () => {
  it('uses the configured position without mutating the API array', () => {
    const questions = [
      question({ id: 'second', position: 2 }),
      question({ id: 'first', position: 1 }),
    ]
    expect(orderedQuestions(questions).map(({ id }) => id)).toEqual(['first', 'second'])
    expect(questions[0]?.id).toBe('second')
  })

  it('requires meaningful text while accepting false as a boolean answer', () => {
    const questions = [question(), question({ id: 'boolean', type: 'boolean' })]
    expect(validateAnswers(questions, { 'question-1': '  ', boolean: false })).toEqual({
      'question-1': 'Esta pergunta é obrigatória.',
    })
    expect(validateAnswers(questions, { 'question-1': 'Resposta', boolean: false })).toEqual({})
  })

  it('checks scale bounds and option ids from the form', () => {
    const questions = [
      question({ type: 'scale', scaleMin: 0, scaleMax: 3 }),
      question({ id: 'choice', type: 'multiple_choice', options: [{ id: 'a', label: 'A' }] }),
    ]
    expect(validateAnswers(questions, { 'question-1': 0, choice: ['a'] })).toEqual({})
    expect(validateAnswers(questions, { 'question-1': 4, choice: ['missing'] })).toEqual({
      'question-1': 'Selecione um valor da escala.',
      choice: 'Selecione opções válidas.',
    })
  })
})
