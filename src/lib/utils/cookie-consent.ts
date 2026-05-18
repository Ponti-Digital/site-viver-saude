export const CONSENT_COOKIE_NAME = "vs_consent";
export const CONSENT_VERSION = "1.0";

export type ConsentCategory = "essential" | "analytics" | "marketing";

export interface ConsentState {
  version: string;
  timestamp: string;
  categories: Record<ConsentCategory, boolean>;
}

export const DEFAULT_CONSENT: ConsentState = {
  version: CONSENT_VERSION,
  timestamp: "",
  categories: {
    essential: true,
    analytics: false,
    marketing: false,
  },
};

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function readConsent(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + CONSENT_COOKIE_NAME + "=([^;]*)")
  );
  if (!match) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1])) as ConsentState;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(state: ConsentState) {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(JSON.stringify(state));
  document.cookie =
    CONSENT_COOKIE_NAME +
    "=" +
    value +
    "; path=/; max-age=" +
    COOKIE_MAX_AGE +
    "; SameSite=Lax";
}

export function buildConsent(
  categories: Partial<Record<ConsentCategory, boolean>>
): ConsentState {
  return {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    categories: {
      essential: true,
      analytics: categories.analytics ?? false,
      marketing: categories.marketing ?? false,
    },
  };
}

export function purposesFromConsent(state: ConsentState): string[] {
  const out: string[] = ["essential"];
  if (state.categories.analytics) out.push("analytics");
  if (state.categories.marketing) out.push("marketing");
  return out;
}

export function dispatchConsentChange(state: ConsentState) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("vs:consent-change", { detail: state }));
}

export function openConsentManager() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("vs:consent-open"));
}
