"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ScrollAnimationWrapper } from "@/components/shared/ScrollAnimationWrapper";
import { resolveUtm } from "@/lib/utils/utm";
import { formatPhone } from "@/lib/utils/phone-mask";
import { WHATSAPP_URL, LGPD } from "@/lib/constants/site";

const CONSENT_TEXT =
  "Autorizo a Viver Saúde a tratar meus dados pessoais (nome, telefone, e-mail e plano de interesse) para fins de contato comercial e proposta dos planos de saúde, conforme a Política de Privacidade.";

const formSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  phone: z.string().min(14, "Informe um telefone válido"),
  email: z.string().email("Informe um e-mail válido"),
  plan_interest: z.string().min(1, "Selecione um plano de interesse"),
  message: z.string().optional(),
  consent: z
    .boolean()
    .refine((v) => v === true, { message: "É necessário autorizar o tratamento dos dados." }),
  company_website: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const planOptions = [
  { value: "diamante", label: "Diamante", comingSoon: false },
  { value: "quartzo", label: "Quartzo", comingSoon: false },
  { value: "rubi", label: "Rubi", comingSoon: false },
  { value: "turmalina", label: "Turmalina", comingSoon: false },
  { value: "safira", label: "Safira", comingSoon: false },
  { value: "topazio", label: "Topázio", comingSoon: false },
  { value: "ametista", label: "Ametista (em breve)", comingSoon: true },
  { value: "turquesa", label: "Turquesa (em breve)", comingSoon: true },
];

export default function QueroSerClientePage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [renderedAt, setRenderedAt] = useState<number>(0);

  useEffect(() => {
    setRenderedAt(Date.now());
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      plan_interest: "",
      message: "",
      consent: undefined,
      company_website: "",
    },
  });

  const phoneValue = watch("phone");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setValue("phone", formatted, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const utm = resolveUtm();
      const payload = {
        ...data,
        _rendered_at: renderedAt,
        form_type: "quero-ser-cliente",
        page_url: window.location.href,
        consent_text: CONSENT_TEXT,
        policy_version: LGPD.privacyPolicyVersion,
        purposes: ["contato_comercial", "proposta_plano"],
        ...utm,
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
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

  if (isSubmitted) {
    return (
      <>
        <section className="bg-gradient-to-br from-primary-dark to-primary text-white py-20 lg:py-28">
          <div className="container mx-auto px-4 text-center">
            <ScrollAnimationWrapper>
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Mensagem enviada!
              </h1>
              <p className="text-lg text-white/90 max-w-xl mx-auto mb-8">
                Tudo certo! Recebemos seus dados. Em breve, nossa equipe vai falar com você sobre o plano ideal.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/" variant="accent" size="lg">
                  Voltar ao início
                </Button>
                <Button
                  href={WHATSAPP_URL}
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary"
                >
                  Falar no WhatsApp
                </Button>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-dark to-primary text-white py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimationWrapper>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Quero Ser Cliente
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Preencha seus dados e falaremos com você em breve.
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <ScrollAnimationWrapper>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white rounded-2xl p-8 shadow-sm border border-border space-y-6"
              >
                {/* Nome */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                    Nome completo *
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className="w-full px-4 py-3 rounded-lg border border-border text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    placeholder="Seu nome completo"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Telefone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2">
                    Telefone *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phoneValue}
                    onChange={handlePhoneChange}
                    className="w-full px-4 py-3 rounded-lg border border-border text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    placeholder="(84) 99999-9999"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                    E-mail *
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="w-full px-4 py-3 rounded-lg border border-border text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    placeholder="seu@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Plano de interesse */}
                <div>
                  <label htmlFor="plan_interest" className="block text-sm font-semibold text-foreground mb-2">
                    Plano de interesse *
                  </label>
                  <select
                    id="plan_interest"
                    {...register("plan_interest")}
                    className="w-full px-4 py-3 rounded-lg border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors bg-white"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Selecione um plano
                    </option>
                    {planOptions.map((plan) => (
                      <option key={plan.value} value={plan.value} disabled={plan.comingSoon}>
                        {plan.label}
                      </option>
                    ))}
                  </select>
                  {errors.plan_interest && (
                    <p className="text-red-500 text-sm mt-1">{errors.plan_interest.message}</p>
                  )}
                </div>

                {/* Mensagem */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
                    Mensagem <span className="text-muted font-normal">(opcional)</span>
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    {...register("message")}
                    className="w-full px-4 py-3 rounded-lg border border-border text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
                    placeholder="Conte-nos mais sobre o que você precisa..."
                  />
                </div>

                {/* Honeypot */}
                <div style={{ display: "none" }} aria-hidden="true">
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("company_website")}
                  />
                </div>

                {/* Aviso de finalidade */}
                <div className="bg-primary/5 border border-primary/15 rounded-lg p-4 text-xs text-muted leading-relaxed">
                  <p className="mb-2">
                    <strong className="text-foreground">Finalidade da coleta:</strong> seus dados
                    serão usados para contato comercial e elaboração de proposta dos planos da Viver
                    Saúde. Ao final do atendimento, você pode solicitar a exclusão dos dados.
                  </p>
                  <p>
                    Conheça seus direitos em{" "}
                    <Link
                      href="/direitos-do-titular"
                      className="text-primary hover:underline font-medium"
                    >
                      Direitos do Titular
                    </Link>
                    .
                  </p>
                </div>

                {/* Consentimento LGPD */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("consent")}
                    className="mt-1 w-4 h-4 accent-primary cursor-pointer flex-shrink-0"
                  />
                  <span className="text-sm text-foreground leading-relaxed">
                    Autorizo a Viver Saúde a tratar meus dados pessoais para contato comercial e
                    proposta de planos, conforme a{" "}
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
                  <p className="text-red-500 text-sm -mt-3">{errors.consent.message}</p>
                )}

                {/* Error */}
                {submitError && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
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
                  {isSubmitting ? "Enviando..." : "Enviar mensagem"}
                </Button>
              </form>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>
    </>
  );
}
