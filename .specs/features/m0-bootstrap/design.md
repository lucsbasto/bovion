# M0 — Bootstrap & Infra Design

**Spec**: `.specs/features/m0-bootstrap/spec.md`
**Status**: Draft
**Updated**: 2026-05-03

> APIs verbatim verified via Context7 MCP (Better Auth, Drizzle, Next.js 15, Resend, Vercel, Turborepo). Não inventar shape — quando ambíguo, marcar `// TODO verificar` e checar antes de Tasks.

---

## Architecture Overview

Monorepo Turborepo + pnpm. App único `apps/web` (Next.js 15 full-stack). Pacotes compartilhados `packages/db` (schema Drizzle + client) e `packages/emails` (templates React Email + wrapper Resend). Postgres local via Docker (porta 5433) em dev; Supabase Postgres em prod (free tier). Better Auth com `drizzleAdapter` + plugin `organization` para multi-tenant. CI GitHub Actions com service container Postgres 16. Deploy Vercel Hobby; domínio `bovion.com.br` apex.

```mermaid
graph TB
  subgraph "Dev local"
    DEV[Developer]
    DEV -->|pnpm dev| WEB_LOCAL[apps/web :3000]
    DEV -->|docker compose up| PG_LOCAL[(Postgres 16 :5433)]
    WEB_LOCAL --> PG_LOCAL
  end

  subgraph "GitHub"
    REPO[lucsbasto/bovion]
    REPO -->|push PR| CI[GH Actions ci.yml]
    CI -->|service container| PG_CI[(Postgres 16)]
    CI -->|biome+tsc+vitest+next build+db:migrate| GATE{Green?}
  end

  subgraph "Vercel Hobby"
    PREVIEW[Preview deploy /pull/*]
    PROD[Prod bovion.com.br]
  end

  subgraph "Supabase free"
    PG_PROD[(Postgres prod)]
  end

  subgraph "Resend free"
    RESEND[Resend API]
  end

  GATE -->|merge main| PROD
  GATE -->|PR open| PREVIEW
  PROD --> PG_PROD
  PROD --> RESEND
  PREVIEW --> PG_PROD
  PREVIEW --> RESEND
```

---

## Code Reuse Analysis

### Existing Components to Leverage

Repo bootstrap — sem código pré-existente. Toda escolha é greenfield.

### Integration Points

| System              | Integration Method                                                                |
| ------------------- | --------------------------------------------------------------------------------- |
| Better Auth schema  | CLI `npx @better-auth/cli@latest generate --output packages/db/schema/auth.ts`    |
| Drizzle ↔ Postgres  | `drizzle-orm/node-postgres` com `pg.Pool({ connectionString: DATABASE_URL })`      |
| Better Auth ↔ Next  | `toNextJsHandler(auth)` em `app/api/auth/[...all]/route.ts`                        |
| Resend ↔ React Email| **DEFERRED M6.** M0..M5 usa stub `console.info`. Quando integrar: `resend.emails.send({ react: <Component /> })`. |
| Vercel ↔ GitHub     | Vercel app GitHub integration (auto preview + prod)                                |

---

## Components

### AuthModule

- **Purpose**: Instância Better Auth única, importada por route handler `/api/auth/[...all]` e por Server Actions/middleware via `auth.api.getSession`.
- **Location**: `apps/web/server/auth.ts`
- **Interfaces**:
  - `auth: BetterAuthInstance` — singleton exportado
  - `auth.api.getSession({ headers })` — leitura de sessão server-side
  - `auth.api.signInEmail`, `signUpEmail`, etc. — usados por Server Actions M1
- **Dependencies**: `better-auth`, `better-auth/adapters/drizzle`, `better-auth/plugins.organization`, `better-auth/next-js.toNextJsHandler`, `@bovion/db.client`, `@bovion/emails.sendEmail`, `env`
- **Reuses**: schema gerado pelo CLI Better Auth → consumido pelo Drizzle como `users/sessions/accounts/verifications/organizations/members/invitations`
- **Config travado** (verbatim verificado Context7):
  ```ts
  // apps/web/server/auth.ts
  import { betterAuth } from "better-auth";
  import { drizzleAdapter } from "better-auth/adapters/drizzle";
  import { organization } from "better-auth/plugins";
  import { db } from "@bovion/db";
  import { sendEmail } from "@bovion/emails";
  import { WelcomeEmail, ResetPasswordEmail, VerifyEmail } from "@bovion/emails";
  import { env } from "./env";

  export const auth = betterAuth({
    appName: "Bovion",
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    database: drizzleAdapter(db, { provider: "pg" }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false, // M0..M5 stub-only emails; M6 flips true after Resend
      minPasswordLength: 8,
      autoSignIn: false,
      sendResetPassword: async ({ user, url }) => {
        // M0..M5: payload cai no console.info via sendEmail stub
        void sendEmail({
          to: user.email,
          subject: "Redefinir sua senha — Bovion",
          react: ResetPasswordEmail({ name: user.name, url }),
        });
      },
      revokeSessionsOnPasswordReset: true,
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        void sendEmail({
          to: user.email,
          subject: "Confirme seu email — Bovion",
          react: VerifyEmail({ name: user.name, url }),
        });
      },
      sendOnSignUp: false, // M6 flips true
      autoSignInAfterVerification: true,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30d
      updateAge: 60 * 60 * 24,       // 1d rolling
      cookieCache: { enabled: true, maxAge: 5 * 60 }, // 5min
    },
    plugins: [
      organization({
        // roles default: owner | admin | member — ampliados em M1 (manager/viewer)
      }),
    ],
  });
  ```
- **Trade-off**: usar `requireEmailVerification: true` desde M0 protege CI/preview de spam. M1 instala fluxo UI; M0 só prova que rota responde sem 500.

### DB Client (`@bovion/db`)

- **Purpose**: Singleton `drizzle()` + re-export de schema completo.
- **Location**: `packages/db/src/index.ts`
- **Interfaces**:
  - `db: NodePgDatabase<typeof schema>`
  - `pool: pg.Pool` (exportado pra `migrate.ts` e tests)
  - `* from "./schema"` (todas tabelas tipadas)
- **Dependencies**: `drizzle-orm/node-postgres`, `pg`, `@bovion/db/schema/*`
- **Reuses**: `DATABASE_URL` validado pelo `env`
- **Shape**:
  ```ts
  // packages/db/src/index.ts
  import { drizzle } from "drizzle-orm/node-postgres";
  import { Pool } from "pg";
  import * as schema from "./schema";

  // Drizzle 0.35+ preferred client form: drizzle({ client, schema })
  // Old `drizzle(pool, { schema })` is deprecated but still works until v1.
  export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  export const db = drizzle({ client: pool, schema });
  export * from "./schema";
  export type DB = typeof db;
  ```

### Email Wrapper (`@bovion/emails`) — console-only stub em M0..M5

- **Purpose**: Interface estável `sendEmail()` chamada por Better Auth + Server Actions. Backend é console-only até **M6 Go-Live** (Resend SDK + DNS DKIM/SPF entram lá). Pré-MVP usuários são internos — emails reais não são bloqueador de feature.
- **Location**: `packages/emails/src/send.ts`
- **Interfaces**:
  - `sendEmail({ to, subject, react?, text?, html? }): Promise<{ id: string }>`
- **Dependencies (M0..M5)**: `@react-email/components`, `react-email` (dev — preview server). **Sem `resend` SDK.**
- **Reuses**: nenhum env var em M0..M5 (sem `RESEND_API_KEY`).
- **Shape (M0)**:
  ```ts
  // packages/emails/src/send.ts
  import type { ReactElement } from "react";
  import { randomUUID } from "node:crypto";

  type SendInput = {
    to: string | string[];
    subject: string;
    react?: ReactElement;
    text?: string;
    html?: string;
  };

  export async function sendEmail(input: SendInput): Promise<{ id: string }> {
    const id = `console-noop-${randomUUID()}`;
    console.info("[email:stub]", JSON.stringify({
      id,
      to: input.to,
      subject: input.subject,
      hasReact: !!input.react,
      text: input.text,
      html: input.html,
    }, null, 2));
    return { id };
  }
  ```
- **M6 swap (deferred spec):** instalar `resend`, adicionar `RESEND_API_KEY` + `EMAIL_FROM` env, swap stub por chamada `resend.emails.send({ from, to, subject, react })`. Interface pública não muda — zero impacto em callers.

### Health Endpoint

- **Purpose**: prova ponta a ponta app↔DB; entrada futura pra monitoring.
- **Location**: `apps/web/app/api/health/route.ts`
- **Interfaces**: `GET /api/health` → `200 { ok, db, commit, timestamp } | 503 { ok: false, db, error }`
- **Dependencies**: `@bovion/db.db`, `drizzle-orm.sql`
- **Shape** (Next.js 15 App Router — `params` async N/A pois rota sem segmento dinâmico):
  ```ts
  // apps/web/app/api/health/route.ts
  import { db } from "@bovion/db";
  import { sql } from "drizzle-orm";
  import { NextResponse } from "next/server";

  export const dynamic = "force-dynamic"; // no static cache
  export const runtime = "nodejs";

  export async function GET() {
    const commit = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7)
      ?? process.env.GIT_COMMIT_SHA?.slice(0, 7)
      ?? "local";
    const timestamp = new Date().toISOString();
    try {
      await db.execute(sql`SELECT 1`);
      return NextResponse.json({ ok: true, db: "connected", commit, timestamp });
    } catch (error) {
      return NextResponse.json(
        { ok: false, db: "disconnected", error: (error as Error).message, commit, timestamp },
        { status: 503 },
      );
    }
  }
  ```

### Env Validator

- **Purpose**: Falha rápida no boot se var crítica ausente. Single source of truth pra tipos `process.env`.
- **Location**: `apps/web/server/env.ts`
- **Interfaces**: `env: z.infer<typeof schema>` exportado
- **Dependencies**: `zod`
- **Shape**:
  ```ts
  // apps/web/server/env.ts
  import { z } from "zod";

  const schema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string().url(),
    APP_URL: z.string().url(),
    // RESEND_API_KEY + EMAIL_FROM removidos — entram em M6 spec EMAIL-PROVIDER
    // Pré-MVP sendEmail é stub console-only. Sem env vars relacionadas.
    GIT_COMMIT_SHA: z.string().optional(),
    VERCEL_GIT_COMMIT_SHA: z.string().optional(),
  });

  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid env:", parsed.error.flatten().fieldErrors);
    throw new Error("Missing/invalid environment variables — see logs above");
  }
  export const env = parsed.data;
  ```

### Auth Route Handler

- **Location**: `apps/web/app/api/auth/[...all]/route.ts`
- **Shape** (verbatim Better Auth docs):
  ```ts
  import { auth } from "@/server/auth";
  import { toNextJsHandler } from "better-auth/next-js";

  export const { GET, POST } = toNextJsHandler(auth);
  ```

---

## Data Models

### Better Auth tables (geradas pelo CLI)

```bash
pnpm --filter @bovion/db exec better-auth generate \
  --output ./src/schema/auth.ts \
  --config ../../apps/web/server/auth.ts \
  --yes
```

Tabelas geradas:
- `user` — id, name, email (unique), emailVerified, image, createdAt, updatedAt
- `session` — id, userId, token, expiresAt, ipAddress, userAgent, activeOrganizationId (estendido pelo plugin organization)
- `account` — id, userId, providerId, accountId, password (hash scrypt), tokens OAuth
- `verification` — id, identifier, value, expiresAt
- `organization` — id, name, slug (unique), logo, metadata, createdAt
- `member` — id, organizationId, userId, role (owner/admin/member), createdAt
- `invitation` — id, organizationId, email, role, status, expiresAt, inviterId

> Renomear pra plural opcional via `modelName` no Better Auth config (M1, não bloqueante).

### Custom Bovion tables (M0 esqueleto)

```ts
// packages/db/src/schema/farms.ts
import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { organization } from "./auth";

export const farms = pgTable("farms", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

```ts
// packages/db/src/schema/farm-settings.ts
import { pgTable, integer, uuid, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { farms } from "./farms";

export const farmSettings = pgTable("farm_settings", {
  farmId: uuid("farm_id")
    .primaryKey()
    .references(() => farms.id, { onDelete: "cascade" }),
  kgPerArroba: integer("kg_per_arroba").notNull().default(30),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// CHECK constraint kg_per_arroba = 30 (hard, não configurável)
// criada via migration SQL gerada com sql`...` ou via .sql custom em packages/db/migrations/
```

> M0 trava esqueleto. Specs FARM-002 (M1) expandem `farm_settings` com price-per-arroba etc.

```ts
// packages/db/src/schema/index.ts
export * from "./auth";
export * from "./farms";
export * from "./farm-settings";
```

---

## Directory Structure

```
bovion/
├── apps/
│   └── web/
│       ├── app/
│       │   ├── (marketing)/page.tsx          # landing "Em construção"
│       │   ├── api/
│       │   │   ├── auth/[...all]/route.ts    # Better Auth handler
│       │   │   └── health/route.ts           # health check
│       │   ├── layout.tsx
│       │   └── globals.css
│       ├── server/
│       │   ├── auth.ts                       # Better Auth instance
│       │   └── env.ts                        # zod env validator
│       ├── public/
│       ├── next.config.ts
│       ├── tsconfig.json
│       └── package.json
├── packages/
│   ├── db/
│   │   ├── src/
│   │   │   ├── index.ts                      # drizzle client + re-exports
│   │   │   └── schema/
│   │   │       ├── index.ts                  # barrel
│   │   │       ├── auth.ts                   # gerado pelo Better Auth CLI
│   │   │       ├── farms.ts
│   │   │       └── farm-settings.ts
│   │   ├── migrations/                       # SQL versionado (drizzle-kit generate)
│   │   ├── scripts/
│   │   │   ├── migrate.ts                    # programmatic migrate em prod
│   │   │   └── seed.ts                       # placeholder M0
│   │   ├── drizzle.config.ts
│   │   └── package.json
│   └── emails/
│       ├── src/
│       │   ├── send.ts                       # wrapper Resend
│       │   ├── index.ts                      # barrel
│       │   └── templates/
│       │       ├── welcome.tsx
│       │       ├── reset-password.tsx
│       │       └── verify-email.tsx
│       └── package.json
├── .github/
│   └── workflows/
│       └── ci.yml
├── .specs/                                    # já existe
├── .claude/
├── docker-compose.postgres.yml
├── biome.json
├── turbo.json
├── tsconfig.base.json
├── pnpm-workspace.yaml
├── vercel.json
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## Config Files (verbatim)

### `package.json` (root)

```json
{
  "name": "bovion",
  "private": true,
  "packageManager": "pnpm@10.33.2",
  "engines": { "node": ">=24.0.0" },
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "biome check .",
    "format": "biome check --write .",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "db:generate": "pnpm --filter @bovion/db generate",
    "db:push": "pnpm --filter @bovion/db push",
    "db:migrate": "pnpm --filter @bovion/db migrate",
    "db:studio": "pnpm --filter @bovion/db studio",
    "db:seed": "pnpm --filter @bovion/db seed",
    "auth:generate": "pnpm --filter @bovion/db auth:generate",
    "prepare": "husky"
  },
  "devDependencies": {
    "@biomejs/biome": "^2.4.14",
    "turbo": "^2.9.7",
    "typescript": "^6.0.3",
    "husky": "^9.1.7",
    "lint-staged": "^16.4.0"
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx,json,md}": ["biome check --write --no-errors-on-unmatched"]
  }
}
```

### `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### `turbo.json`

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"],
      "env": ["NODE_ENV", "VERCEL_GIT_COMMIT_SHA"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    }
  }
}
```

> Verbatim Turborepo docs: top-level `tasks` (não `pipeline`).

### `tsconfig.base.json` (root)

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true
  },
  "exclude": ["node_modules", "dist", ".next", ".turbo"]
}
```

### `apps/web/tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "ES2022"],
    "jsx": "preserve",
    "noEmit": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]
}
```

### `biome.json`

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
  "files": {
    "includes": ["**/*.{ts,tsx,js,jsx,json,md}"],
    "ignore": ["**/.next", "**/dist", "**/node_modules", "**/migrations/*.sql"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": { "recommended": true }
  },
  "javascript": {
    "formatter": { "quoteStyle": "double", "semicolons": "always", "trailingCommas": "all" }
  }
}
```

### `docker-compose.postgres.yml`

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: bovion-postgres
    restart: unless-stopped
    ports: ["5433:5432"]
    environment:
      POSTGRES_USER: bovion
      POSTGRES_PASSWORD: bovion
      POSTGRES_DB: bovion
    volumes:
      - bovion-pg-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bovion -d bovion"]
      interval: 5s
      timeout: 3s
      retries: 10

volumes:
  bovion-pg-data:
```

### `packages/db/drizzle.config.ts`

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema/index.ts",
  out: "./migrations",
  dbCredentials: { url: process.env.DATABASE_URL! },
  strict: true,
  verbose: true,
});
```

### `packages/db/package.json` (scripts)

```json
{
  "name": "@bovion/db",
  "type": "module",
  "exports": { ".": "./src/index.ts", "./schema": "./src/schema/index.ts" },
  "scripts": {
    "generate": "drizzle-kit generate",
    "push": "drizzle-kit push",
    "migrate": "tsx scripts/migrate.ts",
    "studio": "drizzle-kit studio",
    "seed": "tsx scripts/seed.ts",
    "auth:generate": "better-auth generate --output ./src/schema/auth.ts --config ../../apps/web/server/auth.ts --yes"
  },
  "dependencies": {
    "drizzle-orm": "^0.45.2",
    "pg": "^8.20.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.31.10",
    "@types/pg": "^8.11.0",
    "tsx": "^4.21.0",
    "@better-auth/cli": "^1.6.9"
  }
}
```

### `packages/db/scripts/migrate.ts`

```ts
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

await migrate(db, { migrationsFolder: "./migrations" });
console.log("✅ migrations applied");
await pool.end();
```

### `vercel.json`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install --frozen-lockfile",
  "ignoreCommand": "git diff --quiet HEAD^ HEAD ./apps/web ./packages",
  "redirects": [
    { "source": "/home", "destination": "/", "permanent": true }
  ],
  "crons": []
}
```

> M0 não tem cron. Array vazio reservado pra M5 (BILLING) e M6 (overage daily). Hobby tier limita 1 execução/dia por cron.
> Apex domain (`bovion.com.br`) configurado via dashboard Vercel; `www` redirect 301 → apex via Vercel domain settings (não via `redirects`).

### `.github/workflows/ci.yml`

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  ci:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: bovion
          POSTGRES_PASSWORD: bovion
          POSTGRES_DB: bovion
        ports: ["5432:5432"]
        options: >-
          --health-cmd "pg_isready -U bovion"
          --health-interval 5s
          --health-timeout 3s
          --health-retries 10

    env:
      DATABASE_URL: postgresql://bovion:bovion@localhost:5432/bovion
      BETTER_AUTH_SECRET: ci-secret-32-chars-minimum-xxxxxxxxxx
      BETTER_AUTH_URL: http://localhost:3000
      APP_URL: http://localhost:3000

    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 1 }

      - uses: pnpm/action-setup@v4
        with: { version: 9 }

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - name: Lint (Biome)
        run: pnpm lint

      - name: Migrate DB
        run: pnpm db:migrate

      - name: Typecheck
        run: pnpm typecheck

      - name: Test
        run: pnpm test

      - name: Build
        run: pnpm build
```

---

## Error Handling Strategy

| Cenário                                    | Handling                                                              | Impacto usuário                            |
| ------------------------------------------ | --------------------------------------------------------------------- | ------------------------------------------ |
| `DATABASE_URL` ausente                     | `env.ts` `safeParse` falha no import → throw                          | Boot falha; build/dev nunca sobe           |
| `BETTER_AUTH_SECRET` ausente               | idem (mín 32 chars zod)                                               | idem                                       |
| Postgres down em runtime                   | `/api/health` retorna 503 com mensagem; outras rotas 500              | Health monitoring alerta                   |
| `sendEmail` chamado em qualquer ambiente   | Stub console-only — sempre `console.info` payload + retorna `{ id: 'console-noop-<uuid>' }`. M0..M5. | Dev/preview/prod = mesmo comportamento até M6 |
| Resend swap (M6)                            | M6 EMAIL-PROVIDER spec instala SDK + env; sem `RESEND_API_KEY` em prod = build fail via zod | Bloqueia deploy M6+ sem provider |
| Migration conflict (duas branches)         | drizzle-kit gera arquivos NNNN_*.sql; merge conflict explícito         | Resolver renumerando arquivo manualmente   |
| Better Auth schema drift entre versões     | spec futura (BOOT-09) — fora M0                                        | —                                          |
| CI sem secrets                             | env definido no workflow + GitHub repo secrets em jobs prod-only       | Falha clara no step                        |

---

## Tech Decisions

| Decisão                                  | Escolha                                          | Rationale                                                                                                                                                          |
| ---------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Migration workflow dev vs prod           | `db:push` em dev, `db:generate + db:migrate` em prod | `push` é direto schema→DB (sem arquivo SQL), zero overhead pra iterar. `generate` cria SQL versionado pra prod auditável. Misturar gera drift.                     |
| Postgres driver                          | `node-postgres` (pg.Pool)                        | Suporta migration via `drizzle-orm/node-postgres/migrator`. Postgres.js requer `max:1` workaround. Vercel runtime Node aceita pg sem edge constraint.              |
| Cookie cache 5min                        | `cookieCache.maxAge: 300`                        | Reduz query de sessão em ~95% em rotas hot path. Trade-off: revogação atrasa até 5min — aceitável (sem caso financial-grade no M0).                                |
| Apex domain `bovion.com.br`              | apex (não `www.`)                                | Mais curto; já é o branding. `www` 301 → apex via Vercel dashboard.                                                                                                |
| Better Auth schema gerado por CLI        | `npx better-auth generate --output schema/auth.ts` | Manter sync com upgrades Better Auth. Custom tables ficam em `farms.ts`/`farm-settings.ts` — sem mistura.                                                          |
| `requireEmailVerification: true` em M0   | enabled                                          | Protege endpoints de spam mesmo sem UI funcional. M1 implementa fluxo; M0 só prova handler responde.                                                               |
| Env validator zod no boot                | `safeParse + throw`                              | Falha visível antes de aceitar tráfego — zod retorna fieldErrors estruturado, melhor que `process.env.X!` runtime.                                                 |
| Health endpoint runtime nodejs           | `runtime = "nodejs"`                             | Drizzle + pg precisam Node runtime (não Edge). Marcar explícito evita Vercel inferir Edge.                                                                          |
| `dynamic = "force-dynamic"` em /api/health | force-dynamic                                  | Sem cache estático — sempre toca DB.                                                                                                                                |
| Vercel ignoreCommand                     | git diff em apps/web + packages                  | Skip rebuild se PR só mexe `.specs/` ou docs.                                                                                                                       |
| `.env.local` em dev, Vercel env em prod  | duas fontes                                      | Padrão Next.js. CI usa env do workflow.                                                                                                                              |
| Worktree per feature                     | `.claude/worktrees/<spec-id>`                    | Isolar branches; preview Vercel automático por branch. Já decidido em STATE.md.                                                                                     |

---

## Deferred / Out of Design

- Plugin Better Auth `magicLink`, `passkey`, OAuth providers — M1+
- Better Auth `databaseHooks.user.create.after` pra auto-criar `organization` + `farm` no signup — M1 (AUTH-001)
- Roles customizados (`manager`, `viewer`) no plugin organization — M1
- React Email preview server (`pnpm --filter @bovion/emails preview`) — script já listado no spec, instalar `react-email` dev dep
- Husky pre-commit hook script body — instalar via `pnpm exec husky init` em BOOT-08
- `kg_per_arroba = 30` CHECK constraint via raw SQL em migration custom — adicionar SQL após primeira `drizzle-kit generate`

---

## Open Questions — RESOLVED 2026-05-03

1. **modelName plural vs singular** → **PLURAL** (`users`, `sessions`, `accounts`, `verifications`, `organizations`, `members`, `invitations`). *Why:* alinha com tabelas custom Bovion (`farms`, `farm_settings`). Config em `auth.ts` via `user: { modelName: 'users' }` + plugin `organization({ schema: { organization: { modelName: 'organizations' }, ... } })`.
2. **`auth:generate` em CI** → **NÃO rodar em CI**. Schema commitado é fonte de verdade. Dev roda `pnpm auth:generate` manualmente após bump Better Auth. Drift-check opcional (deferred) só se aparecer bug real.
3. **Seed M0 mínimo** → **SIM**: 1 user + 1 organization + 1 member(owner) + 1 farm + 1 farm_settings(default kg=30). Senha hash via `auth.api.signUpEmail` (não reproduzir scrypt). Permite navegar app local sem UI signup (que só vem M1).
4. **EMAIL_FROM / Resend** → **DEFERRED → M6 Go-Live (spec EMAIL-PROVIDER)**. M0..M5 wrapper `sendEmail` é console-only stub (sem provider, sem env vars de email). React Email templates ficam disponíveis pra preview local. Decisão original (3 modos sandbox/prod) volta a valer quando M6 ativar Resend.

---

## Verification Plan — DONE 2026-05-03

- [x] **Better Auth CLI schema** — Docs Context7 confirmam tabelas geradas: `user`, `session`, `account`, `verification` (default singular) + plugin `organization` adiciona `organization`, `member`, `invitation`. Design.md lista exato. Q1 override pra plural via `modelName`.
- [x] **drizzle-kit `defineConfig`** — Shape `{ dialect: 'postgresql', schema, out, dbCredentials: { url }, strict, verbose }` confirmado em changelog 0.24+ e válido até latest 0.31.10.
- [x] **Resend `react` prop direto** — Confirmado em docs Resend v6 e `resend-examples`: `react: WelcomeEmail({ name })` é forma canônica. Sem helper `React.render` extra. Resend SDK renderiza internamente.
- [x] **GitHub Actions Postgres port** — `ports: ["5432:5432"]` (host:container) + `DATABASE_URL=...@localhost:5432/...` correto per docs GH Actions service containers.
- [x] **Vercel `ignoreCommand`** — Type `string` confirmado (não array). Design.md sintaxe válida.

---

## Pinned Latest Versions — 2026-05-03

> Mandate: usar sempre latest npm. Verificado via `npm view <pkg> version`.

| Package | Version | Major bump notes |
|---------|---------|------------------|
| next | `^16.2.4` | **Bump 15 → 16.** Async params já era em 15; Next 16 só *removeu* sync compat. `/api/health` sem dynamic params, OK. Rotas futuras devem usar `await params`. |
| react / react-dom | `^19.2.5` | Mantido — Next 16 ainda em React 19. |
| typescript | `^6.0.3` | TS 6 — flags `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `verbatimModuleSyntax` ainda válidos. |
| @biomejs/biome | `^2.4.14` | Minor bump dentro de v2 — config schema 2.0 OK. |
| turbo | `^2.9.7` | Schema `tasks` (não `pipeline`) mantido. |
| drizzle-orm | `^0.45.2` | Pre-1.0; `drizzle(pool)` deprecated (ainda funciona); preferir `drizzle({ client: pool, schema })` — atualizado em `client.ts` acima. |
| drizzle-kit | `^0.31.10` | `defineConfig` shape inalterado. |
| pg | `^8.20.0` | OK |
| @types/pg | `^8.11.0` | OK |
| better-auth | `^1.6.9` | API estável; `drizzleAdapter`, `organization` plugin, `toNextJsHandler`, `nextCookies` inalterados. |
| @better-auth/cli | `^1.6.9` | `auth generate` igual. |
| resend | **DEFERRED → M6** | Install + DNS DKIM/SPF em `bovion.com.br` só no Go-Live. Pré-MVP `sendEmail` é console-only stub. |
| @react-email/components | `^1.0.12` | v1 estável. Templates previewáveis sem provider. |
| react-email (dev) | `^4.0.0` | Preview server `email dev --port 3001` OK. |
| zod | `^4.4.2` | **Bump 3 → 4.** `safeParse`, `.object`, `.string()`, `.url()`, `.enum`, `.default` inalterados em uso M0. |
| tsx | `^4.21.0` | Migrate runner OK. |
| husky | `^9.1.7` | OK |
| lint-staged | `^16.4.0` | **Bump 15 → 16.** Config `*.{ts,tsx,...}: ["biome check --write ..."]` formato igual. |
| @vercel/config | n/a | `vercel.json` schema mantido. |
