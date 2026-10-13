import {
  createQuestionDraft,
  duplicateQuestionDraft,
  hasQuestionContent,
  type QuestionDraft,
} from '../test-form'
import { LinkAction, QuestionEditorCard } from './QuestionEditorCard'

type TestFormBuilderProps = {
  questions: QuestionDraft[]
  onChange: (questions: QuestionDraft[]) => void
}

/** Lista editável de perguntas do formulário de avaliação (wizard "Novo teste", passo 2). */
export function TestFormBuilder({ questions, onChange }: TestFormBuilderProps) {
  function updateAt(index: number, question: QuestionDraft) {
    onChange(questions.map((q, i) => (i === index ? question : q)))
  }

  function moveAt(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const current = questions[index]
    const target = questions[targetIndex]
    if (!current || !target) return
    const next = [...questions]
    next[index] = target
    next[targetIndex] = current
    onChange(next)
  }

  function duplicateAt(index: number) {
    const original = questions[index]
    if (!original) return
    onChange([
      ...questions.slice(0, index + 1),
      duplicateQuestionDraft(original),
      ...questions.slice(index + 1),
    ])
  }

  function deleteAt(index: number) {
    const question = questions[index]
    if (!question) return
    // RN-05 (Tela 07): exclusão pede confirmação quando há conteúdo preenchido.
    if (
      hasQuestionContent(question) &&
      !window.confirm('Essa pergunta tem conteúdo preenchido. Deletar mesmo assim?')
    ) {
      return
    }
    onChange(questions.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-6">
      {questions.map((question, index) => (
        <QuestionEditorCard
          key={question.key}
          question={question}
          isFirst={index === 0}
          isLast={index === questions.length - 1}
          onChange={(updated) => updateAt(index, updated)}
          onMove={(direction) => moveAt(index, direction)}
          onDuplicate={() => duplicateAt(index)}
          onDelete={() => deleteAt(index)}
        />
      ))}

      <div>
        <LinkAction
          icon="plus"
          label="Adicionar pergunta"
          onClick={() => onChange([...questions, createQuestionDraft()])}
        />
      </div>
    </div>
  )
}
