import { useId, type ReactNode } from 'react'
import arrowsUpUrl from '@/assets/boost/arrows-up.svg'
import gameCoverUrl from '@/assets/boost/game-cover.jpg'
import glowUrl from '@/assets/boost/glow.svg'
import { Icon, type IconName } from '@/components/icon'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import {
  AGE_MAX,
  AGE_MIN,
  ARCHETYPE_OPTIONS,
  BOOST_PRICE_CENTS,
  LOCATION_OPTIONS,
  PLAYER_TIER_OPTIONS,
  QUANTITY_MAX,
  QUANTITY_MIN,
  formatCents,
  toggleLocation,
  type AudienceDraft,
} from '../audience'

type AudienceStepProps = {
  draft: AudienceDraft
  onChange: (draft: AudienceDraft) => void
}

/** Wizard "Novo teste", passo 4 (Tela 09): público, quantidade, duração e impulsionamento. */
export function AudienceStep({ draft, onChange }: AudienceStepProps) {
  const id = useId()
  const set = <K extends keyof AudienceDraft>(key: K, value: AudienceDraft[K]) =>
    onChange({ ...draft, [key]: value })

  return (
    <div className="flex flex-col gap-6">
      <Separator />
      <h3 className="text-xl font-medium text-foreground-strong">Público</h3>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-base font-bold text-foreground-strong">Localização*</legend>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {LOCATION_OPTIONS.map((location) => (
            <label
              key={location.key}
              htmlFor={`${id}-location-${location.key}`}
              className="flex items-center gap-2 text-base text-foreground-strong"
            >
              <Checkbox
                id={`${id}-location-${location.key}`}
                checked={draft.locations.includes(location.key)}
                onCheckedChange={() =>
                  set('locations', toggleLocation(draft.locations, location.key))
                }
                className="size-6 rounded-lg border-2 border-muted bg-foreground-strong data-[state=checked]:border-primary"
              />
              {location.label}
            </label>
          ))}
        </div>
      </fieldset>

      <ChoiceGroup
        legend="Tipo de jogador"
        name={`${id}-tier`}
        value={draft.playerTier}
        onChange={(value) => set('playerTier', value)}
        options={PLAYER_TIER_OPTIONS.map((tier) => ({
          ...tier,
          footer: '$'.repeat(tier.priceLevel),
        }))}
      />

      <ChoiceGroup
        legend="Arquétipos"
        name={`${id}-archetype`}
        value={draft.archetype}
        onChange={(value) => set('archetype', value)}
        options={ARCHETYPE_OPTIONS}
      />

      <div className="flex flex-col gap-1">
        <span id={`${id}-age`} className="text-base font-bold text-foreground-strong">
          Idade
        </span>
        <RangeRow min={AGE_MIN} max={AGE_MAX} maxLabel="99+">
          <Slider
            thumbLabels={['Idade mínima', 'Idade máxima']}
            min={AGE_MIN}
            max={AGE_MAX}
            step={1}
            minStepsBetweenThumbs={0}
            value={draft.ageRange}
            onValueChange={(value) => set('ageRange', [value[0] ?? AGE_MIN, value[1] ?? AGE_MAX])}
            className={sliderClassName}
          />
          <ThumbLabels
            values={draft.ageRange.map((age) => (age >= AGE_MAX ? '99+' : String(age)))}
            positions={draft.ageRange.map((age) => (age - AGE_MIN) / (AGE_MAX - AGE_MIN))}
          />
        </RangeRow>
      </div>

      <Separator />
      <h3 className="text-xl font-medium text-foreground-strong">Quantidade &amp; Duração</h3>

      <div className="flex flex-col gap-1">
        <span id={`${id}-quantity`} className="text-base font-bold text-foreground-strong">
          Quantidade de testes
        </span>
        <div className="flex flex-wrap items-end gap-6">
          <RangeRow min={QUANTITY_MIN} max={QUANTITY_MAX} maxLabel="1.000">
            <Slider
              thumbLabels={['Quantidade de testes']}
              min={QUANTITY_MIN}
              max={QUANTITY_MAX}
              step={1}
              disabled={draft.keepActive}
              value={[draft.quantity]}
              onValueChange={(value) => set('quantity', value[0] ?? QUANTITY_MIN)}
              className={sliderClassName}
            />
            {draft.keepActive ? null : (
              <ThumbLabels
                values={[draft.quantity.toLocaleString('pt-BR')]}
                positions={[(draft.quantity - QUANTITY_MIN) / (QUANTITY_MAX - QUANTITY_MIN)]}
              />
            )}
          </RangeRow>
          <span className="pb-1 text-base text-foreground-strong">Ou</span>
          <label
            htmlFor={`${id}-keep-active`}
            className="flex items-center gap-2 pb-0.5 text-base font-bold text-foreground-strong"
          >
            <Switch
              id={`${id}-keep-active`}
              checked={draft.keepActive}
              onCheckedChange={(checked) => set('keepActive', checked)}
              className={switchClassName}
            />
            Até desativar o teste*
          </label>
        </div>
      </div>

      <div className="flex max-w-[390px] flex-col gap-1">
        <label htmlFor={`${id}-duration`} className="text-base font-bold text-foreground-strong">
          Duração (dias)*
        </label>
        <Input
          id={`${id}-duration`}
          type="number"
          inputMode="numeric"
          min={1}
          max={365}
          value={Number.isNaN(draft.durationDays) ? '' : draft.durationDays}
          onChange={(event) => set('durationDays', event.target.valueAsNumber)}
          aria-invalid={!(draft.durationDays >= 1 && draft.durationDays <= 365)}
          className="h-[46px] rounded-xl border-field-border bg-field px-4 text-base text-foreground-strong md:text-base dark:bg-field"
        />
        <p className="text-xs text-muted">Entre 1 e 365 dias.</p>
      </div>

      <Separator />

      <BoostCard boosted={draft.boosted} onChange={(boosted) => set('boosted', boosted)} />
    </div>
  )
}

const sliderClassName =
  '[&_[data-slot=slider-range]]:bg-gradient-to-r [&_[data-slot=slider-range]]:from-cta-configure-from [&_[data-slot=slider-range]]:to-cta-configure-to [&_[data-slot=slider-thumb]]:size-[18px] [&_[data-slot=slider-thumb]]:border-[3px] [&_[data-slot=slider-track]]:h-4 [&_[data-slot=slider-track]]:bg-muted-foreground'

const switchClassName =
  'h-6 w-11 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-cta-configure-from data-[state=checked]:to-cta-configure-to [&>span]:size-5 [&>span]:bg-foreground-strong [&>span]:data-[state=checked]:translate-x-5 dark:[&>span]:data-[state=checked]:bg-foreground-strong'

function RangeRow({
  min,
  max,
  maxLabel,
  children,
}: {
  min: number
  max: number
  maxLabel: string
  children: ReactNode
}) {
  return (
    <div className="flex w-full max-w-[640px] items-end gap-2 text-base text-foreground-strong">
      <span className="pb-0.5">{min}</span>
      <div className="relative flex-1 pt-7 pb-1">{children}</div>
      <span className="pb-0.5" aria-hidden={maxLabel !== String(max)}>
        {maxLabel}
      </span>
    </div>
  )
}

/** Valor atual escrito sobre cada alça do slider, como no design. */
function ThumbLabels({ values, positions }: { values: string[]; positions: number[] }) {
  return (
    <>
      {values.map((value, index) => (
        <span
          key={index}
          aria-hidden
          className="pointer-events-none absolute top-0 -translate-x-1/2 text-base text-foreground-strong"
          style={{
            left: `calc(${(positions[index] ?? 0) * 100}% + ${9 - (positions[index] ?? 0) * 18}px)`,
          }}
        >
          {value}
        </span>
      ))}
    </>
  )
}

type ChoiceOption<K extends string> = {
  key: K
  label: string
  description: string
  icon: IconName
  iconClassName: string
  footer?: string
}

/** Cartões de escolha única (radio) — "Tipo de jogador" e "Arquétipos". */
function ChoiceGroup<K extends string>({
  legend,
  name,
  value,
  onChange,
  options,
}: {
  legend: string
  name: string
  value: K
  onChange: (value: K) => void
  options: ChoiceOption<K>[]
}) {
  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="mb-1 text-base font-bold text-foreground-strong">{legend}</legend>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
        {options.map((option) => {
          const checked = option.key === value
          return (
            <label
              key={option.key}
              className={cn(
                'relative flex min-h-[260px] cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 px-4 pt-8 pb-4 text-center transition-colors has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50',
                checked ? 'border-primary' : 'border-foreground hover:border-primary/60',
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.key}
                checked={checked}
                onChange={() => onChange(option.key)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  'absolute top-2 left-1.5 flex size-6 items-center justify-center rounded-full border-2 bg-foreground-strong',
                  checked ? 'border-primary' : 'border-muted',
                )}
              >
                {checked ? <span className="size-3 rounded-full bg-primary" /> : null}
              </span>
              <Icon name={option.icon} className={cn('size-12', option.iconClassName)} />
              <span className="text-base font-bold text-foreground-strong">{option.label}</span>
              <span className="text-base text-foreground-strong">{option.description}</span>
              {option.footer ? (
                <span className="text-base font-bold text-success">{option.footer}</span>
              ) : null}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

const BOOST_PERKS: { icon: IconName; text: string }[] = [
  { icon: 'star', text: 'Destaque visual na grade do teste com borda, selo e maior contraste' },
  { icon: 'tag', text: 'Tag adicional na Home para capturar mais interesse' },
  { icon: 'map-pin', text: 'Posicionamento prioritário para novos testers' },
  { icon: 'eye', text: 'Mais visibilidade, atrai mais jogadores variados' },
  { icon: 'coins', text: 'Maior incentivo direto aos jogadores' },
]

function BoostCard({
  boosted,
  onChange,
}: {
  boosted: boolean
  onChange: (value: boolean) => void
}) {
  const switchId = useId()

  return (
    <section className="flex flex-col gap-6 rounded-3xl border border-action-start bg-gradient-to-t from-action-start/80 via-action-start/10 to-transparent p-6">
      <div className="flex flex-col gap-2">
        <h3 className="flex items-center gap-1 text-2xl font-bold text-foreground-strong">
          <Icon name="rocket" className="size-6" />
          Impulsione seu teste
        </h3>
        <p className="text-xl font-medium text-foreground-strong">
          Destaque seu teste na plataforma e acelere a demonstrar valor com mais visibilidade,
          engajamento e respostas qualificadas.
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
        <BoostIllustration />

        <div className="flex min-w-0 flex-1 flex-col gap-6 text-foreground-strong">
          <p className="text-base">
            Ao <strong>impulsionar</strong> seu teste, ele ganha <strong>prioridade visual</strong>{' '}
            e <strong>estratégica</strong> dentro da OrbitPlay, aumentando a <strong>taxa</strong>{' '}
            de participação e a qualidade dos insights coletados.
          </p>
          <ul className="flex flex-col gap-2">
            {BOOST_PERKS.map((perk) => (
              <li key={perk.text} className="flex items-center gap-2 text-base">
                <Icon name={perk.icon} className="size-6 shrink-0 text-highlight" />
                {perk.text}
              </li>
            ))}
          </ul>
          <p className="text-xl font-medium">
            Acelere seu teste e colete insights de qualidade em menos tempo!
          </p>
          <div className="flex items-center justify-end gap-2 text-base font-bold">
            <label htmlFor={switchId}>Impulsionar teste!</label>
            <span>+ {formatCents(BOOST_PRICE_CENTS)}/teste</span>
            <Switch
              id={switchId}
              checked={boosted}
              onCheckedChange={onChange}
              className="h-6 w-11 data-[state=checked]:bg-highlight [&>span]:size-5 [&>span]:bg-foreground-strong [&>span]:data-[state=checked]:translate-x-5 dark:[&>span]:data-[state=checked]:bg-foreground-strong"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/** Cartão de jogo "Em destaque" do design, montado com a capa e o brilho exportados do Figma. */
function BoostIllustration() {
  return (
    <div aria-hidden className="relative h-[328px] w-full max-w-[511px] shrink-0">
      <img src={glowUrl} alt="" width={511} height={328} className="absolute inset-0 size-full" />
      <img
        src={arrowsUpUrl}
        alt=""
        width={96}
        height={96}
        className="absolute top-[41px] left-[68%] size-24"
      />
      <img
        src={arrowsUpUrl}
        alt=""
        width={64}
        height={64}
        className="absolute top-[104px] left-[18%] size-16 blur-[1px]"
      />
      <div className="absolute top-[28px] left-1/2 w-[258px] -translate-x-1/2">
        <span className="absolute -top-3.5 right-0 z-10 rounded-tl-[19px] rounded-br-[19px] bg-highlight/90 px-2.5 py-1 text-xs font-bold text-foreground-strong shadow-[0_0_8px] shadow-highlight">
          Em destaque
        </span>
        <div className="overflow-hidden rounded-tl-[14px] rounded-br-[14px] border border-primary/60 bg-background shadow-[0_0_10px] shadow-highlight">
          <img src={gameCoverUrl} alt="" className="h-[149px] w-full object-cover" />
          <div className="flex items-center justify-between px-2.5 py-1 text-sm font-bold text-foreground-strong">
            <span>Tênis Clash</span>
            <span className="text-xs">1.742</span>
          </div>
          <div className="grid grid-cols-3 gap-2 px-2.5 py-1 text-center text-[10px] text-foreground-strong">
            <span>
              <strong className="block text-sm">2</strong>Testes abertos
            </span>
            <span className="text-highlight">
              <strong className="block text-sm">R$ 2,75</strong>Prêmio máximo
            </span>
            <span>
              <strong className="block text-sm">R$ 122,00</strong>Prêmio restante
            </span>
          </div>
          <div className="bg-gradient-to-br from-action-start to-primary py-1 text-center text-sm font-bold text-foreground-strong">
            Testar!
          </div>
        </div>
      </div>
    </div>
  )
}
