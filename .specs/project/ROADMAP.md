# Roadmap

**Current Milestone:** M0 — Bootstrap & Infra
**Status:** In Progress (spec written, design pending)

> Decomposição derivada de PRD-COMPLETO.md sec 17 (passos 1-11). Ordem respeita árvore funcional de domínios (sec 7): AUTH → ORG → FARM → AREA → LOT → ANIMAL → eventos → HEALTH/SUPP → FIN/DASH/PSIM → BILLING → SETTINGS.
>
> **Stack:** Next.js 15 (App Router) full-stack na Vercel + Drizzle + Better Auth + Supabase Postgres + Resend. Custo MVP $0.

---

## M0 — Bootstrap & Infra

**Goal:** Repo executável, banco rodando local, CI verde, primeiro `npm run dev` na porta 3000 com landing page mínima.
**Target:** Sprint 1

### Features

**Monorepo Setup** - PLANNED
- npm workspaces (`apps/web`, `packages/emails`, `packages/db`)
- Next.js 15 App Router + TS
- Tailwind + shadcn/ui inicial
- Biome + Husky + lint-staged
- Vitest + Playwright config

**Database Infra** - PLANNED
- Docker Compose Postgres porta 5433
- Drizzle Kit config (`drizzle.config.ts`)
- Schema base em `packages/db/schema/*.ts`
- Scripts `db:push` (dev) + `db:migrate` (prod) + `db:seed`
- Migration policy: `packages/db/migrations/NNNN_*.sql`
- Tenancy pattern: helper `requireFarm()` em Server Actions + repository functions filtram `farm_id` automaticamente

**Auth Infra (Better Auth)** - PLANNED
- Better Auth + drizzleAdapter + organization plugin
- Schema gerado: `users`, `sessions`, `accounts`, `verifications`, `organizations`, `members`, `invitations`
- Cookie config (HttpOnly, Secure, SameSite=Lax, cookieCache 5min, expiresIn 30d)
- Helper `await auth.api.getSession({ headers: headers() })` em Server Components
- Roles customizadas: owner/admin/manager/viewer (PRD sec 11.3)

**Email Infra** - PLANNED
- Resend SDK em `packages/emails`
- Template base com React Email
- Helper `sendEmail({ to, subject, react })`

**CI/CD** - PLANNED
- GitHub Actions: lint + typecheck + test + build + drizzle migrate dry-run
- Vercel project linkado (preview por PR, prod por main)
- Env vars: `DATABASE_URL`, `RESEND_API_KEY`, `AUTH_SECRET`, `APP_URL`

---

## M1 — AUTH + ORG + FARM Foundation

**Goal:** Usuário registra, cria fazenda, faz login, recupera senha. Multi-tenant base operante.
**Target:** Sprint 2-3

### Features

**Schema Base (migrations 0001-0010)** - PLANNED
- Tabelas Better Auth (geradas): `users`, `sessions`, `accounts`, `verifications`, `organizations`, `members`, `invitations`
- Tabelas custom Bovion: `farms`, `farm_settings`, `areas`, `lots`, `animals` (esqueleto)
- Triggers `set_audit_fields` (created_at/updated_at/created_by/updated_by)
- Coluna `farm_id` indexada em toda tabela operacional (enforce em service layer, não RLS)
- FK `farms.organization_id` → `organizations.id`

**AUTH (4 specs)** - PLANNED
- AUTH-001 login (Server Action + `auth.api.signInEmail` + cookie automático)
- AUTH-002 registro com hook `databaseHooks.user.create.after` → cria farm inicial + trial 14d (Drizzle transaction)
- AUTH-003 reset de senha (Better Auth `forgetPassword` + Resend custom sender)
- AUTH-004 verificação de email (Better Auth `emailVerification.sendVerificationEmail` + Resend)

**MEMBER (4 specs)** - PLANNED → simplificado pelo plugin organization
- Convites por email via `auth.api.inviteUserToOrganization` (validade 7 dias)
- Aceite/recusa via endpoints prontos do plugin
- Roles customizadas: owner/admin/manager/viewer
- Status: active/invited (gerido pelo plugin); disabled = custom flag em `members` extension

**FARM + ORG (7 specs)** - PLANNED
- FARM-001..007: CRUD, soft delete (bloqueio se há animais), settings (preço @ global), seletor de fazenda ativa, multi-fazenda

**MEMBER cleanup hooks** - PLANNED
- Helper `hasRole()` que lê `member.role` do Better Auth
- Cascata: deletar farm → membros relacionados marcados disabled
- Matriz permissões PRD sec 11.3 mapeada em helper único

---

## M2 — Rebanho Core (Áreas + Lotes + Animais)

**Goal:** Cadastrar e gerir rebanho com pesagem e GMD calculado.
**Target:** Sprint 4-5

### Features

**AREA + LOT (7 specs)** - PLANNED
- LOT-001..007: CRUD áreas/lotes, override preço @ por lote, override custo ração, modo mortalidade (isolado/diluído), KPIs do lote, datas início/fim

**ANIMAL Cadastro (8 specs)** - PLANNED
- add-animal-001..008: validações, defaults, financials, main-flow, state, errors, edge-cases, ui-accessibility
- Tipos entrada: nascimento/compra/transferência
- Cadastro individual + bulk (rateio frete/comissão)
- Tag única por farm, campos genealógicos (RGN/RGD)

**ANIMAL Lifecycle (11 specs)** - PLANNED
- AL-001..011: pesagem (Drizzle hook calcula GMD), transferência entre lotes, venda (lucro real), óbito (isolado/diluído), histórico imutável (timeline + movements)

---

## M3 — Saúde & Suplementação

**Goal:** Registrar ocorrências de saúde e dietas com cálculo de custo integrado ao animal.
**Target:** Sprint 6

### Features

**HEALTH (4 specs)** - PLANNED
- Tipos: vacina/medicação/vermífugo/tratamento
- Severidade leve/moderada/grave + status ativo/em-tratamento/resolvido/cancelado
- Custo por ocorrência integrado, próxima dose, soft delete
- Página `app/(app)/saude/page.tsx`

**SUPP (5 specs)** - PLANNED
- CRUD dietas com ingredientes (kg, não %)
- Catálogo ingredientes normalizado
- Cálculo: custo/kg, consumo (%PV), custo diário/mensal/animal-dia
- Snapshot de preços congelado por dieta
- Associação dieta ↔ lote
- Gated por feature `supplementation`

---

## M4 — Inteligência Financeira

**Goal:** Proposta de valor entregue: custo/@, break-even, dia ótimo, saturação.
**Target:** Sprint 7-8

### Features

**FIN (8 specs)** - PLANNED
- FIN-001 resumo financeiro
- FIN-002 composição de custos
- FIN-003 curva de lucro
- FIN-004 comparação de lotes
- FIN-005 break-even (preço mínimo @)
- FIN-006 margem por animal
- FIN-007 overage (excedente)
- FIN-008 pro-rata upgrade

**DASH (12 specs)** - PLANNED
- KPI cards (animais, GMD médio, lucro projetado)
- Distribuição rebanho (status/lote/área)
- Indicadores operacionais por lote
- Alertas operacionais
- Histograma de peso (faixas 20kg)
- Saúde do lote (CRÍTICO/MONITORAR/SAUDÁVEL)

**PSIM (4 specs)** - PLANNED
- Cenário "Venda Hoje" / "Venda Futura"
- Dia ótimo (iteração 0..120 dias) — cabe em 10s timeout Hobby
- Break-even
- Persistência `profit_simulations`
- Gated por `profit_simulator` (3/mês) ou `profit_simulator_unlimited`

---

## M5 — Billing & Plans

**Goal:** Monetização ativa: 4 planos, feature gating, cobrança de excedente.
**Target:** Sprint 9

### Features

**BILLING (10 specs)** - PLANNED
- 4 planos (Essencial R$49 / Gestão R$99 / Estratégico R$199 / Corporativo R$499)
- Subscriptions, invoices, line items, billing events
- Helper `requirePlanFeature()` em Server Components + Server Actions
- Limite animais + cálculo overage (~R$0,50/animal/mês) via **Vercel Cron** (`vercel.json` daily 11:59 UTC)
- Hard-block fazendas/usuários
- Trial 14 dias
- Pro-rata upgrade, downgrade `cancel_at_period_end`
- Página pública `app/(marketing)/planos/page.tsx`
- Stripe Checkout (provider de pagamento — definir spec)

**SETTINGS (3 specs)** - PLANNED
- Preço @ global + URL referência + freshness timestamp
- Fator kg/@ (constraint = 30)
- Currency (default BRL)
- Configurações por organização

---

## M6 — Marketing & Polish

**Goal:** Onboarding suave + landing page pronta para tráfego + go-live comercial.
**Target:** Sprint 10

### Features

**Marketing Pages** - PLANNED
- Landing `app/(marketing)/page.tsx` com SSG
- `/planos` público com SSR
- Onboarding redirect → `/fazendas`
- Redirecionamentos legados (sem `/app/*` neste stack)

**Quality Gates** - PLANNED
- E2E Playwright fluxos críticos
- Suite de tenancy isolation (usuário B não acessa dados de A em todas rotas)
- Testes unitários Vitest cobertura por domínio
- Migrations rodam do zero
- Dark mode validado
- Lighthouse score landing > 90

**Go-Live** - PLANNED
- Upgrade Vercel Hobby → Pro ($20/mês)
- Domínio custom + DNS
- Política de privacidade + termos
- Onboarding email sequence (Resend)

---

## Future Considerations (Backlog sec 16)

- Curva Lucro Projetado what-if no dashboard
- Conversão alimentar KPI
- Margem por lote relatório dedicado
- Capital imobilizado
- Custo marginal vs ganho marginal
- Exportação CSV/PDF (`reports_export`)
- CTAs upgrade UI + telemetria eventos
- Deep-linking convites
- Consolidação multi-fazenda (Corporativo)
- Auditoria visível em UI
- i18n
- Integrações B3 / ERPs
- Upstash Redis (rate limit auth + cache)
- Migrar pra container dedicado (Railway/Fly) se aparecer dor de cold start ou jobs longos
