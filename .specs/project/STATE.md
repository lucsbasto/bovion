# State

**Updated:** 2026-05-03 (M0 design.md gerado via Context7 MCP — pronto pra fase Tasks)

## Decisions

- **2026-05-03 · Stack full-stack Next.js 16 (App Router):** Bump 15 → 16 (latest stable). Async params/cookies já era em 15; Next 16 removeu sync compat — sem código existente afetado em M0. Substitui Vite + Fastify + NestJS do PRD. *Why:* deploy único na Vercel, custo $0 no MVP, Server Components + Server Actions + Route Handlers cobrem CRUD com type-safety end-to-end, Vercel Cron resolve jobs scheduled. *Trade-off aceito:* perde DI/decorators NestJS, organiza em `server/modules/*` à mão.
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
- **2026-05-02 · M0 stack travada:** Turborepo + pnpm workspaces + Biome only (sem ESLint/Prettier) + Node 24 (latest, Vercel-supported) + Postgres 16 + TS strict + noUncheckedIndexedAccess. *Why:* Turborepo dá cache build grátis em monorepo; pnpm é melhor PM pra workspaces; Biome cobre lint+format sem config duplicada.
- **2026-05-02 · Domínio `bovion.com.br` já adquirido:** Configurar DNS Vercel em M0 BOOT-05 (não adiar pra M6). www → 301 apex (decidir final na execução).
- **2026-05-02 · Postgres em CI obrigatório:** GitHub Actions service container Postgres 16 + `pnpm db:migrate` contra ele em todo PR. *Why:* Bovion é DB-heavy, migration bug não pode chegar em prod.
- **2026-05-02 · Health endpoint público em M0:** `/api/health` retorna `{ ok, db, commit, timestamp }` sem auth. Validação ponta a ponta da pipeline + base pra monitoring futuro.
- **2026-05-03 · Better Auth `modelName` plural:** `users/sessions/accounts/verifications/organizations/members/invitations`. *Why:* alinha com tabelas custom Bovion (`farms`, `farm_settings`, `animals`, `lots`). Config via `user: { modelName: 'users' }` + `organization({ schema: { organization: { modelName: 'organizations' } } })`.
- **2026-05-03 · `auth:generate` NÃO roda em CI:** Schema commitado é source of truth. Dev roda `pnpm auth:generate` manualmente após bump Better Auth. Drift-check em CI deferred (só se bug aparecer).
- **2026-05-03 · Seed M0 mínimo viável:** `pnpm db:seed` cria 1 user (`dev@bovion.local`/`devpass123`) + 1 org (`Fazenda Demo`) + 1 member(owner) + 1 farm + 1 farm_settings(kg=30). Senha hash via `auth.api.signUpEmail` (não duplicar scrypt). Permite app local navegável sem UI signup (que só vem M1).
- **2026-05-03 · EMAIL_FROM 3 modos:** dev sem `RESEND_API_KEY` = console.log; dev/preview com key = `onboarding@resend.dev` (sandbox Resend, sem DNS); prod = `no-reply@bovion.com.br` (após DKIM/SPF em BOOT-05). `.env.example` default sandbox.
- **2026-05-03 · Pin sempre latest npm:** Mandate user. Bovion bump tudo pra latest: Next 16.2.4, React 19.2.5, TS 6.0.3, Biome 2.4.14, Turbo 2.9.7, Drizzle ORM 0.45.2 + Kit 0.31.10, Better Auth 1.6.9, Resend 6.12.2, Zod 4.4.2, lint-staged 16.4.0. *Why:* greenfield, sem legacy. Patterns API verificados via Context7 — sem breaking change que afete M0.
- **2026-05-03 · M0 Verification Plan completo:** 5/5 checks passaram (Better Auth schema, drizzle-kit defineConfig, Resend react prop, GH Actions postgres port, Vercel ignoreCommand). Ver `.specs/features/m0-bootstrap/design.md` sec final.
- **2026-05-03 · Resend deferred → M6 Go-Live:** `packages/emails` em M0..M5 é wrapper console-only (`sendEmail` imprime payload + retorna `{ id: 'console-noop-<uuid>' }`). React Email templates previewáveis local via `react-email` dev. Resend SDK install + `RESEND_API_KEY` env + SPF/DKIM em `bovion.com.br` entram só em M6 spec EMAIL-PROVIDER. *Why:* usuários pré-MVP são internos, email real não é bloqueador. Better Auth `requireEmailVerification: false` até M6. Interface `sendEmail()` estável — swap stub→Resend zero-impact em callers.

## Blockers

- **Docker não instalado no host (2026-05-03):** `docker compose -f docker-compose.postgres.yml up -d` não pode rodar até user instalar Docker Desktop / Engine. Bloqueia verify runtime de BOOT-01-T04 (postgres healthcheck), BOOT-02-T05 (drizzle migrate local), BOOT-03-T03+ (auth route smoke test contra DB). Workaround: continuar com tasks que não tocam DB; docker fica blocker pra primeiro verify ponta-a-ponta. Install: `curl -fsSL https://get.docker.com | sh` (Linux) ou Docker Desktop (mac/win).

## Session Handoff (2026-05-03 fim)

**Última ação:** `.specs/features/m0-bootstrap/design.md` (~794 linhas) gerado e validado via Context7 MCP. Cobre: arch mermaid (dev/CI/prod), components (AuthModule + DB client + Email wrapper + Health endpoint + Env validator), schemas (Better Auth core + organization plugin + farms/farm_settings esqueleto), config files verbatim (turbo.json `tasks` key, drizzle.config.ts `defineConfig`, vercel.json `crons`/redirects, docker-compose.postgres.yml :5433, .github/workflows/ci.yml com Postgres service, biome.json, tsconfig strict), 12 tradeoffs, error handling matrix, Open Questions (4) + Verification Plan (5 checks).

**Próximo passo ao reabrir:**
1. Phase 4 Execute — começar BOOT-01-T01 (workspace root scaffold)
2. Worktree pattern per task: `git worktree add .claude/worktrees/boot-01-t01 -b boot/01-t01`
3. Seguir `tasks.md` em ordem: BOOT-01 → (BOOT-08 ‖ BOOT-02) → BOOT-03 → BOOT-04 → BOOT-07 → (BOOT-06 ‖ BOOT-05) → EPILOGUE
4. Cada task: editar files → verify command → commit Conventional Commits → merge → próxima

**Comandos pra retomar:**
```
cd /home/lucas/bovion
claude
# diga: "executar BOOT-01-T01" ou "começar M0 execução"
```

## Lessons

(none yet)

## Todos

- [x] M0: Spec escrita (`.specs/features/m0-bootstrap/spec.md`) — 8 requirements (6 P1 + 2 P2)
- [x] M0: Design phase (`.specs/features/m0-bootstrap/design.md` — arquitetura mermaid + dir tree + Drizzle schema + configs verbatim verificados Context7 + componentes + tradeoffs)
- [x] M0: 4 Open Questions resolvidas (modelName plural, auth:generate fora CI, seed mínimo, EMAIL_FROM 3 modos)
- [x] M0: Verification Plan completo (5/5 checks) + bump tudo pra latest (Next 16, Drizzle 0.45, Resend 6, Zod 4 etc)
- [x] M0: Tasks phase (`.specs/features/m0-bootstrap/tasks.md` — 32 tasks atômicas em 8 specs + 2 epilogue, dependency graph + verify command per task + commit msg preview)
- [ ] M0: Execute BOOT-01-T01 (workspace root scaffold) → primeiro commit
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
