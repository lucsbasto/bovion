# Auditoria SEO — Bovion

*Gerado em: 2026-05-03*
*Ferramenta: gemini-cli (análise do codebase + estado do domínio bovion.com.br)*
*Fase do produto: M0 bootstrap — site de marketing em construção, app ainda não em produção*

---

## Estado Atual

O site bovion.com.br está em fase M0 de bootstrap. O domínio existe mas serve uma página "em construção" com conteúdo mínimo. Não há páginas indexadas no Google (confirmado via análise do domínio). A base técnica é Next.js (App Router), o que significa que a estrutura para SEO adequado existe, mas ainda não foi implementada.

| Componente | Estado atual |
|------------|-------------|
| Title tag | Presente — "Bovion" (muito curto, sem keyword) |
| Meta description | Presente — genérica, 52 chars |
| H1 | Presente — "Bovion" (sem keyword de intenção) |
| H2+ | Ausente |
| Open Graph tags | **Ausente** |
| Canonical tag | **Ausente** |
| Meta robots | **Ausente** (default: indexável) |
| robots.txt | **Ausente** |
| sitemap.xml | **Ausente** |
| Structured data / JSON-LD | **Ausente** |
| Imagens com alt text | N/A (sem imagens na página atual) |
| Internal linking | **Ausente** (página única sem links) |
| HTTPS | Confirmado (Next.js + Vercel padrão) |
| lang="pt-BR" | Presente no `<html>` |
| Core Web Vitals | Não mensurável (página mínima; avaliar pós-landing real) |

---

## Issues

### Alta Severidade

**A1 — Ausência de robots.txt**
- **Impacto:** Googlebot rastreia sem orientação; sem referência ao sitemap.
- **Evidência:** Nenhum arquivo em `apps/web/public/robots.txt`.
- **Correção:** Criar `apps/web/public/robots.txt` com `User-agent: *`, `Allow: /`, `Sitemap: https://bovion.com.br/sitemap.xml`.

**A2 — Ausência de sitemap.xml**
- **Impacto:** Google não descobre novas URLs quando o site crescer.
- **Evidência:** Nenhum arquivo em `apps/web/public/` ou rota dinâmica `/sitemap.xml`.
- **Correção:** Implementar `apps/web/app/sitemap.ts` com Next.js Metadata API (geração dinâmica).

**A3 — Title tag sem keyword de negócio**
- **Impacto:** SERP snippet não comunica o produto; CTR baixo.
- **Evidência:** `metadata.title = "Bovion"` em `layout.tsx` — 6 chars, sem "gestão pecuária", "custo arroba", etc.
- **Correção:** `"Bovion — Gestão de Rebanho e Custo por Arroba para Pecuaristas"` (60 chars).

**A4 — Ausência de Open Graph tags**
- **Impacto:** Compartilhamentos no WhatsApp/LinkedIn (canal crítico do ICP pecuarista) sem preview rico.
- **Evidência:** `metadata` em `layout.tsx` não inclui `openGraph`.
- **Correção:** Adicionar `openGraph` com `title`, `description`, `url`, `images` (og:image 1200×630).

**A5 — H1 sem keyword de intenção**
- **Impacto:** Sinal de relevância perdido para rastreadores.
- **Evidência:** `<h1>Bovion</h1>` na `page.tsx` — nome da marca apenas.
- **Correção:** H1 deve conter keyword principal: "Gestão Profissional de Rebanho Bovino — Custo por Arroba em Tempo Real".

### Média Severidade

**M1 — Meta description genérica e curta**
- **Impacto:** CTR abaixo do potencial; Google pode reescrever com texto aleatório da página.
- **Evidência:** "Plataforma SaaS de gestão pecuária e controle financeiro." — 52 chars, sem CTA, sem keyword de intenção.
- **Correção:** "Bovion calcula custo por arroba, GMD e dia ótimo de venda para fazendas de bovinos de corte. Trial gratuito de 14 dias, sem cartão." (130 chars).

**M2 — Ausência de canonical tag**
- **Impacto:** Risco de conteúdo duplicado quando URL com/sem trailing slash, parâmetros UTM, ou variantes http/https.
- **Evidência:** `metadata` sem campo `alternates.canonical`.
- **Correção:** Adicionar `alternates: { canonical: "https://bovion.com.br" }` no layout raiz; canonical específico por página nos layouts de rota.

**M3 — Ausência de meta robots explícito**
- **Impacto:** Sem controle sobre comportamento de indexação; páginas internas (login, cadastro, api) podem ser indexadas.
- **Correção:** Default `index, follow` no layout raiz; `noindex` explícito em `/login`, `/cadastro`, `/api/*`.

**M4 — Structured data ausente**
- **Impacto:** Sem rich results elegíveis (FAQ, HowTo, SoftwareApplication, BreadcrumbList).
- **Correção:** Implementar JSON-LD conforme plano em `schema-markup-plan.md`.

**M5 — Ausência de breadcrumbs**
- **Impacto:** Sem sinal de hierarquia para rastreadores; UX prejudicada em páginas internas.
- **Correção:** Implementar componente `<Breadcrumb>` + schema `BreadcrumbList` em todas as páginas não-home.

### Baixa Severidade

**B1 — Sem favicon declarado programaticamente**
- **Impacto:** Browsers fallback; branding fraco em abas e bookmarks.
- **Correção:** Adicionar `apps/web/app/favicon.ico` + `metadata.icons`.

**B2 — Sem Twitter/X Card tags**
- **Impacto:** Compartilhamentos no Twitter sem preview estruturado.
- **Correção:** Adicionar `twitter: { card: "summary_large_image", ... }` ao metadata.

**B3 — lang="pt-BR" apenas no html raiz, sem hreflang**
- **Impacto:** Menor risco dado que Bovion é produto exclusivamente BR, mas ausência de hreflang pode confundir rastreadores se domínio global aparecer.
- **Correção:** Adicionar `<link rel="alternate" hreflang="pt-BR" href="https://bovion.com.br" />` + `x-default`.

**B4 — Nenhuma imagem com alt text (quando imagens forem adicionadas)**
- **Impacto:** Acessibilidade e SEO de imagem perdidos.
- **Correção:** Política obrigatória: toda `<Image />` deve ter `alt` descritivo; incluir keyword onde natural.

---

## Quick Wins — Semana 1

Todas as ações abaixo são mudanças de código de baixo esforço, sem dependências de produto:

1. **Corrigir title tag** — 1 linha em `layout.tsx`. Impacto imediato no SERP snippet.
2. **Reescrever meta description** — 1 linha em `layout.tsx`. Impacto no CTR orgânico.
3. **Criar `robots.txt`** — arquivo estático em `apps/web/public/`. 5 minutos.
4. **Adicionar Open Graph tags** — extender o objeto `metadata` em `layout.tsx`. 10 linhas.
5. **Adicionar canonical tag** — 1 campo no `metadata` do layout raiz.
6. **Corrigir H1** — quando a landing real for implementada, usar headline com keyword.

---

## Médio Prazo — Mês 1–3

Ações que dependem da landing real estar publicada ou de desenvolvimento adicional:

| Prioridade | Ação | Esforço | Fase sugerida |
|------------|------|---------|---------------|
| Alta | Implementar `sitemap.ts` dinâmico (Next.js Metadata API) | Baixo | M1 (landing real) |
| Alta | Implementar JSON-LD: Organization + SoftwareApplication na home | Baixo | M1 |
| Alta | Implementar JSON-LD: FAQPage em `/faq` | Baixo | M1 |
| Alta | Implementar JSON-LD: BreadcrumbList em todas as páginas internas | Médio | M1 |
| Alta | Adicionar `noindex` em `/login`, `/cadastro`, `/api/*` | Baixo | M1 |
| Média | Implementar página `/blog` com estrutura de artigos (Article schema) | Alto | M2 |
| Média | Criar páginas de comparativo `/vs/<concorrente>` | Médio | M2 |
| Média | Implementar calculadoras SEO (`/calculadora/custo-arroba`, `/calculadora/gmd`) | Alto | M2–M3 |
| Média | Submeter sitemap ao Google Search Console | Baixo | M1 (pós-deploy) |
| Média | Configurar Google Search Console e Bing Webmaster Tools | Baixo | M1 (pós-deploy) |
| Baixa | Otimizar Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1) | Médio | M2 (pós-landing real) |
| Baixa | Implementar OG image dinâmica via Next.js `opengraph-image.tsx` | Médio | M2 |

---

## Pendências que Exigem Desenvolvimento

As seguintes ações dependem de decisões de produto ou desenvolvimentos mais complexos:

1. **Landing page real** — A página atual é "em construção". Todas as otimizações on-page dependem do conteúdo final da landing (hero, features, FAQ, CTA). SEO técnico pode ser preparado antes, mas keywords e H-tags dependem do copy.

2. **Sitemap dinâmico** — Precisa de `apps/web/app/sitemap.ts` implementado com todas as rotas planejadas; deve ser atualizado automaticamente quando blog posts forem publicados.

3. **OG image dinâmica** — Implementar `opengraph-image.tsx` com Next.js para gerar imagens de preview específicas por página (blog posts, calculadoras).

4. **Blog CMS** — Estrutura de blog (`/blog`, `/blog/<slug>`) exige decisão de stack (MDX local vs. CMS headless). SEO de conteúdo (Article schema, breadcrumbs, internal linking) depende dessa decisão.

5. **Search Console verification** — Exige acesso ao domínio e DNS. Deve ser feito assim que a landing real for ao ar (M1).

6. **Core Web Vitals baseline** — Só mensurável após deploy com conteúdo real. Priorizar: imagens otimizadas (WebP, `next/image`), sem layout shift (dimensões explícitas), fontes com `font-display: swap`.

7. **Robots.txt para rotas de app** — Quando `/cadastro`, `/login` e rotas de API estiverem implementadas, o `robots.txt` deve excluí-las explicitamente.

---

*Próxima auditoria: após publicação da landing real (M1). Usar Google Search Console + PageSpeed Insights para métricas reais.*
