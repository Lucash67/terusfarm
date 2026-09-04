import { z } from "zod";

import type { CampaignAttribution } from "@/config/campaign";

import type { LeadScoreResult } from "./leadScoring";
import type { DiagnosticReport } from "./raiox";
import { buildDiagnosticCrmPayload } from "./raioxPayload";

export const pondOptions = ["1–5", "6–20", "21–50", "+50"] as const;
export const cycleOptions = ["ERP", "Planilha", "BI", "Outro"] as const;
export const difficultyOptions = [
  "Produção",
  "Custos",
  "Indicadores",
  "Comercial",
  "Dados espalhados",
  "Alertas",
  "Outra",
] as const;

export const diagnosticSchema = z.object({
  ponds: z.enum(pondOptions),
  cycleTracking: z.enum(cycleOptions),
  difficulty: z.enum(difficultyOptions),
  name: z.string().trim().min(2, "Informe seu nome completo."),
  farm: z.string().trim().min(2, "Informe o nome da fazenda ou empresa."),
  whatsapp: z
    .string()
    .trim()
    .min(10, "Informe um WhatsApp válido.")
    .regex(/^[\d\s()+-]{10,20}$/, "Informe um WhatsApp válido."),
  city: z.string().trim().min(2, "Informe a cidade."),
  email: z
    .string()
    .trim()
    .email("Informe um e-mail válido.")
    .optional()
    .or(z.literal("")),
});

export type DiagnosticPayload = z.infer<typeof diagnosticSchema>;

export type DiagnosticSubmitResult =
  | { ok: true }
  | { ok: false; error: string };

export type DiagnosticSubmitInput = {
  answers: DiagnosticPayload;
  report: DiagnosticReport;
  commercial: LeadScoreResult;
  source?: CampaignAttribution;
  intent?: "complete" | "demo" | "whatsapp" | "share";
};

/**
 * Ponto único de submit. Trocar o corpo desta função quando a API/CRM existir.
 */
export async function submitFarmDiagnostic(input: DiagnosticSubmitInput): Promise<DiagnosticSubmitResult> {
  const crmPayload = buildDiagnosticCrmPayload(input);

  if (process.env.NODE_ENV !== "production") {
    console.info("[raio-x] crm", {
      diagnosticId: crmPayload.diagnosticId,
      profileCode: crmPayload.profileCode,
      leadClass: crmPayload.commercial.leadClass,
      intent: crmPayload.intent,
    });
  }

  const endpoint = process.env.NEXT_PUBLIC_DIAGNOSTIC_ENDPOINT;

  if (!endpoint) {
    await new Promise((resolve) => setTimeout(resolve, input.intent === "complete" ? 400 : 0));
    return { ok: true };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(crmPayload),
    });

    if (!response.ok) {
      return { ok: false, error: "Não foi possível enviar agora. Tente novamente." };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Falha de conexão. Tente novamente." };
  }
}
