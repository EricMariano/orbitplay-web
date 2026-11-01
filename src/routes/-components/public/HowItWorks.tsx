import { Link } from '@tanstack/react-router'
import rays from '@/assets/landing/how-it-works-rays.png'
import player from '@/assets/landing/tester-playing.png'
import racing from '@/assets/landing/racing-screen.png'
import adventure from '@/assets/landing/adventure-screen.png'
import coin from '@/assets/landing/reward-coin.png'
import smallCoin from '@/assets/landing/reward-coin-small.png'
import { Icon, type IconName } from '@/components/icon'
import { Button } from '@/components/ui/button'

const benefits: { icon: IconName; title: string }[] = [
  { icon: 'person-standing', title: 'Jogue e explore' },
  { icon: 'laugh', title: 'Divirta-se e avalie' },
  { icon: 'piggy-bank', title: 'Ganhe recompensas' },
]

const features: { icon: IconName; text: string }[] = [
  { icon: 'tv-play', text: 'Conheça trailers e prévias dos jogos' },
  { icon: 'gamepad', text: 'Escolha o jogo que quer testar' },
  { icon: 'circle-dollar-sign', text: 'Confira a recompensa informada em cada teste' },
  { icon: 'presentation', text: 'Acompanhe suas participações e conquistas' },
  { icon: 'panels-top-left', text: 'Confira as plataformas compatíveis com cada jogo' },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="how-it-works" aria-labelledby="how-title">
      <h2 id="how-title" className="public-section-title">
        Como funciona
      </h2>
      <p className="public-section-subtitle">Transforme seu tempo em novas experiências.</p>
      <div
        className="public-how-scene"
        role="img"
        aria-label="Jogadora testando jogos, com telas de corrida e aventura e moedas de recompensa"
      >
        <img src={rays} className="how-rays" alt="" loading="lazy" />
        <img src={racing} className="how-racing" alt="" loading="lazy" />
        <img src={adventure} className="how-adventure" alt="" loading="lazy" />
        <img src={player} className="how-player" alt="" loading="lazy" />
        <img src={coin} className="how-coin" alt="" loading="lazy" />
        <img src={smallCoin} className="how-coin-small" alt="" loading="lazy" />
      </div>
      <p className="public-how-description">
        Explore jogos e versões de teste, compartilhe sua experiência e ajude a criar jogos
        melhores. Você se diverte, dá feedback e acompanha suas participações.
      </p>
      <div id="recursos" className="public-benefits">
        {benefits.map(({ icon, title }) => (
          <div key={title}>
            <Icon name={icon} className="public-benefit-icon" />
            <h3>{title}</h3>
          </div>
        ))}
      </div>
      <div className="public-features">
        {features.map(({ icon, text }) => (
          <div key={icon}>
            <Icon name={icon} className="public-feature-icon" />
            <p>{text}</p>
          </div>
        ))}
      </div>
      <div className="public-centered-cta public-final-cta">
        <Button asChild className="public-button public-button-warm public-button-wide">
          <Link to="/signup" search={{ account: 'player' }}>
            Comece a jogar agora!
          </Link>
        </Button>
        <p>Inscreva-se gratuitamente!</p>
        <small>
          Recompensas conforme cada teste. Pagamentos e saques ainda não estão disponíveis.
        </small>
      </div>
    </section>
  )
}
