import { Cell, Pie, PieChart } from 'recharts'
import type { ReportBlockOf, ReportPayload } from '@/api-types'
import { chartColor, type TagTone } from '@/components/common/TagTones'
import {
  archetypeView,
  playerTierView,
  UNKNOWN_PROFILE_LABEL,
} from '@/features/reports/report-labels'
import { BlockContent, BlockMessage } from './BlockContent'
import { ReportCard } from './ReportCard'

type Profile = ReportPayload<'tester_profile'>
type Slice = { key: string; label: string; tone: TagTone | 'neutral'; count: number }

function tierSlices(profile: Profile): Slice[] {
  return profile.playerTiers.map(({ key, count }) =>
    key === 'unknown'
      ? { key, label: UNKNOWN_PROFILE_LABEL, tone: 'neutral', count }
      : { key, ...playerTierView(key), count },
  )
}

function archetypeSlices(profile: Profile): Slice[] {
  return profile.archetypes.map(({ key, count }) =>
    key === 'unknown'
      ? { key, label: UNKNOWN_PROFILE_LABEL, tone: 'neutral', count }
      : { key, ...archetypeView(key), count },
  )
}

/** "Testadores & Arquétipos": tipo de jogador e arquétipo de quem participou. */
export function TestersCard({ block }: { block: ReportBlockOf<'tester_profile'> | undefined }) {
  return (
    <ReportCard
      title="Testadores & Arquétipos"
      info="Perfil informado pelos jogadores que participaram. Quem ainda não preencheu aparece como “Não informado”."
      className="h-96"
    >
      <BlockContent block={block} unavailableMessage="Perfil dos testadores indisponível.">
        {(profile) => {
          const tiers = tierSlices(profile)
          const archetypes = archetypeSlices(profile)
          if (tiers.every((s) => s.count === 0)) {
            return <BlockMessage icon="empty">Nenhum testador participou ainda.</BlockMessage>
          }
          return (
            <div className="flex flex-1 flex-wrap items-center justify-center gap-6">
              <Donut title="Tipo de jogador" slices={tiers} />
              <Donut title="Arquétipo" slices={archetypes} />
            </div>
          )
        }}
      </BlockContent>
    </ReportCard>
  )
}

const DONUT_SIZE = 161

function Donut({ title, slices }: { title: string; slices: Slice[] }) {
  const filled = slices.filter((s) => s.count > 0)
  // "Não informado" só entra na legenda quando existe.
  const legend = slices.filter((s) => s.key !== 'unknown' || s.count > 0)
  const total = filled.reduce((sum, s) => sum + s.count, 0)

  return (
    <figure className="flex items-center gap-6">
      <PieChart
        width={DONUT_SIZE}
        height={DONUT_SIZE}
        role="img"
        aria-label={`${title}: ${filled.map((s) => `${s.label} ${s.count}`).join(', ')}`}
      >
        <Pie
          data={filled}
          dataKey="count"
          nameKey="label"
          innerRadius={DONUT_SIZE / 2 - 14}
          outerRadius={DONUT_SIZE / 2}
          paddingAngle={filled.length > 1 ? 2 : 0}
          stroke="none"
          isAnimationActive={false}
        >
          {filled.map((slice) => (
            <Cell key={slice.key} fill={chartColor(slice.tone)} />
          ))}
        </Pie>
      </PieChart>
      <figcaption>
        <span className="sr-only">{title}</span>
        <ul className="flex flex-col gap-2 text-[14px]">
          {legend.map((slice) => (
            <li key={slice.key} className="flex items-center gap-1">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: chartColor(slice.tone) }}
                aria-hidden
              />
              {slice.label}
              <span className="sr-only">
                : {slice.count} de {total}
              </span>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  )
}
