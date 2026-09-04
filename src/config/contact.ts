const DEFAULT_WHATSAPP_NUMBER = "558596290044";

const DEFAULT_EVENT_MESSAGE =
  "Olá! Conheci a Terus Farm no Festival do Camarão em Aracati e quero entender como aplicar o Intelligence OS na minha fazenda.";

const DEFAULT_DEMO_MESSAGE =
  "Olá! Quero agendar uma demonstração do Terus Farm para a minha operação de carcinicultura.";

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export const contact = {
  whatsappNumber: digitsOnly(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER,
  ),
  whatsappMessage:
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || DEFAULT_EVENT_MESSAGE,
  demoMessage:
    process.env.NEXT_PUBLIC_WHATSAPP_DEMO_MESSAGE || DEFAULT_DEMO_MESSAGE,
  demoUrl: process.env.NEXT_PUBLIC_DEMO_URL || "",
} as const;

export function buildWhatsAppUrl(message = contact.whatsappMessage) {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const whatsappUrl = buildWhatsAppUrl(contact.whatsappMessage);
export const demoWhatsappUrl = buildWhatsAppUrl(contact.demoMessage);

export function getDemoHref() {
  return contact.demoUrl || demoWhatsappUrl;
}
