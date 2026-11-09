import rays from '@/assets/landing/tester-rays.png'
import preview from '@/assets/landing/desktop-preview.png'
import { Logo } from '@/components/common/Logo'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { getDesktopDownloads, isDesktopApp } from '@/lib/desktop'
import { PublicHeader } from './PublicHeader'
import './public-pages.css'

export function TesterIntroduction() {
  // Só o instalador do sistema de quem está acessando (o menu do usuário lista todos).
  const download = getDesktopDownloads().find((d) => d.current) ?? null
  const desktop = isDesktopApp()
  return (
    <div className="public-page tester-page">
      <a className="public-skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      <PublicHeader />
      <main id="conteudo" className="tester-introduction">
        <div className="tester-copy">
          <Logo className="h-auto w-[262px]" />
          <h1>Seja um testador de jogos e participe da criação de novas experiências!</h1>
          <ul>
            <li>Descubra jogos e versões de teste da plataforma.</li>
            <li>Encontre os testes disponíveis para o seu perfil.</li>
            <li>Acompanhe suas participações e conquistas.</li>
            <li>Aprenda a testar com o tutorial de cada sessão.</li>
            <li>Compartilhe seu feedback e ajude os estúdios.</li>
          </ul>
          <div className="tester-download">
            {download ? (
              <Button asChild className="public-button public-button-cool tester-install">
                <a href={download.url} target="_blank" rel="noreferrer">
                  <span>
                    Instale o <strong>Orbit</strong>Play
                  </span>
                  <Icon
                    name={download.label === 'Windows' ? 'windows' : 'download'}
                    className="size-8"
                  />
                </a>
              </Button>
            ) : (
              <Button
                disabled
                className="public-button public-button-cool tester-install"
                aria-describedby="download-status"
              >
                <span>
                  {desktop ? (
                    'OrbitPlay instalado'
                  ) : (
                    <>
                      Instale o <strong>Orbit</strong>Play
                    </>
                  )}
                </span>
                <Icon name="windows" className="size-8" />
              </Button>
            )}
            <p id="download-status" className="tester-download-status">
              {download
                ? `Disponível para ${download.label}.`
                : desktop
                  ? 'Você já está usando o aplicativo desktop.'
                  : 'Instalador ainda não disponível para este sistema.'}
            </p>
          </div>
        </div>
        <div
          className="tester-art"
          role="img"
          aria-label="OrbitPlay em um computador e notebook, cercados de moedas de recompensa"
        >
          <img src={rays} className="tester-rays" alt="" />
          <img src={preview} className="tester-desktop-preview" alt="" fetchPriority="high" />
        </div>
      </main>
    </div>
  )
}
