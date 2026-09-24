import { Icon } from '@/components/icon'
import { QuestionEditorCard } from './QuestionEditorCard'
import type { TestFormQuestion } from '../types'

function createQuestion(): TestFormQuestion {
  return {
    id: crypto.randomUUID(),
    type: 'short_answer',
    prompt: '',
    required: false,
    options: [],
    scaleMin: 1,
    scaleMax: 5,
    scaleMinLabel: '',
    scaleMaxLabel: '',
  }
}

type TestFormBuilderProps = {
  questions: TestFormQuestion[]
  onChange: (questions: TestFormQuestion[]) => void
}

export function TestFormBuilder({ questions, onChange }: TestFormBuilderProps) {
  function updateAt(index: number, question: TestFormQuestion) {
    onChange(questions.map((q, i) => (i === index ? question : q)))
  }

  function moveAt(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= questions.length) return
    const next = [...questions]
    ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]
    onChange(next)
  }

  function duplicateAt(index: number) {
    const copy = { ...questions[index], id: crypto.randomUUID() }
    onChange([...questions.slice(0, index + 1), copy, ...questions.slice(index + 1)])
  }

  function deleteAt(index: number) {
    const question = questions[index]
    const hasContent = question.prompt.trim() || question.options.some((o) => o.label.trim())
    // RN-05: exclusão pede confirmação quando há conteúdo preenchido
    if (
      hasContent &&
      !window.confirm('Essa pergunta tem conteúdo preenchido. Deletar mesmo assim?')
    ) {
      return
    }
    onChange(questions.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <QuestionEditorCard
          key={question.id}
          question={question}
          index={index}
          total={questions.length}
          onChange={(updated) => updateAt(index, updated)}
          onMove={(direction) => moveAt(index, direction)}
          onDuplicate={() => duplicateAt(index)}
          onDelete={() => deleteAt(index)}
        />
      ))}

      <button
        type="button"
        onClick={() => onChange([...questions, createQuestion()])}
        className="flex items-center gap-1 text-sm text-primary"
      >
        <Icon name="plus" className="size-4" />
        Adicionar pergunta
      </button>
    </div>
  )
}
