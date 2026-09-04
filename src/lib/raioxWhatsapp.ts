import { buildWhatsAppUrl } from "@/config/contact";

export type RaioxWhatsAppIntent = "demo" | "send" | "talk";

export type RaioxWhatsAppInput = {
  diagnosticId: string;
  farmName: string;
  city: string;
  profileName: string;
  maturityScore: number;
  maturityLabel: string;
  mainPain: string;
};

export function buildRaioxWhatsAppMessage(
  input: RaioxWhatsAppInput,
  intent: RaioxWhatsAppIntent = "demo",
) {
  const body = [
    "Olá! Fiz o Raio-X da minha fazenda pelo Terus Farm.",
    "",
    `Fazenda: ${input.farmName}`,
    `Cidade: ${input.city}`,
    `Perfil: ${input.profileName}`,
    `Maturidade: ${input.maturityScore}/100 (${input.maturityLabel})`,
    `Principal desafio: ${input.mainPain}`,
    `ID do diagnóstico: ${input.diagnosticId}`,
    "",
    "Tenho interesse em entender como o Terus Farm poderia ser aplicado à minha operação.",
  ];

  if (intent === "demo") {
    body.push("", "Quero uma demonstração.");
  } else if (intent === "send") {
    body.push("", "Segue o Raio-X para o time da Terus.");
  } else {
    body.push("", "Quero falar agora com o time.");
  }

  return body.join("\n");
}

export function buildRaioxWhatsAppUrl(input: RaioxWhatsAppInput, intent: RaioxWhatsAppIntent = "demo") {
  return buildWhatsAppUrl(buildRaioxWhatsAppMessage(input, intent));
}

export function buildRaioxWhatsAppUrls(input: RaioxWhatsAppInput) {
  return {
    demo: buildRaioxWhatsAppUrl(input, "demo"),
    send: buildRaioxWhatsAppUrl(input, "send"),
    talk: buildRaioxWhatsAppUrl(input, "talk"),
  };
}
