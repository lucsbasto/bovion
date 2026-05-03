# Bovion

SaaS multi-tenant de gestão pecuária e controle financeiro para fazendas de bovinos de corte no Brasil. Centraliza rebanho, manejo, saúde, suplementação e simulação financeira.

> "Quanto custa minha arroba e quando devo vender?"

## Status

Bootstrap. Sem código de aplicação ainda — só especificação SDD.

- [PRD-COMPLETO.md](./PRD-COMPLETO.md) — fotografia completa do produto (visão, domínios, regras, rotas, cálculos)
- [.specs/project/PROJECT.md](./.specs/project/PROJECT.md) — vision + stack + scope v1
- [.specs/project/ROADMAP.md](./.specs/project/ROADMAP.md) — milestones M0 → M6 (~89 specs)
- [.specs/project/STATE.md](./.specs/project/STATE.md) — decisões travadas + todos
- [.specs/features/m0-bootstrap/spec.md](./.specs/features/m0-bootstrap/spec.md) — spec atual em desenvolvimento

## Stack

| Camada | Escolha |
|---|---|
| Web + API | Next.js 15 App Router (full-stack) |
| ORM | Drizzle |
| Auth | Better Auth + plugin `organization` |
| DB | PostgreSQL (Supabase free, Docker local porta 5433) |
| Email | Resend |
| Cron | Vercel Cron Jobs |
| Build | Turborepo + pnpm workspaces |
| Lint | Biome |
| Hospedagem | Vercel Hobby (MVP, $0/mês) |

## Workflow

1 spec → 1 PR → 1 commit atômico por task. Conventional Commits. Worktree dedicado `.claude/worktrees/<spec-id>`.
