# DECISIONS

Divergências desta instrução de setup e pendências, com o motivo. Curto por
design.

## Divergências

### Versões de ferramentas (Node/pnpm) e template Vite

- A instrução pede **Node 22 LTS**; o ambiente de setup rodava **Node 25.1** e
  **pnpm 10.20**. Tudo (install, lint, typecheck, build, test, e2e) passou.
  `.nvmrc` fixa **22** como alvo do projeto.
- O template `create-vite react-ts` hoje entrega **React 19.2, Vite 8, TypeScript
  6.0** e usa **oxlint** por padrão. Mantivemos as versões do template (stack
  estável atual) mas trocamos oxlint por **ESLint (flat config) + Prettier**, como
  a instrução exige explicitamente (§9).

### TypeScript 6.0: `baseUrl` removido

TS 6.0 deprecou `baseUrl`. Os `paths` (`@/*`) resolvem relativo ao `tsconfig`,
então `baseUrl` foi omitido para não quebrar o `typecheck`.

### `openapi-typescript` × TypeScript 6

`openapi-typescript@7` declara peer `typescript@^5`. Com TS 6 há apenas um
**warning** de peer; `pnpm gen:api` gera os tipos normalmente.

### `remember` no contrato provisório

No `openapi.json`, `remember` tem `default`, e o `openapi-typescript` gera a
propriedade como **obrigatória**. Por isso o form de login inclui um checkbox
"Lembrar login" (também exigido pela Tela 01). A persistência de fato virá do
cookie `httpOnly` da API — `TODO(remember-me)`.

### Rotas `/studio` e `/player`: `studio.tsx` em vez de `_studio.tsx`

A instrução nomeia os layouts como `_studio.tsx` / `_player.tsx`. No TanStack
Router o prefixo `_` cria rota **pathless** (sem segmento na URL), o que
**quebraria** os critérios de aceite 1–3, que exigem as URLs `/studio` e
`/player`. Usamos `studio.tsx` + `studio/…` (e `player.tsx` + `player/…`), que
preservam a intenção (layout + guarda de papel) **e** produzem as URLs corretas.

### Dependências não listadas

- **`radix-ui` / `sonner`**: instaladas pela CLI oficial do shadcn/ui ao adicionar
  os componentes pedidos — são dependências desses componentes.
- **`@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`,
  `eslint-plugin-react-refresh`, `eslint-config-prettier`, `globals`**: necessárias
  para a flat config do ESLint exigida em §9.
- **`next-themes`**: a CLI do shadcn a puxou junto do `sonner`. Como o app é
  dark-first e não troca de tema, **removemos** `next-themes` e fixamos o toaster
  em `theme="dark"`.
- **`tw-animate-css`**: **não** instalada. As classes de animação dos componentes
  shadcn (`animate-in`, etc.) ficam inertes no Tailwind v4 sem erro; sem impacto
  funcional no esqueleto.

### shadcn/ui escreveu em `./@/…`

A CLI leu os `paths` só do `tsconfig.json` (que era solution-style, com os paths
em `tsconfig.app.json`) e criou uma pasta literal `@/`. Movemos os componentes
para `src/components/` e adicionamos `paths` ao `tsconfig.json` para futuros
`shadcn add`.

### `routeTree.gen.ts` versionado

Gerado pelo plugin do TanStack Router no `dev`/`build`. Foi **versionado** para
que `typecheck`/CI funcionem sem um `vite` rodando antes. Ignorado pelo ESLint e
Prettier; nunca editar à mão.

## Placeholders combinados

### Design tokens (`DESIGN.md`)

O `DESIGN.md` "oficial" não foi entregue. Criamos um **placeholder dark-first**
(combinado), com valores incertos marcados `TODO`. Substituir ao receber o
handoff — editar `src/styles/globals.css`.

### Contrato provisório (`src/api-types/openapi.json`)

Feito à mão a partir dos 7 endpoints da instrução, **ainda não alinhado** com quem
constrói a API. É provisório: substituir pelo `openapi.json` real
(`pnpm gen:api <url|path>`) assim que a API existir. Endpoints cobertos:

```
POST /api/auth/login   POST /api/auth/refresh
GET  /api/games        GET  /api/games/:id
GET  /api/test-models  GET  /api/opportunities
GET  /api/tests/:id/report
```

Estendido para a Home do Jogador (`/player`) com mais 7 endpoints, no mesmo
espírito provisório — hand-authored a partir do mockup, sem API real por
trás:

```
GET /api/wallet                GET /api/player/profile-stats
GET /api/tests/continue        GET /api/tests/mine
GET /api/games/highlighted     GET /api/earnings/summary
GET /api/missions/ranking
```

## Pendências — só verificáveis quando a API subir

Não contornar; entram quando houver API.

7. **Login real** leva estúdio → `/studio` e jogador → `/player`.
8. **Lista de jogos** exibe dados reais, com estados de carregando e vazio.
9. **Refresh de token** em resposta 401 (uma tentativa, depois limpa sessão →
   `/login`). Lógica pronta em `src/lib/api-client.ts`; falta a API para exercê-la.

O E2E deste passo cobre apenas os itens 1–3 (lógica de cliente).
