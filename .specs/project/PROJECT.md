# Bovion

**Vision:** Plataforma SaaS multi-tenant de gestão pecuária e controle financeiro para fazendas de bovinos de corte no Brasil. Centraliza rebanho, manejo, saúde, suplementação e simulação financeira.
**For:** Pecuaristas individuais, gestores de fazenda e grupos pecuários (1-20 fazendas, 100-5.000 animais).
**Solves:** "Quanto custa minha arroba e quando devo vender?" — substitui planilhas dispersas por decisões data-driven (GMD, custo/@, saturação, dia ótimo de venda).

## Goals

- Paridade funcional com PRD-COMPLETO.md sec 9 (cobertura atual ~31% → 100%)
- Cálculos financeiros corretos: custo/@, break-even, saturação, dia ótimo (sec 12)
- Multi-tenant estrito: usuário B nunca vê dados de fazenda de A (enforce em middleware Next + service layer)
- 4 planos com feature gating + cobrança de excedente funcional
- UI 100% PT-BR, código inglês
- Custo de hospedagem no MVP: **$0/mês** (free tiers)

## Tech Stack

**Core:**
- Framework: **Next.js 16 (App Router) full-stack** — web + API em uma só app
- Language: TypeScript
- Database: PostgreSQL via Supabase (cloud free tier + Docker local porta 5433)
- ORM: **Drizzle** (leve, serverless-friendly, migrations SQL-first)
- Auth: **Better Auth** (session cookie HttpOnly + tabela `sessions` Postgres via Drizzle adapter, plugin `organization` para multi-tenant)
- Email: **Console-only stub pré-MVP** (`packages/emails`); **Resend** integrado só em M6 Go-Live (free 100/dia, 3.000/mês)
- Cron: **Vercel Cron Jobs** (Hobby: 2 jobs daily; suficiente pra excedente + cleanup)
- Hospedagem: **Vercel Hobby** (MVP) → **Vercel Pro $20/mês** quando lançar comercial

**UI dependencies:** shadcn/ui + Radix + Tailwind, TanStack Query v5, react-hook-form + zod, recharts, date-fns, sonner (toast).

**Backend dependencies:** Drizzle + drizzle-kit, `better-auth` (auth core + drizzleAdapter + organization plugin), zod (validação compartilhada), `@upstash/ratelimit` + `@upstash/redis` (quando precisar — não MVP). Hash de senha gerido internamente pelo Better Auth (scrypt default).

**Decisão não-óbvia:** **NÃO usa NestJS, NÃO usa Vite, NÃO usa Fastify, NÃO usa Supabase Auth, NÃO usa RLS, NÃO usa Lucia (descontinuado em 2025).** Toda lógica backend vive em `server/` dentro de `apps/web` (Server Actions + Route Handlers + Server Components). Sessão via cookie HttpOnly+Secure+SameSite=Lax gerida pelo Better Auth (~28k stars, ~10M downloads/mês, ativo diariamente). Tenancy enforced em middleware Next + service layer por `farm_id` no contexto da request — não no banco. Plugin `organization` do Better Auth gere relação user ↔ org ↔ membership com roles (owner/admin/manager/viewer customizáveis).

**Monorepo:** npm workspaces — `apps/web` (Next.js full-stack), `packages/emails` (Resend templates), `packages/db` (Drizzle schemas + migrations compartilhados). Biome + Husky + lint-staged.

**Migrations:** Drizzle Kit em `packages/db/migrations/NNNN_*.sql`. Script `npm run db:push` (dev) + `npm run db:migrate` (prod CI).

## Scope

**v1 includes (paridade MVP — checklist sec 19):**
- AUTH (login/registro/reset/verify) com Better Auth + session cookie + criação automática de org+farm
- Multi-tenancy: organização → fazendas → áreas → lotes → animais
- Membership com 4 roles (owner/admin/manager/viewer) + convites por email
- CRUD animais (individual + bulk), pesagem com cálculo de GMD, transferência, venda, óbito (isolado/diluído)
- Saúde animal (vacina/medicação/vermífugo/tratamento) com soft delete
- Suplementação com cálculo de dieta (custo/kg, consumo, custo diário)
- Dashboard + KPIs + alertas operacionais
- Análise financeira + simulador (dia ótimo 0..120 dias, break-even, saturação)
- Configurações (preço @ global, fator kg/@ = 30, currency)
- Billing: 4 planos, feature gating (`requirePlanFeature` helper), excedente, pro-rata upgrade
- Marketing pública (`/`, `/planos`, `/login`, `/registro`)
- Rotas em PT-BR

**Explicitly out of scope (backlog sec 16):**
- Curva de Lucro Projetado (what-if) no dashboard
- Conversão alimentar como KPI dedicado
- Margem por lote (relatório dedicado)
- Exportação CSV/PDF (`reports_export`)
- Consolidação multi-fazenda (Corporativo)
- Auditoria visível em UI
- i18n outros idiomas
- Integrações externas (B3, ERPs)
- Redis/Upstash no MVP (adiciona quando aparecer dor real de rate limit/cache)

## Constraints

- Timeline: SDD incremental, ~89 specs (sec 17 passos 1-11)
- Technical: 1 spec → 1 PR → 1 commit atômico por task; worktree dedicado `.claude/worktrees/<spec-id>`
- Convenções: Conventional Commits, rotas PT-BR, código EN, feature flag por plano
- Banco: `kg_per_arroba_chk = 30` constraint, tag única por farm, soft delete onde aplicável. SEM RLS — tenancy enforced em middleware Next + service layer.
- Compliance: validar isolamento multi-tenant em todo CRUD via testes E2E (usuário B não acessa dados de A em nenhuma rota).
- Sessão: cookie HttpOnly Secure SameSite=Lax, store Postgres via Better Auth Drizzle adapter, expira 30 dias com renovação rolling + cookie cache 5min.
- Cálculos pesados (simulador 0..120 dias, dashboard agregado): cabe nos 10s de timeout Hobby. Relatórios futuros que excedam = mover pra Vercel Cron + persistir resultado.
- Vercel Hobby é dev/MVP only — uso comercial exige Pro ($20/mês) antes do lançamento pago.
