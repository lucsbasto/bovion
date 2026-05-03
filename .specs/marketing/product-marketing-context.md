# Product Marketing Context — Bovion

*Last updated: 2026-05-03*
*Gerado via: product-marketing-context skill (DRAFT mode — sintetizado dos specs internos)*
*Idioma: pt-BR (todo copy de marketing em pt-BR; código e variáveis em inglês)*

---

## Product Overview

**One-liner:**
Bovion é a plataforma SaaS de inteligência pecuária que responde a pergunta que todo pecuarista tem: "Quanto custa minha arroba — e quando devo vender?"

**O que faz:**
Bovion centraliza gestão de rebanho (animais, lotes, áreas), saúde animal, suplementação e análise financeira em uma única plataforma. Calcula GMD (Ganho Médio Diário), custo por arroba, break-even, ponto de saturação e simula o dia ótimo de venda em um horizonte de 120 dias. Substitui planilhas dispersas por decisões data-driven com visão de margem em tempo real.

**Product category:**
Software de gestão pecuária (gestão de rebanho + inteligência financeira). Prateleira: "sistema para pecuarista", "software fazenda gado de corte", "gestão bovina".

**Product type:** SaaS multi-tenant, web-app (Next.js, responsivo).

**Business model:**
4 planos mensais por organização (Essencial R$ 49,90 / Gestão R$ 149,00 / Estratégico R$ 399,00 / Corporativo R$ 1.099,00) + cobrança de excedente de animais (~R$ 0,50–1,50/animal/mês acima do limite do plano). Trial gratuito de 14 dias. Sem contrato de fidelidade. [INFERRED — valores finais de pricing precisam de confirmação do usuário antes do go-live]

---

## Target Audience

**Target companies:**
Fazendas de bovinos de corte no Brasil — operações individuais a grupos pecuários. Porte: 1 a 20 fazendas, 100 a 5.000 animais ativos. Fase: operação em andamento (não startups rurais sem estrutura).

**Decision-makers:**
- Pecuarista proprietário (toma decisão de compra, paga a conta)
- Gestor de fazenda / gerente operacional (usa diariamente, defende internamente)
- Consultor zootécnico / contador rural (influenciador técnico em operações maiores)

**Primary use case:**
Saber o custo real por arroba de cada lote e decidir com precisão quando vender — antes de perder margem por saturação ou vender cedo demais.

**Jobs to be done:**
1. "Me diz quanto está custando cada animal hoje e quanto vou lucrar se vender amanhã vs daqui 30 dias."
2. "Quero parar de usar três planilhas diferentes pra cruzar pesagem, custo de ração e preço de venda."
3. "Preciso comparar o desempenho de lotes diferentes sem montar um relatório manual toda semana."
4. "Quero saber se meu lote está saturado antes que os números piorem."

**Use cases:**
- Controle de rebanho com pesagem e cálculo automático de GMD
- Gestão de saúde animal (vacinas, medicações, tratamentos) com custo integrado
- Planejamento de suplementação com custo de dieta por animal/dia
- Simulação de cenários de venda (dia ótimo, break-even)
- Dashboard de KPIs operacionais e financeiros por fazenda e lote
- Convite de membros da equipe com controle de acesso por papel (dono, admin, gerente, visualizador)

---

## Personas

| Persona | Cargo | Cares about | Challenge principal | Valor que o Bovion entrega |
|---------|-------|-------------|---------------------|-----------------------------|
| **Pecuarista proprietário** | Dono da fazenda | Lucro líquido, timing de venda, custo/@  | Decisão de venda baseada em intuição ou preço spot; sem visão de custo real | Custo/@ em tempo real + simulador de dia ótimo de venda |
| **Gestor de fazenda** | Gerente operacional | Controle diário de rebanho, saúde, ração | Dados em planilhas isoladas; sem visão integrada de saúde + financeiro | Tudo centralizado: pesagem, saúde, suplementação, financeiro |
| **Consultor / Zootécnico** | Consultor externo | Dados precisos para recomendar manejo | Recebe informação fragmentada do cliente; perde tempo consolidando | Acesso viewer ao sistema do cliente; dados históricos exportáveis [INFERRED — exportação CSV no backlog, não no MVP] |
| **Grupo pecuário (CFO)** | Gestor financeiro | Visão consolidada de múltiplas fazendas | Sem ferramenta que consolide P&L de operações distintas | Plano Corporativo: multi-fazenda, roles, billing centralizado [INFERRED — consolidação multi-fazenda é backlog pós-MVP] |

---

## Problems & Pain Points

**Core problem:**
O pecuarista de corte opera com alto capital imobilizado (R$ 200–800/@ compra) e margens apertadas, mas toma decisões de venda sem saber seu custo real por arroba. A informação existe dispersa: pesagens numa planilha, compras de ração em outra, notas de compra no e-mail. Calcular o break-even de um lote exige horas de trabalho manual — e quando o dado fica pronto, o mercado já mudou.

**Por que as alternativas atuais falham:**
- **Planilhas (Excel/Google Sheets):** não integram pesagem, ração e custo de compra automaticamente; erro humano frequente; sem simulação; não colaborativas por default.
- **ERPs rurais tradicionais (Pecege, AgroSistemas, SoftFarm):** instalação desktop ou complexidade enterprise; UI dos anos 2000; curva de aprendizado alta; sem simulador de margem.
- **Sistemas de rebanho básicos (apps de brinco/pesagem):** registram o dado mas não calculam margem nem projetam venda ótima.
- **Planilhas de consultores:** dependem do consultor para interpretar; não estão disponíveis 24/7 para decisão rápida.

**O que custa ao pecuarista:**
- Vender no momento errado = R$ 20–80/@ de margem perdida por animal [INFERRED — estimar com base em volatilidade de mercado; validar com usuários reais]
- Horas semanais consolidando dados manualmente
- Saturação não detectada = perda de peso e custo de ração desperdiçado
- Decisão de compra/venda sem embasamento = risco financeiro em operações de R$ 500k+

**Tensão emocional:**
"Eu sei que tô deixando dinheiro na mesa, mas não sei quanto nem como parar." Mistura de frustração com planilhas quebradas, insegurança na hora de negociar com frigoríficos, e sensação de que "todo mundo tem mais controle do que eu."

---

## Competitive Landscape

**Diretos (mesma solução, mesmo problema):**
- **SoftFarm / AgroSistemas / Pecege:** sistemas desktop ou web legados, focados em controle zootécnico, sem inteligência financeira preditiva. Caros pra operações menores, UI ultrapassada.
- **Planilhas Excel/Google personalizadas:** solução mais usada hoje. Problema: não escala, não integra, erro manual, sem simulação. [INFERRED — market share estimado; validar com pesquisa]

**Secundários (problema parecido, solução diferente):**
- **Consultores zootécnicos com planilha própria:** entregam análise mensal, mas não dão acesso contínuo ao pecuarista.
- **Apps de pesagem portáteis (Vence, TagTalk):** coletam dado no campo mas não fecham o ciclo financeiro.

**Indiretos (abordagem conflitante):**
- **Não fazer nada / instinto:** segmento relevante de pecuaristas que ainda decide por experiência + telefonema com o frigorífico. Hábito forte, resistência à digitalização.
- **ERP rural completo (GestFarm, Rural Pro):** solução enterprise demais para fazendas de até 5k animais; exige implantação, treinamento, custo alto.

**Como cada alternativa fica aquém:**
| Alternativa | Gap |
|-------------|-----|
| Planilha Excel | Sem simulação, sem GMD automático, sem alerta de saturação |
| ERP legado | UI ruim, sem simulador, complexo demais, caro por usuário |
| App de pesagem | Coleta dado mas não fecha P&L |
| Consultor | Assíncrono, caro, sem self-service |
| Instinto/experiência | Sem dados históricos, risco em mercado volátil |

---

## Differentiation

**Diferenciais-chave:**
1. **Simulador de dia ótimo de venda** — único diferencial comprovado: calcula lucro projetado para cada dia nos próximos 120 dias, indica o ponto de saturação e o dia de máximo retorno. Nenhuma planilha ou ERP legado faz isso automaticamente.
2. **Custo/@ calculado em tempo real** — integra peso, custo de compra, ração, saúde e suplementação num único número: "quanto está custando cada animal hoje."
3. **UI fintech-grade, PT-BR nativo** — design sóbrio e denso (referências: Stripe, Linear, Vercel) em vez de "fazendinha amigável." Dados primeiro, sem floreios.
4. **Multi-tenant com controle de acesso por papel** — dono convida gestor e zootécnico com permissões distintas; multi-fazenda sob uma organização.
5. **SaaS acessível sem instalação** — funciona no navegador, sem IT, sem implantação; setup em minutos.

**Como fazemos diferente:**
Bovion fecha o ciclo dados → decisão no próprio produto. O pecuarista lança a pesagem, o sistema atualiza GMD e custo/@, e o simulador já mostra o impacto financeiro de vender hoje vs em 30 dias — sem sair do app.

**Por que isso é melhor:**
Elimina o tempo entre "ter os dados" e "tomar a decisão." Hoje esse ciclo leva dias (planilha manual) ou semanas (relatório do consultor). No Bovion, é em tempo real.

**Por que clientes nos escolhem:**
[INFERRED — sem dados de usuários reais ainda; hipótese a validar em M1/M6:]
- Primeiro produto que fecha dados operacionais + financeiros + simulação em uma interface só
- Preço acessível para fazendas médias (R$ 49,90–149,00/mês vs ERPs R$ 500+/mês)
- Onboarding sem friction: cadastra fazenda, importa animais, já vê dashboard

---

## Objections

| Objeção | Resposta |
|---------|----------|
| "Já uso planilha, funciona pra mim." | Planilha não calcula GMD automaticamente, não alerta saturação, não simula o dia ótimo. O tempo que você gasta consolidando dados toda semana custa mais do que o plano. |
| "Sistema rural é complicado demais, não vou usar." | Bovion tem UI de produto de tecnologia moderno (não de ERP dos anos 2000). Setup em minutos, sem instalação, sem treinamento formal. Trial de 14 dias sem cartão. [INFERRED — "sem cartão" a confirmar na política de billing] |
| "Minha operação é pequena, não preciso de sistema." | Plano Essencial é para operações de até 100 animais. R$ 49,90/mês. Se você deixar de vender no momento errado mesmo uma vez, o sistema se paga. |
| "Meus dados vão ficar na nuvem, é seguro?" | Multi-tenant estrito: seus dados são isolados, nenhum outro usuário acessa. Banco Postgres com backups automáticos (Supabase). Cookie de sessão HttpOnly seguro. [INFERRED — compliance LGPD a detalhar antes do go-live] |
| "O preço vai aumentar depois que eu entrar." | [INFERRED — política de lock-in de preço a definir; sugestão: grandfathering pra early adopters] |

**Anti-persona (mau fit):**
- Pecuarista de leite (Bovion é bovinos de **corte** — GMD e custo/@ são métricas de engorda, não de lactação)
- Fazendas de outras espécies (suíno, avicultura)
- Operações com >20 fazendas e necessidade de consolidação corporativa complexa (backlog pós-MVP)
- Quem precisa de integração com B3, ERPs (SAP, TOTVS) agora — fora de escopo MVP
- Quem precisa de certificações SOC2 / auditoria formal — Better Auth ainda sem SOC2

---

## Switching Dynamics

**Push (o que empurra pra fora da planilha):**
- "Quebrei a planilha de novo e perdi o histórico de pesagem."
- "Não consigo saber o custo/@ de um lote sem passar 2h consolidando dados."
- "Vendi um lote achando que estava lucrando e no final o custo saiu mais alto do que calculei."
- Saturação não detectada a tempo — animal ganhou peso, ficou caro pra manter, vendia barato.

**Pull (o que atrai pro Bovion):**
- "Quero saber agora, sem montar relatório, quanto estou lucrando por lote."
- Dashboard com KPIs de margem visíveis assim que abre o app.
- Simulador de venda que responde "vendo hoje ou espero 30 dias?"
- UI limpa, moderna, sem treinamento.

**Habit (o que mantém preso na solução atual):**
- Planilha já existe, dados históricos estão lá.
- "Sempre fiz assim, funciona."
- Zootécnico/consultor já entrega relatório mensal — por que pagar mais?
- Resistência a digitalização em operações familiares tradicionais.

**Anxiety (o que preocupa ao considerar trocar):**
- "Vou perder meu histórico de dados." [mitigar: importação de dados históricos, mesmo que simples]
- "Vou depender de internet no campo." [mitigar: app funciona bem em conexão móvel; dados críticos offline a avaliar pós-MVP]
- "E se o sistema sair do ar na hora de fechar negócio?" [mitigar: SLA claro, status page]
- "Minha equipe não vai aprender usar." [mitigar: onboarding guiado, trial 14d]

---

## Customer Language

**Como descrevem o problema (hipótese — a validar com entrevistas reais):** [INFERRED]
- "Nunca sei o custo exato da minha arroba."
- "Fico no chute na hora de vender."
- "Minha planilha vive quebrando."
- "Não consigo comparar um lote com outro sem montar tudo na mão."
- "Quando o consultor entrega o relatório, o mercado já mudou."
- "Sei que tô deixando dinheiro na mesa, mas não sei quanto."

**Como descrevem o produto ideal (hipótese):** [INFERRED]
- "Queria ver tudo numa tela só."
- "Um sistema que me diga quando é hora de vender."
- "Igual o que os grandes grupos usam, mas acessível pra mim."

**Palavras e termos a usar:**
- Arroba (@), custo/@, preço/@, break-even, saturação, GMD (Ganho Médio Diário), dia ótimo de venda
- Lote, rebanho, brinco, área, fazenda
- Manejo sanitário, vacinação, suplementação, ração
- Margem, lucro projetado, custo total, resultado financeiro
- Pecuarista, gestor de fazenda, grupo pecuário
- "Decisão data-driven", "inteligência pecuária", "visão de margem"

**Palavras a evitar:**
- "Fazendinha" (tom infantil)
- "Revolução", "disruptivo", "inovador" (clichês vazios)
- "Agricultura" (Bovion é pecuária, não agricultura ampla)
- "Sistema ERP" (associa com complexidade antiga)
- Jargão técnico de software sem contexto (API, cloud, serverless) em copy voltado ao pecuarista

**Glossário do produto:**
| Termo | Significado no Bovion |
|-------|----------------------|
| Lote | Grupo de animais num mesmo espaço/gestão financeira; unidade de análise |
| GMD | Ganho Médio Diário (kg/dia) — velocidade de engorda do animal |
| Custo/@ | Custo total acumulado do animal ÷ peso em arrobas |
| Break-even | Preço mínimo de venda por @ para cobrir todos os custos |
| Saturação | Ponto em que o custo marginal de manter o animal supera o ganho de peso |
| Dia ótimo | Dia nos próximos 120 dias com maior lucro projetado |
| Simulador | Feature que projeta lucro para cada dia do horizonte (0–120 dias) |
| Organização | Entidade raiz no multi-tenant; pode ter 1..N fazendas |
| Fazenda ativa | Fazenda selecionada no contexto atual do usuário |
| Arroba (@) | Unidade: 1@ = 30kg (constraint fixo no sistema) |

---

## Brand Voice

**Tom:**
Profissional, direto, baseado em dados. B2B fintech-grade aplicado à pecuária. Sem paternalismo, sem folclore rural, sem emoji. Fala com o pecuarista como parceiro de negócio, não como consumidor de aplicativo.

**Estilo de comunicação:**
- Declarativo e específico: "Custo/@ calculado automaticamente a cada pesagem" — não "gestão eficiente do seu rebanho"
- Orientado a resultado: sempre conectar feature a decisão ou resultado financeiro
- Denso quando necessário: o pecuarista profissional lida com tabelas e números — não simplificar demais
- Sem superlativo vazio: não "o melhor sistema", sim "o único que calcula o dia ótimo de venda"

**Personalidade da marca (5 adjetivos):**
1. **Preciso** — dados corretos, cálculos auditáveis, sem estimativas vagas
2. **Direto** — sem rodeios, sem UX que esconde informação
3. **Confiável** — multi-tenant estrito, histórico imutável, backup automático
4. **Acessível** — preço justo para fazenda média, sem implantação, sem treinamento
5. **Profissional** — UI fintech-grade, não "fazenda game"

**Referências de tom (proxies):**
- Stripe (clareza + densidade de informação)
- Linear (contenção tonal, sem hiperbole)
- Vercel (whitespace, comunicação técnica elegante)
- Bloomberg Terminal (precisão tabular quando relevante)

**Anti-tom:**
- NÃO rústico ("parceirão do campo")
- NÃO startup entusiasta ("disrupting agribusiness")
- NÃO emoji-heavy
- NÃO ilustrações cartoon / mascote bovino

---

## Brand Pillars

1. **Margem em primeiro lugar** — toda feature existe para aumentar ou proteger a margem do pecuarista. KPIs financeiros estão sempre visíveis, nunca escondidos em submenus.
2. **Dados que viram decisão** — não basta registrar dado. O sistema fecha o ciclo: dado → análise → recomendação de timing de venda.
3. **Simplicidade profissional** — interface limpa e densa como um produto fintech, sem sacrificar profundidade para o usuário avançado.
4. **Confiança operacional** — multi-tenant estrito, histórico imutável, zero downtime esperado. O pecuarista pode depender do sistema na hora de fechar negócio.

---

## Key Messages

**Mensagem principal:**
"Bovion responde a pergunta que vale dinheiro: quanto custa minha arroba — e quando devo vender?"

**Mensagens de suporte:**

1. **Para quem usa planilha:**
   "Pare de consolidar dados na mão. Bovion calcula GMD, custo/@ e margem projetada automaticamente a cada pesagem."

2. **Para quem decide por intuição:**
   "Você sabe quanto custa criar um animal. O Bovion te diz quando o custo de manter supera o ganho — e qual o dia de máximo retorno nos próximos 120 dias."

3. **Para quem compara lotes:**
   "Compare Engorda Primavera com Lote 2 sem montar relatório. Dashboard com KPIs lado a lado, atualizado em tempo real."

4. **Para o dono preocupado com equipe:**
   "Convide seu gestor e zootécnico com permissões diferentes. Cada um vê o que precisa, sem acessar o que não deve."

5. **Para quem tem medo de sistema complexo:**
   "Setup em minutos, sem instalação, sem treinamento. Se não funcionar para você em 14 dias, sem cobrança."

**Tagline:**
"Inteligência Pecuária" (já em uso no produto — manter consistência)

**Hero headline (marketing landing):**
"Gestão profissional de rebanho com foco em margem e timing de venda" (fonte: visual-brief home.png)

---

## Use Cases

### UC-01: Pecuarista individual, 200 animais, 2 lotes
- Cadastra animais na compra (peso, valor, frete)
- Registra pesagens quinzenais — GMD calculado automaticamente
- Vê custo/@ de cada lote no dashboard
- Roda simulador antes de aceitar oferta do frigorífico: "se eu vender hoje a R$ 280/@, lucro R$ 18.400. Se esperar 30 dias (simulação), lucro R$ 22.100 — se arroba subir R$ 5."
- Decide com base em número, não intuição

### UC-02: Grupo pecuário, 3 fazendas, gerente + dono
- Dono cria organização, convida gerente como admin e zootécnico como viewer
- Gerente registra ocorrências de saúde e dietas de suplementação
- Zootécnico visualiza histórico sanitário sem poder editar financeiro
- Dono vê dashboard consolidado por fazenda, compara margem entre operações

### UC-03: Alerta de saturação
- Sistema detecta que Lote A tem GMD caindo e custo/@ acelerando
- Dashboard exibe badge "Saturado" no lote
- Simulador mostra que curva de lucro já cruzou o ponto de máximo — venda imediata é recomendada
- Pecuarista aciona frigorífico com dados em mãos

### UC-04: Planejamento de suplementação
- Nutricionista cadastra dieta com ingredientes (kg/dia, custo/kg)
- Sistema calcula custo diário por animal e custo mensal total do lote
- Pecuarista compara duas dietas pelo custo/@-dia antes de decidir qual usar

---

## Proof Points

**Métricas do produto (a coletar em beta/M6):** [INFERRED — ainda sem usuários reais; preencher com dados reais antes do go-live]
- "X pecuaristas economizam Y horas/semana em consolidação de dados"
- "Z% de redução no tempo entre pesagem e decisão de venda"
- Simulações rodadas / semana (engagement metric)

**Clientes / logos:** [INFERRED — nenhum ainda (M0); seção a preencher após beta M6]

**Testimonials:** [INFERRED — nenhum ainda; coletar nos primeiros 30 usuários beta]

**Value themes e evidências disponíveis:**
| Tema | Evidência atual | A coletar |
|------|-----------------|-----------|
| Precisão financeira | Algoritmo de custo/@ + simulador 0–120 dias auditável no código | Casos reais de decisões de venda |
| Facilidade de uso | UI baseada em referências Stripe/Linear; 13 telas mapeadas | NPS beta |
| Confiabilidade | Multi-tenant estrito com testes E2E obrigatórios; Better Auth 28k stars | Uptime real pós-deploy |
| Custo-benefício | Plano Essencial R$ 49,90 vs ERP R$ 500+/mês | Comparativo de custo-benefício formal |

---

## Goals

**Business goal:**
Validar product-market fit com primeiros 50 clientes pagantes em fazendas de bovinos de corte no Brasil. Meta M6 go-live: 3 clientes pagos no plano Gestão ou superior.

**Conversion action primária:**
Cadastro no trial de 14 dias (CTA "Abrir o app" → tela de registro → fazenda criada → primeiro animal cadastrado).

**Conversion action secundária:**
Upgrade do trial para plano pago antes do vencimento dos 14 dias.

**Current metrics:** [INFERRED — pré-lançamento; nenhum dado real ainda]
- Usuários pagantes: 0 (M0)
- MRR: R$ 0 (M0)
- Trials ativos: 0 (M0)
- Meta M6: primeiros 3 pagantes, MRR > R$ 450/mês

---

## Notes for Downstream Skills

Esta seção é meta-informação para outros skills que consumem este documento:

- **copywriting / landing pages:** usar mensagem principal + hero headline da seção Key Messages. Tom: profissional, direto, sem hiperbole. Sempre pt-BR.
- **seo:** keywords primárias: "software gestão pecuária", "sistema para pecuarista", "gestão rebanho gado de corte", "custo arroba calculadora", "quando vender gado". Keywords secundárias: "GMD bovino", "simulador venda gado", "planilha pecuária substituição".
- **ad-creative:** use UC-01 e UC-03 como creative concepts. Headline anchor: "Você sabe quando vender?" Dor anchor: "Planilha quebrada na hora de fechar negócio."
- **content-strategy:** topo de funil = conteúdo educativo sobre custo/@ e GMD (quem busca calcular custo de arroba tem alta intenção). Fundo de funil = comparativo Bovion vs planilha.
- **email-sequence:** sequência de onboarding deve guiar usuário do cadastro → primeiro animal → primeiro lote → primeiro dashboard com KPIs → simulador. Cada email = um aha moment.
- **pricing-strategy:** ancora no plano Gestão (R$ 149,00) como "mais popular". Essencial é entry point, Estratégico/Corporativo são upgrade goals. Simulador de cobrança na página de planos.

---

## Items Marcados como [INFERRED] — Necessitam Confirmação do Usuário

1. **Valores exatos de pricing** (R$ 49,90 / 149,00 / 399,00 / 1.099,00) — baseados no visual-brief billing.png; confirmar antes do go-live comercial
2. **Trial sem cartão de crédito** — política a definir no spec BILLING
3. **Estimativa de margem perdida por vender no momento errado** (R$ 20–80/@) — validar com dados de mercado real
4. **Linguagem do cliente** (frases verbatim) — hipóteses; substituir por frases reais coletadas em entrevistas com pecuaristas antes do M6
5. **Quota de mercado das planilhas Excel** — "solução mais usada" é hipótese razoável mas não validada com pesquisa
6. **Grandfathering de preço para early adopters** — decisão de produto a tomar antes de lançar
7. **Consolidação multi-fazenda (Corporativo)** — backlog pós-MVP; não prometer na landing
8. **Exportação CSV/PDF** — backlog; não incluir em feature list antes de implementar
9. **Conformidade LGPD** — a detalhar formalmente antes do go-live (política de privacidade + termos)
10. **Métricas de prova social** (tempo economizado, % redução) — preencher com dados reais dos primeiros 20 clientes beta
11. **Testimonials / logos** — nenhum disponível em M0; seção placeholder
12. **Meta de MRR M6 (R$ 450/mês / 3 clientes)** — hipótese; ajustar com dados reais do beta
