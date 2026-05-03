# Bovion Visual Brief

**Source of truth:** Generated via `frontend-blueprint` skill from 13 reference PNGs in `ui-references/` (home, dashboard, animais, lotes, fazendas, saude, financeiro, abrir-o-app, billing, como-funciona, funcionalidades, faq, configuracoes).
**Color tokens:** sampled via Pillow PIL (not estimated by eye). Sources cited per token.
**Status:** Approved 2026-05-03. SOURCE OF TRUTH for all M1+ UI specs (AUTH/FARM/MEMBER/ANIMAL/LOT/AREA/HEALTH/SUPP/FIN/DASH/PSIM/BILLING/SETTINGS/marketing).
**Owner:** lucas (lucsbasto@gmail.com)

> **Workflow:** When implementing any of the 13 reference screens (or extending), engineer can use this doc alone — no need to re-open the PNG. If something looks ambiguous, fall back to the PNG and update this brief with the resolved spec.

---

## 1. Brand Identity

### 1.1 Naming
- **Product:** Bovion
- **Tagline:** Inteligência Pecuária
- **Lockup:** Bull icon (filled blue square containing bull silhouette outline) + wordmark "Bovion" + sub-line "Inteligência Pecuária" (always 2-line stack in app sidebar; 1-line inline in marketing nav).

### 1.2 Voice / Tone
- **Audience:** pecuarista profissional + gestor de fazenda + grupo pecuário (1-20 fazendas, 100-5k animais).
- **Tone:** B2B fintech-grade, decisão data-driven, foco em margem e timing de venda.
- **Anti-tone:** NÃO rústico, NÃO "fazendinha amigável", NÃO emoji-heavy, NÃO ilustrações cartoon.
- **Reference proxies:** Stripe (clarity + density), Linear (sober tonal restraint), Vercel (whitespace), Bloomberg (tabular precision when relevant).
- **Idioma:** PT-BR full UI. Money formato `R$ 1.234,56`. Decimal vírgula. Datas `DD/MM/AAAA`.

---

## 2. Color Tokens

All hex values are PIL-sampled from references unless marked **(derived)** for hover/focus/disabled variants. Implementação via Tailwind v4 `@theme` block em `apps/web/app/globals.css`.

### 2.1 Brand
| Token | Hex | Sample source | Use |
|-------|-----|---------------|-----|
| `--color-brand-navy` | `#182435` | dashboard/animais/lotes/fazendas/saude/financeiro/configuracoes sidebar | Sidebar bg, marketing footer dark blocks |
| `--color-brand-navy-soft` | `#1A2738` | sidebar top zone | Sidebar header section bg |
| `--color-brand-navy-hover` | `#263345` | animais sidebar selected nav item | Hover/selected nav item, active sidebar tab |
| `--color-brand-blue` | `#286BA0` | lotes "Novo Lote" CTA, configurações "Sistema" selected | Primary CTA, links, focus ring base, chart series 1, bull logo accent |
| `--color-brand-blue-hover` | `#1F5687` | **(derived)** | Primary CTA hover |
| `--color-brand-blue-active` | `#173F66` | **(derived)** | Primary CTA active/pressed |
| `--color-brand-blue-disabled` | `#99B8D2` | configurações "Alterar Senha" disabled | Disabled primary btn bg |
| `--color-brand-blue-soft` | `#3E7AAA` | financeiro "Despesa" toggle selected | Soft primary (toggle, secondary CTA emphasis) |

### 2.2 Surface (light mode default)
| Token | Hex | Sample source | Use |
|-------|-----|---------------|-----|
| `--color-bg` | `#F9FAFB` | dominant bg pixel em todas internas (~70%+) | App background |
| `--color-bg-marketing` | `#F6F8F9` | abrir-o-app + home outer | Marketing page bg (slightly cooler) |
| `--color-surface` | `#FFFFFF` | cards configurações, manejos card saude | Cards, modals, popovers |
| `--color-surface-alt` | `#F3F4F6` | **(derived)** | Hover row table, sub-section bg |
| `--color-surface-muted` | `#EDEFF2` | **(derived)** | Disabled input bg |
| `--color-border` | `#E5E7EB` | **(derived from card outlines)** | Card border, divider |
| `--color-border-strong` | `#CBD5E1` | **(derived)** | Input border default |
| `--color-border-input` | `#D1D5DB` | **(derived)** | Input border resting |

### 2.3 Text
| Token | Hex | Use |
|-------|-----|-----|
| `--color-text` | `#0F172A` | Headings (Dashboard / Animais / Lotes etc), KPI big numbers |
| `--color-text-body` | `#1F2937` | Body copy, table cells |
| `--color-text-muted` | `#6B7280` | Subtítulos, labels, breadcrumb non-active, table headers small |
| `--color-text-subtle` | `#9CA3AF` | Placeholder text, disabled labels |
| `--color-text-inverse` | `#F9FAFB` | Text on navy sidebar, on filled primary CTA |
| `--color-text-link` | `#286BA0` | Inline link, "Esqueci minha senha", "Criar conta", "Voltar ao topo" |

### 2.4 Status (semantic)
Sampled badge bg = pale tint; "strong" = derived foreground/icon variant.

| Token | bg | fg/strong | Sample source | Use |
|-------|-----|-----------|---------------|-----|
| `--color-success-bg` | `#D1E6DE` | `#166534` | lotes Saudável + Ativo | Saudável, Ativo, KPI positivo, Receitas card tint |
| `--color-success-card-bg` | `#EEF4F3` | — | financeiro Receitas/Saldo cards | Hero KPI card success tint |
| `--color-warning-bg` | `#EEDBBC` | `#92400E` | lotes Saturados:2 + saude Moderada | Saturado, Moderada, Próximos Lembretes |
| `--color-warning-card-bg` | `#F8F5EF` | — | saude Próximos Lembretes card | Hero KPI card warning tint |
| `--color-danger-bg` | `#EE9898` | `#991B1B` | saude Grave + Ativo (red) | Grave, Casos Ativos, ações destrutivas |
| `--color-danger-card-bg` | `#F7EFF0` | — | saude Casos Ativos + financeiro Despesas cards | Hero KPI card danger tint |
| `--color-info-bg` | `#DBEAF4` | `#0E4F7A` | **(derived)** | Insights highlight, info banner |
| `--color-info-card-bg` | `#EEF4F3` | — | dashboard "Monitore a saúde" insights card | Hero callout card |
| `--color-neutral-bg` | `#F1F5F9` | `#475569` | **(derived)** | Vendido outline state, neutral metadata pill |

### 2.5 Charts (recharts paleta)
Sequential, paired with semantic intent:
| Series | Hex | Use |
|--------|-----|-----|
| `--chart-1` | `#286BA0` | Linha principal (lucro projetado, KPI primário) |
| `--chart-2` | `#10B981` | Receita, ganho, métrica positiva |
| `--chart-3` | `#F59E0B` | Custo, métrica de atenção |
| `--chart-4` | `#94A3B8` | Baseline, projeção, série secundária neutra |
| `--chart-5` | `#7C3AED` | Comparativo extra (suplementação/extra) |
| Donut empty/inverse | `#E5E7EB` | Slice "outros" / restante |
| Grid line | `#F1F5F9` | Background grid linhas charts |

### 2.6 Dark mode (full app, toggled via theme switcher visible em todas internas)
Dark é toggle global, não só sidebar. Sidebar permanece navy em ambos modos (não inverte).

| Token | Hex |
|-------|-----|
| `--color-bg` (dark) | `#0F172A` (slate-900) |
| `--color-surface` (dark) | `#1E293B` (slate-800) |
| `--color-surface-alt` (dark) | `#273344` |
| `--color-border` (dark) | `#334155` (slate-700) |
| `--color-text` (dark) | `#F1F5F9` |
| `--color-text-muted` (dark) | `#94A3B8` |

Brand colors mantêm hex em dark (navy/blue funcionam nos dois modos). Status tints precisam darken: bg success dark `#10341F`, danger dark `#3F1212` etc — refinar quando implementar dark mode (M1+).

---

## 3. Typography

### 3.1 Font stack
**Primary:** Inter via `next/font/google` (Latin + Latin-ext subset, 400/500/600/700 weights). Fallback `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.

**Numérico:** `font-variant-numeric: tabular-nums` em todas células de tabela monetária + KPI big numbers.

### 3.2 Scale (Tailwind v4 names)
| Role | Class | Pixel approx | Weight | Letter-spacing | Where |
|------|-------|--------------|--------|----------------|-------|
| Display hero | `text-5xl sm:text-6xl tracking-tight` | 48-60px | 700 | -0.02em | home hero "Gestão profissional de rebanho..." |
| H1 page | `text-3xl tracking-tight` | 30px | 700 | -0.01em | "Dashboard" / "Animais" / "Lotes" / "Configurações" page titles |
| H2 section | `text-xl` | 20px | 600 | normal | "Funcionalidades que sustentam decisão profissional", section headings inside cards |
| H3 card | `text-base` | 16px | 600 | normal | Card titles ("Lançamento Avulso", "Áreas visíveis", "Meu Perfil") |
| H4 sub | `text-sm` | 14px | 600 | normal | Sub-card titles |
| Body | `text-sm` | 14px | 400 | normal | App body, table cells, form helper text |
| Body large | `text-base` | 16px | 400 | normal | Marketing body copy |
| Small / caption | `text-xs` | 12px | 400 | normal | Metadata, timestamps |
| Label uppercase | `text-xs font-semibold uppercase tracking-wider` | 12px | 600 | 0.05em | "OPERAÇÃO", "SISTEMA", "FAZENDA ATIVA", table column headers ("BRINCO", "RAÇA") |
| Eyebrow | `text-xs font-medium uppercase tracking-wide text-muted` | 12px | 500 | 0.04em | Marketing section eyebrow ("Plataforma de inteligência pecuária") |
| KPI big number | `text-2xl font-semibold tabular-nums` | 24px | 600 | normal | "R$ 537.501,00", "120 dias", "R$ 206,00" |
| Card big number | `text-4xl font-bold tabular-nums` | 36px | 700 | -0.01em | Saude "2" Casos Ativos, financeiro "R$ 0,00" cards |

### 3.3 Line heights
- Display: `leading-tight` (1.1)
- Headings: `leading-tight` (1.2)
- Body: `leading-relaxed` (1.625) marketing / `leading-normal` (1.5) app
- Tabular: `leading-snug` (1.375) tabelas

---

## 4. Spacing & Layout

### 4.1 Spacing scale (Tailwind defaults)
Use canonical `1=4px, 2=8px, 3=12px, 4=16px, 6=24px, 8=32px, 12=48px, 16=64px`.

### 4.2 Layout grids
- **App shell:** sidebar `w-64` (256px) fixed left + main fluid right, `h-screen` flex layout.
- **Topbar:** `h-16` (64px), `border-b border-slate-200`, `bg-white`, `px-6`, flex justify-between (page label left / search + bell + theme right).
- **Main content:** `flex-1 overflow-y-auto px-8 py-6 bg-bg`.
- **Page header:** `mb-6` flex justify-between (left col: breadcrumb + H1 + subtitle / right col: action cluster `gap-2`).
- **Container max-width:** N/A em telas data-heavy (full-width). Marketing usa `max-w-6xl mx-auto px-6 lg:px-8`.

### 4.3 Card spacing
- Padding interno: `p-6` (24px) padrão; `p-4` (16px) compactos (tabela header).
- Gap entre cards mesma linha: `gap-4` (16px).
- Gap entre rows de cards (vertical): `space-y-6` (24px).
- Hero KPI cards 3-col: `grid-cols-1 md:grid-cols-3 gap-4`.

### 4.4 Form spacing
- Field stack vertical: `space-y-4` (16px).
- Label → input: `mb-1.5` (6px).
- Helper text → input: `mt-1.5` (6px).
- Multi-col form: `grid grid-cols-1 md:grid-cols-2 gap-4`.

---

## 5. Border Radius & Shadow

### 5.1 Radius
| Element | Class | px |
|---------|-------|-----|
| Card | `rounded-xl` | 12 |
| Hero KPI card | `rounded-xl` | 12 |
| Button | `rounded-md` | 6 |
| Input / select | `rounded-md` | 6 |
| Status badge / pill | `rounded-full` | full |
| Avatar / icon container | `rounded-lg` | 8 |
| Modal / dialog | `rounded-xl` | 12 |
| Dropdown menu | `rounded-md` | 6 |
| Tab pill (configurações Geral/Cobranças) | `rounded-md` | 6 |

### 5.2 Shadow
| Token | Class | Use |
|-------|-------|-----|
| `--shadow-sm` | `shadow-sm` | Cards default |
| `--shadow-md` | `shadow-md` | Hovered cards, dropdowns |
| `--shadow-lg` | `shadow-lg` | Modals, popovers |
| `--shadow-xs` | `shadow-xs` | Sidebar elevated farm switcher |
| inset focus | `ring-2 ring-blue-500/40` | Focus state inputs |

---

## 6. Iconography

- **Library:** `lucide-react` (matches shadcn defaults; outline style fits brand).
- **Sizes:**
  - Sidebar nav: `size-5` (20px)
  - Topbar action: `size-5` (20px)
  - Inline button icon: `size-4` (16px)
  - Card header icon: `size-5` (20px)
  - Status badge inline icon: `size-3.5` (14px)
- **Strokeweight:** lucide default (2px) — não alterar
- **Color:** herda `text-current` (caller controla via tailwind classes)

### 6.1 Mapeamento icon → contexto
| Icon | Where |
|------|-------|
| `LayoutDashboard` | Sidebar > Dashboard |
| `Building2` | Sidebar > Fazendas |
| `Beef` (or custom bull) | Sidebar > Animais |
| `Layers` | Sidebar > Lotes |
| `HeartPulse` | Sidebar > Saúde |
| `LineChart` ou `TrendingUp` | Sidebar > Financeiro |
| `Settings` | Sidebar > Configurações |
| `LogOut` | Sidebar footer Sair |
| `Search` | Topbar global search input prefix |
| `Bell` | Topbar notifications |
| `Sun` / `Moon` | Topbar theme toggle (alternates) |
| `Eye` / `Pencil` / `Trash2` | Table row actions |
| `Plus` | "+ Novo X" CTAs |
| `ChevronDown` | Select chevron, accordion expand, FAQ |
| `ChevronRight` | Breadcrumb separator, "Voltar ao topo" rotate |
| `CircleAlert` | Saude Casos Ativos card icon |
| `Heart` | Saude Manejos card icon |
| `BellRing` | Saude Próximos Lembretes card icon |
| `TrendingUp` / `TrendingDown` / `DollarSign` | Financeiro Receitas/Despesas/Saldo card icons |
| `Check` / `CheckCircle` | Selecionar todas, success states |

### 6.2 Brand mark
Custom SVG (não em lucide): bull silhouette frontal outline, encerrado em quadrado `rounded-md` `bg-brand-blue` (clear `#286BA0`) com bull `stroke-white` 2px. Usado em sidebar header (40x40) e marketing nav (32x32). Manter SVG original em `apps/web/app/_brand/bull-mark.svg`.

---

## 7. Component Inventory

Mapped 1:1 com shadcn/ui primitives + custom wrappers. Naming: `<AppX>` para custom Bovion, `<ui/x>` para shadcn raw.

### 7.1 Layout chrome (logged-in app)
- **`AppShell`** (`apps/web/components/app/shell.tsx`) — flex `min-h-screen` com Sidebar + main column.
- **`AppSidebar`** — dark navy fixed-left, `w-64`. Conteúdo:
  - Top: brand mark + "Bovion" + "Inteligência Pecuária" (2-line)
  - Section "FAZENDA ATIVA" (eyebrow uppercase) + `<FarmSwitcher>` (custom select sobre dark)
  - Section "OPERAÇÃO" (eyebrow) + nav items (icon + label, hover bg `#1F2B3D`, active bg `#263345` + sub-text accent)
  - Section "SISTEMA" + Configurações
  - Footer: user email + Sair button (border-top `border-white/10`)
- **`AppTopbar`** — `h-16 border-b bg-white px-6 flex items-center justify-between`
  - Left: page label (e.g. "Animais", repete H1 — opcional contextual)
  - Right: `<GlobalSearch>` (input ~`w-80`), `<NotificationsBell>`, `<ThemeToggle>`
- **`PageHeader`** — `mb-6`
  - Top row: `<Breadcrumb>` (separator `<ChevronRight>` 12px, `text-muted`)
  - H1 + subtitle muted
  - Right: actions cluster (`<Button variant="outline">` + `<Button variant="primary">`)

### 7.2 Marketing chrome (public)
- **`MarketingNav`** — sticky top, white bg, `h-16`, `border-b border-slate-200`. Logo+name left | nav links center (`Funcionalidades`, `Billing`, `Como funciona`, `FAQ`) | CTA "Abrir o app →" right (primary navy).
- **`MarketingFooter`** — `py-8 border-t`, copyright left + "Voltar ao topo" right (text + chevron-up).
- **`HeroSplit`** — `grid grid-cols-1 lg:grid-cols-2 gap-12 py-16` — eyebrow + display H1 + body + 2 CTAs left | KPI mockup card right.
- **`FeatureGrid`** — `grid grid-cols-1 md:grid-cols-3 gap-4`, cada card icon (colored-bg square) + title + description.
- **`CTABanner`** — large card `bg-slate-50 border` com title + body + CTA right (used at bottom of como-funciona/faq).

### 7.3 Auth chrome (abrir-o-app pattern)
- **`AuthCard`** — `max-w-md mx-auto mt-32 p-6 bg-white rounded-xl border border-slate-200`. Title H3 ("Acessar Bovion") + subtitle muted + form fields + primary btn full-width + secondary action right + footer link.

### 7.4 Forms / inputs (shadcn map)
- **`<Input>`** — text/email/password. `border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`. Bg `bg-white` (light) / `bg-slate-50` no caso de read-only mostrado em "Email" disabled em configurações Meu Perfil.
- **`<Select>`** — same shape + chevron. shadcn select via radix.
- **`<DatePicker>`** — placeholder `DD/MM/AAAA` (animais filter row). shadcn date picker (radix popover + day-picker).
- **`<Search input>`** — `pl-10` + `<Search>` icon left absolutely positioned. Usado em topbar (global), em filter row (animais), em filter row settings.
- **`<Textarea>`** — não visto nas refs mas necessário pra "Descrição" futuras (financeiro ex). Mesmo border style.
- **`<Switch>`** / **`<Checkbox>`** — fazendas "Selecionar todas" / "Manter 1" mostra checkbox-bordered estilo (square `rounded` 4px, primary blue check).
- **`<RadioGroup>`** ou toggle group — financeiro "Receita / Despesa" toggle (2-segment, selected = `bg-brand-blue-soft text-white`, unselected = `bg-slate-100 text-muted`).
- **`<Tabs>`** — configurações "Geral / Cobranças" (radix tabs com pills bg-white border slate-200, active bg-white sombra leve).

### 7.5 Buttons (variants)
| Variant | Class esqueleto | Use |
|---------|-----------------|-----|
| `primary` | `bg-brand-blue text-white hover:bg-brand-blue-hover px-4 py-2 rounded-md font-medium text-sm shadow-sm` | "Entrar", "+ Novo Animal", "+ Lançar Valor", "Salvar" (active), "Abrir o app" |
| `primary-disabled` | `bg-brand-blue-disabled text-white cursor-not-allowed` | "Salvar" sem changes, "Alterar Senha" sem campos |
| `secondary` | `bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-md font-medium text-sm` | "+ Nova área", "+ Novo Lote" (animais page), "Membros" (fazenda card) |
| `ghost` | `text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-md` | "Limpar filtros", topbar bell/theme/sair |
| `link` | `text-brand-blue hover:underline` | "Esqueci minha senha", "Criar conta", "Voltar ao topo" |
| `destructive` | `bg-red-600 text-white hover:bg-red-700` ou variant `outline-destructive` em row icon (red trash) | Row delete action (icon-only red) |
| `icon` | `size-8 inline-flex items-center justify-center rounded-md hover:bg-slate-100` | Table row actions (eye/pencil/trash) |
| `icon-destructive` | icon + `text-red-600 hover:bg-red-50` | Table row trash |
| `nav-active` | bg `--color-brand-navy-hover` text-white | Sidebar selected item |
| `nav-inactive` | text-slate-300 hover:bg-white/5 | Sidebar non-selected |

### 7.6 Status badges (`<Badge>`)
| Variant | Hex bg / text | Where |
|---------|---------------|-------|
| `success` | bg `#D1E6DE` / text `#166534` | "Saudável", "Ativo" |
| `success-soft` | bg `#DBEBE5` / text `#1E5C3D` | "Ativo" lotes alt tone |
| `warning` | bg `#EEDBBC` / text `#92400E` | "Saturado", "Saturados: 2", "Moderada" |
| `danger` | bg `#EE9898` / text `#991B1B` | "Grave", "Ativo" no contexto saúde (ocorrência) |
| `outline` | bg transparent / border `#CBD5E1` / text `#475569` | "Vendido" (animais), neutral metadata |
| `info` | bg `#DBEAF4` / text `#0E4F7A` | Insights pills, badges contextual |

Shape padrão: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`.

### 7.7 Cards
- **`<Card>` base** — `bg-white border border-slate-200 rounded-xl shadow-sm p-6`.
- **`<KpiCard>` w/ semantic tint** — bg variant (`success-card`, `warning-card`, `danger-card`, `info-card`), border same hue darker, label uppercase + big number. Header icon top-right em circle bg.
- **`<ChartCard>`** — title H3 + optional subtitle muted + chart area + legend bottom.
- **`<InsightsCard>`** (dashboard "Monitore a saúde da operação...") — bg `#EEF4F3`, ícone left + title H3 + 2-col KPI grid right.
- **`<LotComparisonCard>`** (dashboard "Comparativo dos lotes") — header (lot name + status badge) + metrics row (peso/GMD/dias/custo/lucro horizontais com label-value pairs) + footer status badge ou call-out.
- **`<PricingCard>`** (billing) — title + subtitle ("Organização pequena" etc) + price R$/month + "Mais popular" highlight ribbon (Gestão tier highlighted blue) + features list (`<Check>` 16px + label) + CTA primary full-width.
- **`<EmptyState>`** — centered, icon (40-48px muted) + title + description + optional CTA. Padrão "Nenhuma movimentação encontrada" (financeiro).
- **`<FormPanel>`** — card variant pra forms split layout (financeiro Lançamento Avulso esquerda).
- **`<FaqAccordionItem>`** — bordered card, padding `px-4 py-3`, chevron right rotate on open. Background-only em contexto agrupado FAQ.

### 7.8 Data table
- **`<DataTable>`** baseado em **TanStack Table v8** + shadcn `<table>` primitive.
- Header: `bg-slate-50 text-xs font-semibold uppercase text-muted tracking-wider` + sort arrows ↕ (`<ArrowUpDown>` 14px, ativo color brand).
- Body row: `border-b border-slate-200 hover:bg-slate-50 transition-colors`. Numéricos right-aligned + `tabular-nums`.
- Status col: badge variant
- Ações col: 3 icon buttons (eye/pencil/trash) right-aligned, gap 1.
- Empty state quando `data.length === 0`: full-width centered EmptyState dentro do card body.
- Pagination: footer com page selector + total count (não visto em refs mas standard).
- Selection: checkbox col esquerda quando seleção múltipla.

### 7.9 Filter row
- Container: `flex flex-wrap items-center gap-2 mb-4`.
- Chips: select w/ chevron, `rounded-md border border-slate-300 px-3 py-2 text-sm bg-white`.
- Date inputs: text input com placeholder `DD/MM/AAAA`.
- "Limpar filtros" right: ghost button text-only.
- Search input acima da row, full-width sometimes (animais).

### 7.10 Charts (recharts)
- **Line chart:** `strokeWidth={2}`, monotone interpolation, dots opacionais hover. Colors `--chart-1..5`. Grid `<CartesianGrid stroke="#F1F5F9" strokeDasharray="3 3" />`.
- **Donut chart:** `<PieChart>` com `<Pie innerRadius="60%" outerRadius="80%">`, paddingAngle 2, no stroke. Legend below squares.
- **Bar chart:** rounded top corners (`radius={[4,4,0,0]}`), single fill (`--chart-1` ou `--chart-2`).
- **Tooltip:** white card `shadow-md border border-slate-200 rounded-md p-2 text-xs`. Custom `<TooltipContent>` formatter pra `R$ X,XX`.
- **Legend:** below chart, square swatches 8px + label `text-xs text-muted`.

### 7.11 Dialog / Modal
- shadcn `<Dialog>` (radix). White surface, `max-w-md` defaut, `rounded-xl`, `p-6`. Title H3 + description muted + body + footer (right-aligned `gap-2` cancel + primary).
- Used in M1+ for "Novo Animal", "Editar Lote", "Convidar membro", etc.

### 7.12 Toast (sonner)
- `sonner` lib. Position top-right. Variants: success (green), error (red), info (blue). Auto-dismiss 4s default.

### 7.13 Skeleton / Loading
- shadcn `<Skeleton>` (animated bg-slate-100 → bg-slate-200 pulse). Use em data tables + KPI cards durante fetch.

### 7.14 Theme toggle
- shadcn dropdown ou inline button toggle. 3 modos: Claro / Escuro / Sistema (visto em configurações Aparência section). Use `next-themes`.

---

## 8. Per-Screen Specs

### 8.1 home.png — Marketing landing
**Path:** `app/(marketing)/page.tsx`
**Layout:** `MarketingNav` + Hero split + 3-col Feature grid + CTA banner + `MarketingFooter`.
- **Top nav:** logo+wordmark left | nav links center ("Funcionalidades", "Billing", "Como funciona", "FAQ") | CTA "Abrir o app" navy right.
- **Hero (split):**
  - Left col: eyebrow "Plataforma de inteligência pecuária" → display H1 "Gestão profissional de rebanho com foco em margem e timing de venda" → body 1 paragraph → 2 CTAs (`Abrir o app` primary navy + `Ver planos` secondary outline) → 4-bullet list w/ check icons (Projeções de margem por animal, Preço de arroba global com inversão histórica, Leitura objetiva de saturação por lote, Comparativo entre lotes).
  - Right col: white card `rounded-xl border shadow-sm p-6` mockup. Header H3 "Visão de decisão em um só painel" + subtitle. 2-col KPI grid (Margem por animal `R$ 128.400` / Margem livre `R$ 6.320` w/ trend up). Mini-table 3 lots rows (Lote letras + status badge dotted color).
- **Features section:** H2 "Funcionalidades que sustentam decisão profissional" + 1-line subtitle muted + `grid-cols-3 gap-4` 3 cards (icon colored container + title + description).

### 8.2 funcionalidades.png — Marketing features
**Path:** `app/(marketing)/funcionalidades/page.tsx`
**Layout:** Same nav + page H1 "Funcionalidades que sustentam decisão profissional" + 6-card grid (2 rows x 3 cols) — each card: colored icon square + title H3 + description body.
**Cards observed:** Painel executivo em minutos / Gestão individual de animais / Comparativo inteligente de lotes / Simulação de cenários / Acompanhamento de ROI / Alertas de risco econômico.

### 8.3 billing.png — Marketing pricing
**Path:** `app/(marketing)/billing/page.tsx`
**Layout:** nav + page H2 "Planos por estágio da operação, com foco em ganho real" + subtitle (com link "Comparativo de cobrança por referência mensal" inline right) + `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4` 4 pricing cards.
- **Pricing cards (4 tiers):**
  - **Essencial** — "Organização pequena" subtitle | `R$ 49,90` price | period "/usuário · janela" | features list (Limite até 100 animais ativos, Excedente: R$ 1,50/animal etc) | CTA outline "Plano base" or similar
  - **Gestão** — highlighted (border-brand-blue + "Mais popular" ribbon top), `R$ 149,00` | features list | CTA primary
  - **Estratégico** — `R$ 399,00` | features incluindo simulação ilimitada
  - **Corporativo** — `R$ 1.099,00` | enterprise features
- **Right panel "Simulador de cobrança":** select Plano (Gestão default) + slider/input "Animais ativos no mês" 1.000 + breakdown calculation (Base mensal + Excedente projeção + Total estimado). Highlight area `bg-info-card`.

### 8.4 como-funciona.png — Marketing how-it-works
**Path:** `app/(marketing)/como-funciona/page.tsx`
**Layout:** nav + section H2 "Como funciona" + subtitle + `grid-cols-1 md:grid-cols-3 gap-4` 3 numbered cards (1) Configure parâmetros financeiros / 2) Cadastre lotes, animais e pesagens / 3) Decida com base em projeções) — cada card: icon brand-blue + numbered title + description. Section divider + "Perguntas frequentes" preview (4 FAQ accordion items collapsed) + bottom CTA banner "Pronto para decidir com mais confiança e margem?" w/ "Abrir o App →" primary CTA.

### 8.5 faq.png — Marketing FAQ
**Path:** `app/(marketing)/faq/page.tsx`
**Layout:** nav + page H2 "Perguntas frequentes" + accordion list (cada item bordered card individual w/ chevron-down right rotate on open). Same FAQ shown collapsed in como-funciona. Bottom CTA banner.

### 8.6 abrir-o-app.png — Auth login
**Path:** `app/(auth)/login/page.tsx` (M1 AUTH-001)
**Layout:** Centered card `max-w-md mx-auto mt-32`. NO sidebar/topbar. Bg `bg-marketing` (`#F6F8F9`).
- Card content: H3 "Acessar Bovion" + subtitle muted "Use o usuário da aplicação para entrar no dashboard." + form (Email field + Senha field) + "Esqueci minha senha" link right-aligned + primary CTA full-width "Entrar" + footer "Não tem conta? Criar conta" centered.

### 8.7 dashboard.png — App Dashboard (PRINCIPAL)
**Path:** `app/(app)/dashboard/page.tsx` (M4 DASH-001)
**Layout:** AppShell + topbar + PageHeader ("Dashboard" + subtitle "Conecte projeções financeiras aos dados de rebanho, manejo, saúde de margem e a margem projetada por lote.") + filter row + multi-section content.
- **Filter row:** 4 selects (Selecione a fazenda, Tipo de operação?, Filtrar por área, Filtrar por status) + "Limpar filtros" link right.
- **Charts section row:** 2-col `<ChartCard>`s
  - Left: "Curva de lucro projetado (atual ${})" line chart 4 series (legend bottom: Atual / Meta / Cenário ótimo / Baseline)
  - Right: "Composição de custos" donut chart (single series colored slices)
- **Bar chart card:** "Projeção financeira por lote" bar chart (single series brand-blue bars) full-width.
- **Empty state card right of bar:** "Mortes registradas" — empty state icon + "Sem mortes registradas" + helper text + CTA outline.
- **Insights callout card:** bg `#EEF4F3` cyan-tint, ícone + H3 "Monitore a saúde da operação, identifique risco cedo e compare lotes sem trocar de tela." + 2-col grid (header "Engorda Primavera" badge | KPIs "R$ 206,00 / 1 / 0 / R$ 537.501,00 / 120 dias / 1,18 kg/d") + meta KPIs side panel.
- **KPI hero row:** 4-col `<KpiCard>` (R$ 192,06 / 1 / 120 dias / 0 / R$ 337.501,00) — mix tints success/warning per metric.
- **"Comparativo dos lotes" section:** title + 3 lot comparison cards stacked (Engorda Primavera / Semi aberto / Lote Novo) — cada card: header (lot name + status badge "Saudável" verde) + 5-col KPI strip + footer status pill.
- **"Curva de venda" line chart card** (no fim): single line + KPI cards 5-col below (Última pesagem / Média de animais / Peso médio / Custo médio / Lucro médio).

### 8.8 fazendas.png — App Fazendas (FARM list/management)
**Path:** `app/(app)/fazendas/page.tsx` (M1 FARM-001..007)
**Layout:** AppShell + PageHeader ("Fazendas" + subtitle + actions "+ Nova área" outline + "+ Nova fazenda" primary) + 2 stacked cards.
- **Card 1 "Fazendas gerenciadas":** header H3 + actions right ("Selecionar todas" check + "Manter 1" check). Body: list de fazendas (cada row: ícone building + nome bold + cidade-UF muted | actions "Membros" link + edit pencil + delete trash + active checkmark indicator).
- **Card 2 "Áreas visíveis":** header H3 + list de áreas (cada row: nome + sub-fazenda muted + `border border-slate-200 rounded-md p-3 mb-2`).

### 8.9 animais.png — App Animais (ANIMAL CRUD)
**Path:** `app/(app)/animais/page.tsx` (M2 add-animal-001 + AL-001..011)
**Layout:** AppShell + PageHeader ("Animais" + subtitle + actions "+ Novo Lote" outline + "+ Novo Animal" primary) + helper sub-text right "Use os filtros para refinar por status, sexo e período de compra/venda." + filter row + DataTable.
- **Filter row:** Search input full-width "Buscar por brinco, raça, lote..." + chips (Todos x3, 2 date inputs DD/MM/AAAA, Compra ou venda select, Limpar filtros button).
- **Table cols:** BRINCO ↕ | RAÇA ↕ | LOTE ↕ | PESO ↕ | GMD ↕ | CUSTO TOTAL ↕ | Dias na ração | Custo ração (R$) | INSIGHTS ↕ | STATUS ↕ | Ações.
- **Rows shown:** #1231 / #123423 / #123456 / #a123 / #B123 — mix de Saudável (success), Saturado (warning) / Vendido (outline), Ativo (success).
- **Bottom:** "+ Novo Animal" primary CTA repeat.

### 8.10 lotes.png — App Lotes (LOT CRUD)
**Path:** `app/(app)/lotes/page.tsx` (M2 LOT-001..007)
**Layout:** AppShell + PageHeader ("Lotes" + subtitle "Gestão por lote com foco em performance e rentabilidade." + action "+ Novo Lote" primary) + filter row simplificado + DataTable.
- **Filter row:** Search "Buscar por nome ou área" + select right "Todos" w/ chevron.
- **Table cols:** LOTE | ÁREA | ANIMAIS | GMD | CUSTO/@ | LUCRO | INSIGHTS | STATUS | Ação.
- **Rows shown:** Engorda Primavera | LOte 1 | LOte Novo | Semi aberto — status badges Saudável/Saturados:2/Saudável + Ativo.
- **Ação col:** apenas eye icon (visualizar) — não tem edit/delete inline (pq edit é via página dedicada).

### 8.11 saude.png — App Saúde (HEALTH)
**Path:** `app/(app)/saude/page.tsx` (M3 HEALTH-001..004)
**Layout:** AppShell + PageHeader ("Saúde e Manejo" + subtitle "Controle de ocorrências sanitárias do rebanho.") + 3-col KPI hero cards + search input + DataTable.
- **KPI hero (3-col):**
  - "Casos Ativos" big number `2` + danger-card tint (`#F7EFF0`) + circle-alert icon top-right
  - "Manejos (30 dias)" big number `1` + white surface + heart icon
  - "Próximos Lembretes" big number `1` + warning-card tint (`#F8F5EF`) + bell-ring icon
- **Search:** input full-width "Buscar por diagnóstico, brinco, lote ou tipo..."
- **CTA right:** "+ Registrar Ocorrência" primary
- **Table cols:** ANIMAL ↕ | LOTE ↕ | OCORRÊNCIA ↕ | INÍCIO ↕ | SEVERIDADE ↕ | STATUS ↕ | CUSTO ↕ | AÇÕES.
- **Rows shown:** #a123 / Lesão / perna quebrada / aplicar tala (sub) / 29/04/2026 / Grave (danger badge) / Ativo (danger badge) / R$ 400,00. #123456 / Doença / Corte na Perna / 16/03/2026 / Moderada (warning) / Ativo (danger) / R$ 150,00.
- **Ações:** delete (red trash) / edit / view eye.

### 8.12 financeiro.png — App Financeiro (FIN)
**Path:** `app/(app)/financeiro/page.tsx` (M4 FIN-001..008)
**Layout:** AppShell + PageHeader ("Controle Financeiro" + subtitle "Fluxo de caixa e lucratividade em tempo real" + actions: 2 selects right (Maio default + 2026 default)) + 3-col KPI hero + 2-col split (form panel + list panel).
- **KPI hero (3-col):**
  - "Receitas Totais" `R$ 0,00` + success-card tint (`#EEF4F3`) + trending-up icon
  - "Despesas Totais" `R$ 0,00` + danger-card tint (`#F7EFF0`) + trending-down icon
  - "Saldo Líquido (Lucro)" `R$ 0,00` + success-card tint + dollar-sign icon
- **Split (left form / right list):**
  - **Left "Lançamento Avulso"** card: form (Descrição* input + Valor (R$)* input com "R$" prefix + Categoria select default "Ração" + Tipo de Lançamento toggle 2-segment "Receita"/"Despesa" (Despesa selected = `bg-brand-blue-soft text-white`) + primary CTA full-width "+ Lançar Valor").
  - **Right "Lançamentos de Maio de 2026"** card: H3 + search input "Filtrar lançamentos..." + EmptyState (icon + "Nenhuma movimentação" + helper "Nenhuma movimentação encontrada.").

### 8.13 configuracoes.png — App Configurações
**Path:** `app/(app)/configuracoes/page.tsx` (M5 SETTINGS)
**Layout:** AppShell + PageHeader ("Configurações" + subtitle "Preferências gerais de operação do Bovion.") + Tabs (Geral / Cobranças) + sectioned form cards.
- **Tabs:** pill-style 2 tabs, Geral active.
- **Section cards stacked:**
  - **"Organização":** ícone building + H3 + form (Nome da organização input "Grupo Agro Serra Dourada" + "Salvar" disabled btn right).
  - **"Meu Perfil":** ícone person + H3 + form 2-col (Nome / Email read-only) + Telefone full-width + "Salvar" disabled btn right.
  - **"Alterar Senha":** ícone lock + H3 + form 1-col (Senha atual) + 2-col (Nova senha "Mínimo 8 caracteres" placeholder + Confirmar nova senha) + "Alterar Senha" disabled btn right.
  - **"Aparência":** ícone palette + H3 + 3-button toggle (Claro / Escuro / Sistema active = `bg-brand-blue text-white`).

---

## 9. Stack & Dependencies

### 9.1 Already locked (M0)
- next 16.2.4
- react 19.2.5 + react-dom
- tailwindcss 4.2.4 + @tailwindcss/postcss
- typescript 6.0.3
- zod 4.4.2

### 9.2 To install in M1 (UI infra)
```bash
pnpm --filter web add \
  @radix-ui/react-accordion @radix-ui/react-checkbox @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-popover \
  @radix-ui/react-radio-group @radix-ui/react-select @radix-ui/react-slot \
  @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast \
  @radix-ui/react-tooltip @radix-ui/react-avatar \
  class-variance-authority clsx tailwind-merge \
  lucide-react \
  next-themes \
  react-hook-form @hookform/resolvers \
  sonner \
  date-fns

# shadcn/ui via CLI (não installa runtime, copia componentes pra apps/web/components/ui/)
pnpm dlx shadcn@latest init  # in apps/web
pnpm dlx shadcn@latest add button card input select badge table dialog dropdown-menu tabs sheet \
  accordion checkbox switch radio-group label popover toast avatar separator skeleton tooltip
```

### 9.3 To install in M2+ (data table)
```bash
pnpm --filter web add @tanstack/react-table
```

### 9.4 To install in M4 (charts)
```bash
pnpm --filter web add recharts
```

### 9.5 Recommended utilities
- `react-hook-form` + `zod` + `@hookform/resolvers/zod` — forms with validation
- `sonner` — toasts
- `next-themes` — dark mode toggle
- `date-fns` + `react-day-picker` (via shadcn) — date inputs
- `cva` (class-variance-authority) — typed variants

---

## 10. Implementation Order by Milestone

| Milestone | Screens / patterns | Brief sections aplicáveis |
|-----------|-------------------|---------------------------|
| **M0** | placeholder landing — current | Skip brief, real UI starts M1 |
| **M1 AUTH/FARM/MEMBER** | abrir-o-app (login), reset/verify cards, fazendas list, fazendas form modals, member invites | §3 Typography + §6 Icons + §7.3 AuthCard + §7.1 AppShell + §7.2 MarketingNav (basic) + §8.6 + §8.8 |
| **M2 ANIMAL/LOT/AREA** | animais, lotes, lot detail page, animal detail page, novo animal modal | §7.7 Cards + §7.8 DataTable + §7.9 Filter row + §7.6 Badges + §8.9 + §8.10 |
| **M3 HEALTH/SUPP** | saude, dieta CRUD, ingrediente catálogo | §7.7 KpiCard tints + §7.8 DataTable + §8.11 |
| **M4 FIN/DASH/PSIM** | dashboard, financeiro, simulador | §7.10 Charts + §7.7 InsightsCard / KpiCard / LotComparisonCard + §8.7 + §8.12 |
| **M5 BILLING/SETTINGS** | billing pricing, configurações tabs | §7.7 PricingCard + §7.4 Tabs + §8.3 + §8.13 |
| **M6 Marketing** | home, funcionalidades, como-funciona, faq, polish | §7.2 MarketingNav/Footer + HeroSplit + FeatureGrid + FaqAccordion + §8.1-8.5 + Resend integration |

---

## 11. Tailwind v4 `@theme` block (drop-in para `apps/web/app/globals.css`)

```css
@import 'tailwindcss';

@theme {
  /* Brand */
  --color-brand-navy: #182435;
  --color-brand-navy-soft: #1A2738;
  --color-brand-navy-hover: #263345;
  --color-brand-blue: #286BA0;
  --color-brand-blue-hover: #1F5687;
  --color-brand-blue-active: #173F66;
  --color-brand-blue-disabled: #99B8D2;
  --color-brand-blue-soft: #3E7AAA;

  /* Surface */
  --color-bg: #F9FAFB;
  --color-bg-marketing: #F6F8F9;
  --color-surface: #FFFFFF;
  --color-surface-alt: #F3F4F6;
  --color-surface-muted: #EDEFF2;
  --color-border: #E5E7EB;
  --color-border-strong: #CBD5E1;
  --color-border-input: #D1D5DB;

  /* Text */
  --color-text: #0F172A;
  --color-text-body: #1F2937;
  --color-text-muted: #6B7280;
  --color-text-subtle: #9CA3AF;
  --color-text-inverse: #F9FAFB;
  --color-text-link: #286BA0;

  /* Status */
  --color-success-bg: #D1E6DE;
  --color-success-card-bg: #EEF4F3;
  --color-success-fg: #166534;
  --color-warning-bg: #EEDBBC;
  --color-warning-card-bg: #F8F5EF;
  --color-warning-fg: #92400E;
  --color-danger-bg: #EE9898;
  --color-danger-card-bg: #F7EFF0;
  --color-danger-fg: #991B1B;
  --color-info-bg: #DBEAF4;
  --color-info-card-bg: #EEF4F3;
  --color-info-fg: #0E4F7A;
  --color-neutral-bg: #F1F5F9;
  --color-neutral-fg: #475569;

  /* Charts */
  --color-chart-1: #286BA0;
  --color-chart-2: #10B981;
  --color-chart-3: #F59E0B;
  --color-chart-4: #94A3B8;
  --color-chart-5: #7C3AED;

  /* Radius */
  --radius-button: 0.375rem;
  --radius-input: 0.375rem;
  --radius-card: 0.75rem;

  /* Font */
  --font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

@variant dark (&:where(.dark, .dark *));

:root {
  color-scheme: light dark;
}

body {
  font-family: var(--font-sans);
  font-feature-settings: 'cv02', 'cv11', 'ss01', 'ss03'; /* Inter typographic features */
}
```

---

## 12. Open Questions (resolver M1)

1. **Inter font loading:** `next/font/google` preferido (preload + zero-FOUT). Confirm.
2. **Dark mode escopo:** apenas toggle UI (3 modos Claro/Escuro/Sistema visíveis em configurações Aparência) → assumir SIM dark mode global. Status badge tints precisam darken — refinar quando implementar.
3. **TanStack Table v8 vs shadcn `<table>` simples:** TanStack pra animais/lotes/saude (sort/filter/paginate). Confirm.
4. **`Beef` icon vs custom bull SVG no sidebar nav "Animais":** custom SVG matching brand mark é mais consistente. Confirm.
5. **Fonte numérica tabular:** Inter já tem `cv11`/`tnum` — ativar via `font-feature-settings` global. OK.
6. **Mobile breakpoint (sidebar collapse):** refs todas desktop. Sidebar vira `<Sheet>` (drawer) em `md:` breakdown. Confirm at M1.
7. **Marketing landing real (M6):** refs cobrem layout estático. Adicionar animations sutis (Framer Motion ou CSS @keyframes) — decidir no M6 quando chegar.
8. **Ícone "Mais popular" no pricing (billing):** ribbon-style top-right ou label inline header? Refs mostram label inline header. Confirm.

---

## 13. Departures from References

Sugestões além das refs (justificadas):

1. **Focus rings explícitos** — refs estáticas não mostram. A11y exige. Use `ring-2 ring-blue-500/40 ring-offset-1 ring-offset-white` em inputs/buttons.
2. **Empty states pra todas tabelas** — refs só populadas. Definido `<EmptyState>` componente padrão (visto em financeiro list).
3. **Loading skeletons** — refs estáticas. Padrão moderno: shadcn `<Skeleton>` pulse animation.
4. **Toast notifications (sonner)** — refs não mostram feedback mas critical for forms / actions. top-right position.
5. **Mobile sidebar (Sheet drawer)** — refs todas desktop-only. Required for production.
6. **Skip link** — `<a href="#main-content" class="sr-only focus:not-sr-only">Pular para conteúdo</a>` em layout pra a11y.
7. **`<title>` por página** — Next 16 metadata API. Já presente em layout placeholder M0.

---

## 14. Appendix: Reference image audit summary

| Image | Resolution | Type | Bg dominant | Sidebar present |
|-------|-----------|------|-------------|-----------------|
| home.png | 1920x1080 | marketing | `#F9FAFB` | no |
| funcionalidades.png | 1920x1080 | marketing | `#F9FAFB` | no |
| billing.png | 1920x1080 | marketing | `#F9FAFB` | no |
| como-funciona.png | 1920x1080 | marketing | `#F9FAFB` | no |
| faq.png | 1920x1080 | marketing | `#F9FAFB` | no |
| abrir-o-app.png | 1920x1080 | auth | `#F6F8F9` | no |
| dashboard.png | 1920x4640 (long scroll) | app | `#F9FAFB` | yes navy `#182435` |
| animais.png | 1920x1080 | app | `#F9FAFB` | yes navy `#182435` |
| lotes.png | 1920x1080 | app | `#F9FAFB` | yes navy `#182435` |
| fazendas.png | 1920x1080 | app | `#F9FAFB` | yes navy `#182435` |
| saude.png | 1920x1080 | app | `#F9FAFB` | yes navy `#182435` |
| financeiro.png | 1920x1080 | app | `#F9FAFB` | yes navy `#182435` |
| configuracoes.png | 1920x1264 (mid scroll) | app | `#FFFFFF` (form-heavy) | yes navy `#182435` |

---

## 15. Maintenance

- **Update brief when:** new pattern emerges that wasn't in original 13 refs (e.g. M2 animal detail page lifecycle timeline). Add new section §8.X with PIL-sampled colors.
- **Token changes:** must update §11 `@theme` block + §2 tables together.
- **Skill flow:** subsequent UI additions should ALSO route via `frontend-blueprint` skill (per `feedback_use_skills_first.md` mandate).
