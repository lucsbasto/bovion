# CRO Recommendations — Bovion
*Idioma: pt-BR | Versão: M0 | Status: DRAFT*
*Auditoria conceitual baseada em: foundation doc, visual brief, princípios de CRO. Sem dados reais de conversão — M0 pré-lançamento.*

---

## Contexto da Auditoria

**Páginas auditadas:** Home (`/`), Pricing teaser, fluxo de Signup/Trial
**Meta de conversão primária:** Cadastro no trial de 14 dias (sem cartão de crédito)
**Meta secundária:** Upgrade para plano pago antes do vencimento dos 14 dias
**ICP:** Pecuarista proprietário (40–60 anos), gestor de fazenda — perfil não necessariamente tech-savvy
**Fontes de tráfego esperadas:** Orgânico de alta intenção ("custo arroba calculadora", "sistema gestão rebanho"), direto, futuramente mídia paga
**Restrições M0:** Sem dados reais de conversão, sem testimoniais, sem logos de clientes, sem valores de pricing publicados

---

## 1. HERO

### Análise

**Headline atual:** "Gestão profissional de rebanho com foco em margem e timing de venda."

**Pontos fortes:**
- Específico e orientado a resultado — foge do genérico "gestão pecuária"
- "Margem" e "timing de venda" são os dois termos de maior valor para o ICP
- Tom profissional, sem superlativo

**Pontos de atenção:**

**Densidade vs. clareza para o ICP:** O ICP (pecuarista 40–60 anos, hábito de planilha) pode não ter "timing de venda" como vocabulário imediato — prefere "quando vender" ou "dia certo de vender". Considerar variante mais próxima da linguagem do cliente para teste A/B.

**Subheadline:** Faz bem o trabalho de especificar o simulador e o custo/@. Risco: é longa (3 cláusulas). Em mobile, pode empurrar o CTA para baixo da dobra.

**CTA-PRIMARY:** "Começar trial gratuito" — funcional, mas pode ser mais específico. Ver Quick Wins.

**CTA-SECONDARY:** "Ver como funciona" — adequado para visitantes em fase de pesquisa (orgânico de alta intenção mas ainda não pronto para converter).

### Recomendações de Hero

1. **CTA acima da dobra em mobile:** Garantir que HEADLINE + SUBHEADLINE + CTA-PRIMARY sejam visíveis sem scroll em viewport 390px (iPhone 14). Se a subheadline for longa, truncar para 1 frase em mobile.
2. **Trust bar logo abaixo do CTA:** "14 dias grátis · Sem cartão de crédito · Cancele quando quiser" — substitui social proof ausente em M0 com trust signals de baixa fricção.
3. **Hierarquia visual CTA:** CTA-PRIMARY em cor primária sólida, destaque alto. CTA-SECONDARY em texto com seta — não competir visualmente com o primário.
4. **Especificidade do simulador no hero:** Considerar adicionar uma linha visual (micro-screenshot ou número estático) do simulador no hero — o diferencial único do produto merece ancoragem visual imediata, não apenas copy.

---

## 2. ABOVE-THE-FOLD CHECKLIST

| # | Critério | Status M0 | Observação |
|---|----------|-----------|------------|
| 1 | Proposta de valor clara em 5 segundos | PASS | Headline + subheadline específicos |
| 2 | CTA primário visível sem scroll (desktop 1280px) | PASS (a verificar) | Depende do layout — confirmar no build |
| 3 | CTA primário visível sem scroll (mobile 390px) | RISCO | Subheadline longa pode empurrar CTA para baixo da dobra |
| 4 | Trust signal presente above-the-fold | PASS parcial | Trust bar com "14 dias sem cartão" compensa ausência de logos M0 |
| 5 | Um único CTA primário dominante | PASS | Hierarquia clara: primário + secundário |
| 6 | Copy em linguagem do cliente | PASS parcial | "Timing de venda" pode ser mais distante que "quando vender" — testar |
| 7 | Diferencial mencionado above-the-fold | PASS | Simulador mencionado na subheadline |
| 8 | Sem navegação que distraia (landing page mode) | A DEFINIR | Se home tiver nav completa, avaliar se nav é necessária above-the-fold |
| 9 | Visual de produto presente above-the-fold | AUSENTE M0 | Sem screenshot/mockup ainda. Risco de abstração excessiva. Prioridade pós-UI |
| 10 | Mensagem consistente com fonte de tráfego | PASS para orgânico | Alinhar com ads quando campanha paga iniciar |
| 11 | Velocidade de carregamento (LCP < 2.5s) | A MEDIR | Next.js ajuda, mas imagens de produto podem pesar |
| 12 | Contraste e legibilidade em mobile | A VERIFICAR | Design system de referência (Stripe/Linear) favorece, mas confirmar |

---

## 3. FUNIL DE CONVERSÃO

### Atenção → Interesse → Desejo → Ação

---

**ATENÇÃO** — *Chegada à página (hero)*

Seção: Hero
Objetivo: Responder "estou no lugar certo?" em 3 segundos
Gatilho para ICP: Headline conecta diretamente às palavras "margem" e "venda" — os dois termos de maior ansiedade do pecuarista
Risco de drop-off: ICP de orgânico chega com intenção específica ("custo arroba calculadora") — se o hero não confirmar imediatamente que o produto resolve isso, bounce imediato
Mitigação: Subheadline menciona "custo por arroba" explicitamente. Considerar micro-copy adicional: "Sim, isso inclui calculadora de custo/@."

---

**INTERESSE** — *Problema e solução (scroll inicial)*

Seções: Problema (3 dores) → Solução (3 outcomes)
Objetivo: "Eles me entendem — e têm uma resposta"
Gatilho para ICP: Linguagem de dor específica ("planilha quebrada", "chute na hora de vender", "saturação não detectada") gera reconhecimento emocional
Padrão de leitura: F-pattern — primeiros 2 parágrafos e início de cada bloco são lidos; miolo é escaneado. Headlines de dor devem ser autoexplicativas sem o body.
Risco de drop-off: Se a seção de solução for muito abstrata (features em vez de outcomes), o visitante perde o fio. Outcomes devem conectar diretamente às dores — 1:1 sempre que possível.
Mitigação: Estrutura atual (3 dores → 3 outcomes em espelho) é correta. Verificar se os outcomes respondem às dores na mesma ordem.

---

**DESEJO** — *Feature highlights + Simulador demo*

Seções: Feature highlights (5 features) → Simulador demo
Objetivo: "Quero isso — e parece que funciona"
Gatilho para ICP: Simulador demo com número concreto (lucro hoje vs. lucro em 28 dias) é o momento de maior desejo — único diferencial que nenhum concorrente tem
Padrão de leitura: Z-pattern na seção de features (olho escaneia diagonal, captura ícone + título + primeira linha). Títulos de feature devem ser autoexplicativos.
Risco de drop-off: Seção de social proof é placeholder M0. Essa lacuna é a maior ameaça ao desejo — o visitante quer prova social e não encontra. Compensar com especificidade técnica (algoritmo auditável, multi-tenant estrito, backups automáticos) como substituto de prova social.
Mitigação: Considerar "social proof alternativa M0": especificidade de produto ("cálculo baseado em GMD histórico do lote + custo acumulado auditável") em vez de depoimento. Detalhe técnico crível > placeholder vazio.

---

**AÇÃO** — *Pricing teaser + Final CTA*

Seções: Pricing teaser → Final CTA
Objetivo: "Vou tentar — risco zero"
Gatilho para ICP: "14 dias grátis, sem cartão" remove a principal barreira de entrada. "Preço travado por 12 meses para early adopters" cria urgência sem artifício.
Risco de drop-off: Pricing teaser sem valores pode gerar ansiedade ("quanto vai custar?") — compensar com framing de risco zero e menção explícita de cancelamento fácil.
Risco adicional: Visitante que chegou pesquisando "sistema gestão rebanho" ainda não sabe o preço. Se ele sair para pesquisar concorrentes e voltar, a conversão pode acontecer no segundo acesso — email capture via lead magnet é a mitigação.
Mitigação: Final CTA deve ter risk reversal explícito ("se não funcionar em 14 dias, sem cobrança"). Não esconder esse texto.

---

## 4. PONTOS DE FRICÇÃO

### Fricção Pré-Signup

**F1 — Campos do formulário de cadastro**
Risco: Formulário com muitos campos (nome, fazenda, número de animais, telefone) na primeira tela cria abandono.
Recomendação: Signup em 2 etapas. Etapa 1: só email + senha. Etapa 2 (onboarding guiado dentro do app): nome, fazenda, número de animais. O ICP deve chegar ao dashboard antes de preencher contexto operacional.

**F2 — Opacidade de pricing**
Risco: Visitante curioso sobre preço encontra só "Saiba mais" — pode gerar frustração e bounce para concorrentes.
Recomendação M0 (sem revelar valores): Comunicar faixas de escala de forma qualitativa ("plano de entrada para até 100 animais; plano para operações maiores"). Não revelar R$ — mas reduzir a ansiedade de "será que consigo pagar?".
Nota: Revelar valores completos após validação M5 — a fricção de pricing oculto é aceitável em M0 vs. o risco de ancorar num preço não validado.

**F3 — Ausência de social proof**
Risco: ICP desconhece o Bovion. Sem logos, depoimentos ou números reais, a credibilidade depende 100% da qualidade do copy e da UI.
Recomendação M0: Substituir social proof por especificidade técnica confiável ("banco Postgres com backups automáticos", "multi-tenant estrito — seus dados não são compartilhados com outros usuários", "algoritmo de custo/@ auditável"). Especificidade técnica é mais crível que placeholder genérico.
Recomendação M6+: Coletar 3 depoimentos com nome + cargo + tamanho de operação nas primeiras semanas de beta. Publicar assim que release de uso assinado.

**F4 — Dúvida sobre complexidade do sistema**
Risco: ICP com histórico de ERP ruim (Pecege, SoftFarm) tem ansiedade de "vou precisar de treinamento".
Recomendação: "Como funciona" deve aparecer cedo no funil (link no hero como CTA-SECONDARY ou seção logo após o hero). O fluxo de 5 passos deve ser visível antes do primeiro pedido de cadastro.

**F5 — Mobile: scroll até o CTA**
Risco: Em mobile, se o hero empurra o CTA primário abaixo da dobra, visitantes de alta intenção podem não converter porque não viram o CTA.
Recomendação: Sticky CTA bar em mobile ("Começar grátis — 14 dias sem cartão") visível durante todo o scroll. Implementação de baixo custo, alto impacto.

**F6 — Confiança em produto novo sem histórico**
Risco: "E se o sistema sair do ar na hora de fechar negócio?" — ansiedade legítima do ICP.
Recomendação: Status page pública (Statuspage.io ou similar) antes do go-live. Link no rodapé. SLA comunicado na FAQ.

---

## 5. QUICK WINS — TOP 5 PRIORIZADOS

Ordenados por impacto estimado × facilidade de implementação (sem dados reais — priorização qualitativa).

---

**QW-1 — Sticky CTA bar em mobile**
Impacto: Alto | Esforço: Baixo
Descrição: Barra fixa no rodapé em mobile com "Começar grátis" + "14 dias sem cartão de crédito". Visível em qualquer ponto do scroll.
Por que primeiro: Mobile é o dispositivo do ICP no campo. CTA escondido = conversão perdida. Implementação: componente CSS fixo, 1 dia de dev.

**QW-2 — Trust bar logo abaixo do hero CTA**
Impacto: Alto | Esforço: Baixo
Descrição: Linha de micro-copy: "14 dias grátis · Sem cartão de crédito · Cancele quando quiser · Preço travado para os primeiros clientes".
Por que segundo: Endereça as 3 principais ansiedades de entrada (custo, compromisso, aumento de preço) no momento de maior intenção. Substitui social proof ausente em M0.

**QW-3 — Simulador demo acima do pricing teaser**
Impacto: Alto | Esforço: Médio
Descrição: Mover (ou duplicar) o bloco de simulador demo para antes do pricing teaser. O simulador com número concreto (lucro hoje vs. lucro em X dias) é o gatilho de desejo mais forte — deve aparecer antes do pedido de conversão.
Por que terceiro: Visitante que viu o simulador em ação tem muito mais propensão a converter. O cálculo concreto justifica o trial sem precisar de testimonial.

**QW-4 — Signup em 2 etapas (email-first)**
Impacto: Alto | Esforço: Médio
Descrição: Tela de cadastro com só email + senha. Dados de fazenda e rebanho coletados no onboarding guiado dentro do app.
Por que quarto: Cada campo adicional no cadastro reduz conversão. Email-first reduz fricção máxima no ponto de maior intenção.

**QW-5 — "Como funciona" linkado no hero**
Impacto: Médio | Esforço: Baixo
Descrição: CTA-SECONDARY "Ver como funciona" no hero leva para `/como-funciona` ou ancora na seção de 5 passos na própria home.
Por que quinto: Visitante que não está pronto para converter ainda pode ser retido pela página de como funciona — e converter no segundo acesso ou via lead magnet.

---

## 6. A/B TEST BACKLOG — 5 HIPÓTESES PÓS-LAUNCH

*Prioridade para quando houver volume de tráfego suficiente para significância estatística. Baseline: taxa de conversão para trial signup.*

---

**AB-01 — Headline: linguagem da empresa vs. linguagem do cliente**
Hipótese: Uma headline na voz do cliente ("Você sabe quando é hora de vender seu lote?") converte mais que a headline declarativa atual ("Gestão profissional de rebanho com foco em margem e timing de venda").
Variante A (controle): "Gestão profissional de rebanho com foco em margem e timing de venda."
Variante B (teste): "Você sabe quanto custa sua arroba hoje — e quando é hora de vender?"
Métrica: CTR para signup / taxa de conversão hero
Fundamentação: Foundation doc indica que o cliente descreve o problema na forma de pergunta ("Nunca sei o custo exato da minha arroba"). Testar se pergunta retórica supera declaração direta para o ICP.

**AB-02 — CTA-PRIMARY copy: ação vs. resultado**
Hipótese: CTA orientado ao resultado ("Calcular meu custo/@") converte mais que CTA orientado à ação ("Começar trial gratuito").
Variante A: "Começar trial gratuito"
Variante B: "Calcular meu custo/@ agora"
Variante C: "Ver meu lote no Bovion"
Métrica: CTR do CTA primário / taxa de signup
Fundamentação: CTAs que comunicam o que o usuário obtém superam CTAs de ação genérica. "Calcular meu custo/@" conecta diretamente ao job-to-be-done principal do ICP.

**AB-03 — Posicionamento da demo do simulador**
Hipótese: Colocar a demo do simulador acima da seção de features (logo após a seção de solução) aumenta a taxa de scroll até o CTA final e a conversão.
Variante A (controle): Demo do simulador após features
Variante B (teste): Demo do simulador após seção de solução (antes de features)
Métrica: Scroll depth até o CTA final / taxa de conversão
Fundamentação: O simulador é o diferencial único — nenhum concorrente tem. Mostrar mais cedo capitaliza o pico de interesse antes que o visitante decida sair.

**AB-04 — Pricing teaser: opacidade vs. faixas qualitativas**
Hipótese: Comunicar faixas qualitativas de preço ("planos a partir de R$ X/mês" — a definir após M5) reduz fricção de pricing opacity e aumenta conversão vs. apenas "Saiba mais".
Variante A (controle M0): "Saiba mais" sem nenhuma âncora de preço
Variante B (pós-M5): Anchor de preço de entrada + "Ver planos completos"
Métrica: CTR para página de pricing / taxa de conversão trial
Nota: Este teste só pode ser executado após validação de pricing em M5.

**AB-05 — Social proof: placeholder vs. especificidade técnica**
Hipótese: Substituir a seção de social proof placeholder por um bloco de especificidade técnica ("Algoritmo de custo/@ auditável · Multi-tenant estrito · Backups automáticos diários") produz maior confiança e conversão do que um placeholder genérico "em breve" ou seção omitida.
Variante A (controle M0): Seção de social proof omitida
Variante B (teste M0): Bloco de credenciais técnicas no slot de social proof
Variante C (pós-M6): Depoimentos reais de clientes beta
Métrica: Taxa de conversão trial / scroll depth
Fundamentação: Ausência de prova social é o maior risco de credibilidade M0. Especificidade técnica é a única alternativa disponível antes do beta.

---

## Roadmap de Implementação CRO por Milestone

| Item | Milestone | Prioridade |
|------|-----------|------------|
| Sticky CTA bar mobile | Antes do go-live M6 | P0 |
| Trust bar abaixo do hero | Antes do go-live M6 | P0 |
| Signup 2 etapas (email-first) | Antes do go-live M6 | P0 |
| Demo simulador reposicionada | Antes do go-live M6 | P1 |
| "Como funciona" no hero | Antes do go-live M6 | P1 |
| AB-01 (headline) | Pós-launch, 500+ visitas/semana | P2 |
| AB-02 (CTA copy) | Pós-launch, 500+ visitas/semana | P2 |
| AB-03 (simulador position) | Pós-launch, 500+ visitas/semana | P2 |
| Social proof real (depoimentos) | Beta M6, mínimo 5 clientes | P1 |
| AB-04 (pricing anchor) | Pós-M5 pricing validation | P3 |
| AB-05 (social proof vs. técnico) | Pós-launch imediato | P2 |
| Status page pública | Antes do go-live M6 | P1 |
| Screenshot de produto no hero | Quando UI finalizada | P1 |

---

*Fim do arquivo — cro-recommendations.md*
*Versão M0 · Auditoria conceitual sem dados reais de conversão · Revisitar com dados após go-live M6*
