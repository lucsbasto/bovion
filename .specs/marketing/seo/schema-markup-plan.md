# Plano de Schema Markup — Bovion

*Gerado em: 2026-05-03*
*Idioma: pt-BR (valores de copy em pt-BR; chaves JSON em inglês conforme spec do schema.org)*
*Implementação: JSON-LD inline via Next.js (Server Components)*

---

## Visão Geral

| Tipo de Schema | Páginas | Prioridade | Fase |
|----------------|---------|-----------|------|
| Organization | `/` (raiz) | Alta | M1 |
| SoftwareApplication | `/` | Alta | M1 |
| FAQPage | `/faq`, artigos educativos | Alta | M1 |
| BreadcrumbList | Todas as páginas internas | Alta | M1 |
| Article | `/blog/<slug>` | Alta | M2 |
| HowTo | `/calculadora/*` | Média | M2 |
| AggregateRating | **NÃO publicar até ter reviews reais** | — | M6+ |
| Product/Offer | `/precos` | **Diferir para M5** | M5 |

---

## Schemas por Tipo

### 1. Organization

**Onde aplicar:** Homepage `/` — uma única instância, no layout raiz ou em componente `<JsonLd>` carregado apenas na home.

**Propósito:** Estabelecer identidade da empresa para Knowledge Graph do Google.

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Bovion",
  "url": "https://bovion.com.br",
  "logo": {
    "@type": "ImageObject",
    "url": "https://bovion.com.br/images/logo.png",
    "width": 200,
    "height": 60
  },
  "description": "Plataforma SaaS de inteligência pecuária para gestão de rebanho bovino de corte. Calcula custo por arroba, GMD e simula o dia ótimo de venda.",
  "foundingDate": "2025",
  "areaServed": {
    "@type": "Country",
    "name": "Brasil"
  },
  "knowsAbout": [
    "Gestão de rebanho bovino",
    "Pecuária de corte",
    "Custo por arroba",
    "GMD bovino",
    "Simulação de venda de gado"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "availableLanguage": "Portuguese",
    "url": "https://bovion.com.br/contato"
  },
  "sameAs": [
    "https://www.instagram.com/bovion",
    "https://www.linkedin.com/company/bovion"
  ]
}
```

**Notas:**
- Substituir `sameAs` com URLs reais de redes sociais quando criadas
- `logo` deve ser imagem real em formato PNG ou SVG, hospedada no domínio
- Não inventar `foundingDate` — ajustar para data real de constituição da empresa

---

### 2. SoftwareApplication

**Onde aplicar:** Homepage `/` — junto com o Organization, ou como schema separado.

**Propósito:** Eligibilidade para rich results de software; sinal para Google entender que é um produto SaaS.

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Bovion",
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "Pecuária / Gestão de Rebanho",
  "operatingSystem": "Web (todos os navegadores modernos)",
  "url": "https://bovion.com.br",
  "description": "Software de gestão pecuária para bovinos de corte. Controle de rebanho, cálculo de custo por arroba, GMD automático e simulador de dia ótimo de venda.",
  "inLanguage": "pt-BR",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "BRL",
    "description": "Trial gratuito de 14 dias, sem cartão de crédito",
    "category": "trial"
  },
  "featureList": [
    "Cálculo automático de GMD (Ganho Médio Diário)",
    "Custo por arroba em tempo real",
    "Simulador de dia ótimo de venda (0–120 dias)",
    "Controle de saúde animal (vacinas e medicações)",
    "Gestão de suplementação e dietas",
    "Multi-fazenda com controle de acesso por papel"
  ],
  "screenshot": "https://bovion.com.br/images/screenshot-dashboard.png",
  "softwareVersion": "1.0"
}
```

**Notas:**
- `offers.price: "0"` refere-se ao trial — correto e não deceptivo
- Não incluir `aggregateRating` aqui até ter reviews reais (ver seção Avoid)
- `screenshot` deve ser imagem real do app (adicionar quando tela de dashboard existir)
- `softwareVersion` manter atualizado com versão atual

---

### 3. FAQPage

**Onde aplicar:** `/faq` (FAQ completo) + seções de FAQ no final de artigos educativos e nas calculadoras.

**Propósito:** Rich result de FAQ no SERP — expande o snippet com perguntas/respostas visíveis diretamente no Google.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "O que é custo por arroba e como o Bovion calcula?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Custo por arroba (custo/@) é o total de gastos acumulados com um animal — compra, ração, saúde, suplementação — dividido pelo peso atual em arrobas (1@ = 30kg). O Bovion calcula esse número automaticamente a cada pesagem registrada, sem necessidade de planilha."
      }
    },
    {
      "@type": "Question",
      "name": "O que é GMD e por que importa para a rentabilidade do lote?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "GMD (Ganho Médio Diário) é a quantidade de peso que o animal ganha por dia, em quilogramas. Quanto maior o GMD, mais eficiente é a conversão de ração em peso — o que reduz o custo por arroba e aumenta a margem. O Bovion calcula o GMD automaticamente com base nas pesagens registradas."
      }
    },
    {
      "@type": "Question",
      "name": "O Bovion funciona para fazendas pequenas, com menos de 200 animais?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim. O plano de entrada do Bovion cobre fazendas com até 100 animais. Para operações de 100 a 500 animais, o plano intermediário cobre com folga. O sistema foi projetado para ser simples de configurar — setup em minutos, sem instalação, sem treinamento formal."
      }
    },
    {
      "@type": "Question",
      "name": "Preciso de cartão de crédito para começar o trial?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Não. O trial de 14 dias é completamente gratuito e não exige cartão de crédito. Você só fornece dados de pagamento se decidir continuar após o período de teste."
      }
    },
    {
      "@type": "Question",
      "name": "O Bovion funciona apenas para bovinos de corte?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim. O Bovion é especializado em bovinos de corte — as métricas de GMD, custo por arroba e simulador de venda são específicas para engorda. Não é adequado para pecuária de leite, suínos ou aves."
      }
    },
    {
      "@type": "Question",
      "name": "Posso usar o Bovion para gerenciar mais de uma fazenda?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim. O Bovion suporta múltiplas fazendas em uma única organização, com controle de acesso por papel — dono, administrador, gerente e visualizador. Cada membro da equipe vê apenas o que precisa."
      }
    }
  ]
}
```

**Notas:**
- Máximo recomendado pelo Google: sem limite oficial, mas manter apenas perguntas com resposta genuínas
- As perguntas devem corresponder exatamente ao texto visível na página (não inventar FAQ só para schema)
- Para artigos de blog: incluir apenas 3–5 FAQs relevantes ao tema do artigo

---

### 4. Article

**Onde aplicar:** Cada página `/blog/<slug>`.

**Propósito:** Rich result de artigo; sinal de autoridade editorial (E-E-A-T).

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Como Calcular o Custo por Arroba do Seu Rebanho",
  "description": "Aprenda a calcular o custo por arroba passo a passo, entenda o que entra no cálculo e como automatizar o processo para tomar decisões de venda com mais precisão.",
  "image": {
    "@type": "ImageObject",
    "url": "https://bovion.com.br/blog/como-calcular-custo-por-arroba/og-image.jpg",
    "width": 1200,
    "height": 630
  },
  "author": {
    "@type": "Organization",
    "name": "Bovion",
    "url": "https://bovion.com.br"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Bovion",
    "logo": {
      "@type": "ImageObject",
      "url": "https://bovion.com.br/images/logo.png",
      "width": 200,
      "height": 60
    }
  },
  "datePublished": "2026-06-01",
  "dateModified": "2026-06-01",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://bovion.com.br/blog/como-calcular-custo-por-arroba"
  },
  "inLanguage": "pt-BR",
  "about": {
    "@type": "Thing",
    "name": "Custo por arroba em pecuária de corte"
  }
}
```

**Notas:**
- `datePublished` e `dateModified` devem ser datas reais — gerar dinamicamente no `generateMetadata` do Next.js
- `author` pode ser `Person` quando houver autor individual identificado; usar `Organization` no início
- `image` obrigatório para elegibilidade no Google Discover
- Schema deve ser gerado dinamicamente por post (não hardcoded)

---

### 5. BreadcrumbList

**Onde aplicar:** Todas as páginas internas (qualquer página que não seja a homepage).

**Propósito:** Rich result de breadcrumb no SERP; sinal de hierarquia para rastreadores.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Início",
      "item": "https://bovion.com.br"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Funcionalidades",
      "item": "https://bovion.com.br/funcionalidades"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Custo por Arroba",
      "item": "https://bovion.com.br/funcionalidades/custo-por-arroba"
    }
  ]
}
```

**Notas:**
- Gerar dinamicamente com base na hierarquia de rota do Next.js
- A última entrada (`position: N`) não precisa de `item` (é a página atual), mas incluir não causa erro
- Implementar como componente `<BreadcrumbJsonLd breadcrumbs={[...]} />` reutilizável

---

### 6. HowTo

**Onde aplicar:** `/calculadora/custo-arroba`, `/calculadora/gmd` e artigos com passo a passo explícito.

**Propósito:** Rich result de "Como fazer" no SERP — destaque visual com passos numerados.

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Como Calcular o Custo por Arroba do Seu Rebanho",
  "description": "Passo a passo para calcular o custo por arroba (custo/@) de um lote de bovinos de corte, considerando todos os custos acumulados.",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "BRL",
    "value": "0"
  },
  "tool": [
    {
      "@type": "HowToTool",
      "name": "Calculadora de Custo por Arroba (gratuita)"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Levante o custo de compra do animal",
      "text": "Some o valor pago pelo animal + frete + taxa de compra. Este é o custo inicial do lote.",
      "image": "https://bovion.com.br/calculadora/custo-arroba/step-1.jpg"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Some os custos de alimentação acumulados",
      "text": "Some todos os gastos com ração e suplementação desde a entrada do animal no lote até hoje.",
      "image": "https://bovion.com.br/calculadora/custo-arroba/step-2.jpg"
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Adicione os custos de saúde animal",
      "text": "Inclua vacinas, medicamentos e tratamentos aplicados ao lote, divididos pelo número de animais.",
      "image": "https://bovion.com.br/calculadora/custo-arroba/step-3.jpg"
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Divida pelo peso atual em arrobas",
      "text": "Pegue o peso médio atual dos animais em kg e divida por 30 (1 arroba = 30 kg). Divida o custo total acumulado pelo resultado para obter o custo por arroba.",
      "image": "https://bovion.com.br/calculadora/custo-arroba/step-4.jpg"
    }
  ],
  "inLanguage": "pt-BR"
}
```

**Notas:**
- Imagens de cada step são opcionais mas aumentam elegibilidade para rich results visuais
- O `name` de cada step deve corresponder ao subtítulo visível na página
- `estimatedCost: 0` é válido para calculadora gratuita

---

### 7. AggregateRating — DIFERIR

**Regra:** **NÃO publicar AggregateRating fabricado ou placeholder.**

O Google penaliza reviews inventados. O esquema `AggregateRating` só deve ser implementado quando:
- Houver reviews reais de clientes pagantes (mínimo 5, com consentimento explícito)
- Os dados vierem de uma plataforma verificável (Google Business Profile, Trustpilot, G2, etc.) ou de sistema próprio de coleta com data de publicação
- A nota refletir a média real, não um valor aspiracional

**Fase de implementação:** M6+ (pós-beta com primeiros 30 usuários pagantes)

---

### 8. Product/Offer — DIFERIR PARA M5

**Regra:** Não publicar schema `Product` ou `Offer` com valores de preço até validação M5.

Quando `/precos` for publicado em M5, implementar:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Bovion — Software de Gestão Pecuária",
  "description": "Plataforma SaaS para gestão de rebanho bovino de corte com cálculo de custo por arroba, GMD e simulador de dia ótimo de venda.",
  "brand": {
    "@type": "Brand",
    "name": "Bovion"
  },
  "offers": [
    {
      "@type": "Offer",
      "name": "Trial Gratuito",
      "price": "0",
      "priceCurrency": "BRL",
      "description": "14 dias grátis, sem cartão de crédito",
      "url": "https://bovion.com.br/cadastro",
      "availability": "https://schema.org/InStock"
    }
  ]
}
```

---

## Tabela: Páginas × Schemas

| Path | Organization | SoftwareApplication | FAQPage | BreadcrumbList | Article | HowTo | AggregateRating | Product/Offer |
|------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `/` | Sim | Sim | — | — | — | — | Não (M6+) | — |
| `/como-funciona` | — | — | Sim (3–5 FAQs) | Sim | — | — | — | — |
| `/funcionalidades` | — | — | — | Sim | — | — | — | — |
| `/funcionalidades/*` | — | — | Sim | Sim | — | — | — | — |
| `/calculadora/custo-arroba` | — | — | Sim | Sim | — | Sim | — | — |
| `/calculadora/gmd` | — | — | Sim | Sim | — | Sim | — | — |
| `/faq` | — | — | Sim (completo) | Sim | — | — | — | — |
| `/blog` | — | — | — | Sim | — | — | — | — |
| `/blog/<slug>` | — | — | Sim (3–5 FAQs) | Sim | Sim | Condicional | — | — |
| `/vs/*` | — | — | Sim | Sim | — | — | — | — |
| `/sobre` | — | — | — | Sim | — | — | — | — |
| `/contato` | — | — | — | Sim | — | — | — | — |
| `/precos` | — | — | Sim | Sim | — | — | Não (M6+) | Sim (M5) |

---

## Implementação no Next.js

### Padrão recomendado (Server Component)

```tsx
// apps/web/components/json-ld.tsx
interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[]
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

```tsx
// uso em page.tsx
import { JsonLd } from '@/components/json-ld'

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={softwareApplicationSchema} />
      {/* conteúdo da página */}
    </>
  )
}
```

**Alternativa:** usar biblioteca `next-seo` ou `schema-dts` para type safety nos schemas.

---

## Validação

### Ferramentas obrigatórias antes de publicar

1. **Google Rich Results Test** — https://search.google.com/test/rich-results
   - Testar cada tipo de schema individualmente
   - Confirmar elegibilidade para rich result
   - Corrigir todos os erros antes de deploy

2. **Schema.org Validator** — https://validator.schema.org
   - Validar conformidade com spec do schema.org
   - Identificar propriedades obrigatórias faltantes

3. **Google Search Console — Enhancement Reports**
   - Após indexação, monitorar "Resultados Enriquecidos" no GSC
   - Agir em qualquer warning ou error reportado

---

## Regras — O Que NÃO Fazer

| Regra | Motivo |
|-------|--------|
| NÃO publicar `AggregateRating` com dados inventados | Penalidade manual do Google por review spam |
| NÃO inflar `ratingValue` para 5.0 sem base real | Viola Google's rich results policies |
| NÃO usar schema markup em conteúdo não visível na página | Misleading structured data = penalidade |
| NÃO duplicar schemas conflitantes (ex: dois `Organization` diferentes) | Confunde rastreadores |
| NÃO incluir `Product/Offer` com preços antes de M5 | Preços não validados não devem ser publicados externamente |
| NÃO adicionar `FAQPage` com perguntas não presentes na página | Schema deve espelhar conteúdo visível |
| NÃO omitir `datePublished` em `Article` | Campo obrigatório para rich results de artigo |

---

*Revisão deste documento: M1 (Organization + SoftwareApplication + FAQPage + BreadcrumbList), M2 (Article + HowTo), M5 (Product/Offer), M6+ (AggregateRating).*
