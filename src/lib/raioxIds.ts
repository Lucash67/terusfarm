import type { DiagnosticPayload } from "./diagnostic";

const POND_CODE = { "1–5": "A", "6–20": "B", "21–50": "C", "+50": "D" } as const;
const TRACK_CODE = { ERP: "ER", Planilha: "PL", BI: "BI", Outro: "OT" } as const;
const PAIN_CODE = {
  Produção: "PR",
  Custos: "CU",
  Indicadores: "IN",
  Comercial: "CO",
  "Dados espalhados": "DS",
  Alertas: "AL",
  Outra: "OU",
} as const;

/** Alphabet without ambiguous 0/O/1/I. */
export const DIAGNOSTIC_ID_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function buildProfileCode(
  ponds: DiagnosticPayload["ponds"],
  cycleTracking: DiagnosticPayload["cycleTracking"],
  difficulty: DiagnosticPayload["difficulty"],
) {
  return `RX-${POND_CODE[ponds]}${TRACK_CODE[cycleTracking]}-${PAIN_CODE[difficulty]}`;
}

export function createUniqueSuffix(bytes?: Uint8Array) {
  const alphabet = DIAGNOSTIC_ID_ALPHABET;
  const data =
    bytes ??
    (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function"
      ? crypto.getRandomValues(new Uint8Array(4))
      : Uint8Array.from({ length: 4 }, (_, index) => (Date.now() + index * 17) % 256));
  return Array.from(data, (value) => alphabet[value % alphabet.length]).join("");
}

export function buildDiagnosticId(profileCode: string, suffix?: string) {
  return `${profileCode}-${suffix ?? createUniqueSuffix()}`;
}

export function parseProfileCodeFromId(diagnosticId: string) {
  const parts = diagnosticId.split("-");
  if (parts.length < 3) return diagnosticId;
  return parts.slice(0, 3).join("-");
}
