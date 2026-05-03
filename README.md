# Bovion

SaaS multi-tenant de gestão pecuária e controle financeiro para fazendas de bovinos de corte no Brasil. Centraliza rebanho, manejo, saúde, suplementação e simulação financeira.

> "Quanto custa minha arroba e quando devo vender?"

## Status

Bootstrap M0 — Infra. Sem código de aplicação ainda — só especificação SDD + scaffold workspace.

- [PRD-COMPLETO.md](./PRD-COMPLETO.md) — fotografia completa do produto (visão, domínios, regras, rotas, cálculos)
- [.specs/project/PROJECT.md](./.specs/project/PROJECT.md) — vision + stack + scope v1
- [.specs/project/ROADMAP.md](./.specs/project/ROADMAP.md) — milestones M0 → M6 (~89 specs)
- [.specs/project/STATE.md](./.specs/project/STATE.md) — decisões travadas + todos
- [.specs/features/m0-bootstrap/](./.specs/features/m0-bootstrap/) — spec + design + tasks da fase atual

## Stack

| Camada | Escolha |
|---|---|
| Web + API | Next.js 16 App Router (full-stack) |
| ORM | Drizzle 0.45 |
| Auth | Better Auth 1.6 + plugin `organization` |
| DB | PostgreSQL 16 (Supabase free em prod, Docker local porta 5433) |
| Email | Console stub pré-MVP (`packages/emails`); Resend integrado em M6 Go-Live |
| Cron | Vercel Cron Jobs (M5+) |
| Build | Turborepo + pnpm workspaces |
| Lint | Biome 2 |
| Runtime | Node 24 |
| Hospedagem | Vercel Hobby (MVP, $0/mês) |

## Setup local

Pré-requisitos: Node 24+, pnpm 10+ (ou corepack), Docker.

```bash
git clone https://github.com/lucsbasto/bovion.git
cd bovion
corepack enable && corepack prepare pnpm@latest --activate   # se pnpm não instalado
pnpm install
docker compose -f docker-compose.postgres.yml up -d
pnpm db:push      # após M0 BOOT-02 (Drizzle scaffold)
pnpm dev          # após M0 BOOT-01-T05 (Next.js scaffold)
```

App em `http://localhost:3000`. Postgres local em `postgres://bovion:bovion@localhost:5433/bovion`.

## Workflow

1 spec → 1 PR → 1 commit atômico por task. Conventional Commits. Worktree opcional `.claude/worktrees/<task-id>` em features que tocam código.
