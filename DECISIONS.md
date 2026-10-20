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

### Orçamento do Novo teste (Tela 09) — preço só no front

A API não tem preço nem cobrança (o contrato diz "preço e impulsionamento
estão deferidos"). Combinado com o solicitante: o "Resumo da compra" é
calculado em `src/features/tests/audience.ts` e "Pagar e finalizar!" só salva
o público (`PATCH /tests/{id}/audience`) e publica — **não cobra nada**.

- Preço base por modelo (centavos/teste): telemetria 69, exploração livre 59,
  A/B 39, A/B de imagens 19 — a tabela que já existia na tela de Tipo.
- Impulsionar: +15. Tipo de jogador: Experiente +10 (do design); Todos +10,
  Tester treinado +20, QA +35 e Casual 0 são **provisórios** (o design só
  indica a ordem por `$`). Trocar quando a precificação real existir.
- Formas de pagamento aparecem só como informação.
- Idade começa em 18 (DECISIONS.md da API §1.4), não em 16 como no Figma;
  "99+" é enviado como 120 (teto da API).

### Relatório do teste (Tela 11) — o que o design pede e a API ainda não tem

Rota `/studio/games/$gameId/tests/$testId` (abas por `?tab=`). Cada bloco
mostra o próprio estado (`processing`/`failed`/`unavailable`) sem derrubar
os demais. Sem dado fixo:

- **IA deferida** (DECISIONS.md da API, M10): "Nota média da IA", "Fator
  diversão", "Bugs e Glitches", "Qualidade do teste IA", descobertas e
  sugestões do plug-in mostram "—" com a explicação no `title`; os Insights
  de IA mostram o estado "ainda não disponíveis". Os botões de exportar
  insights e o de filtros do cabeçalho ficam desabilitados.
- **Telemetria** só aparece com o Orbit Plug-in na build; sem ele, o cartão
  explica como integrar.
- **Arquétipo / tipo de jogador** usam o vocabulário do público da Tela 09
  (`ARCHETYPE_OPTIONS`/`PLAYER_TIER_OPTIONS`), não o "Hardcore/Testador/
  Desenvolvedor" do Figma; cada perfil tem **uma** cor nas tags e nos donuts
  (o Figma usa cores diferentes para o mesmo arquétipo na tabela e no donut).
- **Tabela de sessões**: a API pagina por cursor — dá para voltar a páginas
  já vistas e avançar uma por vez; a ordenação reordena só a página atual.
  "Mostrar teste" (Tela 12) fica desabilitado até a tela de sessão existir.
- Badges do cabeçalho: modelo do teste (catálogo `/test-models`) e status;
  a descrição é a do modelo.

## Pendências — só verificáveis quando a API subir

### Home do estúdio (Tela 02)

A Home usa os KPIs de `GET /studio/dashboard`, sem recalcular totais a partir
dos cinco jogos em destaque. O gráfico apresenta somente os dias que o backend
retorna, na janela de 30 dias; um bloco sem sessões tem estado vazio próprio.

- O resumo de telemetria é de um **teste recente selecionado**, via relatório
  já existente (`GET /tests/{id}/report`, bloco `telemetry`). Não é um agregado
  do estúdio. Sem build integrada, o cartão explica a ausência de telemetria;
  descobertas de IA nulas aparecem como indisponíveis, sem inventar contagens.
- O comparativo usa somente os jogos da própria organização, conforme escolha
  do produto. `GET /studio/benchmark` retorna o histórico completo por jogo,
  paginado por cursor e com os jogos mais recentes primeiro. A conclusão segue
  a definição da API (sessões concluídas / participações); sem participações
  aparece como indisponível, diferente de zero. Jogadores únicos e nota média
  acompanham cada jogo. O bloco permite carregar mais jogos e abrir seus detalhes.
- Criar jogo, criar teste e publicar teste invalidam também o cache da Home.
  O botão de atualização consulta os blocos visíveis novamente.
- O indicador de presença do plug-in, inclusive nos testes recentes, vem da
  validação `plugin_manifest` da build, não do modelo escolhido.

### Home do jogador (Tela 13)

- Os três blocos antes provisórios usam `GET /player/home`: continuidade do
  teste, até quatro participações recentes e recompensas validadas em sete
  dias. A tela não apresenta saldo, saque ou prazo de pagamento, pois a
  carteira ainda não existe no backend.
- Uma participação encerrada abre o resultado; as demais retomam o tutorial
  do teste, que recupera a participação existente antes de permitir uma nova.

### Detalhes do jogo do estúdio (Tela 05)

`/studio/games/$gameId` é uma rota index, para não transformar chat e relatórios
em conteúdo aninhado da página. O cabeçalho usa `GET /games/{id}/summary`;
as abas de testes usam `GET /games/{id}/tests?tab=active|all` com paginação
por cursor. A criação/publicação invalida também o resumo do jogo.

- Indicadores mostram jogadores, testes ativos, sessões válidas e nota média:
  são os agregados disponíveis no contrato real; não há prêmio máximo no resumo.
- Avaliações, publicações e especificações reutilizam os mesmos componentes
  e endpoints da área do jogador, após o resumo confirmar o acesso ao jogo.
- Conquistas por jogo não existem no contrato (as conquistas atuais são globais
  e pertencem à conta do jogador). A aba explica a indisponibilidade, sem chamar
  endpoints de jogador com credenciais de estúdio.
- Configurar Orbit Plug-in permanece desabilitado: não há contrato de configuração.
- A tabela apresenta o término **previsto** (`expiresAt`); a API não informa a
  data de encerramento efetivo. A presença do plug-in vem da validação
  `plugin_manifest` da build, nunca apenas do modelo do teste.

Não contornar; entram quando houver API.

7. **Login real** leva estúdio → `/studio` e jogador → `/player`.
8. **Lista de jogos** exibe dados reais, com estados de carregando e vazio.
9. **Refresh de token** em resposta 401 (uma tentativa, depois limpa sessão →
   `/login`). Lógica pronta em `src/lib/api-client.ts`; falta a API para exercê-la.

O E2E deste passo cobre apenas os itens 1–3 (lógica de cliente).

## Cadastro completo de novo jogo (Tela 04)

- **O modal "Novo jogo" virou a página `/studio/games/new`** (wizard de 3 etapas
  do Figma — Informações → Mídias → Permissões — mais a tela "Jogo criado com
  sucesso!"). `NewGameDialog` foi removido; o botão da lista agora é um link.
- **O jogo só é criado no fim.** As etapas guardam o rascunho em memória e
  `Finalizar` faz, em ordem: `POST /games` → envio de capa/logo/ícone (URL
  assinada + PUT + confirmação) → `PUT /games/{id}/access`. O jogo é criado uma
  única vez: se um envio posterior falhar, o botão vira "Tentar de novo" e só
  refaz o que faltou; os campos de informação ficam travados (não há `PATCH`
  no wizard — ajustes vão pela página do jogo). `Salvar` roda o mesmo fluxo e
  leva à página do jogo, sem a tela de confirmação.
- **Quem cria o jogo entra na matriz com todas as permissões.** Grupos e
  membros vêm de `GET /orgs/groups` e `GET /orgs/members` (só papéis de estúdio,
  não desativados). A matriz é só gravada: nenhuma tela do front consulta essas
  permissões ainda (a API também não as aplica — ver `DECISIONS.md` da API).
- **Catálogos no front.** Sugestões de gênero/sub-gênero, engines, idiomas e os
  rótulos de plataforma, modo, estágio e classificação ficam em
  `features/games/new-game.ts`; a API só valida os enums fechados. Os campos de
  texto da API aceitam valores fora das sugestões (Enter adiciona a tag digitada).
- **Divergência de copy do Figma:** o título da matriz de permissões no design
  repete "Gatilhos e eventos de telemetria" (resto de outro frame); foi
  omitido. O header da etapa é "Responsáveis e permissões".
- **Extraídos para `components/common`** por serem reutilizáveis: `WizardField`,
  `TagPicker`, `MultiSelect` e `WizardFooter` (este saiu do wizard de teste, que
  agora o importa). O PUT para o storage virou `lib/storage-upload.ts`,
  compartilhado entre o envio de build e o de imagens do jogo.
