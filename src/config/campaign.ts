export const CAMPAIGN = {
  defaultSource: "festival-camarao-aracati-2026",
  page: "terusfarm",
} as const;

export type CampaignAttribution = {
  campaign: string;
  page: string;
  utmSource: string | null;
  utmCampaign: string | null;
  source: string | null;
};

function firstParam(search: string, key: string) {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const value = params.get(key)?.trim();
  return value ? value.slice(0, 80) : null;
}

export function readCampaignAttribution(search = ""): CampaignAttribution {
  return {
    campaign: firstParam(search, "utm_campaign") || CAMPAIGN.defaultSource,
    page: CAMPAIGN.page,
    utmSource: firstParam(search, "utm_source"),
    utmCampaign: firstParam(search, "utm_campaign"),
    source: firstParam(search, "source"),
  };
}
