# M0 — Bootstrap & Infra Tasks

**Spec:** `./spec.md` · **Design:** `./design.md`
**Status:** Tasks
**Updated:** 2026-05-03
**Convention:** 1 task = 1 commit (Conventional Commits). Worktree `.claude/worktrees/<task-id>` per task. Verify command roda local antes de commit.

---

## Dependency Graph

```
BOOT-01 (monorepo skeleton)
  ├─ BOOT-08 (tooling)        ┐
  └─ BOOT-02 (db)             ┴─ BOOT-03 (auth)
                                    └─ BOOT-04 (emails stub)
                                          └─ BOOT-07 (health + landing)
                                                ├─ BOOT-06 (CI)
                                                └─ BOOT-05 (deploy + DNS)
```

Tasks dentro de BOOT-NN são sequenciais salvo notado. BOOT-08 ‖ BOOT-02 (paralelo). BOOT-06 ‖ BOOT-05 (paralelo no fim).

**Total tasks:** 32 (BOOT-01: 5, BOOT-08: 4, BOOT-02: 5, BOOT-03: 4, BOOT-04: 3, BOOT-07: 2, BOOT-06: 3, BOOT-05: 4, EPILOGUE: 2).

---

## BOOT-01 — Monorepo skeleton

### BOOT-01-T01: Workspace root files
**Depends:** —
**Files:** `package.json`, `pnpm-workspace.yaml`, `.nvmrc`, `.gitignore` (append)
**Steps:**
- `package.json` per design.md sec "package.json (root)" (scripts dev/build/lint/typecheck/test/format/db:*/prepare). `packageManager: pnpm@10.33.2`. `engines.node: >=24.0.0`.
- `pnpm-workspace.yaml`: `packages: ['apps/*', 'packages/*']`
- `.nvmrc`: `22`
- `.gitignore` append: `node_modules/`, `.next/`, `.turbo/`, `dist/`, `*.tsbuildinfo`, `.env.local`, `.env.*.local`, `coverage/`
**Verify:** `pnpm -v` (>= 10.33), `node -v` (>= 24), `cat .nvmrc` = `24`
**Commit:** `chore(bootstrap): scaffold pnpm workspace root`
**Maps to AC:** BOOT-01:AC1

### BOOT-01-T02: Turborepo config
**Depends:** T01
**Files:** `turbo.json`
**Steps:** Copiar verbatim de design.md sec "turbo.json" (top-level `tasks`, build/dev/lint/typecheck/test, globalDependencies, globalEnv).
**Verify:** `pnpm dlx turbo@^2.9.7 --version` retorna `2.9.x`. `cat turbo.json | jq '.tasks | keys'` lista build/dev/lint/typecheck/test.
**Commit:** `chore(bootstrap): add turborepo config`
**Maps to AC:** BOOT-01:AC1

### BOOT-01-T03: TypeScript base config
**Depends:** T01
**Files:** `tsconfig.base.json`
**Steps:** Copiar verbatim design.md sec "tsconfig.base.json". Confirmar `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `verbatimModuleSyntax`, target ES2022.
**Verify:** `pnpm dlx typescript@^6.0.3 --version`. `cat tsconfig.base.json | jq '.compilerOptions.strict'` = `true`.
**Commit:** `chore(bootstrap): add base tsconfig with strict flags`
**Maps to AC:** BOOT-01:AC1, BOOT-08:AC7

### BOOT-01-T04: Postgres docker compose + dev README section
**Depends:** T01
**Files:** `docker-compose.postgres.yml`, `README.md` (criar/atualizar com sec "Setup local")
**Steps:**
- `docker-compose.postgres.yml` verbatim design.md (port 5433:5432, healthcheck pg_isready, volume bovion-pg-data).
- README sec "Setup local" com 4 comandos: `pnpm install`, `docker compose -f docker-compose.postgres.yml up -d`, `pnpm db:push`, `pnpm dev`.
**Verify:** `docker compose -f docker-compose.postgres.yml up -d && docker compose -f docker-compose.postgres.yml ps | grep healthy` (5-10s). Cleanup: `docker compose -f docker-compose.postgres.yml down -v`.
**Commit:** `chore(bootstrap): add postgres docker compose for dev`
**Maps to AC:** BOOT-01:AC2, BOOT-01:AC6

### BOOT-01-T05: apps/web Next.js bootstrap
**Depends:** T01, T02, T03
**Files:** `apps/web/package.json`, `apps/web/tsconfig.json`, `apps/web/next.config.ts`, `apps/web/app/layout.tsx`, `apps/web/app/(marketing)/page.tsx`, `apps/web/app/globals.css`, `apps/web/postcss.config.mjs`, `apps/web/proxy.ts` (Next 16 renamed `middleware.ts`), `apps/web/public/.gitkeep`
**Steps:**
- `apps/web/package.json`: deps `next@^16.2.4`, `react@^19.2.5`, `react-dom@^19.2.5`, `zod@^4.4.2`. devDeps `@types/node`, `@types/react`, `@types/react-dom`, `typescript@^6.0.3`, `tailwindcss@latest`, `@tailwindcss/postcss`. scripts: `dev`, `build`, `start`, `lint`, `typecheck`.
- `tsconfig.json` extend base + paths `@/*`, `@bovion/db`, `@bovion/emails`.
- `next.config.ts` minimal (`{ reactStrictMode: true, transpilePackages: ['@bovion/db', '@bovion/emails'] }`).
- `app/layout.tsx`: html/body wrapper PT-BR (`<html lang="pt-BR">`).
- `app/(marketing)/page.tsx`: landing "Em construção" — botão health vem em BOOT-07.
- `globals.css`: tailwind imports.
- `proxy.ts`: passthrough `export function proxy() { return NextResponse.next() }` (Next 16 renamed `middleware.ts` → `proxy.ts`, function `middleware` → `proxy`).
**Verify:** `pnpm install`. `pnpm --filter web dev` sobe na :3000 — abrir browser, ver landing. Ctrl+C.
**Commit:** `feat(web): scaffold Next.js 16 app with marketing landing`
**Maps to AC:** BOOT-01:AC4, BOOT-01:AC5

---

## BOOT-08 — Tooling consistency  (paralelo BOOT-02)

### BOOT-08-T01: Biome config + scripts wired
**Depends:** BOOT-01-T01
**Files:** `biome.json`
**Steps:** Verbatim design.md sec "biome.json". Confirmar version `2.4.14`, schema `https://biomejs.dev/schemas/2.4.14/schema.json` (atualizar URL pra match version).
**Verify:** `pnpm dlx @biomejs/biome@^2.4.14 check . --reporter=summary` roda sem error fatal.
**Commit:** `chore(tooling): add biome config`
**Maps to AC:** BOOT-08:AC3, BOOT-08:AC4

### BOOT-08-T02: Husky + lint-staged
**Depends:** T01, BOOT-01-T01
**Files:** `.husky/pre-commit`, package.json (já tem `lint-staged` config)
**Steps:**
- `pnpm exec husky init` cria `.husky/_/` + `.husky/pre-commit`.
- Sobrescrever `.husky/pre-commit`: `pnpm exec lint-staged`.
- Confirmar `lint-staged` config no root `package.json` (já per design.md).
**Verify:** Tocar arquivo malformado (`echo "const X=  1" > /tmp/x.ts && cp /tmp/x.ts apps/web/x.ts`), `git add apps/web/x.ts && git commit -m "test"` deve auto-formatar via biome. Cleanup: `git reset HEAD~1 && rm apps/web/x.ts`.
**Commit:** `chore(tooling): add husky pre-commit running biome via lint-staged`
**Maps to AC:** BOOT-08:AC1, BOOT-08:AC2

### BOOT-08-T03: Vitest skeleton
**Depends:** BOOT-01-T03
**Files:** `vitest.config.ts` (root, opcional) ou `apps/web/vitest.config.ts` + `packages/db/vitest.config.ts` (per-package)
**Steps:**
- Decisão: per-package (apps/web jsdom, packages/db node).
- `apps/web/vitest.config.ts`: env `jsdom`, globals true.
- `packages/db/vitest.config.ts`: env `node`.
- `apps/web/__tests__/smoke.test.ts`: `it('truth', () => expect(true).toBe(true))` (placeholder).
- Adicionar `vitest@latest` em devDeps de cada package.
**Verify:** `pnpm test` (turbo run test) roda sem erro, 1 test pass.
**Commit:** `chore(tooling): add vitest skeleton per package`
**Maps to AC:** BOOT-08:AC5

### BOOT-08-T04: Typecheck script wired
**Depends:** T03
**Files:** `apps/web/package.json` (scripts), `packages/db/package.json` (scripts), `packages/emails/package.json` (scripts) — adicionar `"typecheck": "tsc --noEmit"`.
**Verify:** `pnpm typecheck` (turbo) — sai 0 (sem erros pq apps/web ainda mínimo).
**Commit:** `chore(tooling): wire typecheck scripts in workspaces`
**Maps to AC:** BOOT-08:AC6

---

## BOOT-02 — Database infra Drizzle

### BOOT-02-T01: packages/db skeleton
**Depends:** BOOT-01-T01
**Files:** `packages/db/package.json`, `packages/db/tsconfig.json`, `packages/db/.gitignore`
**Steps:**
- `package.json` verbatim design.md sec "packages/db/package.json" — bumped: `drizzle-orm@^0.45.2`, `drizzle-kit@^0.31.10`, `pg@^8.20.0`, `tsx@^4.21.0`, `@better-auth/cli@^1.6.9`. Scripts: generate/push/migrate/studio/seed/auth:generate.
- `tsconfig.json` extend base, `composite: true`.
- `.gitignore`: `dist/`, `*.tsbuildinfo`.
**Verify:** `pnpm install` resolve workspace `@bovion/db`. `pnpm --filter @bovion/db typecheck` (skip se sem fonte ainda).
**Commit:** `feat(db): scaffold @bovion/db package`
**Maps to AC:** BOOT-02 setup

### BOOT-02-T02: Drizzle config
**Depends:** T01
**Files:** `packages/db/drizzle.config.ts`
**Steps:** Verbatim design.md (`defineConfig({ dialect: 'postgresql', schema: './src/schema/index.ts', out: './migrations', dbCredentials: { url }, strict: true, verbose: true })`).
**Verify:** `DATABASE_URL=postgres://bovion:bovion@localhost:5433/bovion pnpm --filter @bovion/db exec drizzle-kit --help` roda.
**Commit:** `feat(db): add drizzle-kit config`
**Maps to AC:** BOOT-02:AC1, BOOT-02:AC6

### BOOT-02-T03: Schemas (farms + farm_settings + index barrel + auth/org placeholders)
**Depends:** T02
**Files:** `packages/db/src/schema/index.ts`, `packages/db/src/schema/farms.ts`, `packages/db/src/schema/farm-settings.ts`, `packages/db/src/schema/auth.ts` (placeholder vazio), `packages/db/src/schema/organization.ts` (placeholder vazio)
**Steps:**
- `farms.ts` + `farm-settings.ts` verbatim design.md (uuid id, fk org cascade, kg_per_arroba default 30, soft delete).
- `auth.ts` + `organization.ts` placeholder com `// gerado por better-auth/cli em BOOT-03-T04`.
- `index.ts` barrel: `export * from './auth'; export * from './organization'; export * from './farms'; export * from './farm-settings';`
**Verify:** `pnpm --filter @bovion/db typecheck` passa.
**Commit:** `feat(db): add farms + farm_settings schemas with auth placeholders`
**Maps to AC:** BOOT-02 schema base

### BOOT-02-T04: DB client + migrate runner + seed placeholder
**Depends:** T03
**Files:** `packages/db/src/index.ts`, `packages/db/scripts/migrate.ts`, `packages/db/scripts/seed.ts`
**Steps:**
- `src/index.ts` verbatim design.md (Pool + `drizzle({ client: pool, schema })` novo style).
- `scripts/migrate.ts` verbatim design.md.
- `scripts/seed.ts` placeholder `console.log('seed: no-op (M0); populated in BOOT-03-T04+ once auth schema exists)')`.
**Verify:** `pnpm typecheck` passa.
**Commit:** `feat(db): add drizzle client + migrate + seed scripts`
**Maps to AC:** BOOT-02:AC3, BOOT-02:AC5

### BOOT-02-T05: First migration via drizzle-kit generate (farms only)
**Depends:** T04, BOOT-01-T04 (postgres up)
**Files:** `packages/db/migrations/0000_init_farms.sql` (gerado)
**Steps:**
- Subir Postgres: `docker compose -f docker-compose.postgres.yml up -d`.
- `cp .env.example .env.local` ou criar com `DATABASE_URL=postgres://bovion:bovion@localhost:5433/bovion`.
- `pnpm db:generate --name init_farms` (executa drizzle-kit generate).
- Verificar SQL gerado tem `CREATE TABLE farms` + `CREATE TABLE farm_settings`.
- `pnpm db:migrate` aplica em local.
- `pnpm db:studio` (opcional) lista tabelas.
**Verify:** `psql postgres://bovion:bovion@localhost:5433/bovion -c "\dt"` lista `farms`, `farm_settings`, `__drizzle_migrations`.
**Commit:** `feat(db): generate first migration for farms tables`
**Maps to AC:** BOOT-02:AC1, BOOT-02:AC3, BOOT-02:AC4

---

## BOOT-03 — Auth foundation (Better Auth)

### BOOT-03-T01: Install Better Auth + env validator
**Depends:** BOOT-01-T05, BOOT-02-T04
**Files:** `apps/web/server/env.ts`, `apps/web/package.json` (deps), `.env.example`
**Steps:**
- `pnpm --filter web add better-auth@^1.6.9 zod@^4.4.2` (zod talvez já esteja).
- `pnpm --filter web add -D @better-auth/cli@^1.6.9` (CLI usado por @bovion/db, mas dev-time aqui).
- `apps/web/server/env.ts` verbatim design.md (zod schema atualizado SEM `RESEND_API_KEY`/`EMAIL_FROM`).
- `.env.example`:
  ```
  DATABASE_URL=postgres://bovion:bovion@localhost:5433/bovion
  BETTER_AUTH_SECRET=replace-me-with-openssl-rand-base64-32
  BETTER_AUTH_URL=http://localhost:3000
  APP_URL=http://localhost:3000
  ```
**Verify:** `pnpm typecheck`. Tentar `pnpm --filter web dev` SEM `.env.local` → deve falhar com mensagem zod estruturada.
**Commit:** `feat(web): add env validator with zod`
**Maps to AC:** BOOT-03:AC6, BOOT-03:AC7

### BOOT-03-T02: Better Auth instance + organization plugin
**Depends:** T01
**Files:** `apps/web/server/auth.ts`, `apps/web/server/db.ts` (re-export `@bovion/db`)
**Steps:**
- `server/db.ts`: `export { db } from '@bovion/db'`.
- `server/auth.ts` verbatim design.md sec "AuthModule" — mas SEM Resend imports. Email senders chamam `sendEmail` stub (importado de `@bovion/emails`). Aplicar Q1 plural overrides: `user: { modelName: 'users' }`, etc. + plugin `organization({ schema: { organization: { modelName: 'organizations' }, ... } })`. Aplicar Q4 deferred: `requireEmailVerification: false`, `sendOnSignUp: false`. Cookie cache 5min, expiresIn 30d.
**Verify:** `pnpm typecheck` passa. Import `auth.api.getSession` resolve tipo.
**Commit:** `feat(auth): add better-auth instance with organization plugin (plural model names)`
**Maps to AC:** BOOT-03:AC1, BOOT-03:AC2, BOOT-03:AC3

### BOOT-03-T03: Auth route handler
**Depends:** T02
**Files:** `apps/web/app/api/auth/[...all]/route.ts`
**Steps:** Verbatim design.md (`export const { GET, POST } = toNextJsHandler(auth)`).
**Verify:** `pnpm --filter web dev` sobe, `curl http://localhost:3000/api/auth/get-session` retorna `{ session: null, user: null }` HTTP 200 sem 500.
**Commit:** `feat(auth): add catch-all route handler for better-auth`
**Maps to AC:** BOOT-03:AC5

### BOOT-03-T04: Generate auth schema + migration
**Depends:** T02, BOOT-02-T05
**Files:** `packages/db/src/schema/auth.ts` (sobrescrito), `packages/db/src/schema/organization.ts` (sobrescrito), `packages/db/migrations/0001_auth.sql` (gerado)
**Steps:**
- `pnpm auth:generate` (CLI Better Auth lê `apps/web/server/auth.ts` config + plural overrides + organization plugin) → escreve schema em `packages/db/src/schema/auth.ts`.
- Mover bloco organization gerado pra `organization.ts` separado (ou manter junto se CLI não separar). Atualizar barrel `index.ts`.
- `pnpm db:generate --name auth` → cria `migrations/0001_auth.sql` com tabelas `users`, `sessions`, `accounts`, `verifications`, `organizations`, `members`, `invitations`.
- `pnpm db:migrate` aplica.
- `psql ... -c "\dt"` confirma 9 tabelas (farms + farm_settings + 7 auth/org).
- Atualizar `seed.ts`: criar 1 user via `auth.api.signUpEmail` + 1 org + 1 member(owner) + 1 farm (Q3 resolution).
**Verify:** `pnpm db:seed` → exit 0 + log `seed ok: { email: 'dev@bovion.local', password: 'devpass123', orgSlug: 'demo' }`. Studio lista user/org/member/farm.
**Commit:** `feat(db): generate better-auth schema + seed minimal data`
**Maps to AC:** BOOT-03:AC4, BOOT-02:AC5

---

## BOOT-04 — Email stub

### BOOT-04-T01: packages/emails skeleton
**Depends:** BOOT-01-T01
**Files:** `packages/emails/package.json`, `packages/emails/tsconfig.json`, `packages/emails/.gitignore`
**Steps:**
- `package.json`:
  ```json
  {
    "name": "@bovion/emails",
    "version": "0.0.0",
    "private": true,
    "type": "module",
    "exports": { ".": "./src/index.ts", "./send": "./src/send.ts", "./templates/*": "./src/templates/*.tsx" },
    "scripts": {
      "preview": "email dev --port 3001 --dir ./src/templates",
      "lint": "biome check .",
      "typecheck": "tsc --noEmit"
    },
    "dependencies": {
      "@react-email/components": "^1.0.12",
      "react": "^19.2.5"
    },
    "devDependencies": {
      "react-email": "^4.0.0",
      "typescript": "^6.0.3"
    }
  }
  ```
- `tsconfig.json` extend base, jsx `react-jsx`.
**Verify:** `pnpm install` resolve workspace `@bovion/emails`.
**Commit:** `feat(emails): scaffold @bovion/emails package`
**Maps to AC:** BOOT-04 setup

### BOOT-04-T02: sendEmail stub + barrel
**Depends:** T01
**Files:** `packages/emails/src/send.ts`, `packages/emails/src/index.ts`
**Steps:**
- `send.ts` verbatim design.md sec "Email Wrapper M0" — stub console-only, returns `{ id: 'console-noop-<uuid>' }`. Sem `resend` import.
- `index.ts` barrel: `export { sendEmail } from './send'; export * from './templates/welcome'; export * from './templates/reset-password'; export * from './templates/verify-email';`
**Verify:** `pnpm --filter @bovion/emails typecheck`. Quick eval: `pnpm --filter @bovion/emails exec tsx -e "import('./src/send').then(m => m.sendEmail({to:'a@b.c',subject:'x',text:'y'}).then(r => console.log(r)))"` → vê `[email:stub]` payload + `{ id: 'console-noop-...' }`.
**Commit:** `feat(emails): add sendEmail console stub`
**Maps to AC:** BOOT-04:AC1, BOOT-04:AC2, BOOT-04:AC5

### BOOT-04-T03: React Email templates (welcome + reset-password + verify-email)
**Depends:** T02
**Files:** `packages/emails/src/templates/welcome.tsx`, `packages/emails/src/templates/reset-password.tsx`, `packages/emails/src/templates/verify-email.tsx`
**Steps:** Cada template usa `@react-email/components` (Html/Body/Container/Heading/Text/Button/Tailwind). Props: `welcome({ name })`, `reset-password({ name, url })`, `verify-email({ name, url })`. Texto PT-BR.
**Verify:** `pnpm --filter @bovion/emails preview` sobe `react-email` em :3001 — browser lista 3 templates renderizando.
**Commit:** `feat(emails): add welcome/reset-password/verify-email templates`
**Maps to AC:** BOOT-04:AC3, BOOT-04:AC4

---

## BOOT-07 — Health endpoint + landing button

### BOOT-07-T01: /api/health route
**Depends:** BOOT-03-T03 (web sobe), BOOT-02-T05 (DB up)
**Files:** `apps/web/app/api/health/route.ts`
**Steps:** Verbatim design.md sec "Health Endpoint" (runtime nodejs, force-dynamic, `SELECT 1` via `db.execute(sql`SELECT 1`)`, retorna `{ ok, db, commit, timestamp }` ou 503).
**Verify:** `pnpm --filter web dev` + `curl -s http://localhost:3000/api/health | jq` → `{ ok: true, db: 'connected', commit: 'local', timestamp: '...' }`. Stop Postgres (`docker compose down`) + curl novamente → 503 + `db: 'disconnected'`.
**Commit:** `feat(web): add /api/health endpoint with DB check`
**Maps to AC:** BOOT-07:AC1, BOOT-07:AC2, BOOT-07:AC3, BOOT-07:AC6

### BOOT-07-T02: Landing health button
**Depends:** T01
**Files:** `apps/web/app/(marketing)/page.tsx`
**Steps:** Adicionar botão client-side ("use client" component separado) que chama `fetch('/api/health')` e mostra resultado em `<pre>`. Mantém SSG da page (botão em sub-component client).
**Verify:** Browser :3000 → click "Health check" → vê JSON na tela.
**Commit:** `feat(web): add health check button on marketing landing`
**Maps to AC:** BOOT-01:AC5, BOOT-07 user-validation

---

## BOOT-06 — CI pipeline  (paralelo BOOT-05)

### BOOT-06-T01: GitHub Actions workflow
**Depends:** BOOT-08-T04, BOOT-02-T05, BOOT-07-T01
**Files:** `.github/workflows/ci.yml`
**Steps:** Verbatim design.md sec ".github/workflows/ci.yml". Postgres service container 16-alpine, env vars dummy CI-side, steps: install + lint + db:migrate + typecheck + test + build. Concurrency cancel-in-progress.
**Verify:** Push branch test → ver workflow rodar verde no GitHub Actions UI. Cleanup branch após.
**Commit:** `ci: add github actions workflow with postgres service`
**Maps to AC:** BOOT-06:AC1, BOOT-06:AC3, BOOT-06:AC5, BOOT-06:AC7

### BOOT-06-T02: Branch protection (manual)
**Depends:** T01 (workflow run pelo menos 1x)
**Files:** N/A — config GitHub UI
**Steps:**
- GitHub repo → Settings → Branches → Add rule pra `main`:
  - Require PR before merge
  - Require status check `ci` passing
  - Require up-to-date branch
  - Block force push
**Verify:** Tentar push direto em `main` deve falhar.
**Commit:** N/A (config externa). Documentar em `README.md` sec "Repo policy".
**Maps to AC:** BOOT-06:AC2, BOOT-06:AC6

### BOOT-06-T03: Dependabot (deferrable)
**Depends:** T01
**Files:** `.github/dependabot.yml`
**Steps:** Schedule weekly pra npm + github-actions. Group minor/patch.
**Verify:** PR dependabot abre na semana seguinte.
**Commit:** `ci: add dependabot weekly bumps`
**Maps to AC:** BOOT-06:AC6

---

## BOOT-05 — Deploy + domínio bovion.com.br  (paralelo BOOT-06)

### BOOT-05-T01: vercel.json
**Depends:** BOOT-01-T05
**Files:** `vercel.json`
**Steps:** Verbatim design.md (framework nextjs, buildCommand, installCommand, ignoreCommand, redirects placeholder, crons vazio).
**Verify:** `cat vercel.json | jq '.framework'` = `"nextjs"`.
**Commit:** `chore(deploy): add vercel.json`
**Maps to AC:** BOOT-05 setup

### BOOT-05-T02: Vercel project link + env vars (manual)
**Depends:** T01, BOOT-03-T01
**Files:** N/A — Vercel dashboard
**Steps:**
- `pnpm dlx vercel@latest link` no repo (ou via dashboard "Import Project").
- Settings → Environment Variables (Production + Preview):
  - `DATABASE_URL` (Supabase prod connection string — pgbouncer pooler)
  - `BETTER_AUTH_SECRET` (`openssl rand -base64 32`)
  - `BETTER_AUTH_URL` = `https://bovion.com.br`
  - `APP_URL` = `https://bovion.com.br`
- Trigger redeploy.
**Verify:** PR aberto → preview deploy comment no PR. URL `*.vercel.app` carrega landing.
**Commit:** N/A (config externa). Documentar em `README.md` sec "Deploy".
**Maps to AC:** BOOT-05:AC1, BOOT-05:AC3

### BOOT-05-T03: DNS bovion.com.br apex + www redirect (manual)
**Depends:** T02
**Files:** N/A — registrar DNS + Vercel domain settings
**Steps:**
- Vercel project → Settings → Domains → Add `bovion.com.br` + `www.bovion.com.br`.
- Vercel mostra DNS records esperados (A `76.76.21.21` apex + CNAME `cname.vercel-dns.com` www).
- Aplicar no registrador DNS.
- Vercel domain settings → set `bovion.com.br` como primary → `www` redirect 301 apex.
**Verify:** `dig bovion.com.br` retorna A 76.76.21.21. `curl -I https://www.bovion.com.br` retorna 308/301 → `https://bovion.com.br`. SSL ativo.
**Commit:** N/A. Documentar em `README.md` sec "Deploy/DNS".
**Maps to AC:** BOOT-05:AC4, BOOT-05:AC5

### BOOT-05-T04: Prod smoke test
**Depends:** T03, BOOT-07-T01
**Files:** N/A
**Steps:**
- `git push origin main` (vazio ou commit doc) → prod deploy roda.
- `curl -s https://bovion.com.br/api/health | jq` → 200 + `{ ok: true, db: 'connected', commit: '<sha7>', timestamp }`.
**Verify:** comando acima retorna `ok: true`. Captura output em PR doc / STATE.md.
**Commit:** `docs: record m0 prod smoke test result`
**Maps to AC:** BOOT-05:AC2, BOOT-05:AC7, BOOT-07:AC4

---

## EPILOGUE

### EPILOGUE-T01: README.md final pass
**Depends:** todas as anteriores
**Files:** `README.md`
**Steps:** Polir README com:
- Badge CI verde
- Setup local (4 comandos)
- Stack visão geral (link pra PROJECT.md)
- Scripts úteis (db:push/migrate/seed/studio, dev, build, lint, format, test, typecheck)
- Estrutura monorepo (link pra design.md)
- Deploy (link pra vercel project)
**Verify:** Dev externo (não-autor) segue README e completa setup ≤5min. Captura tempo em STATE.md.
**Commit:** `docs: polish README with full M0 setup guide`
**Maps to AC:** BOOT-01:AC6

### EPILOGUE-T02: STATE.md handoff M0 → M1
**Depends:** T01
**Files:** `.specs/project/STATE.md`
**Steps:**
- Marcar todos M0 todos `[x]`.
- Adicionar Lessons (o que aprendeu durante execução M0).
- Próximo passo: spec AUTH-001 em M1 (Phase 1 tlc-spec-driven novo feature dir `.specs/features/auth-001-login/`).
- Update Decisions com qualquer surprise discovered durante execução.
**Verify:** `cat .specs/project/STATE.md` mostra M0 fechado.
**Commit:** `docs(state): close M0 + handoff to M1 AUTH-001`
**Maps to AC:** Roadmap progression

---

## Execution Notes

- **Worktree per task:** `git worktree add .claude/worktrees/<task-id> -b boot/<task-id>` antes de cada task. Limpar pós-merge.
- **Commit message preview** acima é só sugestão — adaptar se task acumular >1 escopo (split então).
- **Verify failures:** se verify falha, NÃO commitar. Iterar até verde. Se bloqueador real, marcar Blocker em STATE.md.
- **External configs (Vercel/DNS/GitHub branch protection):** sem commit; documentar em README + STATE.md.
- **Seed iterativo:** seed.ts evolui ao longo de M1+ (mais tabelas). M0 só prova mecanismo.

---

## Requirement Coverage

| Spec ID | Tasks |
|---------|-------|
| BOOT-01 | T01, T02, T03, T04, T05, EPILOGUE-T01 |
| BOOT-02 | BOOT-02-T01..T05 |
| BOOT-03 | BOOT-03-T01..T04 |
| BOOT-04 | BOOT-04-T01..T03 |
| BOOT-05 | BOOT-05-T01..T04 |
| BOOT-06 | BOOT-06-T01..T03 |
| BOOT-07 | BOOT-07-T01, T02 |
| BOOT-08 | BOOT-08-T01..T04 |

**8 specs / 32 tasks. Cobertura 100%.**
