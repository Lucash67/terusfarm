import { z } from "zod";

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

export type DiagnosticResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Ponto único de submit. Trocar o corpo desta função quando a API/CRM existir.
 */
export async function submitFarmDiagnostic(
  payload: DiagnosticPayload,
): Promise<DiagnosticResult> {
  if (process.env.NODE_ENV !== "production") {
    console.info("[raio-x] payload", payload);
  }

  const endpoint = process.env.NEXT_PUBLIC_DIAGNOSTIC_ENDPOINT;

  if (!endpoint) {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return { ok: true };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "terus-farm-landing",
        event: "Festival do Camarão · Aracati 2026",
        ...payload,
      }),
    });

    if (!response.ok) {
      return { ok: false, error: "Não foi possível enviar agora. Tente novamente." };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Falha de conexão. Tente novamente." };
  }
}
