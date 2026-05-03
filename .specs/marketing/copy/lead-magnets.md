# Lead Magnets — Bovion
*Idioma: pt-BR | Versão: M0 | Status: DRAFT*
*Regra: NÃO publicar valores de pricing. NÃO fabricar números ou estatísticas.*

---

## Visão Geral

Três lead magnets desenhados para o ICP de pecuária de corte, ordenados por funil:

| # | Lead Magnet | Funil | ICP Principal | Prioridade de Lançamento |
|---|-------------|-------|---------------|--------------------------|
| 1 | Calculadora Interativa de Custo/@ | Decisão | Pecuarista proprietário | **#1 — Lançar primeiro** |
| 2 | Planilha Gratuita de GMD | Consideração | Gestor de fazenda | #2 |
| 3 | Guia: Como decidir o dia certo de venda | Consciência | Pecuarista + Consultor | #3 |

---

## LEAD MAGNET 1 — Calculadora Interativa de Custo/@

### Perfil

**Target ICP:** Pecuarista proprietário (alta intenção de compra — já sente a dor de não saber o custo/@ real)
**Funil:** Decisão — visitante está avaliando se o Bovion resolve o problema dele
**Dor endereçada:** "Nunca sei o custo exato da minha arroba sem consolidar três planilhas."
**Job-to-be-done:** "Me diz quanto está custando cada animal hoje."

### Formato Técnico

- **Tipo:** Ferramenta interativa embarcada na landing page (embed ou página dedicada `/calculadora`)
- **Inputs do usuário:** peso de entrada (@), custo de aquisição (R$), frete (R$), dias no confinamento, custo de ração (R$/animal/dia), custo de saúde estimado (R$/animal)
- **Output calculado:** custo/@ atual, break-even mínimo por @, margem estimada dado preço/@ informado pelo usuário
- **Entrega:** resultado exibido na tela imediatamente; PDF do resultado enviado por email após captura
- **Stack sugerida:** componente React na landing (cálculo client-side, sem backend), formulário de captura antes do PDF via Resend

### UX Flow

```
Landing page (hero ou seção dedicada)
  → Usuário vê "Calcule o custo/@ do seu lote agora"
  → Preenche campos de custo na calculadora (sem login, sem cadastro)
  → Vê resultado na tela: custo/@ atual + break-even
  → Modal/inline: "Enviar resultado por PDF para o seu email"
  → Campos: nome + email (2 campos)
  → Submit → Resend dispara email com PDF do resultado
  → Tela de confirmação: "PDF enviado. Veja também como o Bovion automatiza esse cálculo a cada pesagem."
  → CTA: "Começar trial gratuito — 14 dias sem cartão"
```

### Copy de Opt-in

**HEADLINE:**
Calcule o custo/@ do seu lote agora.

**SUBHEAD:**
Informe peso de entrada, custo de aquisição, ração e saúde. O resultado aparece na tela — e você recebe o PDF por email para guardar ou compartilhar.

**FORM-LABEL-1:** Seu nome

**FORM-LABEL-2:** Seu melhor email

**CTA-BUTTON:**
Enviar meu resultado por PDF

**PRIVACY-LINE:**
Seus dados não são compartilhados com terceiros. Você pode cancelar a inscrição a qualquer momento.

### Nurture Sequence Trigger

**Email 1 — disparado imediatamente após captura:**
Assunto: "Seu custo/@ calculado — e o próximo passo para automatizar isso"
Sinal de intenção: usuário calculou o custo/@ manualmente → demonstrou que sente a dor do cálculo manual → próximo passo natural é mostrar que o Bovion faz isso a cada pesagem, sem planilha.
Corpo (resumo): entrega o PDF + explica que o Bovion recalcula automaticamente a cada pesagem registrada + CTA para trial.

**Email 2 — D+2:**
Assunto: "Você sabe quando seu lote vai saturar?"
Conteúdo: introduz o conceito de saturação (custo marginal > ganho de peso) como segunda dor — teaser do simulador de dia ótimo de venda.

**Email 3 — D+5:**
Assunto: "14 dias para testar o custo/@ automático na sua fazenda"
CTA direto para trial signup.

---

## LEAD MAGNET 2 — Planilha Gratuita de GMD

### Perfil

**Target ICP:** Gestor de fazenda (usa planilha hoje, avalia substituição)
**Funil:** Consideração — usuário conhece o problema, avalia soluções, ainda não está pronto para pagar
**Dor endereçada:** "Minha planilha não calcula GMD automaticamente e vive quebrando."
**Posicionamento:** "Teste essa planilha hoje. Automatize amanhã com o Bovion."
**Bridge:** A planilha resolve o problema imediato — mas expõe as limitações que o Bovion elimina (sem simulação, sem alerta de saturação, sem integração de custos de saúde).

### Formato Técnico

- **Tipo:** Google Sheets template (link de cópia pública — "Fazer uma cópia" no Google Drive)
- **Estrutura da planilha:**
  - Aba 1: Cadastro de animais (brinco, peso entrada, data entrada, custo aquisição)
  - Aba 2: Registro de pesagens (data, peso atual — GMD calculado por fórmula)
  - Aba 3: Custos (ração R$/dia, saúde R$/animal — custo/@ calculado por fórmula)
  - Aba 4: Dashboard (GMD médio, custo/@ atual, break-even — sem simulação de venda)
  - Rodapé de cada aba: "Quer isso atualizado automaticamente a cada pesagem? Conheça o Bovion."
- **Entrega:** link do Google Sheets enviado por email após captura

### UX Flow

```
Blog post / página dedicada / popup em post sobre GMD
  → Usuário vê "Baixar Planilha Gratuita de GMD"
  → Formulário de captura: nome + email
  → Submit → Resend dispara email com link da planilha
  → Tela de confirmação: "Planilha enviada. Dica: o Bovion calcula GMD automaticamente a cada pesagem — sem fórmula."
  → CTA: "Ver como funciona" → /como-funciona
```

### Copy de Opt-in

**HEADLINE:**
Planilha gratuita para calcular o GMD e o custo/@ do seu rebanho.

**SUBHEAD:**
Template pronto para registrar pesagens, calcular Ganho Médio Diário e acompanhar o custo por arroba de cada lote. Sem fórmula para montar — é só copiar e usar.

**FORM-LABEL-1:** Seu nome

**FORM-LABEL-2:** Seu melhor email

**CTA-BUTTON:**
Receber a planilha grátis

**PRIVACY-LINE:**
Seus dados não são compartilhados com terceiros. Você pode cancelar a inscrição a qualquer momento.

### Nurture Sequence Trigger

**Email 1 — disparado imediatamente:**
Assunto: "Sua planilha de GMD está pronta para uso"
Conteúdo: entrega o link + instruções de uso em 3 passos + nota de rodapé: "A planilha cobre o básico. O Bovion vai além: integra saúde, suplementação e simula o dia ótimo de venda — automaticamente."

**Email 2 — D+3:**
Assunto: "O que a planilha não consegue fazer (e custa caro ignorar)"
Conteúdo: explica saturação de lote — por que a planilha não alerta quando o custo/@ acelera — e o que acontece quando o gestor percebe tarde demais.

**Email 3 — D+7:**
Assunto: "Teste o Bovion por 14 dias — suas pesagens já calculadas automaticamente"
CTA para trial signup.

---

## LEAD MAGNET 3 — Guia: Como Decidir o Dia Certo de Venda do Seu Lote

### Perfil

**Target ICP:** Pecuarista proprietário + Consultor zootécnico
**Funil:** Consciência — topo de funil, atrai quem busca "quando vender gado", "melhor época vender boi", "como calcular lucro lote"
**Dor endereçada:** "Fico no chute na hora de vender — decido pelo preço spot do frigorífico, não pelo meu custo real."
**Objetivo:** Educar sobre o processo de decisão de venda → posicionar o Bovion como a ferramenta que automatiza esse processo.

### Formato Técnico

- **Tipo:** PDF de 6 a 10 páginas — design limpo, sem infográfico excessivo, densidade informacional adequada ao ICP profissional
- **Estrutura sugerida do guia:**
  1. Por que o timing de venda impacta mais do que o preço/@ (1 página)
  2. As três variáveis que determinam o dia certo: GMD, custo de manutenção e preço/@ projetado (2 páginas)
  3. Como calcular o break-even do seu lote passo a passo (2 páginas)
  4. O que é saturação e como detectar antes que seja tarde (1 página)
  5. Checklist: 5 perguntas para responder antes de aceitar a oferta do frigorífico (1 página)
  6. Próximo passo: como automatizar esse processo (1 página — CTA para Bovion)
- **Entrega:** PDF enviado por email após captura

### UX Flow

```
Busca orgânica ("quando vender gado", "custo arroba calculadora") → blog post ou página dedicada
  → Usuário vê "Baixar Guia Gratuito: Como Decidir o Dia Certo de Venda"
  → Formulário de captura: nome + email + campo opcional "Quantos animais você tem?" (segmentação)
  → Submit → Resend dispara email com PDF
  → Tela de confirmação: "Guia enviado. Se quiser automatizar esse processo, o simulador do Bovion projeta o dia ótimo de venda para os próximos 120 dias."
  → CTA: "Ver o simulador em ação"
```

### Copy de Opt-in

**HEADLINE:**
Como decidir o dia certo de venda do seu lote — sem depender do preço spot do frigorífico.

**SUBHEAD:**
Guia gratuito com o processo para calcular break-even, identificar saturação e projetar o lucro de vender hoje vs. esperar 30 dias. Direto ao ponto, sem enrolação.

**FORM-LABEL-1:** Seu nome

**FORM-LABEL-2:** Seu melhor email

**FORM-LABEL-3 (opcional):** Quantos animais você tem hoje? *(ajuda a personalizar o conteúdo)*

**CTA-BUTTON:**
Quero o guia gratuito

**PRIVACY-LINE:**
Seus dados não são compartilhados com terceiros. Você pode cancelar a inscrição a qualquer momento.

### Nurture Sequence Trigger

**Email 1 — disparado imediatamente:**
Assunto: "Seu guia: Como decidir o dia certo de venda"
Conteúdo: entrega o PDF + destaca o checklist de 5 perguntas como o ponto mais acionável + menciona que o Bovion automatiza as respostas para todas as 5 perguntas.

**Email 2 — D+2:**
Assunto: "Você consegue responder essas 5 perguntas sobre seu lote hoje?"
Conteúdo: reproduz o checklist do guia + pergunta qual das 5 perguntas é mais difícil de responder hoje → leva ao simulador como solução.

**Email 3 — D+5:**
Assunto: "O simulador que responde 'vendo hoje ou espero 30 dias?'"
Conteúdo: demonstração do simulador com exemplo numérico concreto + CTA para trial.

**Email 4 — D+9:**
Assunto: "14 dias para testar o simulador na sua operação real"
CTA direto para trial signup.

---

## PRIORIZAÇÃO — Qual Lançar Primeiro

### Decisão: Calculadora Interativa de Custo/@ (#1)

**Por quê primeiro:**

1. **ICP de maior intenção de compra:** Quem acessa a calculadora está ativamente sentindo a dor do custo/@ desconhecido — é o visitante mais próximo de converter para trial. O lead capturado via calculadora tem maior probabilidade de virar trial na mesma semana.

2. **Alinhamento direto com a mensagem central do produto:** "Quanto custa minha arroba?" é o job-to-be-done #1 do Bovion e a pergunta que a calculadora responde. O lead magnet e o produto resolvem a mesma dor — a transição para trial é natural.

3. **Menor esforço de produção de conteúdo:** A calculadora é um componente React com lógica de custo/@ — o mesmo algoritmo já implementado no produto. Não exige redação longa nem design editorial.

4. **Demonstração do produto embutida:** O usuário experimenta o valor central do Bovion (cálculo de custo/@) antes de se cadastrar. É o trial mais curto possível — cria confiança antes do compromisso de cadastro.

5. **Qualificação implícita:** Quem preenche os campos da calculadora (peso, custo de aquisição, ração) já demonstrou que tem uma operação ativa e dados disponíveis — é exatamente o ICP certo.

### Ordem completa de lançamento

| Ordem | Lead Magnet | Justificativa |
|-------|-------------|---------------|
| 1 | Calculadora de Custo/@ | Maior intenção, menor esforço, demonstra o produto |
| 2 | Planilha de GMD | Captura o ICP que ainda usa planilha — médio prazo, construção de lista |
| 3 | Guia de Dia Certo de Venda | Topo de funil, SEO orgânico, ciclo de conversão mais longo |

---

## CANAIS DE DISTRIBUIÇÃO

### Calculadora de Custo/@

| Canal | Tática |
|-------|--------|
| Landing page home | Seção dedicada ou embed na home (após seção de simulador demo) |
| Página dedicada `/calculadora` | SEO: "calculadora custo arroba", "calcular custo por @ gado" |
| CTA em posts de blog sobre custo/@ | Content upgrade contextual |
| Anúncio pago (futuro) | Google Ads: "custo arroba calculadora" — palavra-chave de alta intenção |
| WhatsApp / grupos de pecuaristas | Link direto para a calculadora — compartilhável |

### Planilha de GMD

| Canal | Tática |
|-------|--------|
| Blog post sobre GMD | Content upgrade: "Baixe a planilha usada neste post" |
| Página dedicada `/planilha-gmd` | SEO: "planilha GMD bovino", "planilha ganho diário gado" |
| Popup de saída na home | Para visitantes que não converteram para trial |
| LinkedIn / grupos rurais | Post com screenshot da planilha + link |
| Consultores zootécnicos | Canal de parceria — consultor compartilha com clientes |

### Guia de Dia Certo de Venda

| Canal | Tática |
|-------|--------|
| Blog posts de topo de funil | CTA inline e ao final do post sobre timing de venda |
| Página dedicada `/guia-venda-lote` | SEO: "quando vender gado", "dia certo vender boi", "como calcular lucro lote" |
| LinkedIn (pecuaristas e consultores) | Teasers com 1 ponto do guia por semana |
| Parceria com associações rurais | Distribuição via newsletter de associações pecuárias |
| Anúncio pago (futuro) | Facebook/Instagram com criativo orientado ao pain "fico no chute na hora de vender" |

---

## INTEGRAÇÃO TÉCNICA

### Stack Recomendada

| Componente | Ferramenta | Justificativa |
|------------|------------|---------------|
| Email transacional (entrega do LM) | **Resend** | Já no stack do Bovion; API simples; deliverability confiável |
| Drip / automação de nurture | **Loops** (loops.so) ou **Brevo** (ex-Sendinblue) | Loops: developer-first, integra via API com Next.js, gratuito até 2.000 contatos. Brevo: opção se precisar de automação visual mais robusta desde cedo |
| Formulário de captura | Componente React nativo na landing | Evitar dependência de ferramenta externa na página de alta conversão |
| CRM / lista de leads | Integração Resend → Loops via webhook | Leads capturados entram automaticamente na lista + trigger da sequência de nurture |
| PDF gerado dinamicamente (calculadora) | Vercel Edge Function + biblioteca de PDF (react-pdf ou puppeteer) | Geração server-side do PDF com os dados do usuário antes do envio via Resend |
| PDF estático (planilha, guia) | Google Drive + Resend attachment ou link público | PDFs estáticos enviados como link no email — sem overhead de geração dinâmica |

### Fluxo Técnico — Calculadora

```
1. Usuário preenche calculadora (React, client-side)
2. Clica "Enviar resultado por PDF"
3. POST /api/lead-magnet/calculadora
   - Payload: { nome, email, inputs_calculadora, resultado_calculado }
4. API route (Next.js):
   a. Valida campos
   b. Gera PDF via react-pdf com resultado personalizado
   c. Chama Resend API para enviar email com PDF anexado
   d. Chama Loops API para adicionar contato à lista + trigger sequência "calculadora-custo-arroba"
5. Retorna { success: true } → frontend exibe tela de confirmação + CTA para trial
```

### Fluxo Técnico — Planilha / Guia (PDF estático)

```
1. Usuário preenche formulário de captura
2. POST /api/lead-magnet/[slug] (planilha-gmd | guia-venda-lote)
3. API route (Next.js):
   a. Valida campos
   b. Chama Resend API para enviar email com link do asset (Google Drive ou CDN)
   c. Chama Loops API para adicionar contato + trigger sequência correspondente
4. Retorna { success: true } → frontend exibe tela de confirmação
```

### Sequências de Nurture no Loops

| Sequência | Trigger | Emails | Cadência |
|-----------|---------|--------|---------|
| `calculadora-custo-arroba` | Captura via calculadora | 3 emails | D+0, D+2, D+5 |
| `planilha-gmd` | Captura via planilha | 3 emails | D+0, D+3, D+7 |
| `guia-venda-lote` | Captura via guia | 4 emails | D+0, D+2, D+5, D+9 |
| `trial-signup` | Cadastro no app | Sequência de onboarding separada | Definir em email-sequence skill |

### Campos de Lead Mínimos a Armazenar

```typescript
interface LeadCapture {
  email: string          // obrigatório
  nome: string           // obrigatório
  source: string         // "calculadora" | "planilha-gmd" | "guia-venda-lote"
  tamanho_rebanho?: string  // opcional — apenas guia, para segmentação
  captured_at: Date
}
```

---

## MÉTRICAS DE ACOMPANHAMENTO

| Lead Magnet | KPI Principal | Meta indicativa (pós-launch) |
|-------------|---------------|------------------------------|
| Calculadora | Taxa de conversão formulário | 30–50% dos que chegam à calculadora |
| Planilha | Downloads / semana | Baseline após 30 dias |
| Guia | Lead-to-trial rate | > taxa de conversão de visitante orgânico sem LM |
| Todos | Lead-to-trial rate por source | Comparar as 3 fontes para priorizar esforço |

*Nota: Metas são indicativas para planejamento. Ajustar com dados reais após 30 dias de lançamento.*

---

*Fim do arquivo — lead-magnets.md*
*Versão M0 · Não publicar valores de pricing · Não fabricar números ou testimoniais*
