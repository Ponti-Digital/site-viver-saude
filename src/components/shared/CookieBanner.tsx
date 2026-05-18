"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  buildConsent,
  dispatchConsentChange,
  purposesFromConsent,
  readConsent,
  writeConsent,
  type ConsentCategory,
  type ConsentState,
} from "@/lib/utils/cookie-consent";

const CONSENT_TEXT =
  "Utilizamos cookies essenciais para o funcionamento do site e, mediante seu consentimento, cookies de análise e marketing. Saiba mais na nossa Política de Cookies.";

async function logConsent(state: ConsentState, action: "granted" | "rejected") {
  try {
    await fetch("/api/lgpd/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "cookie-banner",
        purposes: purposesFromConsent(state),
        consent_text: CONSENT_TEXT,
        action,
        page_url: typeof window !== "undefined" ? window.location.href : null,
      }),
    });
  } catch {
    // Silent: registro de consentimento não bloqueia UX
  }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const open = useCallback(() => {
    const current = readConsent();
    if (current) {
      setAnalytics(current.categories.analytics);
      setMarketing(current.categories.marketing);
      setShowCustomize(true);
    }
    setVisible(true);
  }, []);

  useEffect(() => {
    // Hydration: leitura de cookie só funciona no cliente.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (readConsent() === null) setVisible(true);
    const handler = () => open();
    window.addEventListener("vs:consent-open", handler);
    return () => window.removeEventListener("vs:consent-open", handler);
  }, [open]);

  if (!visible) return null;

  const finish = (state: ConsentState, action: "granted" | "rejected") => {
    writeConsent(state);
    dispatchConsentChange(state);
    void logConsent(state, action);
    setVisible(false);
    setShowCustomize(false);
  };

  const acceptAll = () => {
    finish(buildConsent({ analytics: true, marketing: true }), "granted");
  };

  const rejectAll = () => {
    finish(buildConsent({ analytics: false, marketing: false }), "rejected");
  };

  const saveCustom = () => {
    const state = buildConsent({ analytics, marketing });
    const action = analytics || marketing ? "granted" : "rejected";
    finish(state, action);
  };

  const toggle = (cat: Exclude<ConsentCategory, "essential">, value: boolean) => {
    if (cat === "analytics") setAnalytics(value);
    if (cat === "marketing") setMarketing(value);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-50 p-4 md:p-6"
    >
      <div className="max-w-5xl mx-auto bg-white border border-border shadow-2xl rounded-2xl overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-12 h-12 bg-primary/10 rounded-xl items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-foreground mb-2">
                Sua privacidade é importante
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                {CONSENT_TEXT}{" "}
                <Link
                  href="/politica-de-cookies"
                  className="text-primary hover:underline font-medium"
                >
                  Política de Cookies
                </Link>{" "}
                ·{" "}
                <Link
                  href="/politica-de-privacidade"
                  className="text-primary hover:underline font-medium"
                >
                  Política de Privacidade
                </Link>
              </p>
            </div>
          </div>

          {showCustomize && (
            <div className="mt-6 space-y-3 border-t border-border pt-6">
              <CookieToggle
                label="Cookies essenciais"
                description="Necessários para o funcionamento do site. Sempre ativos."
                checked
                disabled
                onChange={() => {}}
              />
              <CookieToggle
                label="Cookies de análise"
                description="Ajudam-nos a entender como o site é utilizado para melhorar a experiência."
                checked={analytics}
                onChange={(v) => toggle("analytics", v)}
              />
              <CookieToggle
                label="Cookies de marketing"
                description="Permitem mensurar campanhas e exibir comunicações mais relevantes."
                checked={marketing}
                onChange={(v) => toggle("marketing", v)}
              />
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
            {!showCustomize ? (
              <>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setShowCustomize(true)}
                  className="sm:order-1"
                >
                  Personalizar
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={rejectAll}
                  className="sm:order-2"
                >
                  Rejeitar não-essenciais
                </Button>
                <Button variant="primary" size="md" onClick={acceptAll} className="sm:order-3">
                  Aceitar todos
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="md" onClick={() => setShowCustomize(false)}>
                  Voltar
                </Button>
                <Button variant="primary" size="md" onClick={saveCustom}>
                  Salvar preferências
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface CookieToggleProps {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}

function CookieToggle({ label, description, checked, disabled, onChange }: CookieToggleProps) {
  return (
    <label
      className={
        "flex items-start gap-3 p-3 rounded-lg border border-border " +
        (disabled ? "bg-gray-50" : "hover:bg-gray-50 cursor-pointer")
      }
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 w-4 h-4 accent-primary cursor-pointer disabled:cursor-not-allowed"
      />
      <div className="flex-1">
        <div className="font-semibold text-sm text-foreground">{label}</div>
        <p className="text-xs text-muted leading-relaxed mt-0.5">{description}</p>
      </div>
    </label>
  );
}
