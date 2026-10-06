import { describe, expect, it } from 'vitest'
import type { FormQuestion } from '@/api-types'
import {
  orderedQuestions,
  scaleRange,
  toFormResponseRequest,
  validateAnswers,
} from './session-summary'

const question = (overrides: Partial<FormQuestion> = {}): FormQuestion => ({
  id: 'question-1',
  type: 'open_text',
  prompt: 'Pergunta',
  helpText: null,
  position: 1,
  required: true,
  options: [],
  scaleMin: null,
  scaleMax: null,
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
      question({
        id: 'choice',
        type: 'multiple_choice',
        options: [{ id: 'a', label: 'A', position: 0 }],
      }),
    ]
    expect(validateAnswers(questions, { 'question-1': 0, choice: ['a'] })).toEqual({})
    expect(validateAnswers(questions, { 'question-1': 4, choice: ['missing'] })).toEqual({
      'question-1': 'Selecione um valor da escala.',
      choice: 'Selecione opções válidas.',
    })
  })

  it('defaults NPS without a configured scale to 0–10', () => {
    const nps = question({ type: 'nps' })
    expect(scaleRange(nps)).toEqual({ min: 0, max: 10 })
    expect(validateAnswers([nps], { 'question-1': 10 })).toEqual({})
    expect(validateAnswers([nps], { 'question-1': 11 })).toEqual({
      'question-1': 'Selecione um valor da escala.',
    })
    expect(scaleRange(question({ type: 'scale' }))).toBeNull()
  })

  it('drops blank answers from the request body', () => {
    expect(toFormResponseRequest({ a: '  ', b: [], c: false, d: 'ok', e: undefined })).toEqual({
      answers: [
        { questionId: 'c', value: false },
        { questionId: 'd', value: 'ok' },
      ],
    })
  })
})
