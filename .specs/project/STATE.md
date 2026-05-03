# State

**Updated:** 2026-05-03 (M0 design.md gerado via Context7 MCP — pronto pra fase Tasks)

## Decisions

- **2026-05-02 · Stack full-stack Next.js 15 (App Router):** Substitui Vite + Fastify + NestJS do PRD. *Why:* deploy único na Vercel, custo $0 no MVP, Server Components + Server Actions + Route Handlers cobrem CRUD com type-safety end-to-end, Vercel Cron resolve jobs scheduled. *Trade-off aceito:* perde DI/decorators NestJS, organiza em `server/modules/*` à mão.
- **2026-05-02 · ORM Drizzle:** Substitui TypeORM/Prisma. *Why:* leve, serverless-friendly (sem prepared statements pesados), migrations SQL-first auditáveis, schema em TS compartilhado via `packages/db`. *Trade-off:* ecossistema menor que Prisma.
- **2026-05-02 · Auth Better Auth + tabela `users` própria:** Session cookie HttpOnly via Better Auth + drizzleAdapter. Hash de senha (scrypt) gerido internamente. SEM Supabase Auth, SEM JWT, SEM NestJS Passport, SEM Lucia (descontinuado mar/2025). *Why:* projeto ativo (28k stars, ~10M downloads/mês, push diário), TypeScript-first, Drizzle adapter oficial, plugin `organization` cobre multi-tenant out-of-the-box, sem vendor lock-in (open source). *Trade-off:* lib jovem (~2 anos), 712 open issues, sem certificação SOC2.
- **2026-05-02 · Sessão via cookie HttpOnly (Better Auth):** Cookie `HttpOnly + Secure + SameSite=Lax` apontando pra tabela `sessions` (schema gerado pelo Better Auth + Drizzle). Renovação rolling 30d + cookie cache 5min (`cookieCache: { enabled: true, maxAge: 5*60 }`). *Why:* imune a XSS, sem refresh-token, revoga instantânea via DB. *Trade-off:* stateful — Postgres serve no v1, Upstash Redis quando escalar.
- **2026-05-02 · Multi-tenant via plugin `organization` Better Auth:** Substitui esquema custom `farm_members`. Plugin gere `organizations`, `members`, `invitations` com roles customizáveis (owner/admin/manager/viewer). `farms` permanece tabela separada — relação `organization → farms (1..N) → membership scoped por farm_id no service layer`. *Why:* convites, aceite, troca de role já implementados. *Trade-off:* segue convenções do plugin (nomenclatura `organization`, não `farm`).
- **2026-05-02 · SEM RLS Supabase, SEM Supabase client SDK no browser:** Tenancy enforced 100% em middleware Next + helper `requireFarm()` em Server Actions + repository functions com filtro automático por `farm_id`. *Why:* incompatível com session cookie próprio (Supabase RLS espera JWT do Supabase Auth). *Risco:* bug em helper = vazamento cross-tenant → mitigar com testes E2E obrigatórios em todo CRUD + suite de tenancy isolation.
- **2026-05-02 · Hospedagem Vercel Hobby (MVP $0):** Free tier proíbe uso comercial — antes do lançamento pago, migrar pra **Pro $20/mês**. Supabase free (500MB DB, pausa após 1 semana inativo) + Resend free (100/dia, 3k/mês) + Vercel Cron (2 jobs daily Hobby).
- **2026-05-02 · Sem Redis no MVP:** Postgres serve sessions, rate limit, cache. Upstash Redis adicionado quando dor real aparecer (bruteforce login, cache fora do ciclo TanStack Query).
- **2026-05-02 · Frontend dentro do mesmo app Next.js:** shadcn/ui + Tailwind + TanStack Query v5 (cliente; server-side usa fetch/Drizzle direto). Cookie de sessão automático em todas requests same-origin.
- **2026-05-02 · UI PT-BR / código EN:** Rotas em PT-BR (`/animais`, `/lotes`, `/saude`, ...). Variáveis/funções em inglês. Estrutura App Router: `app/(marketing)/`, `app/(auth)/`, `app/(app)/animais/page.tsx` etc.
- **2026-05-02 · Multi-tenancy via `farm_id`:** Coluna indexada em toda tabela operacional. `organization_id` no nível raiz. Enforce em service layer (não banco).
- **2026-05-02 · `kg_per_arroba = 30` constraint:** Não configurável. Hard constraint em `farm_settings`.
- **2026-05-02 · 1 spec → 1 PR → 1 commit atômico por task:** Worktree dedicado `.claude/worktrees/<spec-id>`. Conventional Commits.
- **2026-05-02 · M0 stack travada:** Turborepo + pnpm workspaces + Biome only (sem ESLint/Prettier) + Node 22 LTS + Postgres 16 + TS strict + noUncheckedIndexedAccess. *Why:* Turborepo dá cache build grátis em monorepo; pnpm é melhor PM pra workspaces; Biome cobre lint+format sem config duplicada.
- **2026-05-02 · Domínio `bovion.com.br` já adquirido:** Configurar DNS Vercel em M0 BOOT-05 (não adiar pra M6). www → 301 apex (decidir final na execução).
- **2026-05-02 · Postgres em CI obrigatório:** GitHub Actions service container Postgres 16 + `pnpm db:migrate` contra ele em todo PR. *Why:* Bovion é DB-heavy, migration bug não pode chegar em prod.
- **2026-05-02 · Health endpoint público em M0:** `/api/health` retorna `{ ok, db, commit, timestamp }` sem auth. Validação ponta a ponta da pipeline + base pra monitoring futuro.

## Blockers

(none — pendência ativa: design M0)

## Session Handoff (2026-05-02 fim)

**Última ação:** Push inicial em `lucsbasto/bovion@562d756` (main). Context7 MCP adicionado em `~/.claude.json` (escopo user) — requer restart de sessão pra ativar.

**Próximo passo ao reabrir Claude Code neste diretório:**
1. Confirmar Context7 ativo: `mcp__context7__resolve-library-id "better-auth"` deve responder
2. Retomar design M0: ler `.specs/features/m0-bootstrap/spec.md` + STATE.md + PROJECT.md + ROADMAP.md
3. Gerar `.specs/features/m0-bootstrap/design.md` cobrindo:
   - Arquitetura (mermaid: monorepo + Vercel + Supabase + Resend + GitHub Actions)
   - Estrutura de diretórios definitiva (`apps/web`, `packages/db`, `packages/emails`)
   - Schema Drizzle completo: Better Auth tables (users/sessions/accounts/verifications/organizations/members/invitations) + custom Bovion tables (farms, farm_settings esqueleto)
   - Config files verbatim: `turbo.json` (top-level `tasks` key), `drizzle.config.ts`, `vercel.json` (crons + redirects), `docker-compose.postgres.yml`, `.github/workflows/ci.yml`, `biome.json`, `tsconfig.json` strict
   - Componentes: AuthModule (Better Auth instance + organization plugin + emailVerification/sendResetPassword via Resend wrapper), DB client, Email wrapper, Health endpoint, Env validator (zod)
   - Tradeoffs registrados: por que `db:push` em dev e `db:migrate` em prod, por que cookieCache 5min, por que apex domain (não www)

**Pesquisa já feita (WebFetch nesta sessão — usar Context7 pra refrescar):**
- Better Auth installation + Drizzle adapter (`drizzleAdapter(db, { provider: 'pg' })`)
- Better Auth route handler `/app/api/auth/[...all]/route.ts` via `toNextJsHandler(auth)`
- Better Auth organization plugin (cria `organization`, `member`, `invitation`, estende `session` com `activeOrganizationId`)
- Better Auth emailVerification/sendResetPassword config shape
- Drizzle Kit commands: `push` (dev), `generate` (cria migration SQL), `migrate` (aplica em prod)
- Turborepo `turbo.json` schema: top-level `tasks` (não `pipeline`), `dependsOn`, `outputs`, `cache`, `inputs`, `persistent`

**Pendente verificar via Context7:**
- Vercel Cron syntax (`vercel.json` `crons` array)
- Next.js 15 App Router params shape (Promise<params>)
- React Email + Resend latest API
- Better Auth `databaseHooks.user.create.after` signature pra criar farm inicial automático em registro

**Comandos pra retomar:**
```
cd /home/lucas/bovion
claude
# diga: "continuar design M0"
```

## Lessons

(none yet)

## Todos

- [x] M0: Spec escrita (`.specs/features/m0-bootstrap/spec.md`) — 8 requirements (6 P1 + 2 P2)
- [x] M0: Design phase (`.specs/features/m0-bootstrap/design.md` — arquitetura mermaid + dir tree + Drizzle schema + configs verbatim verificados Context7 + componentes + tradeoffs)
- [ ] M0: Tasks phase (atomic tasks com dependências)
- [ ] M0: Execute BOOT-01 monorepo
- [ ] M0: Execute BOOT-02 database
- [ ] M0: Execute BOOT-03 Better Auth
- [ ] M0: Execute BOOT-04 email
- [ ] M0: Execute BOOT-05 deploy + domínio bovion.com.br
- [ ] M0: Execute BOOT-06 CI
- [ ] M0: Execute BOOT-07 health endpoint
- [ ] M0: Execute BOOT-08 tooling
- [ ] M1: Specify AUTH-001 (login Better Auth + session cookie)

## Deferred

- Threshold R$ 10.000 (saúde do lote sec 12.16) deveria ser configurável por fazenda — pós-MVP.
- Constraint `feed_cost_per_day_override > 0` vs "ração doada" (zero) — decidir na spec LOT.
- Adicionar Upstash Redis quando aparecer rate limit (auth bruteforce) ou cache cross-request — pós-MVP.
- Migrar Vercel Hobby → Pro antes do primeiro cliente pago — bloqueador de lançamento comercial.
- Reavaliar RLS se aparecer integração externa (BI, dbt) bypass-API — pós-MVP.
- Fastify-style API REST pública (`apps/api` standalone) — não no MVP; tudo via Next Route Handlers.

## Preferences

(none yet)
