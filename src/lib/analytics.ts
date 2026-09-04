export type AnalyticsEvent =
  | "hero_cta_click"
  | "raiox_start"
  | "raiox_complete"
  | "whatsapp_click"
  | "demo_click"
  | "ask_terus_cta_click"
  | "aquafarm_case_view"
  | "diagnostic_result_view"
  | "diagnostic_action_plan_view"
  | "diagnostic_share"
  | "diagnostic_download"
  | "diagnostic_demo_click"
  | "diagnostic_whatsapp_click";

type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

/**
 * Interface de tracking pronta para GA/Meta/CRM.
 * Sem dependência externa até o analytics ser configurado.
 */
export function track(event: AnalyticsEvent, payload?: AnalyticsPayload) {
  if (typeof window === "undefined") return;

  const detail = { event, payload, at: Date.now() };

  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", detail);
  }

  window.dispatchEvent(new CustomEvent("terus:analytics", { detail }));

  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") {
    gtag("event", event, payload);
  }
}
