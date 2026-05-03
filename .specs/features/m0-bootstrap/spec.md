# M0 — Bootstrap & Infra Specification

**Feature ID prefix:** `BOOT`
**Milestone:** M0
**Status:** Specifying
**Owner:** lucas (lucsbasto@gmail.com)
**Created:** 2026-05-02

## Problem Statement

Repositório vazio. Antes de qualquer feature de negócio (animais, lotes, financeiro), precisamos de fundação técnica executável: monorepo estruturado, banco rodando local, auth instalado, deploy automatizado e CI verde. Sem isso, toda spec de domínio fica bloqueada.

## Goals

- [ ] `git clone` + 4 comandos → app rodando em `localhost:3000`
- [ ] Push em branch → preview deploy verde na Vercel em <3min
- [ ] CI valida lint + types + tests + build + migrations dry-run em todo PR
- [ ] Domínio `bovion.com.br` apontando pra prod (Vercel)
- [ ] Endpoint `/api/health` toca DB e retorna `{ ok: true, db: "connected", commit: "<sha>" }`
- [ ] Custo de hospedagem: $0/mês (Vercel Hobby + Supabase free + Resend free)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Login UI funcional | Spec AUTH-001 em M1 |
| Schema de domínio (animais, lotes, fazendas) | Specs FARM/LOT/ANIMAL em M1-M2 |
| Tabela `farm_settings` | Spec FARM-002 em M1 |
| Convites por email funcionais | Spec MEMBER em M1 |
| Testes unitários de regra de negócio | Cada spec de domínio traz os seus |
| Vercel Pro upgrade | M6 antes de go-live comercial |
| Stripe integration | M5 BILLING |
| Onboarding email sequence | M6 |
| i18n | Backlog pós-MVP |

---

## User Stories

> "User" no M0 = desenvolvedor/maintainer. Cada story é uma capacidade técnica auto-validável.

### P1: BOOT-01 — Monorepo executável local ⭐ MVP

**User Story**: Como desenvolvedor, quero clonar o repo e rodar a app localmente em ≤5min para começar a contribuir sem fricção.

**Why P1**: Sem repo executável, nenhuma outra spec pode começar.

**Acceptance Criteria**:
1. WHEN dev executa `pnpm install` em repo limpo THEN sistema SHALL instalar todas dependências sem erros usando workspaces pnpm
2. WHEN dev executa `docker compose -f docker-compose.postgres.yml up -d` THEN sistema SHALL subir Postgres 16 na porta 5433 com healthcheck verde
3. WHEN dev executa `pnpm db:push` THEN Drizzle Kit SHALL aplicar schema completo no Postgres local
4. WHEN dev executa `pnpm dev` THEN Next.js SHALL servir em `http://localhost:3000` com landing placeholder visível
5. WHEN dev abre `localhost:3000` THEN landing SHALL exibir "Bovion — Em construção" + botão "Health check" que chama `/api/health`
6. WHEN README é seguido por novo dev THEN setup SHALL completar em ≤5min em máquina com Node 22 + Docker instalados

**Independent Test**: `rm -rf node_modules && pnpm install && docker compose up -d && pnpm db:push && pnpm dev` → abrir browser → ver landing.

---

### P1: BOOT-02 — Database infra com Drizzle ⭐ MVP

**User Story**: Como desenvolvedor, quero schema versionado em TS e migrations SQL auditáveis para que mudanças no banco sejam rastreáveis e reproduzíveis.

**Why P1**: Toda spec subsequente cria/altera schema. Pipeline de migrations é crítico.

**Acceptance Criteria**:
1. WHEN dev altera schema em `packages/db/schema/*.ts` THEN `pnpm db:generate` SHALL criar migration SQL em `packages/db/migrations/NNNN_<descrição>.sql`
2. WHEN migration é gerada THEN ela SHALL ser SQL puro versionável (não binário Prisma-style)
3. WHEN dev executa `pnpm db:migrate` em ambiente prod THEN sistema SHALL aplicar todas migrations pendentes em ordem sequencial idempotente
4. WHEN dev executa `pnpm db:studio` THEN Drizzle Studio SHALL abrir em browser e listar tabelas
5. WHEN dev executa `pnpm db:seed` THEN script SHALL popular DB com dados de teste mínimos (1 user, 1 org, 1 farm) — placeholder em M0, expandido por specs futuras
6. WHEN drizzle config é lido THEN ele SHALL apontar pra `DATABASE_URL` do `.env.local` em dev e `DATABASE_URL` da Vercel/Supabase em prod

**Independent Test**: alterar `users.name` length → `pnpm db:generate` → ver SQL gerado → `pnpm db:migrate` → confirmar coluna alterada via Studio.

---

### P1: BOOT-03 — Auth foundation (Better Auth + Drizzle adapter) ⭐ MVP

**User Story**: Como desenvolvedor, quero Better Auth instalado e configurado com schema gerado para que a spec AUTH-001 (M1) só precise implementar UI e Server Action.

**Why P1**: Auth é dependency de toda rota gated. Schema precisa estar travado antes de M1.

**Acceptance Criteria**:
1. WHEN config de auth é lido em `apps/web/server/auth.ts` THEN ele SHALL exportar instância Better Auth com `drizzleAdapter(db, { provider: 'pg' })`
2. WHEN Better Auth config é validado THEN plugins ativos SHALL incluir `organization()` (com role keys: owner/admin/manager/viewer customizáveis)
3. WHEN config é lido THEN cookie SHALL estar configurado: `httpOnly=true, secure=true em prod, sameSite='lax', expiresIn=30d, cookieCache.enabled=true, cookieCache.maxAge=300`
4. WHEN `pnpm db:generate` roda após instalar Better Auth THEN tabelas SHALL ser criadas: `users`, `sessions`, `accounts`, `verifications`, `organizations`, `members`, `invitations`
5. WHEN endpoint `/api/auth/[...all]/route.ts` recebe request THEN handler SHALL delegar pro Better Auth router (placeholder ativo, fluxos reais em M1)
6. WHEN env var `BETTER_AUTH_SECRET` está ausente THEN app SHALL falhar no startup com erro claro (validação zod em `server/env.ts`)
7. WHEN `BETTER_AUTH_URL` está ausente em prod THEN deploy SHALL falhar antes de aceitar tráfego

**Independent Test**: `curl localhost:3000/api/auth/get-session` retorna `{ session: null, user: null }` (sem 500).

---

### P1: BOOT-04 — Email foundation (Resend + React Email) ⭐ MVP

**User Story**: Como desenvolvedor, quero wrapper de envio de email pronto e template base renderizável para que specs AUTH-003 (reset) e AUTH-004 (verify) só precisem chamar `sendEmail()`.

**Why P1**: Reset/verify de email são P1 da AUTH; sem infra de email, M1 trava.

**Acceptance Criteria**:
1. WHEN dev importa `sendEmail` de `@bovion/emails` THEN função SHALL aceitar `{ to, subject, react }` e retornar resposta da Resend
2. WHEN `sendEmail` é chamado em dev sem `RESEND_API_KEY` THEN log SHALL imprimir email no console (modo dev) sem falhar
3. WHEN `RESEND_API_KEY` está presente THEN email SHALL ser enviado via Resend com `from='no-reply@bovion.com.br'`
4. WHEN template `WelcomeEmail` é renderizado THEN ele SHALL produzir HTML válido + texto plain via React Email
5. WHEN dev roda `pnpm --filter @bovion/emails preview` THEN React Email preview server SHALL abrir em `localhost:3001` listando templates
6. WHEN domínio `bovion.com.br` é configurado em Resend THEN SPF + DKIM SHALL estar verificados (gate: prod-only, dev usa sandbox)

**Independent Test**: `node -e "import('./packages/emails/dist/send.js').then(m => m.sendEmail({to:'test@test.com',subject:'hi',react: WelcomeEmail({name:'X'})}))"` → log do email no console em dev.

---

### P1: BOOT-05 — Deploy pipeline (Vercel + domínio + env) ⭐ MVP

**User Story**: Como desenvolvedor, quero `git push origin main` deployar prod automaticamente em `bovion.com.br` para que ciclo de release seja git-driven.

**Why P1**: Sem deploy automatizado, validar mudanças em prod vira ritual manual e a primeira spec de UI fica bloqueada.

**Acceptance Criteria**:
1. WHEN repo é conectado a Vercel project `bovion` THEN preview deploy SHALL ser criado em todo PR
2. WHEN PR é mergeado em `main` THEN prod deploy SHALL rodar e atualizar `bovion.com.br` em <5min
3. WHEN env vars são lidas pela Vercel THEN sistema SHALL exigir: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `RESEND_API_KEY`, `APP_URL`, `NODE_ENV`
4. WHEN domínio `bovion.com.br` é configurado THEN DNS SHALL ter `A`/`CNAME` apontando pra Vercel + SSL ativo (Let's Encrypt automático Vercel)
5. WHEN `www.bovion.com.br` é acessado THEN sistema SHALL redirecionar 301 pra `bovion.com.br` (ou vice-versa — decidir na execução, default: apex)
6. WHEN env var crítica está ausente em prod THEN build SHALL falhar via validação zod no `server/env.ts`
7. WHEN deploy completa THEN endpoint `/api/health` em prod SHALL retornar 200 com `{ ok: true, db: "connected", commit: "<git-sha>" }`

**Independent Test**: criar PR vazio → ver preview URL no PR comment → mergear → `curl https://bovion.com.br/api/health` retorna ok.

---

### P1: BOOT-06 — CI pipeline ⭐ MVP

**User Story**: Como maintainer, quero CI bloqueando merge de PR que quebre lint/types/tests/build para que `main` permaneça sempre verde.

**Why P1**: Sem CI gate, qualidade degrada em semanas. Prevenção barata, custo de retrofit alto.

**Acceptance Criteria**:
1. WHEN PR é aberto THEN GitHub Actions SHALL rodar workflow `ci.yml` com steps: install + biome check + tsc --noEmit + vitest run + next build
2. WHEN qualquer step do CI falha THEN merge SHALL ser bloqueado (branch protection rule)
3. WHEN workflow `ci.yml` roda THEN ele SHALL spinar Postgres 16 service container + executar `pnpm db:migrate` contra ele pra validar migrations
4. WHEN `pnpm db:migrate` falha em CI THEN PR SHALL ser bloqueado com mensagem clara
5. WHEN workflow completa em PR THEN tempo total SHALL ser <5min (sem cache: <8min)
6. WHEN PR é aberto por dependabot ou bot THEN CI SHALL rodar igualmente
7. WHEN cache pnpm é usado THEN workflow SHALL reusar `~/.pnpm-store` entre runs

**Independent Test**: PR com `console.log` solto (Biome warning) → CI red → não permite merge.

---

### P2: BOOT-07 — Health endpoint funcional

**User Story**: Como desenvolvedor/SRE, quero endpoint `/api/health` provando que app↔DB funcionam para que monitoring externo possa pingar e alertar downtime.

**Why P2**: Útil pra validar pipeline ponta a ponta no M0; vira input pra monitoring em M6.

**Acceptance Criteria**:
1. WHEN `GET /api/health` é chamado THEN response SHALL ser JSON `{ ok: true, db: "connected", commit: "<git-sha-7>", timestamp: "<iso>" }` com status 200
2. WHEN DB está down THEN response SHALL ser `{ ok: false, db: "disconnected", error: "<msg>" }` com status 503
3. WHEN endpoint é chamado THEN ele SHALL executar `SELECT 1` no Postgres via Drizzle pra confirmar conectividade
4. WHEN endpoint é chamado THEN ele SHALL responder em <500ms em prod (cold start incluído)
5. WHEN sha do git é injetada THEN ela SHALL vir de `process.env.VERCEL_GIT_COMMIT_SHA` em prod ou `git rev-parse --short HEAD` em build local
6. WHEN endpoint é chamado em rota `/api/health` THEN ele SHALL ser público (sem auth check)

**Independent Test**: `curl localhost:3000/api/health | jq` retorna JSON válido com `ok: true`.

---

### P2: BOOT-08 — Tooling consistency (Biome + Husky + lint-staged + Vitest skeleton)

**User Story**: Como desenvolvedor, quero hooks de pre-commit rodando lint/format automático para que commits malformados não cheguem ao remote.

**Why P2**: Padronização tira ruído de PR review.

**Acceptance Criteria**:
1. WHEN dev executa `git commit` THEN Husky SHALL rodar lint-staged que executa `biome check --write` nos arquivos staged
2. WHEN biome encontra erro não-corrigível THEN commit SHALL ser abortado com mensagem clara
3. WHEN dev roda `pnpm lint` THEN Biome SHALL checar todo repo (ignorando `node_modules`, `.next`, `dist`)
4. WHEN dev roda `pnpm format` THEN Biome SHALL formatar todo repo
5. WHEN dev roda `pnpm test` THEN Vitest SHALL rodar (vazio em M0 — só valida config)
6. WHEN dev roda `pnpm typecheck` THEN tsc SHALL validar todo workspace sem emitir
7. WHEN configs são lidas THEN tsconfig SHALL ter `strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitOverride: true`

**Independent Test**: `git commit -m "test"` com arquivo malformado → commit bloqueado.

---

## Edge Cases

- **Postgres não responde:** WHEN Docker não está rodando THEN `pnpm db:push` SHALL falhar com mensagem "Postgres não acessível em localhost:5433 — rode `docker compose up -d`"
- **Env vars ausentes:** WHEN `.env.local` ausente em dev THEN `server/env.ts` SHALL falhar no startup listando vars faltantes
- **Migration conflict:** WHEN dois devs geram migrations com mesmo número THEN merge SHALL conflict explicitamente em `migrations/` (resolver renumerando)
- **Vercel build sem env:** WHEN deploy roda sem env var crítica THEN build SHALL falhar antes de aceitar tráfego (zod validation no startup)
- **Domínio DNS propagando:** WHEN DNS ainda propagando THEN Vercel SHALL servir via `*.vercel.app` interim (não bloqueia M0)
- **CI sem secret:** WHEN GitHub secrets `DATABASE_URL_TEST` ou `BETTER_AUTH_SECRET` ausentes THEN workflow SHALL falhar no step "validate secrets" antes de install
- **pnpm cache stale:** WHEN `pnpm install` falha por cache corrompido THEN README SHALL documentar `pnpm store prune`
- **Clone shallow no CI:** WHEN GitHub Actions usa shallow clone THEN `git rev-parse HEAD` SHALL funcionar (default actions/checkout v4 com fetch-depth: 1 ainda permite SHA)
- **Better Auth schema drift:** WHEN versão Better Auth atualiza com schema migration THEN spec separada (BOOT-09 future) SHALL gerar migration de sync — fora de M0

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| BOOT-01 | P1: Monorepo executável | Design | Pending |
| BOOT-02 | P1: Database infra Drizzle | Design | Pending |
| BOOT-03 | P1: Auth foundation Better Auth | Design | Pending |
| BOOT-04 | P1: Email foundation Resend | Design | Pending |
| BOOT-05 | P1: Deploy pipeline Vercel + domínio | Design | Pending |
| BOOT-06 | P1: CI pipeline | Design | Pending |
| BOOT-07 | P2: Health endpoint | Design | Pending |
| BOOT-08 | P2: Tooling consistency | Design | Pending |

**ID format:** `BOOT-NN`
**Status values:** Pending → In Design → In Tasks → Implementing → Verified
**Coverage:** 8 total, 0 mapeados a tasks ainda (gerar em fase Tasks)

---

## Success Criteria

- [ ] Setup local em <5min em máquina nova (Node 22 + Docker pré-instalados)
- [ ] PR aberto → preview deploy verde em <5min
- [ ] Push em main → prod deploy em `bovion.com.br` em <5min
- [ ] CI bloqueia PR quebrado (lint, types, build, migrations)
- [ ] `curl https://bovion.com.br/api/health` retorna `{ ok: true }`
- [ ] Custo total infra MVP: $0/mês confirmado (Vercel Hobby + Supabase free + Resend free + GitHub free)
- [ ] README com setup de 4 comandos validado por dev externo (não-autor) em ≤5min

---

## Decisões travadas (responder antes de Design)

| # | Decisão | Resposta |
|---|---------|----------|
| 1 | Build orchestration | **Turborepo** (`turbo run build/test/lint`) |
| 2 | Package manager | **pnpm** (workspaces) |
| 3 | Postgres em CI | **Sim** (service container GitHub Actions) |
| 4 | Domínio em M0 | **Sim** — `bovion.com.br` (já comprado) |
| 5 | Lint stack | **Biome only** (sem ESLint + Prettier) |
| 6 | Health endpoint em M0 | **Sim** (`/api/health` toca DB) |
| 7 | Node version | Node 22 LTS |
| 8 | DB version | Postgres 16 |
| 9 | TS strict | `strict + noUncheckedIndexedAccess + noImplicitOverride` |
| 10 | Vercel tier no MVP | Hobby ($0); Pro ($20/mês) gate em M6 antes de comercial |
