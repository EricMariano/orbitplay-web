import type { EvaluationQuestionSummary, ReportBlockOf, ReportPayload } from '@/api-types'
import { Icon } from '@/components/icon'
import { formatDecimal, formatDuration, formatPercent } from '@/lib/format'
import { BlockContent, BlockMessage } from './BlockContent'
import { ReportCard, ReportDivider, ReportField, ReportFields } from './ReportCard'

type Evaluations = ReportPayload<'evaluations'>

const RATING_TYPES = ['scale', 'nps']

/** Destaque do cartão: a 1ª pergunta de nota e a 1ª de texto aberto (como no design). */
function featuredQuestions(questions: EvaluationQuestionSummary[]): EvaluationQuestionSummary[] {
  const rating = questions.find((q) => RATING_TYPES.includes(q.type))
  const text = questions.find((q) => q.type === 'open_text')
  const picked = [rating, text].filter((q): q is EvaluationQuestionSummary => Boolean(q))
  // Formulário sem esses tipos: mostra as duas primeiras perguntas que houver.
  return picked.length > 0 ? picked : questions.slice(0, 2)
}

function EvaluationFields({ evaluations }: { evaluations: Evaluations }) {
  return (
    <ReportFields>
      <ReportField label="Total de perguntas" value={String(evaluations.questionsCount)} />
      <ReportField
        label="Tempo médio da avaliação"
        value={
          evaluations.averageResponseTimeMs === null
            ? null
            : formatDuration(evaluations.averageResponseTimeMs)
        }
        unavailableHint="Ainda não há avaliações enviadas."
      />
      <ReportField
        label="Taxa de desistência"
        value={evaluations.dropoutRate === null ? null : formatPercent(evaluations.dropoutRate)}
        unavailableHint="Ainda não há sessões encerradas."
      />
    </ReportFields>
  )
}

type EvaluationsCardProps = {
  block: ReportBlockOf<'evaluations'> | undefined
  onSeeAll?: () => void
}

/** Cartão "Avaliações": números do formulário + duas perguntas em destaque. */
export function EvaluationsCard({ block, onSeeAll }: EvaluationsCardProps) {
  return (
    <ReportCard
      title="Avaliações"
      info="Respostas do formulário enviado pelos testadores ao fim da sessão."
      className="h-96"
      link={onSeeAll ? { label: 'Ir para Todas as avaliações', onClick: onSeeAll } : undefined}
    >
      <BlockContent block={block} unavailableMessage="Avaliações indisponíveis.">
        {(evaluations) => (
          <>
            <EvaluationFields evaluations={evaluations} />
            <ReportDivider />
            {evaluations.questions.length === 0 ? (
              <BlockMessage icon="empty">Este teste não tem perguntas de avaliação.</BlockMessage>
            ) : (
              <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2">
                {featuredQuestions(evaluations.questions).map((question) => (
                  <QuestionSummary key={question.questionId} question={question} compact />
                ))}
              </div>
            )}
          </>
        )}
      </BlockContent>
    </ReportCard>
  )
}

/** Aba "Todas as Avaliações": o resumo de cada pergunta do formulário. */
export function AllEvaluationsCard({ block }: { block: ReportBlockOf<'evaluations'> | undefined }) {
  return (
    <ReportCard
      title="Todas as avaliações"
      info="Respostas do formulário enviado pelos testadores ao fim da sessão."
    >
      <BlockContent block={block} unavailableMessage="Avaliações indisponíveis.">
        {(evaluations) => (
          <>
            <EvaluationFields evaluations={evaluations} />
            <ReportDivider />
            {evaluations.questions.length === 0 ? (
              <BlockMessage icon="empty">Este teste não tem perguntas de avaliação.</BlockMessage>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {evaluations.questions.map((question) => (
                  <QuestionSummary key={question.questionId} question={question} />
                ))}
              </div>
            )}
          </>
        )}
      </BlockContent>
    </ReportCard>
  )
}

function questionTitle(question: EvaluationQuestionSummary): string {
  return `Pergunta ${String(question.position + 1).padStart(2, '0')} - ${question.label}`
}

/** Resumo de uma pergunta, no formato do seu tipo. */
function QuestionSummary({
  question,
  compact = false,
}: {
  question: EvaluationQuestionSummary
  compact?: boolean
}) {
  const responses = `${question.responsesCount.toLocaleString('pt-BR')} ${
    question.responsesCount === 1 ? 'resposta' : 'respostas'
  }`

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex items-center gap-2">
        <Icon name="message-circle" className="size-6 shrink-0" filled />
        <h3 className="truncate text-[16px] font-bold" title={questionTitle(question)}>
          {questionTitle(question)}
        </h3>
      </div>

      {question.distribution.length > 0 ? (
        <>
          <BarList
            rows={[...question.distribution]
              .reverse()
              .map((d) => ({ label: String(d.value), count: d.count }))}
            labelClassName="w-4"
          />
          {question.average !== null ? (
            <p className="flex items-center gap-2 text-[14px]">
              Média de {formatDecimal(question.average)}
              <Icon name="star" className="size-6" filled />
            </p>
          ) : null}
        </>
      ) : question.options.length > 0 ? (
        <BarList
          rows={question.options.map((o) => ({ label: o.label, count: o.count }))}
          labelClassName="w-36 shrink-0 truncate"
        />
      ) : (
        <ul className="list-disc space-y-2 ps-5 text-[14px]">
          <li>{responses}</li>
          {question.samples.slice(0, compact ? 2 : undefined).map((sample, i) => (
            <li key={i} className="line-clamp-2">
              “{sample}”
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** Barras horizontais (pista branca, preenchimento azul) proporcionais ao maior valor. */
function BarList({
  rows,
  labelClassName,
}: {
  rows: { label: string; count: number }[]
  labelClassName?: string
}) {
  const total = rows.reduce((sum, r) => sum + r.count, 0)
  return (
    <ul className="flex flex-col gap-2">
      {rows.map((row) => {
        const ratio = total > 0 ? row.count / total : 0
        return (
          <li
            key={row.label}
            className="flex items-center gap-1 font-label text-[14px] leading-[1.1]"
          >
            <span className={labelClassName} title={row.label}>
              {row.label}
            </span>
            <div
              className="h-2 flex-1 overflow-hidden rounded-full bg-report-progress-track"
              role="meter"
              aria-label={row.label}
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={row.count}
            >
              <div
                className="h-full rounded-full bg-report-progress"
                style={{ width: `${ratio * 100}%` }}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
