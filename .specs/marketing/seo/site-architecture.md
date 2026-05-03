# Arquitetura de Site — Bovion

*Gerado em: 2026-05-03*
*Fase: M0–M5 (roadmap completo de URLs)*
*Todos os slugs em pt-BR*

---

## Mapa de URLs

### Páginas Públicas (Marketing Site)

| Path | Propósito | Página pai | Links internos alvo | Fase | Prioridade SEO |
|------|-----------|------------|---------------------|------|----------------|
| `/` | Homepage — hero, proposta de valor, features principais, CTA trial | — | `/como-funciona`, `/funcionalidades`, `/faq`, `/cadastro` | M0 | Altíssima |
| `/como-funciona` | How it works — fluxo passo a passo, screenshots do app | `/` | `/funcionalidades`, `/cadastro`, `/calculadora/custo-arroba` | M1 | Alta |
| `/funcionalidades` | Hub de funcionalidades — grid com links para cada feature | `/` | Todas as páginas `/funcionalidades/<slug>` | M1 | Alta |
| `/funcionalidades/controle-de-rebanho` | Feature: gestão de animais, lotes, pesagem, GMD | `/funcionalidades` | `/funcionalidades/dashboard`, `/calculadora/gmd`, `/cadastro` | M1 | Alta |
| `/funcionalidades/custo-por-arroba` | Feature: cálculo automático de custo/@ | `/funcionalidades` | `/calculadora/custo-arroba`, `/funcionalidades/simulador-de-venda` | M1 | Altíssima |
| `/funcionalidades/simulador-de-venda` | Feature: simulador dia ótimo de venda 0–120 dias | `/funcionalidades` | `/funcionalidades/custo-por-arroba`, `/cadastro` | M1 | Altíssima |
| `/funcionalidades/saude-animal` | Feature: vacinas, medicações, tratamentos integrados ao custo | `/funcionalidades` | `/funcionalidades/controle-de-rebanho`, `/cadastro` | M1 | Média |
| `/funcionalidades/suplementacao` | Feature: dietas, custo de ração por animal/dia | `/funcionalidades` | `/funcionalidades/custo-por-arroba`, `/cadastro` | M1 | Média |
| `/funcionalidades/dashboard` | Feature: KPIs operacionais e financeiros em tempo real | `/funcionalidades` | `/funcionalidades/simulador-de-venda`, `/cadastro` | M1 | Alta |
| `/funcionalidades/multi-fazenda` | Feature: múltiplas fazendas e controle de acesso por papel | `/funcionalidades` | `/funcionalidades/dashboard`, `/cadastro` | M2 | Média |
| `/calculadora/custo-arroba` | Calculadora gratuita: custo por @ estimado | `/` | `/funcionalidades/custo-por-arroba`, `/cadastro`, artigos do blog | M2 | Altíssima |
| `/calculadora/gmd` | Calculadora gratuita: GMD (Ganho Médio Diário) | `/` | `/funcionalidades/controle-de-rebanho`, `/calculadora/custo-arroba` | M2 | Alta |
| `/faq` | Perguntas frequentes — dúvidas de produto e pecuária | `/` | `/como-funciona`, `/cadastro`, artigos relevantes do blog | M1 | Alta |
| `/blog` | Hub do blog — lista de posts | `/` | Todos os `/blog/<slug>`, `/calculadora/*` | M2 | Alta |
| `/blog/<slug>` | Artigos educativos (ver content-strategy.md) | `/blog` | Posts relacionados, calculadoras, `/cadastro` | M2 | Alta |
| `/vs/softfarm` | Comparativo: Bovion vs SoftFarm | `/` | `/funcionalidades`, `/cadastro`, artigos relevantes | M2 | Alta |
| `/vs/planilha-excel` | Comparativo: Bovion vs planilha Excel | `/` | `/calculadora/custo-arroba`, `/funcionalidades`, `/cadastro` | M2 | Altíssima |
| `/vs/agrosistemas` | Comparativo: Bovion vs AgroSistemas | `/` | `/funcionalidades`, `/cadastro` | M3 | Média |
| `/sobre` | Sobre a empresa — missão, time, visão | `/` | `/contato`, `/cadastro` | M1 | Baixa |
| `/contato` | Formulário de contato | `/` | `/faq`, `/sobre` | M1 | Baixa |
| `/precos` | Página de planos e preços | `/` | `/cadastro`, `/funcionalidades`, `/faq` | **M5** (diferir) | Alta (quando publicar) |

### Páginas de App (noindex)

| Path | Propósito | Robots |
|------|-----------|--------|
| `/cadastro` | Registro de nova conta — trial 14 dias | noindex |
| `/login` | Autenticação | noindex |
| `/app/*` | Rotas do aplicativo SaaS | noindex |
| `/api/*` | Rotas de API | noindex |

---

## Hierarquia de Navegação

### Header (navegação principal)

```
Logo (→ /)
├── Funcionalidades (→ /funcionalidades)
│   ├── Controle de Rebanho
│   ├── Custo por Arroba
│   ├── Simulador de Venda
│   ├── Saúde Animal
│   ├── Suplementação
│   └── Dashboard
├── Como Funciona (→ /como-funciona)
├── Blog (→ /blog)           [M2]
├── Preços (→ /precos)       [M5 — diferir]
└── [CTA] Começar grátis (→ /cadastro)
```

### Footer (navegação secundária)

```
Produto
├── Funcionalidades (→ /funcionalidades)
├── Como funciona (→ /como-funciona)
├── Calculadoras
│   ├── Custo por Arroba (→ /calculadora/custo-arroba)
│   └── GMD (→ /calculadora/gmd)
└── Preços (→ /precos)   [M5]

Comparativos
├── Bovion vs Planilha Excel (→ /vs/planilha-excel)
├── Bovion vs SoftFarm (→ /vs/softfarm)
└── Bovion vs AgroSistemas (→ /vs/agrosistemas)

Recursos
├── Blog (→ /blog)
└── FAQ (→ /faq)

Empresa
├── Sobre (→ /sobre)
└── Contato (→ /contato)

Legal
├── Política de Privacidade (→ /privacidade)   [antes do go-live M6]
└── Termos de Uso (→ /termos)                  [antes do go-live M6]
```

---

## Estratégia de Internal Linking

### Modelo Pillar → Cluster → Leaf

```
PILLAR (Alta autoridade, keyword head term)
└── /funcionalidades/custo-por-arroba
    ├── CLUSTER (keyword de suporte)
    │   ├── /calculadora/custo-arroba
    │   ├── /blog/como-calcular-custo-por-arroba
    │   ├── /blog/break-even-pecuaria-corte
    │   └── /vs/planilha-excel
    └── CLUSTER
        ├── /funcionalidades/simulador-de-venda
        └── /blog/quando-vender-gado-de-corte

PILLAR
└── /funcionalidades/controle-de-rebanho
    ├── CLUSTER
    │   ├── /calculadora/gmd
    │   ├── /blog/gmd-bovino-como-melhorar
    │   └── /blog/pesagem-gado-corte-frequencia
    └── CLUSTER
        ├── /funcionalidades/saude-animal
        └── /funcionalidades/suplementacao
```

### Regras de internal linking

1. **Pillar pages** devem receber links de todas as páginas do cluster e de pelo menos 3 artigos do blog.
2. **Calculadoras** são "link magnets" — linkar de todo artigo educativo relevante e das feature pages de custo e GMD.
3. **Páginas de comparativo** (`/vs/*`) recebem link do blog (artigos comparativos) e do rodapé; não linkar do header para não distrair na jornada principal.
4. **CTA `/cadastro`** deve aparecer como link contextual em todas as feature pages e no final de cada artigo de blog.
5. **Máximo de links por página:** sem limite rígido, mas priorizar relevância. Evitar listas de links puramente navegacionais sem contexto.
6. **Anchor text:** descritivo e variado — usar sinônimos naturais ("custo por arroba", "custo/@", "cálculo de custo de arroba") em vez de repetir o exato mesmo anchor.

---

## Breadcrumbs

### Padrão

```
Início > [Seção] > [Página atual]
```

### Exemplos

| Página | Breadcrumb |
|--------|-----------|
| `/funcionalidades/custo-por-arroba` | Início > Funcionalidades > Custo por Arroba |
| `/blog/como-calcular-custo-por-arroba` | Início > Blog > Como Calcular Custo por Arroba |
| `/vs/planilha-excel` | Início > Comparativos > Bovion vs Planilha Excel |
| `/calculadora/custo-arroba` | Início > Calculadoras > Calculadora de Custo por Arroba |
| `/faq` | Início > FAQ |

### Implementação

- Componente React `<Breadcrumb>` em `apps/web/components/ui/breadcrumb.tsx`
- Schema `BreadcrumbList` JSON-LD renderizado inline em cada página (ver `schema-markup-plan.md`)
- Não exibir breadcrumb na homepage
- "Início" sempre linka para `/`

---

## Plano sitemap.xml

Implementar como rota dinâmica em `apps/web/app/sitemap.ts` (Next.js Metadata API):

```typescript
// apps/web/app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://bovion.com.br', lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: 'https://bovion.com.br/como-funciona', changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://bovion.com.br/funcionalidades', changeFrequency: 'monthly', priority: 0.9 },
    // feature pages: priority 0.8
    // calculadoras: priority 0.8
    // /faq: priority 0.7
    // /blog: priority 0.7
    // /blog/<slug>: gerado dinamicamente, priority 0.6
    // /vs/*: priority 0.7
    // /sobre, /contato: priority 0.4
    // NÃO incluir: /login, /cadastro, /app/*, /api/*
    // NÃO incluir: /precos até M5
  ]
}
```

**Regras:**
- Incluir apenas URLs com status 200 e sem `noindex`
- `lastModified` dinâmico para artigos de blog (data de publicação/atualização)
- Submeter ao Google Search Console e Bing Webmaster Tools após primeiro deploy com landing real (M1)
- Referência obrigatória no `robots.txt`: `Sitemap: https://bovion.com.br/sitemap.xml`

---

## Plano robots.txt

Criar `apps/web/public/robots.txt`:

```
User-agent: *
Allow: /

# Bloquear rotas de app e API
Disallow: /app/
Disallow: /api/
Disallow: /login
Disallow: /cadastro
Disallow: /_next/

# Referência ao sitemap
Sitemap: https://bovion.com.br/sitemap.xml
```

**Notas:**
- `/cadastro` bloqueado via robots (não indexar a tela de signup)
- `/_next/` bloqueado para evitar indexação de chunks de JS/CSS
- Revisitar quando rotas de app estiverem definidas (M2+)
- Não usar `robots.txt` como único mecanismo de proteção — adicionar `noindex` no metadata das páginas sensíveis também

---

*Revisão deste documento: M1 (após landing real publicada) e M2 (após blog implementado).*
