"use client";

import Script from "next/script";
import { useEffect } from "react";
import { readConsent, type ConsentState } from "@/lib/utils/cookie-consent";

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-E79JMQ0TDK";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Google Analytics 4 com Consent Mode v2.
 *
 * Conforme a Política de Cookies, os cookies de análise (_ga) só podem ser
 * gravados após consentimento. Por isso o consentimento padrão é `denied`:
 * o gtag carrega mas só envia pings sem cookies até o usuário aceitar a
 * categoria "análise" no CookieBanner. A atualização é reativa via o evento
 * `vs:consent-change` disparado por dispatchConsentChange().
 */
export function GoogleAnalytics() {
  useEffect(() => {
    const apply = (state: ConsentState | null) => {
      if (typeof window.gtag !== "function") return;
      const analytics = state?.categories.analytics ? "granted" : "denied";
      const marketing = state?.categories.marketing ? "granted" : "denied";
      window.gtag("consent", "update", {
        analytics_storage: analytics,
        ad_storage: marketing,
        ad_user_data: marketing,
        ad_personalization: marketing,
      });
    };

    // Aplica o consentimento já armazenado (visitantes recorrentes).
    apply(readConsent());

    const handler = (event: Event) => {
      apply((event as CustomEvent<ConsentState>).detail);
    };
    window.addEventListener("vs:consent-change", handler);
    return () => window.removeEventListener("vs:consent-change", handler);
  }, []);

  return (
    <>
      <Script id="ga-consent-default" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <Script
        id="ga-lib"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
