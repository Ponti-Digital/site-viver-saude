"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatPhone } from "@/lib/utils/phone-mask";
import { resolveUtm } from "@/lib/utils/utm";
import { LGPD } from "@/lib/constants/site";

const CONSENT_TEXT =
  "Autorizo o tratamento dos meus dados pessoais para inscrição no programa de saúde, contato pela equipe Viver Saúde e acompanhamento da minha participação. Estou ciente de que dados de saúde são sensíveis (LGPD, art. 11) e recebem proteção reforçada.";

interface FormState {
  name: string;
  whatsapp: string;
  email: string;
  consent: boolean;
}

interface FormErrors {
  name?: string;
  whatsapp?: string;
  email?: string;
  consent?: string;
}

interface ProgramRegistrationModalProps {
  programName: string;
  isOpen: boolean;
  onClose: () => void;
}

function validateForm(data: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = "Informe seu nome completo";
  }

  const digits = data.whatsapp.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 11) {
    errors.whatsapp = "Informe um WhatsApp válido";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = "Informe um e-mail válido";
  }

  if (!data.consent) {
    errors.consent = "É necessário autorizar o tratamento dos dados.";
  }

  return errors;
}

export function ProgramRegistrationModal({
  programName,
  isOpen,
  onClose,
}: ProgramRegistrationModalProps) {
  const [form, setForm] = useState<FormState>({ name: "", whatsapp: "", email: "", consent: false });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [renderedAt, setRenderedAt] = useState<number>(0);

  useEffect(() => {
    setRenderedAt(Date.now());
  }, []);

  // Reset form when modal opens for a different program
  useEffect(() => {
    if (isOpen) {
      setForm({ name: "", whatsapp: "", email: "", consent: false });
      setErrors({});
      setSubmitError(null);
      setIsSubmitted(false);
      setRenderedAt(Date.now());
    }
  }, [isOpen, programName]);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setForm((prev) => ({ ...prev, whatsapp: formatted }));
    if (errors.whatsapp) setErrors((prev) => ({ ...prev, whatsapp: undefined }));
  };

  const handleFieldChange =
    (field: "name" | "whatsapp" | "email") => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, consent: e.target.checked }));
    if (errors.consent) setErrors((prev) => ({ ...prev, consent: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const utm = resolveUtm();
      const payload = {
        name: form.name.trim(),
        phone: form.whatsapp,
        email: form.email.trim(),
        message: `Inscrição: ${programName}`,
        form_type: "inscricao-programa",
        page_url: window.location.href,
        _rendered_at: renderedAt,
        company_website: "",
        consent_text: CONSENT_TEXT,
        policy_version: LGPD.privacyPolicyVersion,
        purposes: ["inscricao_programa", "contato", "saude_sensivel"],
        ...utm,
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro ao enviar formulário.");
      }

      setIsSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Erro inesperado. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-border text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors";
  const labelClass = "block text-sm font-semibold text-foreground mb-2";

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-muted hover:text-foreground hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Fechar"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {isSubmitted ? (
          /* Success state */
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Interesse recebido!
            </h3>
            <p className="text-muted leading-relaxed mb-6">
              Recebemos seu interesse no{" "}
              <span className="font-semibold text-foreground">{programName}</span>!
              <br />
              Em breve nossa equipe entrará em contato pelo WhatsApp.
            </p>
            <Button onClick={onClose} variant="primary" size="md" className="w-full">
              Fechar
            </Button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-8 space-y-5" noValidate>
            <div className="pr-8">
              <h2
                id="modal-title"
                className="text-xl font-bold text-foreground leading-snug"
              >
                Quero participar do{" "}
                <span className="text-primary">{programName}</span>
              </h2>
              <p className="text-sm text-muted mt-1">
                Preencha os campos abaixo e nossa equipe entrará em contato.
              </p>
            </div>

            {/* Nome */}
            <div>
              <label htmlFor="enroll-name" className={labelClass}>
                Nome completo *
              </label>
              <input
                id="enroll-name"
                type="text"
                value={form.name}
                onChange={handleFieldChange("name")}
                className={inputClass}
                placeholder="Seu nome completo"
                autoComplete="name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            {/* WhatsApp */}
            <div>
              <label htmlFor="enroll-whatsapp" className={labelClass}>
                WhatsApp *
              </label>
              <input
                id="enroll-whatsapp"
                type="tel"
                value={form.whatsapp}
                onChange={handleWhatsAppChange}
                className={inputClass}
                placeholder="(84) 99999-9999"
                autoComplete="tel"
              />
              {errors.whatsapp && (
                <p className="text-red-500 text-sm mt-1" role="alert">
                  {errors.whatsapp}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="enroll-email" className={labelClass}>
                E-mail *
              </label>
              <input
                id="enroll-email"
                type="email"
                value={form.email}
                onChange={handleFieldChange("email")}
                className={inputClass}
                placeholder="seu@email.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Aviso de finalidade + Consentimento LGPD */}
            <div className="bg-primary/5 border border-primary/15 rounded-lg p-4 text-xs text-muted leading-relaxed space-y-3">
              <p>
                <strong className="text-foreground">Finalidade:</strong> seus dados serão usados
                para inscrição no programa, contato pela equipe e acompanhamento da participação.
                Programas envolvem dados sensíveis de saúde, com proteção reforçada conforme art.
                11 da LGPD.
              </p>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={handleConsentChange}
                  className="mt-0.5 w-4 h-4 accent-primary cursor-pointer flex-shrink-0"
                />
                <span className="text-sm text-foreground leading-snug">
                  Autorizo o tratamento dos meus dados, conforme a{" "}
                  <Link
                    href="/politica-de-privacidade"
                    className="text-primary hover:underline font-medium"
                  >
                    Política de Privacidade
                  </Link>
                  . *
                </span>
              </label>
              {errors.consent && (
                <p className="text-red-500 text-sm" role="alert">
                  {errors.consent}
                </p>
              )}
            </div>

            {/* Error */}
            {submitError && (
              <div
                className="bg-red-50 text-red-600 p-4 rounded-lg text-sm"
                role="alert"
              >
                {submitError}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Quero me inscrever"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
