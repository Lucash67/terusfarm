/**
 * Conteúdo e demo data da landing Terus Farm.
 * Números de mockup NÃO são resultados reais — isolados em DEMO_*.
 */

export const SITE = {
  name: "Terus Farm",
  title: "Terus Farm | Inteligência para Carcinicultura",
  description:
    "Transforme dados da sua fazenda de camarão em inteligência para produção, gestão e tomada de decisão com o Terus Farm.",
  url: "https://terusfarm.vercel.app",
  tagline: "Intelligence OS para carcinicultura.",
} as const;

export const COPY = {
  hero: {
    eyebrow: "INTELIGÊNCIA PARA CARCINICULTURA",
    headlineBefore: "Sua fazenda já gera os dados.",
    headlineAfter: "Agora transforme-os em",
    accent: "decisões.",
    subheadline:
      "O Terus Farm conecta produção, viveiros, ciclos, custos, comercial e inteligência em uma única plataforma feita para a carcinicultura.",
    primaryCta: "Quero conhecer o Terus Farm",
    secondaryCta: "Fazer Raio-X da minha fazenda",
  },
  problem: {
    headline: "Quantos lugares você precisa consultar para entender sua fazenda hoje?",
    closeLead: "O problema não é falta de dados.",
    closeAccent: "É transformar dados em decisão.",
    sources: [
      {
        id: "erp",
        title: "ERP",
        text: "Informações importantes, mas difíceis de analisar isoladamente.",
      },
      {
        id: "sheets",
        title: "Planilhas",
        text: "Versões diferentes, retrabalho e risco de erro.",
      },
      {
        id: "whatsapp",
        title: "WhatsApp",
        text: "Informações importantes se perdem nas conversas.",
      },
      {
        id: "reports",
        title: "Relatórios",
        text: "Demoram para consolidar e chegar até a decisão.",
      },
      {
        id: "notes",
        title: "Anotações",
        text: "Conhecimento preso no papel ou na memória.",
      },
    ],
  },
  cockpit: {
    headline: "Sua operação inteira sob uma única visão.",
    subheadline:
      "Acompanhe os principais sinais da fazenda em um cockpit desenvolvido para a realidade da carcinicultura.",
    tag: "TERUS FARM EM OPERAÇÃO",
  },
  ask: {
    headline: "E se sua fazenda pudesse responder?",
    subheadline:
      "Pergunte em linguagem simples. O Ask Terus interpreta os dados disponíveis da operação e ajuda a transformar informação em decisão.",
    cta: "Quero ver isso na minha fazenda",
    response:
      "Identifiquei um viveiro com piora relativa de FCA no período recente e sinais que merecem investigação. Posso detalhar os indicadores que levaram a essa conclusão.",
    questions: [
      "Qual viveiro merece atenção hoje?",
      "Compare meus ciclos recentes.",
      "Onde minha FCA piorou?",
      "Qual cliente mais comprou no período?",
    ],
  },
  aquafarm: {
    eyebrow: "CASE EM OPERAÇÃO",
    headline: "Da fazenda real para decisões reais.",
    text: "O Terus Farm já está sendo aplicado sobre uma operação real de carcinicultura, conectando dados da produção à inteligência de negócio.",
    identity: "Aquafarm — Cliente Terus Farm",
    cta: "Ver como isso se aplica à sua fazenda",
  },
  how: {
    headline: "Dados da fazenda viram decisão.",
    close: "Menos achismo. Mais contexto.",
    steps: [
      {
        id: "dados",
        title: "Dados da fazenda",
        text: "ERP, produção, viveiros, ciclos, água, biometria, comercial e outras fontes disponíveis.",
      },
      {
        id: "farm",
        title: "Terus Farm",
        text: "Organiza e conecta as informações em um cockpit unificado.",
      },
      {
        id: "intel",
        title: "Inteligência",
        text: "Indicadores, comparações, alertas, Ask Terus e análises.",
      },
      {
        id: "decisao",
        title: "Decisão",
        text: "Mais visibilidade para investigar, priorizar e agir.",
      },
    ],
  },
  diagnostic: {
    headline: "Faça o Raio-X da sua fazenda.",
    subheadline:
      "Responda algumas perguntas rápidas e ajude nosso time a entender o momento da sua operação.",
    cta: "Receber meu diagnóstico",
    microcopy: "Leva menos de 1 minuto.",
    promise: "Diagnóstico inicial da maturidade de gestão da operação.",
  },
  final: {
    headline: "Pronto para enxergar sua fazenda de outra forma?",
    subheadline:
      "Converse com a Terus e veja como o Farm pode ser aplicado à realidade da sua operação.",
    primaryCta: "Agendar demonstração",
    secondaryCta: "Falar no WhatsApp",
    event: "Festival do Camarão • Aracati 2026",
    eventText: "Conheceu a Terus no evento? Continue a conversa com nosso time.",
  },
} as const;

/**
 * DEMO DATA — apenas composição visual do mockup do cockpit.
 * Não apresentar como resultado real, case ou benchmark.
 */
export const DEMO_COCKPIT = {
  production: { label: "Produção", value: 208.7, suffix: " t", delta: "+8,6%", tone: "up" as const },
  ponds: { label: "Viveiros", value: 24, detail: "19 ativos" },
  cycles: { label: "Ciclos", value: 18, detail: "6 colhendo" },
  fca: { label: "FCA", value: 1.42, delta: "−6,2%", tone: "up" as const },
  kgHa: { label: "kg/ha", value: 2560, delta: "+7,3%", tone: "up" as const },
  survival: { label: "Sobrevivência", value: 78, suffix: "%", delta: "+3,1 p.p.", tone: "up" as const },
  cost: { label: "Custo/kg", prefix: "R$ ", value: 5.68 },
  clients: { label: "Clientes", value: 14, detail: "ativos" },
  commercial: { label: "Comercial", value: 320.4, suffix: " t", detail: "volume" },
  alerts: { critical: 3, text: "FCA acima do esperado em 2 viveiros" },
  sparkline: [42, 48, 45, 52, 58, 61, 68, 72, 70, 78, 84, 88],
  costBars: [38, 52, 44, 61, 48, 56],
} as const;

/**
 * Números da operação Aquafarm.
 * DEPENDÊNCIA: autorização comercial antes da publicação final.
 * Desative com `showOperationStats: false`.
 */
export const AQUAFARM_STATS = {
  showOperationStats: true,
  items: [
    { value: "120 ha", label: "área produtiva" },
    { value: "24", label: "viveiros" },
    { value: "10+", label: "anos" },
    { value: "3", label: "ciclos/ano" },
  ],
} as const;

/**
 * Slots de fotografia real.
 * Coloque os arquivos em public/aquafarm/ com estes nomes.
 * Se o arquivo não existir, a UI usa o mapa técnico de viveiros.
 */
export const AQUAFARM_ASSETS = {
  heroAerial: "/aquafarm/hero-aerial.webp",
  caseWide: "/aquafarm/case-wide.webp",
  caseDetail1: "/aquafarm/case-detail-1.webp",
  caseDetail2: "/aquafarm/case-detail-2.webp",
  logo: "/aquafarm/logo.png",
  mark: "/aquafarm/mark.png",
} as const;

export const HERO_PONDS = [
  { id: "V-04", x: 18, y: 28, label: "Viveiro 04 · dados conectados" },
  { id: "V-09", x: 38, y: 42, label: "Viveiro 09 · dados conectados" },
  { id: "V-12", x: 58, y: 33, label: "Viveiro 12 · dados conectados" },
  { id: "V-17", x: 74, y: 52, label: "Viveiro 17 · dados conectados" },
  { id: "V-21", x: 46, y: 68, label: "Viveiro 21 · dados conectados" },
] as const;
