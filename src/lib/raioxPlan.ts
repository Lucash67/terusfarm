import type { DiagnosticPayload } from "./diagnostic";

export type EvolutionPriority = {
  rank: 1 | 2 | 3;
  title: string;
  explanation: string;
  whyItMatters: string;
  howFarmHelps: string;
  modules: string[];
};

export type FarmEntryLine = {
  from: string;
  through: string;
  to: string;
};

type Ponds = DiagnosticPayload["ponds"];
type Track = DiagnosticPayload["cycleTracking"];
type Pain = DiagnosticPayload["difficulty"];

const PAIN_PRIORITY: Record<Pain, Omit<EvolutionPriority, "rank">> = {
  Produção: {
    title: "Centralizar a leitura dos ciclos",
    explanation:
      "Produção, histórico e análise ainda não compartilham o mesmo recorte de viveiro e ciclo.",
    whyItMatters:
      "Quando esses sinais ficam espalhados, comparar viveiros exige esforço manual e a identificação de desvios atrasa.",
    howFarmHelps:
      "O cockpit consolida o recorte operacional e permite comparar ciclos e viveiros com mais velocidade de leitura.",
    modules: ["Produção", "Visão Geral"],
  },
  Custos: {
    title: "Ler custo no mesmo contexto do ciclo",
    explanation: "O custo chega desligado da despesca, da ração e do que o viveiro viveu.",
    whyItMatters:
      "Sem esse contexto, investigar margem vira opinião — o número existe, mas não aponta o próximo passo.",
    howFarmHelps:
      "O Farm organiza custo/kg junto da operação para investigar com contexto, não só para fechar relatório.",
    modules: ["Custo e financeiro", "Cockpit"],
  },
  Indicadores: {
    title: "Dar dono de decisão aos indicadores",
    explanation: "Há métrica. Falta um lugar onde ela aponte o que investigar agora.",
    whyItMatters:
      "Indicador sem recorte de viveiro e ciclo vira painel para reunir — não priorização para agir.",
    howFarmHelps:
      "O observatório do Farm é feito para carcinicultura: comparação, recorte e pergunta em cima do dado disponível.",
    modules: ["Observatório", "Ask Terus"],
  },
  Comercial: {
    title: "Ligar a venda ao viveiro",
    explanation: "O comercial anda. A origem na fazenda quase nunca aparece na mesma leitura.",
    whyItMatters:
      "Sem esse vínculo, volume e cliente não conversam com ciclo — a operação decide as duas pontas separadas.",
    howFarmHelps:
      "Clientes, volume e fazenda entram no mesmo recorte: quem comprou, de onde veio, com qual contexto operacional.",
    modules: ["Clientes e comercial", "Cockpit"],
  },
  "Dados espalhados": {
    title: "Unificar a verdade da fazenda",
    explanation: "A operação se entende em vários lugares. Cada área defende o número que tem na mão.",
    whyItMatters:
      "Enquanto as fontes não se encontram, cada pergunta “como está a fazenda?” recomeça do zero.",
    howFarmHelps:
      "O Farm se apoia no que já é registrado e devolve uma leitura só — camada analítica, sem substituir o ERP.",
    modules: ["Camada de conexão", "Visão Geral"],
  },
  Alertas: {
    title: "Transformar sinal em prioridade",
    explanation: "A mudança existe. O aviso chega quando o padrão já saiu do eixo.",
    whyItMatters:
      "Sem dono, viveiro e contexto, o time investiga no escuro e reage ao que grita mais alto.",
    howFarmHelps:
      "Alertas do Farm apontam o que saiu do padrão para investigar — com contexto, não com susto.",
    modules: ["Alertas e anomalias", "Ask Terus"],
  },
  Outra: {
    title: "Criar um ponto de partida gerencial",
    explanation: "A fazenda gera informação. Falta um lugar onde ela vire prioridade da semana.",
    whyItMatters:
      "Sem um recorte inicial, cada decisão começa do relato — memória em memória.",
    howFarmHelps:
      "A visão geral organiza o que já existe para enxergar a operação inteira antes de aprofundar.",
    modules: ["Visão Geral", "Cockpit"],
  },
};

const TRACK_PRIORITY: Record<Track, Omit<EvolutionPriority, "rank">> = {
  ERP: {
    title: "Colocar inteligência sobre o ERP",
    explanation: "O ERP registra. A visão gerencial ainda se monta fora dele.",
    whyItMatters:
      "Cobrar do ERP uma leitura de fazenda que ele não foi desenhado para entregar atrasa a decisão e espalha planilha paralela.",
    howFarmHelps:
      "O Terus Farm não substitui o ERP. Ele lê o que o ERP guarda e devolve cockpit, comparação e Ask Terus.",
    modules: ["Cockpit", "Camada de conexão"],
  },
  Planilha: {
    title: "Reduzir dependência de planilhas",
    explanation: "A leitura da fazenda ainda depende de arquivo, versão e de quem abriu por último.",
    whyItMatters:
      "Cada aba conta uma operação. Comparar ciclos vira retrabalho — e a decisão espera a montagem manual.",
    howFarmHelps:
      "Os dados disponíveis passam a ser organizados em uma camada analítica, reduzindo a necessidade de montar leitura manual para cada decisão.",
    modules: ["Cockpit", "Visão Geral"],
  },
  BI: {
    title: "Especializar o recorte para a fazenda",
    explanation: "O BI consolida. O chão da operação pede viveiro, ciclo, FCA e despesca.",
    whyItMatters:
      "Um dashboard amplo raramente aponta o próximo viveiro a investigar — a prioridade da semana continua manual.",
    howFarmHelps:
      "O Farm especializa a leitura para carcinicultura e deixa perguntar em cima da operação, não só do gráfico.",
    modules: ["Observatório", "Ask Terus"],
  },
  Outro: {
    title: "Tirar a operação da conversa solta",
    explanation: "WhatsApp, caderno e relato guardam sinal. Não guardam histórico comparável.",
    whyItMatters:
      "O que foi dito ontem não vira série amanhã. Sem histórico, não há priorização — há memória da equipe.",
    howFarmHelps:
      "O Farm é o lugar onde o que aconteceu permanece, se deixa comparar e se deixa perguntar.",
    modules: ["Cockpit", "Ask Terus"],
  },
};

const SCALE_PRIORITY: Record<Ponds, Omit<EvolutionPriority, "rank">> = {
  "1–5": {
    title: "Registrar o conhecimento da operação",
    explanation: "Poucos viveiros cabem na cabeça de quem opera — e esse é o risco.",
    whyItMatters:
      "Se quem opera não está, a fazenda perde o fio da meada. Visibilidade não pode depender de uma pessoa.",
    howFarmHelps:
      "O cockpit guarda o recorte da operação para a equipe investigar e decidir com o mesmo contexto.",
    modules: ["Visão Geral", "Cockpit"],
  },
  "6–20": {
    title: "Comparar viveiros sem montar o quadro",
    explanation: "Nessa faixa, passar o olho já não conta a fazenda. Comparar ciclos ainda é trabalho.",
    whyItMatters:
      "O valor está em ver qual viveiro foge do padrão — não em olhar cada um isolado, em fontes diferentes.",
    howFarmHelps:
      "A comparação de ciclos e viveiros deixa de ser um projeto de planilha e passa a ser uma leitura do cockpit.",
    modules: ["Produção", "Cockpit"],
  },
  "21–50": {
    title: "Priorizar viveiros com recorte",
    explanation: "Com dezenas de viveiros, registrar mais um dado vale menos do que saber o que merece atenção.",
    whyItMatters:
      "Sem ranking de atenção, a gestão reage ao que grita mais alto — não ao que importa neste ciclo.",
    howFarmHelps:
      "O Farm organiza a visão da fazenda para priorizar investigação: qual viveiro, qual sinal, por que agora.",
    modules: ["Produção", "Alertas e anomalias"],
  },
  "+50": {
    title: "Decidir o que olhar — e o que ignorar — hoje",
    explanation: "Em escala, o problema deixa de ser ter dado. Passa a ser recorte.",
    whyItMatters:
      "Sem recorte, reunião vira relato e a decisão perde velocidade. Inteligência aqui é priorização.",
    howFarmHelps:
      "Cockpit e Ask Terus devolvem um critério de atenção sobre os dados disponíveis da operação.",
    modules: ["Cockpit", "Ask Terus"],
  },
};

const TRACK_ENTRY: Record<Track, FarmEntryLine> = {
  ERP: {
    from: "ERP isolado",
    through: "Terus Farm",
    to: "Camada de inteligência",
  },
  Planilha: {
    from: "Planilha",
    through: "Cockpit unificado",
    to: "Comparação de ciclos",
  },
  BI: {
    from: "BI genérico",
    through: "Cockpit de carcinicultura",
    to: "Leitura de fazenda",
  },
  Outro: {
    from: "Informação na conversa",
    through: "Cockpit",
    to: "Histórico comparável",
  },
};

const PAIN_ENTRY: Record<Pain, FarmEntryLine> = {
  Produção: {
    from: "Relatórios demorados",
    through: "Visão Geral",
    to: "Leitura mais rápida",
  },
  Custos: {
    from: "Custo no fechamento",
    through: "Cockpit",
    to: "Investigação com contexto",
  },
  Indicadores: {
    from: "Indicador sem dono",
    through: "Observatório",
    to: "Priorização",
  },
  Comercial: {
    from: "Venda isolada",
    through: "Clientes e comercial",
    to: "Origem do volume",
  },
  "Dados espalhados": {
    from: "Informação dispersa",
    through: "Alertas + Ask Terus",
    to: "Priorização",
  },
  Alertas: {
    from: "Sinal tardio",
    through: "Alertas",
    to: "Investigação com contexto",
  },
  Outra: {
    from: "Decisão no relato",
    through: "Visão Geral",
    to: "Mais contexto para decidir",
  },
};

export function buildActionPlan(payload: Pick<DiagnosticPayload, "ponds" | "cycleTracking" | "difficulty">) {
  return [
    { rank: 1 as const, ...PAIN_PRIORITY[payload.difficulty] },
    { rank: 2 as const, ...TRACK_PRIORITY[payload.cycleTracking] },
    { rank: 3 as const, ...SCALE_PRIORITY[payload.ponds] },
  ];
}

export function buildFarmEntry(payload: Pick<DiagnosticPayload, "cycleTracking" | "difficulty">): FarmEntryLine[] {
  const lines = [TRACK_ENTRY[payload.cycleTracking], PAIN_ENTRY[payload.difficulty]];
  const askLine: FarmEntryLine = {
    from: "Pergunta na reunião",
    through: "Ask Terus",
    to: "Priorização da semana",
  };
  const unique = [...lines, askLine].filter(
    (line, index, list) => list.findIndex((item) => item.from === line.from && item.through === line.through) === index,
  );
  return unique.slice(0, 4);
}

export function buildNextStepCopy(farmName: string, track: Track) {
  const close = {
    ERP: `A demonstração parte do que ${farmName} já registra no ERP — sem pedir troca de sistema.`,
    Planilha: `A demonstração mostra como a leitura que hoje vive em arquivo pode aparecer num cockpit da operação.`,
    BI: `A demonstração especializa o que o BI já mede para a língua de viveiro, ciclo e despesca.`,
    Outro: `A demonstração parte do que a equipe já sabe — e mostra um lugar onde isso permanece.`,
  }[track];

  return {
    headline: "Seu próximo passo",
    text: `Com base no diagnóstico de ${farmName}, uma demonstração do Terus Farm pode mostrar como esses pontos poderiam ser organizados dentro da realidade da sua operação. ${close}`,
  };
}
