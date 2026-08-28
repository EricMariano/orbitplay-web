# AGENTS.md

Instruções para agentes de código que trabalham neste repositório (front-end do
OrbitPlay). Leia antes de editar. Complementa `README.md`, `DESIGN.md` e
`DECISIONS.md` — não os duplique.

## Princípios

1. **Mantenha sempre a estrutura padrão.** Cada coisa tem um lugar (ver abaixo).
   Não invente pastas ou convenções novas; siga o que já existe.
2. **Evite arquivos e conteúdo duplicado.** Antes de criar algo, procure se já
   existe. Reutilize os componentes comuns, hooks e utilitários. Se precisar do
   mesmo trecho em dois lugares, extraia para um único módulo e importe.
3. **Não escreva o que já é gerado ou documentado.** Tipos da API, árvore de
   rotas e tokens de tema têm fonte única — edite a fonte, não a cópia.
4. **Na dúvida sobre estrutura, contrato de dados ou autenticação, pergunte.**
   Não improvise.

## Estrutura padrão (não desviar)

```
src/
├─ app/                 providers, query-client, router  (config única de cada)
├─ routes/              TanStack Router file-based + routeTree.gen.ts (GERADO)
├─ features/<dominio>/  auth · games · tests · reports · opportunities
│  └─ api/              hooks de dados + chaves de query centralizadas
├─ components/
│  ├─ ui/               shadcn — NÃO editar à mão sem motivo forte
│  ├─ common/           QueryBoundary, EmptyState, ErrorState, PageHeader, RoleGate, AppShell
│  └─ icon.tsx          wrapper único de ícones
├─ lib/                 api-client, auth (store), utils (cn)
├─ api-types/           openapi.json (contrato) + generated.ts (GERADO)
└─ styles/globals.css   tokens de tema
```

- Novo domínio → `features/<dominio>/api/` com hook + `*-keys.ts`. Não crie um
  domínio novo se um existente já cobre o caso.
- Novo componente reutilizável → `components/common/`. Específico de uma tela →
  junto da rota que o usa. Nunca duplique em ambos.

## Regras que já valem (não quebrar)

### Dados
- **Todo acesso a dado é um hook** em `features/<dominio>/api/`. **Nunca** faça
  `fetch` dentro de componente. Use sempre o `api` de `lib/api-client.ts`.
- **Chaves de query centralizadas** por feature (`gamesKeys.list()`,
  `gamesKeys.detail(id)`). Não escreva arrays de chave soltos no componente.
- **Nenhum tipo de resposta da API escrito à mão.** Importe de `@/api-types`
  (aliases sobre `generated.ts`). Contrato errado → conserte `openapi.json` e rode
  `pnpm gen:api`. **Nunca** edite `generated.ts` nem `routeTree.gen.ts`.
- **Sem mocks.** As telas consomem a API real. Enquanto ela não sobe, placeholder
  + `QueryBoundary` bastam — não crie dado fixo nem camada falsa de dados.

### Estados de tela
- Use **`<QueryBoundary>`** para carregando/erro/vazio/pronto. Não reimplemente
  esses quatro estados em cada tela.
- Ação sem permissão: **`<RoleGate>`** (oculta ou desabilita), nunca quebrada.

### Tema e ícones
- **Só tokens semânticos** em componente (`bg-surface`, `text-muted`, …). Nunca
  cor literal, nunca token de paleta (`--n-*`, `--g-*`) direto na tela. Tokens em
  `DESIGN.md` / `globals.css`.
- **Ícones só via `@/components/icon`** (`<Icon name="..." />`). Nunca importe de
  `lucide-react` (ou outra lib) direto na tela.

### Autenticação
- **Access token só em memória** (store Zustand). Nunca `localStorage`/
  `sessionStorage` para dado sensível. Persistência de login vem de cookie
  `httpOnly` da API — respeite o `TODO(remember-me)`.
- **O papel vem do backend** (`user.role`), não da aba escolhida no login (RN-03).
- Guarda de rota em `beforeLoad` (`studio.tsx`, `player.tsx`): sem sessão →
  `/login`; papel errado → área correta.

## Antes de terminar

Rode e deixe passando:

```bash
pnpm lint && pnpm typecheck && pnpm test
```

`pnpm test:e2e` quando mexer em rota, guarda ou fluxo de sessão.

## Dependências e commits

- **Não adicione dependência** fora do que já existe sem justificar em
  `DECISIONS.md`. Prefira o que já está instalado.
- **Conventional Commits** (o hook `commit-msg` valida). Não commite segredo,
  `.env.local` nem saída de build.
- Registrou uma divergência desta estrutura? Anote o motivo em `DECISIONS.md`.
