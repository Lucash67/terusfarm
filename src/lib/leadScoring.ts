import type { DiagnosticPayload } from "./diagnostic";

export type LeadClass = "A" | "B" | "C";

export type LeadFlag =
  | "large_operation"
  | "erp_user"
  | "bi_user"
  | "spreadsheet_dependency"
  | "fragmented_data"
  | "production_pain"
  | "cost_pain"
  | "alert_pain"
  | "commercial_pain"
  | "indicator_pain"
  | "high_intent"
  | "demo_requested"
  | "whatsapp_requested"
  | "completed_raiox";

export type LeadActions = {
  completed: boolean;
  demoClicked: boolean;
  whatsappClicked: boolean;
};

export type LeadScoreInput = Pick<DiagnosticPayload, "ponds" | "cycleTracking" | "difficulty"> &
  Partial<LeadActions>;

export type LeadScoreResult = {
  leadPriorityScore: number;
  leadClass: LeadClass;
  flags: LeadFlag[];
  parts: {
    scale: number;
    system: number;
    pain: number;
    actions: number;
  };
};

const SCALE_POINTS: Record<DiagnosticPayload["ponds"], number> = {
  "1–5": 10,
  "6–20": 20,
  "21–50": 30,
  "+50": 40,
};

const SYSTEM_POINTS: Record<DiagnosticPayload["cycleTracking"], number> = {
  ERP: 20,
  BI: 20,
  Planilha: 15,
  Outro: 10,
};

const PAIN_POINTS: Record<DiagnosticPayload["difficulty"], number> = {
  "Dados espalhados": 20,
  Indicadores: 18,
  Produção: 18,
  Custos: 18,
  Alertas: 16,
  Comercial: 14,
  Outra: 10,
};

const ACTION_POINTS = {
  completed: 10,
  demo: 15,
  whatsapp: 10,
} as const;

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function classifyLead(score: number): LeadClass {
  if (score >= 80) return "A";
  if (score >= 55) return "B";
  return "C";
}

export function buildLeadFlags(
  input: LeadScoreInput,
  score: number,
  actions: LeadActions,
): LeadFlag[] {
  const flags: LeadFlag[] = [];

  if (input.ponds === "21–50" || input.ponds === "+50") flags.push("large_operation");
  if (input.cycleTracking === "ERP") flags.push("erp_user");
  if (input.cycleTracking === "BI") flags.push("bi_user");
  if (input.cycleTracking === "Planilha") flags.push("spreadsheet_dependency");
  if (input.difficulty === "Dados espalhados" || input.cycleTracking === "Outro") {
    flags.push("fragmented_data");
  }
  if (input.difficulty === "Produção") flags.push("production_pain");
  if (input.difficulty === "Custos") flags.push("cost_pain");
  if (input.difficulty === "Alertas") flags.push("alert_pain");
  if (input.difficulty === "Comercial") flags.push("commercial_pain");
  if (input.difficulty === "Indicadores") flags.push("indicator_pain");
  if (actions.completed) flags.push("completed_raiox");
  if (actions.demoClicked) flags.push("demo_requested");
  if (actions.whatsappClicked) flags.push("whatsapp_requested");
  if (score >= 80 || actions.demoClicked) flags.push("high_intent");

  return flags;
}

export function scoreLead(input: LeadScoreInput): LeadScoreResult {
  const actions: LeadActions = {
    completed: Boolean(input.completed),
    demoClicked: Boolean(input.demoClicked),
    whatsappClicked: Boolean(input.whatsappClicked),
  };

  const scale = SCALE_POINTS[input.ponds];
  const system = SYSTEM_POINTS[input.cycleTracking];
  const pain = PAIN_POINTS[input.difficulty];
  const actionTotal =
    (actions.completed ? ACTION_POINTS.completed : 0) +
    (actions.demoClicked ? ACTION_POINTS.demo : 0) +
    (actions.whatsappClicked ? ACTION_POINTS.whatsapp : 0);

  const leadPriorityScore = clampScore(scale + system + pain + actionTotal);
  const leadClass = classifyLead(leadPriorityScore);

  return {
    leadPriorityScore,
    leadClass,
    flags: buildLeadFlags(input, leadPriorityScore, actions),
    parts: { scale, system, pain, actions: actionTotal },
  };
}

export function applyLeadAction(
  current: LeadScoreResult,
  answers: LeadScoreInput,
  action: "demo" | "whatsapp",
): LeadScoreResult {
  return scoreLead({
    ponds: answers.ponds,
    cycleTracking: answers.cycleTracking,
    difficulty: answers.difficulty,
    completed: true,
    demoClicked: action === "demo" || current.flags.includes("demo_requested"),
    whatsappClicked: action === "whatsapp" || current.flags.includes("whatsapp_requested"),
  });
}
