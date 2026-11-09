import { Link } from '@tanstack/react-router'
import character from '@/assets/landing/hero-character.png'
import { Button } from '@/components/ui/button'
import { useAuthStore, isStudioRole } from '@/lib/auth'
import { AvailableGames } from './AvailableGames'
import { HowItWorks } from './HowItWorks'
import { PublicHeader } from './PublicHeader'
import './public-pages.css'

export function LandingPage() {
  const role = useAuthStore((state) => state.role)
  return (
    <div className="public-page landing-page">
      <a className="public-skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      <img className="landing-character" src={character} alt="" fetchPriority="high" />
      <PublicHeader />
      <main id="conteudo" className="public-container">
        <section className="landing-hero" aria-labelledby="landing-title">
          <div className="landing-hero-copy">
            <h1 id="landing-title">
              Teste jogos.
              <br />
              Ganhe dinheiro.
            </h1>
            <p>
              A plataforma que conecta estúdios de games a jogadores reais para playtests
              inteligentes.
            </p>
            <div className="landing-hero-actions">
              <Button asChild className="public-button public-button-cool">
                <Link to="/tester">Quero testar!</Link>
              </Button>
              <Button asChild variant="outline" className="public-button public-button-outline">
                {role && isStudioRole(role) ? (
                  <Link to="/studio">Sou um estúdio</Link>
                ) : (
                  <Link to="/signup" search={{ account: 'studio' }}>
                    Sou um estúdio
                  </Link>
                )}
              </Button>
            </div>
          </div>
        </section>
        <AvailableGames />
        <div className="public-centered-cta">
          <Button asChild className="public-button public-button-warm public-button-wide">
            <Link to="/signup" search={{ account: 'player' }}>
              Cadastre-se e jogue agora!
            </Link>
          </Button>
        </div>
        <HowItWorks />
      </main>
    </div>
  )
}
