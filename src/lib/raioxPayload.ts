import type { CampaignAttribution } from "@/config/campaign";
import { CAMPAIGN } from "@/config/campaign";

import type { DiagnosticPayload } from "./diagnostic";
import type { LeadScoreResult } from "./leadScoring";
import type { DiagnosticReport } from "./raiox";

export type DiagnosticCrmPayload = {
  diagnosticId: string;
  profileCode: string;
  profileName: string;
  answers: {
    ponds: DiagnosticPayload["ponds"];
    managementSystem: DiagnosticPayload["cycleTracking"];
    mainPain: DiagnosticPayload["difficulty"];
  };
  contact: {
    name: string;
    farmName: string;
    phone: string;
    city: string;
    email: string;
  };
  maturity: {
    score: number;
    level: string;
    capture: number;
    connection: number;
    decisionSpeed: number;
  };
  diagnosis: {
    headline: string;
    reading: string;
    blindSpots: string[];
    recommendedModules: string[];
    askTerusQuestion: string;
    actionPlan: { rank: number; title: string; modules: string[] }[];
  };
  commercial: {
    leadPriorityScore: number;
    leadClass: LeadScoreResult["leadClass"];
    flags: LeadScoreResult["flags"];
  };
  source: {
    campaign: string;
    page: string;
    utmSource: string | null;
    utmCampaign: string | null;
    touch: string | null;
  };
  intent: "complete" | "demo" | "whatsapp" | "share";
  createdAt: string;
};

export function buildDiagnosticCrmPayload(input: {
  answers: DiagnosticPayload;
  report: DiagnosticReport;
  commercial: LeadScoreResult;
  source?: CampaignAttribution;
  intent?: DiagnosticCrmPayload["intent"];
  createdAt?: string;
}): DiagnosticCrmPayload {
  const source = input.source ?? {
    campaign: CAMPAIGN.defaultSource,
    page: CAMPAIGN.page,
    utmSource: null,
    utmCampaign: null,
    source: null,
  };

  return {
    diagnosticId: input.report.diagnosticId,
    profileCode: input.report.profileCode,
    profileName: input.report.archetype.title,
    answers: {
      ponds: input.answers.ponds,
      managementSystem: input.answers.cycleTracking,
      mainPain: input.answers.difficulty,
    },
    contact: {
      name: input.answers.name.trim(),
      farmName: input.answers.farm.trim(),
      phone: input.answers.whatsapp.trim(),
      city: input.answers.city.trim(),
      email: (input.answers.email || "").trim(),
    },
    maturity: {
      score: input.report.maturity.score,
      level: input.report.maturity.label,
      capture: input.report.maturity.axes.capture.score,
      connection: input.report.maturity.axes.connection.score,
      decisionSpeed: input.report.maturity.axes.decision.score,
    },
    diagnosis: {
      headline: input.report.archetype.headline,
      reading: input.report.reading,
      blindSpots: input.report.blindSpots.map((spot) => spot.title),
      recommendedModules: input.report.unlock.map((item) => item.module),
      askTerusQuestion: input.report.askQuestion,
      actionPlan: input.report.actionPlan.map((item) => ({
        rank: item.rank,
        title: item.title,
        modules: item.modules,
      })),
    },
    commercial: {
      leadPriorityScore: input.commercial.leadPriorityScore,
      leadClass: input.commercial.leadClass,
      flags: input.commercial.flags,
    },
    source: {
      campaign: source.campaign,
      page: source.page,
      utmSource: source.utmSource,
      utmCampaign: source.utmCampaign,
      touch: source.source,
    },
    intent: input.intent ?? "complete",
    createdAt: input.createdAt ?? new Date().toISOString(),
  };
}
