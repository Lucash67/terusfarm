import { SITE } from "@/data/farm";

import type { DiagnosticPayload } from "./diagnostic";
import { buildDiagnosticId, buildProfileCode } from "./raioxIds";
import { buildActionPlan, buildFarmEntry, buildNextStepCopy } from "./raioxPlan";
import type { EvolutionPriority, FarmEntryLine } from "./raioxPlan";
import { buildRaioxWhatsAppUrls } from "./raioxWhatsapp";

export type MaturityBand = "fragmentada" | "construcao" | "parcial" | "pronta";

type Ponds = DiagnosticPayload["ponds"];
type Track = DiagnosticPayload["cycleTracking"];
type Pain = DiagnosticPayload["difficulty"];

export type DiagnosticReport = {
  id: string;
  profileCode: string;
  diagnosticId: string;
  firstName: string;
  farmName: string;
  city: string;
  ponds: Ponds;
  cycleTracking: Track;
  difficulty: Pain;
  archetype: {
    title: string;
    headline: string;
  };
  maturity: {
    score: number;
    band: MaturityBand;
    label: string;
    axes: {
      capture: { score: number; label: string };
      connection: { score: number; label: string };
      decision: { score: number; label: string };
    };
  };
  reading: string;
  pressure: string;
  hops: string[];
  hopClose: string;
  blindSpots: { title: string; text: string }[];
  unlock: { module: string; value: string }[];
  actionPlan: EvolutionPriority[];
  farmEntry: FarmEntryLine[];
  askQuestion: string;
  thisWeek: string;
  nextMove: string;
  nextStep: { headline: string; text: string };
  localNote: string | null;
  shareUrl: string;
  whatsappUrl: string;
  whatsappDemoUrl: string;
  whatsappSendUrl: string;
  whatsappTalkUrl: string;
};

export type MaturityBreakdown = DiagnosticReport["maturity"];

const CAPTURE: Record<Track, number> = {
  Outro: 24,
  Planilha: 44,
  ERP: 70,
  BI: 78,
};

const SCALE_DRAG: Record<Ponds, number> = {
  "1–5": 0,
  "6–20": 8,
  "21–50": 18,
  "+50": 28,
};

const DECISION_BASE: Record<Pain, number> = {
  "Dados espalhados": 22,
  Alertas: 28,
  Indicadores: 34,
  Outra: 36,
  Custos: 38,
  Comercial: 40,
  Produção: 42,
};

const HOPS: Record<Track, string[]> = {
  ERP: ["ERP operacional", "Relatórios", "Planilha paralela", "WhatsApp"],
  Planilha: ["Planilhas", "WhatsApp", "Anotações", "Memória da equipe"],
  BI: ["BI", "ERP", "Planilha de conferência", "Conversa no campo"],
  Outro: ["WhatsApp", "Caderno / memória", "Planilha solta", "Relato verbal"],
};

const SCALE_HOOK: Record<Ponds, string> = {
  "1–5": "Com poucos viveiros, o risco não é o tamanho — é o conhecimento ir embora com quem opera.",
  "6–20": "Nessa faixa, comparar ciclos já deveria ser uma pergunta. Hoje ainda é um trabalho.",
  "21–50": "Aqui priorizar viveiro vale mais do que registrar mais um dado.",
  "+50": "Em escala, inteligência é saber o que ignorar hoje.",
};

const ARCHETYPE: Record<Track, Record<Pain, { title: string; headline: string }>> = {
  ERP: {
    Produção: {
      title: "Produção fora do cockpit",
      headline: "O ERP registra o ciclo. Quem decide ainda monta o quadro na mão.",
    },
    Custos: {
      title: "Custo depois da decisão",
      headline: "O custo/kg chega quando o ciclo já andou — tarde para corrigir, cedo demais para aceitar.",
    },
    Indicadores: {
      title: "Dado sem leitura",
      headline: "O ERP guarda o indicador. A fazenda ainda não o vê como decisão.",
    },
    Comercial: {
      title: "Venda desconectada do viveiro",
      headline: "O comercial anda. A produção também. Os dois raramente se encontram na mesma tela.",
    },
    "Dados espalhados": {
      title: "ERP sem visão",
      headline: "O dado existe. A visão gerencial ainda não.",
    },
    Alertas: {
      title: "Sistema quieto",
      headline: "O ERP registra a mudança. Quem precisa saber fica sabendo depois.",
    },
    Outra: {
      title: "Operação registrada, fazenda invisível",
      headline: "Há registro. Falta um lugar onde a operação inteira vire prioridade.",
    },
  },
  Planilha: {
    Produção: {
      title: "Ciclo em aba",
      headline: "A produção vive em arquivo. A decisão, no feeling de quem abriu por último.",
    },
    Custos: {
      title: "Margem em arquivo",
      headline: "O custo está na planilha — até alguém salvar outra versão.",
    },
    Indicadores: {
      title: "Painel de Excel",
      headline: "Há indicador. Ele vale o arquivo que estiver aberto.",
    },
    Comercial: {
      title: "Pedido numa aba, viveiro em outra",
      headline: "Venda e despesca não compartilham a mesma verdade.",
    },
    "Dados espalhados": {
      title: "Versões da verdade",
      headline: "Cada planilha conta uma fazenda. A operação precisa de uma só.",
    },
    Alertas: {
      title: "Célula vermelha",
      headline: "O alerta existe se alguém abrir o arquivo certo, no dia certo.",
    },
    Outra: {
      title: "A fazenda no arquivo",
      headline: "A planilha organiza o começo. Não segura a operação quando ela cresce.",
    },
  },
  BI: {
    Produção: {
      title: "Gráfico sem viveiro",
      headline: "O BI consolida. Quem opera precisa de recorte de ciclo e viveiro — não de mais um gráfico.",
    },
    Custos: {
      title: "Custo no dashboard",
      headline: "O BI mostra custo. Raramente mostra o ciclo que o gerou.",
    },
    Indicadores: {
      title: "BI genérico, fazenda específica",
      headline: "Há números. Falta um cockpit feito para FCA, kg/ha, sobrevivência e despesca.",
    },
    Comercial: {
      title: "Volume sem origem",
      headline: "O comercial aparece no BI. De qual ciclo veio, quase nunca.",
    },
    "Dados espalhados": {
      title: "Três fontes, um gráfico",
      headline: "BI, ERP e campo ainda contam fazendas diferentes.",
    },
    Alertas: {
      title: "Indicador sem sinal",
      headline: "Você já mede. Ainda não é avisado a tempo de agir.",
    },
    Outra: {
      title: "Número consolidado, decisão manual",
      headline: "O BI junta. A prioridade da semana ainda se monta na reunião.",
    },
  },
  Outro: {
    Produção: {
      title: "Viveiro na memória",
      headline: "Qual viveiro merece atenção hoje depende de quem está na conversa.",
    },
    Custos: {
      title: "Custo na cabeça",
      headline: "A margem existe no feeling de quem fechou o ciclo — não numa visão compartilhada.",
    },
    Indicadores: {
      title: "Sinal que evapora",
      headline: "O indicador viveu no grupo de ontem. Hoje já não dá para comparar.",
    },
    Comercial: {
      title: "Pedido no WhatsApp",
      headline: "A venda aconteceu. O vínculo com o viveiro ficou na conversa.",
    },
    "Dados espalhados": {
      title: "Operação na memória",
      headline: "A fazenda decide com o que a equipe consegue lembrar — não com o que a operação inteira sabe.",
    },
    Alertas: {
      title: "Problema quando chega",
      headline: "O aviso é o próprio viveiro fora do padrão — tarde demais para ser alerta.",
    },
    Outra: {
      title: "Decisão no relato",
      headline: "Sem um lugar que una o que aconteceu, cada dia começa do zero.",
    },
  },
};

const ASK: Record<Track, Record<Pain, string>> = {
  ERP: {
    Produção: "Qual viveiro merece atenção hoje — e por quê?",
    Custos: "Onde o custo/kg mais pressiona os ciclos que o ERP já registrou?",
    Indicadores: "O que o ERP já sabe da fazenda que eu ainda não vejo de forma gerencial?",
    Comercial: "Qual cliente mais comprou — e de quais ciclos do ERP veio esse volume?",
    "Dados espalhados": "Se o ERP é a fonte, por que eu ainda monto a fazenda em outro lugar?",
    Alertas: "O que no ERP mudou ontem e ninguém foi avisado a tempo?",
    Outra: "Se eu tivesse a visão gerencial em cima do ERP, por onde eu começo hoje?",
  },
  Planilha: {
    Produção: "Qual viveiro está pior que o ciclo anterior — sem abrir três abas?",
    Custos: "Qual ciclo está comendo margem — e em qual arquivo isso aparece hoje?",
    Indicadores: "Quais indicadores mudam se eu abrir a planilha de ontem em vez da de hoje?",
    Comercial: "Quem comprou, de qual viveiro, em qual aba?",
    "Dados espalhados": "O que eu não estou vendo porque a informação está em lugares diferentes?",
    Alertas: "O que deveria ter ficado visível nesta planilha ontem?",
    Outra: "Se a fazenda não coubesse mais em arquivo, o que eu precisaria ver primeiro?",
  },
  BI: {
    Produção: "Qual viveiro foge do padrão — em linguagem de ciclo, não de gráfico?",
    Custos: "O custo que o BI mostra fecha com a despesca que o campo viveu?",
    Indicadores: "Quais sinais da fazenda estão fora do padrão neste período?",
    Comercial: "O volume do BI aponta de qual ciclo veio?",
    "Dados espalhados": "Por que o BI, o ERP e o campo ainda contam fazendas diferentes?",
    Alertas: "O que deveria ter me avisado ontem nesta fazenda?",
    Outra: "O que um Intelligence OS de carcinicultura me mostraria que o BI genérico não mostra?",
  },
  Outro: {
    Produção: "Se a equipe não estiver, como eu sei qual viveiro merece atenção?",
    Custos: "Onde o custo está hoje — além da cabeça de quem fechou o ciclo?",
    Indicadores: "Quais sinais da operação só existem na memória da equipe?",
    Comercial: "Quem comprou esta semana — e isso está em algum lugar além do WhatsApp?",
    "Dados espalhados": "O que eu não estou vendo porque a informação está em lugares diferentes?",
    Alertas: "O que deveria ter me avisado ontem — e ninguém registrou?",
    Outra: "Se eu tivesse uma única visão da operação, por onde eu começo hoje?",
  },
};

const THIS_WEEK: Record<Track, Record<Pain, string>> = {
  ERP: {
    Produção:
      "Parar de montar o quadro na mão. Abrir um cockpit sobre o ERP e perguntar qual viveiro merece atenção — com FCA, kg/ha e sobrevivência no mesmo recorte.",
    Custos:
      "Ler custo/kg junto do ciclo que o ERP já registrou. Não esperar o fechamento do mês para descobrir onde a margem apertou.",
    Indicadores:
      "Tirar o indicador do relatório e colocá-lo numa visão de fazenda: o que mudou, em qual viveiro, em qual ciclo.",
    Comercial:
      "Cruzar quem comprou com de onde veio. O ERP já tem as pontas — falta a leitura que as une.",
    "Dados espalhados":
      "Deixar o ERP ser o sistema operacional. O Farm entra como a camada que devolve a fazenda inteira, sem uma planilha paralela no meio.",
    Alertas:
      "Definir o que deveria avisar — viveiro, indicador, desvio — em vez de descobrir o problema no campo.",
    Outra:
      "Escolher um recorte gerencial único em cima do que o ERP já guarda, e decidir a semana a partir dele.",
  },
  Planilha: {
    Produção:
      "Parar de reconstruir produção em aba. Ver viveiros e ciclos num cockpit e perguntar o que hoje leva uma manhã para montar.",
    Custos:
      "Tirar o custo da versão do arquivo. Ler custo/kg no mesmo lugar da operação — para investigar, não só para fechar.",
    Indicadores:
      "Trocar o painel que depende de quem salvou por último por indicadores que se atualizam com a fazenda.",
    Comercial:
      "Colocar pedido e viveiro na mesma conversa. Volume, cliente e origem deixam de ser abas diferentes.",
    "Dados espalhados":
      "Nomear uma verdade só. Enquanto cada área defende o arquivo que tem, a fazenda não tem leitura — tem debate.",
    Alertas:
      "Sair da célula vermelha que ninguém abre. O sinal precisa chegar com contexto, não com sorte de planilha.",
    Outra:
      "Dar à fazenda um lugar que não seja arquivo. A planilha continua existindo; a decisão deixa de depender dela.",
  },
  BI: {
    Produção:
      "Especializar o recorte: do gráfico genérico para viveiro, ciclo e despesca. Aí o Ask Terus passa a responder o chão da fazenda.",
    Custos:
      "Pedir ao cockpit o custo que fecha com o ciclo — não o consolidado que não conversa com o campo.",
    Indicadores:
      "Trocar o dashboard amplo por um observatório de carcinicultura: FCA, kg/ha, sobrevivência, comercial no mesmo idioma.",
    Comercial:
      "Fazer o volume apontar origem. Cliente, ciclo e fazenda na mesma pergunta.",
    "Dados espalhados":
      "Admitir que o BI não fechou as fontes. O Farm conecta o que já existe e devolve uma leitura só.",
    Alertas:
      "Transformar indicador em aviso com dono: qual viveiro, qual sinal, por que agora.",
    Outra:
      "Sair da reunião que monta a prioridade na mão. Deixar a operação responder o que o BI já mediu, em linguagem de fazenda.",
  },
  Outro: {
    Produção:
      "Tirar o ranking de viveiros da conversa e colocá-lo num lugar que permanece — para a fazenda não depender de quem está no grupo.",
    Custos:
      "Registrar o custo onde ele possa ser comparado. Enquanto ele mora na cabeça, não há gestão — há relato.",
    Indicadores:
      "Começar pelo mínimo comparável: um lugar onde o sinal de ontem ainda exista amanhã.",
    Comercial:
      "Parar de deixar pedido só no WhatsApp. Quem comprou precisa encontrar o ciclo de onde veio.",
    "Dados espalhados":
      "Reunir o que hoje está em conversa, caderno e arquivo solto. Sem isso, cada pergunta recomeça do zero.",
    Alertas:
      "Não esperar o viveiro gritar. O primeiro passo é ter histórico — senão não existe alerta, existe susto.",
    Outra:
      "Dar à operação um ponto de partida gerencial. Depois aprofunda. Primeiro, a fazenda precisa existir num só lugar.",
  },
};

const HOP_CLOSE: Record<Track, string> = {
  ERP: "Hoje a fazenda se entende em vários lugares. O Terus Farm devolve isso em um cockpit — sem substituir o ERP.",
  Planilha:
    "Hoje a fazenda se reconstrói em arquivo. O Terus Farm devolve uma visão só — sem pedir que vocês virem um time de BI.",
  BI: "O BI já junta número. O Farm especializa a leitura para carcinicultura e deixa perguntar em cima da operação.",
  Outro: "Hoje a fazenda vive na conversa. O Farm é o lugar onde o que aconteceu permanece — e se deixa perguntar.",
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function firstNameFrom(name: string) {
  const part = name.trim().split(/\s+/)[0] || "Produtor";
  return part.charAt(0).toUpperCase() + part.slice(1);
}

function bandFor(score: number): { band: MaturityBand; label: string } {
  if (score < 40) return { band: "fragmentada", label: "Fragmentada" };
  if (score < 54) return { band: "construcao", label: "Em construção" };
  if (score < 68) return { band: "parcial", label: "Parcialmente conectada" };
  return { band: "pronta", label: "Pronta para inteligência" };
}

function axisLabel(score: number) {
  if (score < 36) return "Fraca";
  if (score < 52) return "Instável";
  if (score < 68) return "Parcial";
  return "Sólida";
}

function localNote(city: string) {
  const value = city.toLowerCase();
  if (/(aracati|jaguaribe|itaiópolis|itaiopolis)/i.test(value)) {
    return "Leitura feita no contexto do Festival do Camarão — Vale do Jaguaribe.";
  }
  if (/(fortaleza|aquiraz|cascavel|beberibe|icaraí|icarai)/i.test(value)) {
    return "Operação no Ceará: o Raio-X já chega com recorte regional para a conversa com o time.";
  }
  if (/(rio grande do norte|rn|areia branca|guamaré|macau|canguaretama)/i.test(value)) {
    return "Perfil lido para uma operação do RN — o próximo passo é aplicar o cockpit à sua escala.";
  }
  return null;
}

function archetype(ponds: Ponds, track: Track, pain: Pain) {
  const base = ARCHETYPE[track][pain];
  const largeSheet = track === "Planilha" && (ponds === "21–50" || ponds === "+50");
  return {
    title: largeSheet ? "Escala sem sistema" : base.title,
    headline: `${base.headline} ${SCALE_HOOK[ponds]}`,
  };
}

function reading(payload: DiagnosticPayload, firstName: string, farmName: string) {
  const scale = {
    "1–5": `${farmName} ainda cabe na cabeça de quem opera — e isso é exatamente o risco: o conhecimento não está no sistema, está nas pessoas.`,
    "6–20": `Com ${payload.ponds} viveiros, ${farmName} já não é uma operação que se entende “passando o olho”. Comparar ciclos vira trabalho, não pergunta.`,
    "21–50": `${farmName} está no ponto em que priorizar viveiros importa mais do que registrar mais um dado. Sem cockpit, a gestão vira fila de incêndio.`,
    "+50": `Em escala ${payload.ponds}, ${firstName}, o problema deixa de ser “ter dado”. Passa a ser saber o que ignorar hoje.`,
  }[payload.ponds];

  const track = {
    ERP: "O ERP cumpre o papel operacional — e não deveria ser cobrado por uma visão gerencial que ele não foi desenhado para entregar.",
    Planilha: "A planilha organiza o começo. Na carcinicultura, ela vira retrabalho, versão e atraso entre o campo e a decisão.",
    BI: "O BI já busca consolidar. Se a maior dor continua existindo, o recorte provavelmente não foi feito para ciclo, viveiro e despesca.",
    Outro: "WhatsApp, caderno e conversa guardam sinal. Não guardam histórico comparável nem alerta.",
  }[payload.cycleTracking];

  return `${scale} ${track}`;
}

function pressure(payload: DiagnosticPayload) {
  const map: Record<Pain, string> = {
    Produção:
      "A pressão está em entender produção com recorte de viveiro e ciclo — FCA, kg/ha e sobrevivência no mesmo contexto, não em relatórios separados.",
    Custos:
      "A pressão está no custo que não conversa com o ciclo. Sem essa ligação, ração, despesca e margem viram opinião.",
    Indicadores:
      "A pressão está em ter indicadores. O que falta é um único lugar onde eles se atualizem e se comparem.",
    Comercial:
      "A pressão está em vender sem ver de onde veio o camarão, para quem foi e como aquilo se relaciona com a fazenda.",
    "Dados espalhados":
      payload.cycleTracking === "ERP"
        ? "A pressão não é falta de informação. É o custo invisível de juntar o que o ERP guarda com planilha, conversa e relatório toda vez que alguém pergunta “como está a fazenda?”."
        : payload.cycleTracking === "BI"
          ? "A pressão não é falta de informação. É o custo invisível de conciliar BI, ERP, planilha de conferência e o que o campo conta — toda vez que alguém pergunta “como está a fazenda?”."
          : payload.cycleTracking === "Planilha"
            ? "A pressão não é falta de informação. É o custo invisível de juntar arquivos, conversa e relatório toda vez que alguém pergunta “como está a fazenda?”."
            : "A pressão não é falta de informação. É o custo invisível de juntar conversa, caderno e arquivo solto toda vez que alguém pergunta “como está a fazenda?”.",
    Alertas:
      "A pressão está no tempo. O sinal chega depois da perda de padrão — e a equipe investiga no escuro.",
    Outra:
      "A pressão é de visibilidade: enxergar a operação inteira sem montar o quadro de memória em memória.",
  };
  return map[payload.difficulty];
}

function blindSpots(payload: DiagnosticPayload) {
  const scaleSpot = {
    "1–5": {
      title: "Conhecimento preso nas pessoas",
      text: "Poucos viveiros escondem um risco clássico: se quem opera não está, a fazenda perde o fio da meada.",
    },
    "6–20": {
      title: "Comparação entre viveiros",
      text: "Nessa faixa, o valor está em ver qual viveiro foge do padrão — não em olhar cada um isolado.",
    },
    "21–50": {
      title: "Prioridade diluída",
      text: "Com dezenas de viveiros, sem ranking de atenção a gestão reage ao que grita mais alto, não ao que importa.",
    },
    "+50": {
      title: "Operação grande, visão lenta",
      text: "Escala exige recorte. Sem ele, reunião vira relato e decisão vira feeling.",
    },
  }[payload.ponds];

  const trackSpot = {
    ERP: {
      title: "Dado operacional ≠ leitura gerencial",
      text: "O Terus Farm não substitui o ERP. Ele lê o que o ERP guarda e devolve visão de fazenda: viveiros, ciclos, comercial e alertas.",
    },
    Planilha: {
      title: "A versão certa nunca é óbvia",
      text: "Duas planilhas, dois FCAs. A discussão vira “qual arquivo?” em vez de “qual viveiro?”.",
    },
    BI: {
      title: "Indicador fora do chão da fazenda",
      text: "Um BI amplo raramente fala a língua do ciclo. O cockpit do Farm existe para isso.",
    },
    Outro: {
      title: "Sinal que evapora",
      text: "O que foi dito no grupo ontem não vira série histórica amanhã. Sem histórico, não há inteligência.",
    },
  }[payload.cycleTracking];

  const painSpot: Record<Pain, { title: string; text: string }> = {
    Produção: {
      title: "FCA sem contexto de ciclo",
      text: "Ver FCA isolado não diz se o viveiro piorou, se o lote é outro ou se a sobrevivência compensou. O cockpit cruza esses sinais.",
    },
    Custos: {
      title: "Custo/kg desligado da despesca",
      text: "Custo só vira gestão quando anda junto de produção, ração e ciclo — não quando fecha no fim do mês.",
    },
    Indicadores: {
      title: "Métrica sem dono de decisão",
      text: "Indicador que não aponta o próximo viveiro a investigar vira painel bonito e reunião longa.",
    },
    Comercial: {
      title: "Cliente sem ligação com o viveiro",
      text: "Quem mais comprou, de qual ciclo, com qual resultado de fazenda: isso raramente vive no mesmo lugar.",
    },
    "Dados espalhados": {
      title: "A fazenda não tem uma verdade só",
      text: "Enquanto as fontes não se encontram, cada área defende o número que tem na mão.",
    },
    Alertas: {
      title: "Anomalia sem dono",
      text: "Alerta útil aponta o viveiro, o indicador e o porquê. Barulho genérico só cansa a equipe.",
    },
    Outra: {
      title: "Decisão sem trilha",
      text: "Sem um lugar que una o que aconteceu na fazenda, cada decisão começa do zero.",
    },
  };

  return [scaleSpot, trackSpot, painSpot[payload.difficulty]];
}

function unlock(payload: DiagnosticPayload) {
  const base = [
    {
      module: "Cockpit",
      value: "Uma visão da fazenda — produção, viveiros, ciclos e comercial no mesmo recorte.",
    },
    {
      module: "Ask Terus",
      value: "Perguntas em linguagem simples sobre os dados disponíveis da operação — consultor, não chatbot.",
    },
  ];

  const extra: Record<Pain, { module: string; value: string }> = {
    Produção: {
      module: "Viveiros e ciclos",
      value: "Comparar viveiros ativos, ciclos em andamento e sinais de FCA, kg/ha e sobrevivência.",
    },
    Custos: {
      module: "Custo e financeiro",
      value: "Ler custo/kg junto da operação — para investigar, não só para fechar relatório.",
    },
    Indicadores: {
      module: "Observatório",
      value: "Indicadores pensados para carcinicultura, não um dashboard genérico de BI.",
    },
    Comercial: {
      module: "Clientes e comercial",
      value: "Volume, clientes e fazenda na mesma conversa — quem comprou, de onde veio.",
    },
    "Dados espalhados": {
      module: "Camada de conexão",
      value: "O Farm se apoia no que a fazenda já registra e entrega uma leitura só — sem pedir um time de BI.",
    },
    Alertas: {
      module: "Alertas e anomalias",
      value: "Sinais para investigar o que saiu do padrão — com contexto, não com susto.",
    },
    Outra: {
      module: "Visão geral",
      value: "Um ponto de partida gerencial para enxergar a fazenda inteira antes de aprofundar.",
    },
  };

  return [...base, extra[payload.difficulty]];
}

function askQuestion(payload: DiagnosticPayload) {
  if (payload.ponds === "+50" && payload.difficulty === "Produção") {
    return "Se eu só puder olhar 5 viveiros hoje, quais são — e com qual critério?";
  }
  if (payload.ponds === "1–5" && payload.cycleTracking === "Outro") {
    return "Se quem opera não estiver amanhã, o que a fazenda ainda sabe sobre si mesma?";
  }
  return ASK[payload.cycleTracking][payload.difficulty];
}

function nextMove(payload: DiagnosticPayload, farmName: string) {
  if (payload.cycleTracking === "ERP") {
    return `O próximo passo de ${farmName} não é trocar o ERP. É colocar uma camada de inteligência sobre ele e ver a fazenda inteira.`;
  }
  if (payload.cycleTracking === "Planilha") {
    return `O próximo passo é parar de reconstruir a fazenda em arquivo. Ver ${farmName} em um cockpit — e perguntar ao Ask Terus o que hoje leva horas para montar.`;
  }
  if (payload.cycleTracking === "BI") {
    return `O próximo passo é especializar a leitura: do BI genérico para um Intelligence OS de carcinicultura, com Ask Terus em cima da operação.`;
  }
  return `O próximo passo é tirar a operação da conversa solta e dar a ${farmName} um lugar onde dado vire decisão.`;
}

export function computeMaturity(
  payload: Pick<DiagnosticPayload, "ponds" | "cycleTracking" | "difficulty">,
): MaturityBreakdown {
  const capture = CAPTURE[payload.cycleTracking];
  const connection = clamp(capture - SCALE_DRAG[payload.ponds] + (payload.cycleTracking === "BI" ? 4 : 0), 18, 84);
  const decision = clamp(
    DECISION_BASE[payload.difficulty] + (payload.cycleTracking === "ERP" || payload.cycleTracking === "BI" ? 8 : 0),
    18,
    80,
  );
  const score = clamp(capture * 0.34 + connection * 0.28 + decision * 0.38, 24, 82);
  const { band, label } = bandFor(score);
  return {
    score,
    band,
    label,
    axes: {
      capture: { score: capture, label: axisLabel(capture) },
      connection: { score: connection, label: axisLabel(connection) },
      decision: { score: decision, label: axisLabel(decision) },
    },
  };
}

export function buildRaioxReport(payload: DiagnosticPayload, options?: { uniqueSuffix?: string }): DiagnosticReport {
  const maturity = computeMaturity(payload);
  const firstName = firstNameFrom(payload.name);
  const farmName = payload.farm.trim();
  const profileCode = buildProfileCode(payload.ponds, payload.cycleTracking, payload.difficulty);
  const diagnosticId = buildDiagnosticId(profileCode, options?.uniqueSuffix);
  const profile = archetype(payload.ponds, payload.cycleTracking, payload.difficulty);
  const hops = HOPS[payload.cycleTracking];
  const note = localNote(payload.city);
  const week = THIS_WEEK[payload.cycleTracking][payload.difficulty];
  const whatsapp = buildRaioxWhatsAppUrls({
    diagnosticId,
    farmName,
    city: payload.city.trim(),
    profileName: profile.title,
    maturityScore: maturity.score,
    maturityLabel: maturity.label,
    mainPain: payload.difficulty,
  });

  return {
    id: diagnosticId,
    profileCode,
    diagnosticId,
    firstName,
    farmName,
    city: payload.city.trim(),
    ponds: payload.ponds,
    cycleTracking: payload.cycleTracking,
    difficulty: payload.difficulty,
    archetype: profile,
    maturity,
    reading: reading(payload, firstName, farmName),
    pressure: pressure(payload),
    hops,
    hopClose: HOP_CLOSE[payload.cycleTracking],
    blindSpots: blindSpots(payload),
    unlock: unlock(payload),
    actionPlan: buildActionPlan(payload),
    farmEntry: buildFarmEntry(payload),
    askQuestion: askQuestion(payload),
    thisWeek: week,
    nextMove: nextMove(payload, farmName),
    nextStep: buildNextStepCopy(farmName, payload.cycleTracking),
    localNote: note,
    shareUrl: SITE.url,
    whatsappUrl: whatsapp.demo,
    whatsappDemoUrl: whatsapp.demo,
    whatsappSendUrl: whatsapp.send,
    whatsappTalkUrl: whatsapp.talk,
  };
}
