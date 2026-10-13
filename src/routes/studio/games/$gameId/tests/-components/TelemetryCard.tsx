import glowSrc from '@/assets/orbit-plugin/glow.svg'
import lineSrc from '@/assets/orbit-plugin/line.svg'
import plugSrc from '@/assets/orbit-plugin/plug.svg'
import sparkSrc from '@/assets/orbit-plugin/spark.svg'
import type { ReportBlockOf } from '@/api-types'
import { Icon, type IconName } from '@/components/icon'
import { BlockContent } from './BlockContent'
import { AI_PENDING_HINT, ReportCard, ReportDivider, ReportField, ReportFields } from './ReportCard'

type TelemetryCardProps = {
  block: ReportBlockOf<'telemetry'> | undefined
  onSeePlugin?: () => void
}

/** Cartão "Telemetria" do Orbit Plug-in (bloco `telemetry`). */
export function TelemetryCard({ block, onSeePlugin }: TelemetryCardProps) {
  return (
    <ReportCard
      title="Telemetria"
      variant="plugin"
      headerExtra={<OrbitPluginMark />}
      className="h-96"
      link={onSeePlugin ? { label: 'Ir para Orbit Plug-in', onClick: onSeePlugin } : undefined}
    >
      <BlockContent
        block={block}
        unavailableMessage="A build deste teste não tem o Orbit Plug-in. Integre o plug-in na build para coletar telemetria."
      >
        {(telemetry) => (
          <>
            <ReportFields>
              <ReportField
                label="Sessões analisadas"
                value={telemetry.sessionsAnalyzed.toLocaleString('pt-BR')}
              />
              <ReportField
                label="Gatilhos ativos"
                value={telemetry.activeTriggers.toLocaleString('pt-BR')}
              />
              <ReportField
                label="Descobertas"
                value={telemetry.discoveries ? String(telemetry.discoveries.length) : null}
                unavailableHint={AI_PENDING_HINT}
              />
              <ReportField
                label="Sugestões de IA"
                value={telemetry.aiSuggestions ? String(telemetry.aiSuggestions.length) : null}
                unavailableHint={AI_PENDING_HINT}
              />
            </ReportFields>
            <ReportDivider />
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2">
              <TelemetryList
                icon="sparkles"
                title="Principais descobertas"
                items={telemetry.discoveries}
              />
              <TelemetryList
                icon="insights"
                title="Sugestões de IA"
                items={telemetry.aiSuggestions}
              />
            </div>
          </>
        )}
      </BlockContent>
    </ReportCard>
  )
}

function TelemetryList({
  icon,
  title,
  items,
}: {
  icon: IconName
  title: string
  items: string[] | null
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex items-center gap-2">
        <Icon name={icon} className="size-6" />
        <h3 className="text-[16px] font-bold">{title}</h3>
      </div>
      {items === null ? (
        <p className="text-[14px]">{AI_PENDING_HINT}</p>
      ) : items.length === 0 ? (
        <p className="text-[14px]">Nada encontrado ainda.</p>
      ) : (
        <ul className="list-disc space-y-2 ps-5 text-[14px]">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** Marca "OrbitPlug-in" com brilho e linhas, como no cabeçalho do cartão (geometria do Figma). */
function OrbitPluginMark() {
  return (
    <div
      className="relative hidden h-9 w-[439.85px] shrink-0 xl:block"
      aria-label="Orbit Plug-in"
      role="img"
    >
      <img
        src={glowSrc}
        alt=""
        className="absolute top-[5.6px] left-[38.05px] h-[31.568px] w-[371.435px]"
      />
      <img src={lineSrc} alt="" className="absolute top-[18.2px] left-0 h-0.5 w-26.5" />
      <img
        src={lineSrc}
        alt=""
        className="absolute top-[18.2px] left-[333.85px] h-0.5 w-26.5 -scale-x-100"
      />
      <div className="absolute top-0 left-[111.85px]">
        <img src={plugSrc} alt="" className="size-9" />
        <img
          src={sparkSrc}
          alt=""
          className="absolute top-[3.4px] left-[21px] h-[16.8px] w-[18px]"
        />
        <span className="absolute top-[5.8px] left-[31.8px] text-[28.8px] leading-none whitespace-nowrap">
          <span className="font-bold">Orbit</span>
          <span>Plug-in</span>
        </span>
      </div>
    </div>
  )
}
