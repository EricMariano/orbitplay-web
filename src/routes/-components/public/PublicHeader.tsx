import { Link } from '@tanstack/react-router'
import { Logo } from '@/components/common/Logo'
import { Button } from '@/components/ui/button'
import { homeRouteForRole, useAuthStore } from '@/lib/auth'

export function PublicHeader() {
  const role = useAuthStore((state) => state.role)
  return (
    <header className="public-header">
      <Link to="/" aria-label="OrbitPlay — início">
        <Logo className="h-auto w-[289px]" />
      </Link>
      <nav aria-label="Navegação principal">
        <Link to="/" hash="jogos">
          Jogos
        </Link>
        <Link to="/tester">Testes</Link>
        <Link to="/" hash="como-funciona">
          Como funciona
        </Link>
        <Link to="/" hash="recursos">
          Recursos
        </Link>
        <Button asChild className="public-button public-button-warm">
          {role ? (
            <Link to={homeRouteForRole(role)}>Minha conta</Link>
          ) : (
            <Link to="/signup" search={{ account: 'player' }}>
              Cadastre-se
            </Link>
          )}
        </Button>
      </nav>
    </header>
  )
}
