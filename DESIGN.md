# OrbitPlay — Design tokens (PLACEHOLDER)

> ⚠️ **Provisório.** O handoff de design definitivo (`DESIGN.md` "oficial") ainda
> não foi entregue. Este arquivo é um **placeholder dark-first** criado no setup
> para destravar o tema, combinado com o solicitante. Substitua os valores pelos
> reais quando o handoff chegar. Valores incertos estão marcados com `TODO`.
>
> (Vou tentar colocar com mais detalhes)
>
> Ver `DECISIONS.md` › "Design tokens".

## Regras (valem já)

- **Tema dark-first.** O protótipo inteiro é escuro; o dark é o estado padrão em
  `:root`, sem depender de classe.
- **Nunca cor literal em componente.** Em tela use sempre token **semântico**
  (`bg-surface`, `text-muted`, `border-border`, `bg-primary`…), nunca um token de
  **paleta** (`--n-dark`, `--g-sapphire`) direto.
- A paleta crua (camada `--n-*` / `--g-*`) só é referenciada aqui e no
  mapeamento semântico dentro de `globals.css`. Telas não a tocam.

## Camadas

1. **Paleta** (`--n-`* neutros, `--g-*` marca) — cores cruas. Uso interno.
2. **Semântica** (`--surface`, `--muted`, `--primary`…) — o que as telas usam.
3. **Mapa Tailwind** (`@theme inline`) — expõe a semântica como utilitários
   (`bg-surface`, `text-muted`…). Também alimenta os componentes shadcn, que
   consomem `--background`, `--foreground`, `--border`, `--ring` etc.

## Snippet para `src/styles/globals.css`

O `src/styles/globals.css` já contém exatamente este bloco. Ao receber o handoff
real, edite lá (não duplique o CSS aqui).

```css
:root {
  color-scheme: dark;

  /* ---- Paleta: neutros (n) ---- */
  --n-dark: #080321;
  --n-900: #0f1115;
  --n-850: #141720;
  --n-800: #1a1e28;
  --n-700: #232834;
  --n-600: #2f3542;
  --n-400: #6b7280;
  --n-300: #8b93a7;
  --n-100: #e6e9f0;
  --n-50: #f5f7fa;
  --white: #ffffff;

  /* ---- Paleta: marca / status (g) ---- */
  --g-sapphire: #4f7cff; /* TODO cor de marca definitiva */
  --g-sapphire-600: #3d63e6; /* TODO */
  --g-violet: #8b5cf6; /* TODO acento secundário */
  --success: #22c55e; /* TODO */
  --warning: #f59e0b; /* TODO */
  --danger: #ef4444; /* TODO */
  --info: #38bdf8; /* TODO */

  /* ---- Semântica ---- */
  --background: var(--n-dark);
  --surface: var(--n-850);
  --surface-raised: var(--n-800);
  --foreground: var(--n-50);
  --muted: var(--n-300);
  --muted-foreground: var(--n-400);
  --border: var(--n-700);
  --input: var(--n-700);
  --ring: var(--g-sapphire);

  --primary: var(--g-sapphire);
  --primary-foreground: var(--white);
  --secondary: var(--n-700);
  --secondary-foreground: var(--n-50);
  --accent: var(--n-800);
  --accent-foreground: var(--n-50);
  --destructive: var(--danger);
  --destructive-foreground: var(--white);

  --card: var(--n-850);
  --card-foreground: var(--n-50);
  --popover: var(--n-800);
  --popover-foreground: var(--n-50);

  --radius: 0.625rem;
}
```

## Tokens semânticos → utilitário Tailwind

| Token semântico        | Utilitário              | Uso típico             |
| ---------------------- | ----------------------- | ---------------------- |
| `--background`         | `bg-background`         | fundo da app           |
| `--surface`            | `bg-surface`            | cartões, painéis       |
| `--surface-raised`     | `bg-surface-raised`     | popovers, menus        |
| `--foreground`         | `text-foreground`       | texto principal        |
| `--muted`              | `text-muted`            | texto secundário       |
| `--muted-foreground`   | `text-muted-foreground` | legendas, placeholders |
| `--border` / `--input` | `border-border`         | bordas, divisores      |
| `--ring`               | `ring-ring`             | foco                   |
| `--primary`            | `bg-primary`            | ação primária          |
| `--destructive`        | `bg-destructive`        | ação destrutiva        |

## Ícones

- Setup usa `lucide-react`, sempre através do wrapper `@/components/icon`
  (`<Icon name="..." />`) — **nunca** importe ícone direto na tela.
- O handoff pede **MingCute em SVG**. A troca acontece só no wrapper quando as
  telas forem implementadas; as telas não mudam. Ver `DECISIONS.md`.
