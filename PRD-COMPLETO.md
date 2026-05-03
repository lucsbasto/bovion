# Bovion — PRD Completo (Snapshot para SDD)

**Versão:** 2.0 (snapshot) · **Data:** 2026-05-02 · **Idioma do produto:** Português (Brasil) · **Idioma do código:** Inglês

> Este documento é uma fotografia completa do estado atual do Bovion. Foi escrito para servir de **insumo único de Spec-Driven Development (SDD)** em um novo projeto: contém visão, personas, domínios, modelo de dados, regras de negócio, rotas, planos, fluxos e critérios de aceitação. Não depende de outros arquivos do repositório.

---

## 1. Visão do Produto

**Bovion** é uma plataforma SaaS de **gestão pecuária e controle financeiro** para fazendas de bovinos de corte no Brasil. O produto integra cadastro do rebanho, rastreamento de ciclo de vida animal, saúde, suplementação alimentar e simulação financeira em um único painel multi-tenant.

**Slogan operacional:** "Quanto custa minha arroba e quando devo vender?"

A plataforma transforma planilhas dispersas em decisões data-driven: calcula GMD (Ganho Médio Diário), custo por arroba, ponto de saturação e dia ótimo de venda em tempo real.

### Proposta de Valor
1. **Centralização**: rebanho, manejo, saúde, suplementação e finanças em um único sistema multi-tenant.
2. **Inteligência Financeira**: cálculo de break-even, ROI por animal, alerta de saturação, simulação de cenários.
3. **Rastreabilidade**: histórico imutável de cada animal (entrada, pesagens, transferências, saúde, saída).
4. **Colaboração**: múltiplos usuários por fazenda com matriz de papéis (owner, admin, manager, viewer).
5. **SaaS escalável**: 4 tiers de planos com cobrança de excedente para crescimento gradual.

---

## 2. Personas

### 2.1 Pecuarista Individual ("Arroba Pequena")
- 1 fazenda, < 100 animais
- Operação solo
- Dor: desorganização, falta de histórico, decisão por intuição
- **Plano-alvo:** Essencial

### 2.2 Gestor de Fazenda ("Arroba Média")
- 1 fazenda, 100–500 animais
- Equipe pequena (2-4 pessoas)
- Dor: coordenação dispersa, sem relatórios de lucro
- **Plano-alvo:** Gestão ou Estratégico

### 2.3 Grupo Pecuário ("Corporativo")
- 2–20 fazendas, 500–5.000 animais
- Múltiplos usuários, gerência centralizada
- Dor: consolidação multi-fazenda, benchmarking, auditoria
- **Plano-alvo:** Corporativo

---

## 3. Vocabulário Ubíquo (Ubiquitous Language)

| Termo | Definição |
|-------|-----------|
| **Arroba (@)** | Unidade brasileira de peso = **30 kg**. Base para cotação de carne. |
| **GMD** | Ganho Médio Diário (kg/dia). Principal indicador de performance da engorda. |
| **Lote (Lot)** | Grupo de animais sob manejo comum (mesma área, mesma ração, mesmo protocolo). |
| **Área / Pasto** | Subdivisão geográfica da fazenda. Lote pertence a uma área. |
| **Brinco / Tag (`code`)** | Identificador visual único do animal dentro da fazenda. |
| **RGN / RGD** | Registro Genealógico Nacional / Digital — registros oficiais brasileiros. |
| **Saturação** | Estado em que custo diário do animal > ganho diário em valor. Sinal de venda. |
| **Override** | Valor específico do lote que sobrescreve configuração global da fazenda. |
| **Mortalidade Isolada** | Custo da morte fica integralmente no animal falecido. |
| **Mortalidade Diluída** | Custo da morte rateado proporcionalmente entre os sobreviventes do lote. |
| **Apartação** | Separação de animais por critério (peso, idade, saúde, sexo). |
| **Confinamento** | Engorda intensiva em piquete/curral com ração controlada. |
| **Break-even** | Preço mínimo da arroba para que a venda cubra o custo total acumulado. |
| **Manejo** | Operação de nutrição, sanidade ou reprodução aplicada. |
| **Ponto Ótimo de Venda** | Dia que maximiza lucro total considerando ganho × custo. |

---

## 4. Stack Tecnológico

### 4.1 Monorepo
- **Workspaces**: `apps/web`, `apps/api`, `packages/emails`
- **Package manager**: npm (com `bun.lockb` também presente)
- **Lint/format**: Biome
- **Hooks**: Husky + lint-staged
- **CI**: GitHub Actions, Vercel (deploy do web), Supabase migrations push

### 4.2 Frontend (`apps/web`)
- **Framework**: React 18 + TypeScript
- **Build**: Vite (porta dev `4444`)
- **Routing**: React Router v6 (rotas em **português**)
- **Estado servidor**: TanStack Query v5 + persistência em localStorage (`bovion.rq-cache`)
- **Estado global cliente**: React Context (split por domínio: `FarmContext`, `AnimalContext`, `HealthContext`, `SupplementationContext`, `BillingContext`, `MemberContext`, agregados via `DataContext`)
- **UI**: shadcn/ui + Radix Primitives + Tailwind CSS (dark mode via class, HSL CSS variables)
- **Forms**: react-hook-form + zod (validação)
- **Tabelas/Charts**: recharts
- **Datas**: date-fns
- **Toast/Notif**: sonner
- **Testes**: Vitest + React Testing Library + jsdom
- **E2E**: Playwright
- **Util**: `cn()` helper (clsx + tailwind-merge) para composição de classes

### 4.3 Backend (`apps/api`)
- **Framework**: Fastify 5
- **Plugins**: `@fastify/cors`
- **Email**: Resend (via `@bovion/emails` package)
- **Cliente DB**: `@supabase/supabase-js`
- **Runtime dev**: tsx

### 4.4 Banco de Dados
- **PostgreSQL** via Supabase (cloud) ou Docker local (`docker-compose.postgres.yml`, porta 5433)
- **Schema**: tudo em `public.*`
- **Multi-tenancy**: `farm_id` em toda tabela operacional; `organization_id` no nível raiz
- **RLS**: habilitado nas tabelas (em iteração)
- **Auditoria**: triggers de `created_at`/`updated_at`/`created_by`/`updated_by`
- **Soft delete**: `deleted_at` em fazendas, ocorrências de saúde, tokens de senha
- **Migrações**: `supabase/migrations/NNNN_*.sql` (sequenciais)
- **Seeds**: via `npm run db:seed`

### 4.5 Autenticação (decisão não-óbvia)
- **NÃO usa Supabase Auth nativo.**
- Usa RPCs custom: `app_login(email, password)`, `app_register(...)`, `app_change_password(...)`
- Senhas: hash via `extensions.crypt` (pgcrypto)
- Tabela própria: `public.app_users`
- Reset de senha: tokens em `password_reset_tokens` com soft delete
- Verificação de email: `email_verification` (tokens descartáveis)

---

## 5. Convenções de Código e Workflow

- **Conventional Commits** atômicos: `<type>(<scope>): <description>` (nunca agrupar mudanças não relacionadas).
- **Rotas em PT-BR**: `/animais`, `/fazendas`, `/lotes`, `/saude`, `/suplementacao`, `/financeiro`, `/simulador`, `/configuracoes`.
- **Texto de UI em PT-BR**, código (variáveis/funções) em **inglês**.
- **Spec = Branch = PR (regra obrigatória)**: cada feature/bugfix vive em worktree dedicado `.claude/worktrees/<spec-id>`, branch `feat/<spec-id>`, PR único.
- **1 spec → 1 PR → 1 commit atômico por task**.

---

## 6. Estrutura de Diretórios (referência para SDD)

```
bovium/
├── apps/
│   ├── web/                       # Frontend Vite + React
│   │   └── src/
│   │       ├── api/               # crudApi.ts, repository.ts, supabaseClient
│   │       ├── components/
│   │       │   ├── animals/       # AddAnimalDialog, EditAnimalDialog, ...
│   │       │   ├── animal-detail/ # MovementTimeline, ...
│   │       │   ├── farms/         # AddFarmDialog, FarmMembersDialog, ...
│   │       │   ├── lots/          # AddLotDialog, LotKPIs, ...
│   │       │   ├── health/        # RegisterHealthOccurrenceDialog
│   │       │   ├── supplementation/ # AddSupplementationDialog
│   │       │   ├── billing/       # PlanCard, OverageBanner, ...
│   │       │   ├── dashboard/     # KPICard, Charts
│   │       │   ├── settings/      # GlobalArrobaPrice, ...
│   │       │   ├── charts/        # recharts wrappers
│   │       │   ├── brand/         # logo, theming
│   │       │   ├── layout/        # AppLayout, MarketingLayout, RequireAuth, RequirePlanFeature
│   │       │   ├── shared/        # ErrorBoundary, common dialogs
│   │       │   └── ui/            # shadcn/ui primitives
│   │       ├── contexts/          # AuthContext, DataContext (split per domain)
│   │       ├── hooks/             # custom hooks
│   │       ├── lib/               # utils, validations, financial calcs, uuid
│   │       ├── pages/             # Routes (PT-BR)
│   │       ├── data/              # static seeds, financialCalcs constants
│   │       ├── test/              # vitest setup + spec tests
│   │       └── types/             # TS types
│   └── api/                       # Fastify API (atualmente: rotas de email)
│       └── src/
│           ├── routes/email.ts
│           ├── plugins/
│           └── server.ts
├── packages/
│   └── emails/                    # Templates de email (Resend)
├── supabase/
│   ├── config.toml
│   └── migrations/                # 0001..NNNN .sql sequenciais
├── docs/                          # PRDs por domínio, planos, specs
│   ├── PRD.md
│   ├── prd/                       # animais.md, fazendas.md, lotes.md, saude.md, ...
│   ├── specs/                     # specs SDD (add-animal-*, ...)
│   ├── plans/                     # planos de implementação
│   ├── architecture/, business/, engineering/, guides/
│   └── templates/
├── e2e/                           # Playwright tests
├── .specs/                        # specs ativas (codebase, features, project)
├── scripts/                       # db-migrate.mjs, check-agent-flow.mjs, seed-supabase.sh
├── docker-compose.postgres.yml
├── biome.json
├── playwright.config.ts
├── vercel.json
└── package.json                   # workspaces
```

---

## 7. Domínios de Negócio

A árvore funcional de domínios:

```
AUTH (base)
  └─ ORG (organização → workspace de billing)
        ├─ FARM (1..N por org)
        │    ├─ MEMBER (usuário ↔ fazenda com role)
        │    ├─ FARM_SETTINGS (preço @ global, kg/@, currency)
        │    ├─ AREA (1..N por fazenda)
        │    │    └─ LOT (1..N por área)
        │    │         ├─ ANIMAL (1..N por lote)
        │    │         │    ├─ WEIGHING (série temporal)
        │    │         │    ├─ HEALTH RECORD (vacina/medicação/vermífugo)
        │    │         │    ├─ MANAGEMENT RECORD (nutrição/sanidade/reprodução)
        │    │         │    ├─ HISTORY EVENT (timeline imutável)
        │    │         │    └─ MOVEMENT (transferência entre lotes)
        │    │         ├─ SUPPLEMENTATION (dieta opcional)
        │    │         └─ FIN (centro de custo)
        │    │              ├─ DASH (KPIs derivados)
        │    │              └─ PSIM (simulador de venda)
        │    └─ HEALTH OCCURRENCE (nível fazenda, opcional)
        └─ BILLING
             ├─ PLAN (essencial/gestão/estratégico/corporativo)
             ├─ SUBSCRIPTION (status, period)
             ├─ INVOICE (linhas + excedente)
             └─ BILLING EVENTS (auditoria)
```

---

## 8. Modelo de Dados (desenvolver)
---

## 9. Funcionalidades a serem implementadas (Atual)

> Cada item abaixo está **funcional no código** atual. Use como checklist de paridade ao reconstruir.

### 9.1 Autenticação e Conta
- [ ] Login (backend usando login e senha)
- [ ] Registro (backend) com criação automática de organização e fazenda inicial
- [ ] Esqueci a senha → email com token (Resend)
- [ ] Redefinir senha (token único, expirável)
- [ ] Verificar email
- [ ] Trocar senha autenticado
- [ ] Sessão persistida

### 9.2 Fazenda, Organização e Membros
- [ ] Listagem de fazendas (`/fazendas`)
- [ ] Criação / edição de fazenda (com cidade + UF)
- [ ] Soft delete de fazenda (com bloqueio se houver animais vinculados)
- [ ] Múltiplas fazendas por organização (limitado por plano)
- [ ] Convidar membro por email com link único (validade 7 dias)
- [ ] Aceitar / recusar convite
- [ ] 4 papéis: **owner**, **admin**, **manager**, **viewer** (matriz de permissões)
- [ ] Status de membership: `active`, `invited`, `disabled`
- [ ] Cascata: ao deletar fazenda, membros viram `disabled`
- [ ] Seletor de "fazenda ativa" na UI (filtra todos os dados visíveis)

### 9.3 Áreas e Lotes
- [ ] Cadastro de áreas (piquetes) por fazenda
- [ ] Criação inline de área dentro de outros formulários
- [ ] CRUD de lotes (`/lotes`)
- [ ] Detalhe do lote (`/lotes/:id`) com KPIs
- [ ] Override de preço da arroba por lote
- [ ] Override de custo de ração por lote
- [ ] Seleção do modo de mortalidade (isolado / diluído)
- [ ] Status do lote (ativo / inativo)
- [ ] Datas de início e fim do lote

### 9.4 Animais — Cadastro e Gestão
- [ ] Listagem com filtros (`/animais`)
- [ ] Detalhe do animal (`/animais/:id`)
- [ ] Cadastro individual
- [ ] Cadastro em lote / bulk
- [ ] Edição
- [ ] Tipos de entrada: `nascimento`, `compra`, `transferencia`
- [ ] Identificação por brinco (`tag`)
- [ ] Validação: `tag` único por fazenda
- [ ] Campos genealógicos: `breed`, `coat`, `horns`, `rgn`, `rgd`, `aptitude`
- [ ] Validações: datas coerentes, peso > 0, campos de compra obrigatórios em `entry_type='compra'`

### 9.5 Animais — Eventos
- [ ] Pesagem - [ ] Cálculo automático de **GMD** (trigger SQL na pesagem)
- [ ] Histórico de pesagens com gráfico
- [ ] Transferência entre lote
- [ ] Registro de venda com cálculo de lucro real
- [ ] Registro de óbito com modo de custo
- [ ] Timeline imutável

### 9.6 Saúde Animal
- [ ] Registro de ocorrência
- [ ] Tipos: vacina, medicação, vermífugo, tratamento
- [ ] Severidade: leve / moderada / grave
- [ ] Status: ativo / em tratamento / resolvido / cancelado
- [ ] Custo por ocorrência integrado ao custo total do animal
- [ ] Próxima dose
- [ ] Histórico de saúde por animal
- [ ] Soft delete de ocorrências
- [ ] Página dedicada `/saude`

### 9.7 Suplementação
- [ ] Página `/suplementacao` (gated por feature `supplementation`)
- [ ] Detalhe da dieta `/suplementacao/:id`
- [ ] CRUD de dietas com ingredientes
- [ ] Catálogo de ingredientes (com nome normalizado para evitar duplicatas)
- [ ] Composição em **kg** (não %)
- [ ] Cálculo automático: custo/kg, consumo/animal/dia (%PV), custo diário, custo mensal, custo/animal/dia
- [ ] Snapshot de preços congelado por dieta
- [ ] Associação dieta ↔ lote

### 9.8 Dashboard e Indicadores
- [ ] Página `/dashboard`
- [ ] KPI Cards (total de animais, GMD médio, lucro projetado, etc.)
- [ ] Distribuição do rebanho por status / lote / área
- [ ] Indicadores operacionais por lote
- [ ] Alertas operacionais
- [ ] Indicadores financeiros básicos

### 9.9 Análise Financeira / Simulador
- [ ] Página `/financeiro`
- [ ] Página `/simulador` (gated por feature `profit_simulator`)
- [ ] Cálculo de **custo por arroba**
- [ ] Detecção de **saturação**
- [ ] **Lucro projetado vs lucro real**
- [ ] Cenário "Venda Hoje"
- [ ] Cenário "Venda Futura" (projeção via GMD)
- [ ] **Dia ótimo de venda** (iteração 0..120 dias)
- [ ] **Preço de equilíbrio (break-even)** da arroba
- [ ] Persistência de simulações (`profit_simulations`)

### 9.10 Configurações
- [ ] Página `/configuracoes`
- [ ] Preço global da arroba (com timestamp de freshness)
- [ ] URL de referência do preço (auditoria)
- [ ] Fator kg/arroba (fixo em 30 — constraint no banco)
- [ ] Currency code (default BRL)
- [ ] Configurações por **organização**

### 9.11 Marketing & Onboarding
- [ ] Landing page pública `/`
- [ ] Página de planos pública `/planos`
- [ ] Login `/login`, Registro `/registro`
- [ ] Esqueci-senha, redefinir-senha, verificar-email
- [ ] Onboarding redireciona para `/fazendas`

### 9.12 Billing & Plans
- [ ] 4 planos (Essencial, Gestão, Estratégico, Corporativo) — modelo v3
- [ ] Engine de feature gating (`RequirePlanFeature` HOC)
- [ ] Limite de animais por plano com cálculo de **excedente** (overage)
- [ ] Hard-block para limites não cobráveis (fazendas, usuários)
- [ ] Modelo de dados completo: subscriptions, invoices, line items, events
- [ ] RPCs de verificação de permissão
- [ ] Trial de 14 dias (modelo)

### 9.13 Infra / DX
- [ ] Docker Compose para Postgres local
- [ ] Migrations sequenciais com push automatizado em `main` (CI)
- [ ] Testes unitários + de integração (Vitest)
- [ ] Testes E2E (Playwright)
- [ ] Linting + formatação (Biome) + Husky + lint-staged
- [ ] Persistência do cache de query (`bovion.rq-cache` localStorage)

---

## 10. Mapa Completo de Rotas

### 10.1 Públicas
| Rota | Página | Layout |
|---|---|---|
| `/` | `LandingPage` | `MarketingLayout` |
| `/login` | `Login` | — |
| `/registro` | `Register` | — |
| `/planos` | `PlansPublic` | — |
| `/esqueci-senha` | `ForgotPassword` | — |
| `/redefinir-senha` | `ResetPassword` | — |
| `/verificar-email` | `VerifyEmail` | — |

### 10.2 Autenticadas (sob `RequireAuth` + `DataProvider` + `AppLayout`)
| Rota | Página | Gating |
|---|---|---|
| `/dashboard` | `Dashboard` | — |
| `/fazendas` | `Farms` | — |
| `/animais` | `Animals` | — |
| `/animais/:id` | `AnimalDetail` | — |
| `/lotes` | `Lots` | — |
| `/lotes/:id` | `LotDetail` | — |
| `/saude` | `Health` | — |
| `/financeiro` | `Financial` | — |
| `/suplementacao` | `Supplementation` | feature `supplementation` |
| `/suplementacao/:id` | `SupplementationDetail` | feature `supplementation` |
| `/simulador` | `ProfitSimulator` | feature `profit_simulator` |
| `/configuracoes` | `Settings` | — |

### 10.3 Redirecionamentos legados
- `/onboarding` → `/fazendas`
- `/app` → `/dashboard`
- `/app/fazendas` → `/fazendas`
- `/app/animais` → `/animais`
- `/app/animais/:id` → `/animais`
- `/app/lotes` → `/lotes`
- `/app/lotes/:id` → `/lotes`
- `/app/configuracoes` → `/configuracoes`
- `/inicio` → `/`
- `*` → `NotFound`

---

## 11. Matriz de Planos e Features

### 11.1 Planos
| Plano | Animais | Fazendas | Usuários | Preço Mensal Ref. |
|---|---|---|---|---|
| Essencial | 100 | 1 | 1 | R$ 49 |
| Gestão | 500 | 1 | 3 | R$ 99 |
| Estratégico | 2.000 | 10 | 10 | R$ 199 |
| Corporativo | 5.000 | 20 | 100 | R$ 499 |

> Anual: 16% de desconto. Overage de animais: ~R$ 0,50/animal/mês acima do limite (planos Essencial e Gestão).

### 11.2 Feature Keys
| Feature | Chave | Essencial | Gestão | Estratégico | Corporativo |
|---|---|:-:|:-:|:-:|:-:|
| Gestão de Animais | `animal_management` | ✓ | ✓ | ✓ | ✓ |
| Histórico de Animais | `animal_history` | ✓ | ✓ | ✓ | ✓ |
| Dashboard Básico | `basic_dashboard` | ✓ | ✓ | ✓ | ✓ |
| Dashboard Avançado | `advanced_dashboard` | | ✓ | ✓ | ✓ |
| Suplementação | `supplementation` | | ✓ | ✓ | ✓ |
| Simulador (3/mês) | `profit_simulator` | | ✓ | | |
| Simulador Ilimitado | `profit_simulator_unlimited` | | | ✓ | ✓ |
| Análise Financeira | `financial_analysis` | | | ✓ | ✓ |
| Exportação | `reports_export` | | ✓ | ✓ | ✓ |
| Multi-Fazenda | `multi_farm` | | | | ✓ |
| Multi-Usuário | `multi_user` | | | | ✓ |
| Permissões por Fazenda | `farm_permissions` | | | | ✓ |

### 11.3 Matriz de Permissões (Roles)
| Ação | Owner | Admin | Manager | Viewer |
|---|:-:|:-:|:-:|:-:|
| Ver dados da fazenda | ✓ | ✓ | ✓ | ✓ |
| Editar fazenda | ✓ | ✓ | | |
| Convidar/remover membros | ✓ | ✓ | | |
| Acessar billing | ✓ | | | |
| CRUD animais/lotes/áreas | ✓ | ✓ | ✓ | |
| Registrar saúde/suplementação | ✓ | ✓ | ✓ | |
| Acessar financeiro | ✓ | ✓ | | |

---

## 12. Regras de Negócio e Cálculos

> Todas as fórmulas devem ser preservadas em uma reimplementação SDD.

### 12.1 Constantes
- `KG_PER_ARROBA = 30` (constraint `farm_settings.kg_per_arroba_chk`)
- `DEFAULT_ARROBA_PRICE = 320` (BRL)
- `INVITE_EXPIRATION_DAYS = 7`
- `TRIAL_DAYS = 14`
- `INVOICE_DUE_DAYS = 10`

### 12.2 Conversões
```
peso_em_arrobas = peso_kg / 30
peso_kg = arrobas * 30
```

### 12.3 GMD (Ganho Médio Diário)
```
GMD_total   = (peso_atual − peso_inicial) / dias_decorridos    // kg/dia
GMD_periodo = (peso_novo − peso_anterior) / dias_entre_pesagens
```
- `peso_inicial` = peso de compra (entry_type=compra), peso ao nascer (nascimento), ou primeira pesagem.
- Calculado por trigger SQL em `animal_weighings` (insert/update).

### 12.4 Custo Total do Animal
```
custo_total = aquisicao
            + (feed_days * feed_price_per_day)
            + Σ custo_saude
            + Σ custo_manejo_rateado
```

### 12.5 Custo de Aquisição
```
aquisicao = (purchase_weight_kg * purchase_price_per_kg) + custos_extras_rateados
```

### 12.6 Custo por Arroba
```
custo_por_arroba = custo_total / arrobas_ganhas
arrobas_ganhas   = (peso_atual − peso_inicial) / 30
```

### 12.7 Hierarquia de Preço da Arroba
```
preco_aplicado = lot.arroba_price_override
              ?? farm_settings.global_arroba_price
              ?? 320
```

### 12.8 Hierarquia de Custo de Ração
```
custo_diario = lot.feed_cost_per_day_override
            ?? farm_settings.global_feed_cost_per_day
            ?? animal.feed_price_per_day
```

### 12.9 Saturação
```
ganho_diario_valor = (GMD / 30) * preco_arroba
saturado           = custo_diario > ganho_diario_valor
```

### 12.10 Cenário Venda Hoje
```
receita = (peso_atual / 30) * preco_arroba
lucro   = receita − custo_total
margem  = lucro / custo_total
```

### 12.11 Cenário Venda Futura (D dias)
```
peso_futuro    = peso_atual + (GMD * D)
receita_futura = (peso_futuro / 30) * preco_arroba
custo_futuro   = custo_total + (custo_diario * D)
lucro_futuro   = receita_futura − custo_futuro
```

### 12.12 Dia Ótimo de Venda
```
para D em 0..120:
  lucro[D] = receita_futura(D) − custo_futuro(D)
dia_otimo = argmax(lucro)
```

### 12.13 Break-even (Preço Mínimo da Arroba)
```
preco_minimo_arroba = custo_total / (peso_atual / 30)
```

### 12.14 Mortalidade
**Modo isolado** (default):
```
lucro_animal_morto = 0 − custo_total_dele
sobreviventes: sem alteração
```
**Modo diluído**:
```
acrescimo_por_sobrevivente = custo_total_animal_morto / animais_vivos_restantes
sobreviventes: custo_total += acrescimo
```

### 12.15 ROI por Animal
```
ROI = (lucro / custo_total) * 100
verde   se ROI > 20
amarelo se 0 ≤ ROI ≤ 20
vermelho se ROI < 0 ou saturado
```

### 12.16 Saúde do Lote
```
saturados_count = Σ(animais saturados no lote)
lucro_projetado_lote = Σ(lucro_projetado_animal)

if saturados_count > 0 OR lucro_projetado_lote < 0 → CRÍTICO
elif lucro_projetado_lote < 10000 → MONITORAR
else → SAUDÁVEL
```
> **Questão em aberto**: threshold de R$ 10.000 deveria ser configurável por fazenda.

### 12.17 Histograma de Peso
- Faixas de 20 kg: `[0,20), [20,40), [40,60)...`
- Cada animal cai na faixa do `weight_kg` mais recente.

### 12.18 Suplementação — Cálculo da Dieta
```
custo_kg_mistura  = Σ(qtd_kg_ingrediente_i * preco_kg_i) / Σ(qtd_kg_ingrediente_i)
consumo_animal_dia = peso_medio * (perc_PV / 100)
consumo_total_dia  = consumo_animal_dia * total_animais
custo_diario       = custo_kg_mistura * consumo_total_dia
custo_mensal       = custo_diario * 30
custo_animal_dia   = custo_diario / total_animais
```

### 12.19 Cadastro em Lote (Bulk)
```
peso_medio_cabeca = peso_total_grupo / quantidade
preco_kg          = valor_total_nota / peso_total_grupo
custo_extra       = (frete + comissao + taxas) / quantidade
codigos           = PREFIXO-001, PREFIXO-002, ..., PREFIXO-NNN
```

### 12.20 Cálculo de Excedente (Overage)
```
excedente = max(0, animais_ativos − limite_plano)
cobranca_extra = excedente * preco_unitario
```
- Executado ao final do ciclo (11:59 UTC).
- Conta animais com `is_active=true AND deleted_at IS NULL`.

### 12.21 Pro-rata de Upgrade
- Upgrade: efetivo imediato, cobra diferença proporcional ao restante do ciclo.
- Downgrade: agendado para fim do ciclo (`cancel_at_period_end=true`); sem reembolso.

---

## 13. Validações e Invariantes

### 13.1 Animais
- `tag` único por `farm_id`.
- `electronic_tag` único por `farm_id` (quando não nulo).
- `birth_weight_kg ≥ 0`, `weaning_weight_kg ≥ 0` (se presente).
- `weaning_date ≥ birth_date`.
- `farm_entry_date ≥ birth_date`.
- Se `entry_type='compra'`: `purchase_date`, `purchase_weight_kg`, `purchase_price_per_kg` são obrigatórios.
- Se `entry_type≠'compra'`: esses três campos devem ser NULL.
- `feed_days ≥ 0`, `feed_price_per_day ≥ 0`.

### 13.2 Lotes
- `name` único por `farm_id`.
- `arroba_price_override > 0` (se presente).
- `feed_cost_per_day_override > 0` (se presente, mas zero é tratado como "ração doada" na UI; constraint pode evoluir).
- `end_date ≥ start_date` (se ambas presentes).
- Lote referencia `(area_id, farm_id)` por FK composta (consistência de tenant).

### 13.3 Áreas
- `name` único por `farm_id`.

### 13.4 Pesagens
- `weight_kg > 0`.
- `gmd_kg_day ≥ 0`, `gain_kg ≥ 0`, `period_days ≥ 0`.
- UNIQUE `(animal_id, weighing_date)` — uma pesagem por dia por animal.

### 13.5 Saúde
- `next_due_date ≥ record_date` (se presente).
- `cost > 0` ao registrar.

### 13.6 Fazendas
- `name` length ≥ 2.
- `slug` único globalmente.
- Não pode deletar fazenda com animais vinculados (validação no `DataContext.deleteFarm`).

### 13.7 Usuários
- `email` único (case-insensitive, lower).
- `full_name` length ≥ 2.
- Email normalizado por trigger (lower + trim).

---

## 14. Casos de Uso (Use Cases) Principais

### UC-1: Onboarding e Primeira Fazenda
1. Usuário acessa `/registro`, preenche nome + email + senha.
2. backend cria `user`, `organization`, e `farm` inicial.
3. Trial de 7 dias é ativado.
4. Redireciona para `/fazendas` (alias de onboarding).

### UC-2: Cadastrar Animal Individual
1. Em `/animais`, clica "Novo Animal".
2. Escolhe tipo: nascimento / compra / transferência.
3. Preenche identificação (código, sexo, raça).
4. Se compra: peso, preço/kg, data.
5. Seleciona área e lote.
6. Sistema cria animal status `ativo` + history event de entrada.

### UC-3: Cadastro em Lote (Bulk)
1. "Novo Animal" → "Modo Lote".
2. Insere quantidade, peso total, valor total nota, frete.
3. Sistema gera N animais com códigos sequenciais e dados rateados.

### UC-4: Registrar Pesagem
1. No detalhe do animal → "Nova Pesagem".
2. Insere data + peso.
3. Trigger SQL calcula GMD e gain automaticamente.
4. KPIs do dashboard recalculam.

### UC-5: Vender Animal
1. Detalhe do animal → "Registrar Venda".
2. Insere data, peso final, preço/kg.
3. Sistema calcula lucro real, atualiza status para `vendido`.
4. Animal sai dos cálculos ativos do rebanho.

### UC-6: Registrar Óbito
1. Detalhe → "Registrar Morte".
2. Data + causa (opcional).
3. Modo de custo herdado do lote (isolado/diluído).
4. Status → `morto`.

### UC-7: Transferir Animal entre Lotes
1. Detalhe → "Transferir".
2. Escolhe novo lote + motivo.
3. Cria `animal_movement` + `history_event`.

### UC-8: Criar Dieta de Suplementação
1. `/suplementacao` → "Nova Dieta".
2. Define nome, lote (opcional), peso médio, total de animais, %PV.
3. Adiciona ingredientes (qtd em kg).
4. Sistema calcula custo/kg, consumo, custos diário/mensal.
5. Salva com snapshot de preços congelado.

### UC-9: Simular Venda (Profit Simulator)
1. `/simulador` (gated por feature).
2. Escolhe lote/animal.
3. Sistema gera curva de lucro 0..120 dias.
4. Destaca dia ótimo + lucro máximo + preço de equilíbrio.
5. Salva simulação para auditoria.

### UC-10: Convidar Membro
1. `/fazendas` → fazenda → "Membros" → "Adicionar".
2. Email + role (owner/admin/manager/viewer).
3. Email enviado via Resend com link único (7 dias).
4. Convidado aceita → status `active`.

### UC-11: Mudar de Plano (Upgrade)
1. Settings → "Plano".
2. Escolhe novo tier.
3. Sistema calcula pro-rata e cobra diferença.
4. Features novas liberadas imediatamente.
5. Evento `subscription.plan_change.succeeded` registrado.

### UC-12: Excedente de Animais
1. Sistema detecta `animais_ativos > limite_plano` ao final do ciclo.
2. Linha de overage adicionada à próxima fatura.
3. Banner no dashboard sugere upgrade.

---

## 15. Critérios de Aceitação Padrão (para reuso SDD)

### 15.1 Padrão de Spec
Cada spec deve seguir:
- **ID**: prefixo de domínio + número (`AL-001`, `LOT-003`, `FIN-001`...).
- **Título** descritivo.
- **Contexto/Problema**.
- **Lista de CAs** (Critérios de Aceitação) numerados (CA-01, CA-02, ...).
- **Cenários de teste** (Given/When/Then).
- **Rastreabilidade**: quais arquivos serão modificados.

### 15.2 Definition of Done por Task
- [ ] Implementação atende a todos os CAs.
- [ ] Testes unitários (Vitest) passam.
- [ ] Testes E2E (Playwright) passam para fluxos críticos.
- [ ] Lint (Biome) sem erros.
- [ ] Migration aplicada e testada localmente (Docker).
- [ ] Texto em PT-BR.
- [ ] Commit atômico no formato Conventional Commits.

### 15.3 Padrões de Teste
- **Lógica pura**: importar funções diretamente, testar sem render.
- **Componentes**: React Testing Library com mocks de `useData` e `sonner`.
- **UUIDs**: mock de `@/lib/uuid` para IDs determinísticos nos testes.

---

## 16. Pendências Conhecidas (Backlog)

> Use como roadmap após paridade de MVP.

### Alta prioridade
- Curva de Lucro Projetado (what-if) no dashboard
- Controles de cenário no dashboard
- Consistência de dados Dashboard ↔ API
- Conversão alimentar (KPI)
- Margem por lote (relatório dedicado)
- Custo marginal vs ganho marginal
- Capital imobilizado

### Média
- Exportação CSV/PDF (feature `reports_export`)
- Relatórios avançados/personalizados
- CTAs de upgrade na UI
- Telemetria completa de eventos
- Deep-linking de convites

### Baixa
- Consolidação multi-fazenda (Corporativo)
- Auditoria visível em UI
- i18n para outros idiomas
- Integrações externas (preços B3, ERPs)

---

## 17. Como Reproduzir o Projeto via SDD

### Passo 1 — Bootstrap do repositório
1. Monorepo com workspaces (`apps/web`, `apps/api`, `packages/emails`).
2. Stack: React 18 + Vite + TypeScript + Tailwind + shadcn/ui + Fastify + Supabase.
3. Configurar Biome + Husky + lint-staged.
4. Configurar Docker Compose para Postgres local.

### Passo 2 — Schema base (specs AUTH + ORG + FARM)
1. Criar migrations 0001–0010 cobrindo: `app_users`, `organizations`, `farms`, `farm_members`, `farm_settings`, `areas`, `lots`, `animals`, eventos.
2. Implementar RPCs: `app_login`, `app_register`, `app_change_password`.
3. Implementar triggers de auditoria (`set_audit_fields`).
4. Habilitar RLS por `farm_id`.

### Passo 3 — Specs AUTH (4 specs)
- AUTH-001: login
- AUTH-002: registro com criação de org+farm
- AUTH-003: reset de senha
- AUTH-004: verificação de email

### Passo 4 — Specs FARM (7 specs)
- FARM-001..007: CRUD, soft delete, members, invites, settings.

### Passo 5 — Specs ANIMAL (lifecycle + cadastro)
- AL-001..011: pesagem, transferência, venda, morte, histórico.
- add-animal-001..008: validações, defaults, financials, main-flow, state, errors, edge-cases, ui-accessibility.

### Passo 6 — Specs LOT (7 specs)
- LOT-001..007: CRUD, detalhe, projeções, histograma, ROI ranking.

### Passo 7 — Specs HEALTH (4 specs) e SUPP (5 specs)

### Passo 8 — Specs FIN (8 specs) — proposta de valor
- FIN-001 resumo financeiro
- FIN-002 composição de custos
- FIN-003 curva de lucro
- FIN-004 comparação de lotes
- FIN-005 break-even
- FIN-006 margem por animal
- FIN-007 overage
- FIN-008 pro-rata

### Passo 9 — Specs DASH (12 specs) e PSIM (4 specs)

### Passo 10 — Specs BILLING (10 specs) e MEMBER (4 specs)

### Passo 11 — SETTINGS (3 specs)

> **Estimativa**: ~89 specs no total (do PRD original). Cobertura atual ≈ 31%.

---

## 19. Checklists de Paridade (para validar a réplica)

### Funcional
- [ ] Login/registro funcionando com RPC custom (não Supabase Auth)
- [ ] Criar fazenda, área e lote
- [ ] Cadastrar animal individual e em lote
- [ ] Registrar pesagem e ver GMD calculado
- [ ] Transferir animal entre lotes
- [ ] Registrar venda e óbito
- [ ] Criar dieta de suplementação com cálculo de custo
- [ ] Simulador de venda exibe dia ótimo
- [ ] Configurar preço global da arroba
- [ ] Convidar membro e aceitar convite
- [ ] Feature gating funciona (`/simulador` bloqueia plano sem feature)
- [ ] Cobrança de excedente registrada na fatura

### Não-funcional
- [ ] UI 100% em PT-BR
- [ ] Dark mode funciona
- [ ] Dev server porta 4444
- [ ] Migrations rodam do zero
- [ ] Tests unitários passam
- [ ] Tests E2E (Playwright) cobrem fluxos críticos
- [ ] Biome lint sem erros
- [ ] Multi-tenant: usuário B não vê dados de fazenda de A

### Banco
- [ ] kg/arroba constraint = 30
- [ ] Tag única por farm
- [ ] Cascata de deleção de fazenda funciona (membros → disabled)
- [ ] Soft delete em fazendas, ocorrências de saúde
- [ ] Trigger de GMD no insert de pesagem