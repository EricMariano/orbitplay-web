# OrbitPlay Web

Front-end do OrbitPlay: aplicação React (Vite) que navega entre as áreas de
**Estúdio** e **Jogador** com rotas protegidas por papel. Consome a API real em
`localhost:3000` — **não há mocks**. Enquanto a API não sobe, as telas são
placeholders e os hooks de dados ficam escritos, mas sem resposta (esperado).

> Este é o **esqueleto de setup**, não a implementação das telas. Ver a instrução
> de setup e o `DECISIONS.md` para o escopo e as divergências.

## Pré-requisitos

- **Node 22 LTS** (ver `.nvmrc`). Use `nvm use`.
- **pnpm 10** — `corepack enable && corepack prepare pnpm@latest --activate`.
- Git.

> Divergência conhecida: o ambiente de setup rodou **Node 25** e **pnpm 10.20**.
> Ver `DECISIONS.md`.

## Começando

```bash
pnpm install
pnpm gen:api      # gera src/api-types/generated.ts a partir do openapi.json versionado
pnpm dev          # http://localhost:5173
```

## Scripts

| Script           | O que faz                                                      |
| ---------------- | -------------------------------------------------------------- |
| `pnpm dev`       | Dev server em `:5173`, com proxy de `/api` → `localhost:3000`. |
| `pnpm build`     | `tsc -b` + build de produção (`dist/`).                        |
| `pnpm preview`   | Serve o build de produção.                                     |
| `pnpm lint`      | ESLint (flat config).                                          |
| `pnpm format`    | Prettier `--write`.                                            |
| `pnpm typecheck` | `tsc -b --noEmit`.                                             |
| `pnpm test`      | Vitest (unit/componente).                                      |
| `pnpm test:e2e`  | Playwright (smoke — itens 1–3).                                |
| `pnpm gen:api`   | Regera os tipos da API a partir do contrato OpenAPI.           |

## Apontando para a API

- Em **dev**, `VITE_API_URL=/api` (ver `.env.example`) e o Vite faz **proxy** de
  `/api` para `http://localhost:3000`. Mesma origem ⇒ sem CORS e o cookie de
  sessão `httpOnly` é enviado. Configuração em `vite.config.ts`.
- A API vive em **repositório separado**. Este repo só precisa que ela esteja
  rodando em `localhost:3000`.

### Contrato da API (tipos gerados)

Nenhum tipo de resposta da API é escrito à mão.

```bash
# regenerar a partir do contrato já versionado
pnpm gen:api

# baixar o contrato mais novo da API rodando, versionar e regerar
pnpm gen:api http://localhost:3000/openapi.json

# ou copiar de um caminho local
pnpm gen:api ../orbitplay-api/openapi.json
```

`src/api-types/openapi.json` e `src/api-types/generated.ts` são **versionados**
(build funciona sem a API no ar; mudança de contrato aparece no diff).
`generated.ts` **nunca** é editado à mão — corrija a API/contrato.

> ⚠️ O `openapi.json` atual é um **contrato provisório** feito à mão a partir dos
> endpoints da instrução, **ainda não alinhado** com a API. Ver `DECISIONS.md`.

## Estrutura

```
src/
├─ main.tsx
├─ app/                 providers, query-client, router
├─ routes/              TanStack Router (file-based) + routeTree.gen.ts (gerado)
│  ├─ __root.tsx
│  ├─ index.tsx         redireciona conforme papel
│  ├─ login.tsx
│  ├─ studio.tsx        layout + guarda de papel  (URL /studio)
│  ├─ studio/           index, games/
│  ├─ player.tsx        layout + guarda de papel  (URL /player)
│  └─ player/index.tsx
├─ features/            auth · games · tests · reports · opportunities
│  └─ <dominio>/api/    hooks de dados + chaves de query centralizadas
├─ components/
│  ├─ ui/               shadcn — não editar à mão sem motivo
│  ├─ common/           QueryBoundary, EmptyState, ErrorState, PageHeader, RoleGate, AppShell
│  └─ icon.tsx          wrapper único de ícones (troca p/ MingCute centralizada)
├─ lib/                 api-client, auth (store Zustand), utils (cn)
├─ api-types/           openapi.json (contrato) + generated.ts (tipos) — versionados
└─ styles/globals.css   tokens de tema (ver DESIGN.md)

e2e/                    Playwright
```

## Autenticação

- Sessão em **Zustand** (`src/lib/auth.ts`): `user`, `role`, `accessToken`, `status`.
- **Access token só em memória** — nunca `localStorage`/`sessionStorage`. "Lembrar
  login" virá de cookie `httpOnly` da API; o ponto de extensão está marcado com
  `TODO(remember-me)`.
- **A aba do login não define o papel** (RN-03). O papel usado para rotear vem do
  backend (`user.role`).
- Guardas em `studio.tsx` / `player.tsx` (`beforeLoad`): sem sessão → `/login`;
  papel incorreto → área correta.

### Atalho de desenvolvimento

Em **dev**, a tela de login mostra botões "Entrar como estúdio/jogador" que
semeiam uma sessão fake no store (sem API), para permitir navegar e rodar o smoke
E2E. **Nunca** aparecem em produção. Ver `DECISIONS.md`.

## Tema

Dark-first, via **tokens semânticos** (`bg-surface`, `text-muted`, …). Nunca use
cor literal em componente. Tokens e regras em **`DESIGN.md`** (placeholder até o
handoff definitivo).

## Fluxo de Git

- **Branch por feature**, criada a partir de `development`, no formato
  `feat/<descricao>` (ex.: `feat/login-studio`). Nunca commite direto em
  `development` ou `main`.
- **Commits padronizados** (Conventional Commits): `feat: ...`, `fix: ...`,
  `refactor: ...`, etc. O hook `commit-msg` valida.
- **Abra o PR sempre para `development`, nunca para `main`.** A `main` recebe
  código apenas via merge de `development`.

## Qualidade

- ESLint (flat) + Prettier.
- Husky: `pre-commit` → lint-staged; `pre-push` → typecheck; `commit-msg` → commitlint (Conventional Commits).
- **CI (GitHub Actions)** em `.github/workflows/ci.yml`: roda em PR e push para
  `development`/`main` — lint, typecheck, testes e build, mais o smoke E2E do
  Playwright. Mesmo conjunto que `pnpm lint && pnpm typecheck && pnpm test`.
