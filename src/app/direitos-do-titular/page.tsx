"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { ScrollAnimationWrapper } from "@/components/shared/ScrollAnimationWrapper";
import { formatPhone } from "@/lib/utils/phone-mask";
import { LGPD } from "@/lib/constants/site";

const REQUEST_TYPES = [
  { value: "access", label: "Confirmar / Acessar meus dados" },
  { value: "correction", label: "Corrigir meus dados" },
  { value: "deletion", label: "Eliminar / Excluir meus dados" },
  { value: "anonymization", label: "Anonimizar ou bloquear meus dados" },
  { value: "portability", label: "Portabilidade dos meus dados" },
  { value: "consent_info", label: "Informações sobre compartilhamento" },
  { value: "consent_withdraw", label: "Revogar meu consentimento" },
  { value: "other", label: "Outra solicitação" },
] as const;

const RELATIONSHIPS = [
  { value: "beneficiario", label: "Beneficiário do plano" },
  { value: "prestador", label: "Prestador credenciado" },
  { value: "lead", label: "Interessado em contratar" },
  { value: "colaborador", label: "Colaborador / ex-colaborador" },
  { value: "outro", label: "Outro" },
] as const;

const formSchema = z.object({
  request_type: z.enum([
    "access",
    "correction",
    "anonymization",
    "portability",
    "deletion",
    "consent_info",
    "consent_withdraw",
    "other",
  ]),
  full_name: z.string().min(2, "Informe seu nome completo"),
  email: z.string().email("Informe um e-mail válido"),
  phone: z.string().optional(),
  cpf: z.string().optional(),
  relationship: z.string().optional(),
  details: z.string().min(10, "Descreva sua solicitação com pelo menos 10 caracteres"),
  consent_confirm: z
    .boolean()
    .refine((v) => v === true, { message: "Você precisa confirmar a veracidade das informações." }),
  company_website: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function DireitosTitularPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [renderedAt, setRenderedAt] = useState(0);

  useEffect(() => setRenderedAt(Date.now()), []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      request_type: "access",
      full_name: "",
      email: "",
      phone: "",
      cpf: "",
      relationship: "",
      details: "",
    },
  });

  const phoneValue = watch("phone");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("phone", formatPhone(e.target.value), { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/lgpd/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          page_url: window.location.href,
          _rendered_at: renderedAt,
        }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error ?? "Erro ao enviar solicitação.");
      }
      setIsSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="bg-gradient-to-br from-primary-dark to-primary text-white py-20 lg:py-28 min-h-[60vh] flex items-center">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimationWrapper>
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Solicitação recebida!</h1>
            <p className="text-lg text-white/90 max-w-xl mx-auto">
              Recebemos sua solicitação e responderemos em até 15 dias úteis pelo e-mail informado,
              conforme art. 19 da LGPD. Em casos complexos, poderemos solicitar informações
              complementares para confirmar sua identidade.
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>
    );
  }

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-border text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors";
  const labelClass = "block text-sm font-semibold text-foreground mb-2";

  return (
    <>
      <section className="bg-gradient-to-br from-primary-dark to-primary text-white py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimationWrapper>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Direitos do Titular
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Exerça os direitos garantidos pelo art. 18 da Lei Geral de Proteção de Dados (LGPD).
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <ScrollAnimationWrapper>
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8">
                <h2 className="font-bold text-foreground mb-2">Antes de continuar</h2>
                <ul className="text-sm text-muted space-y-1.5 list-disc pl-5">
                  <li>
                    Responderemos em até <strong>15 dias úteis</strong> pelo e-mail informado.
                  </li>
                  <li>
                    Para sua segurança, podemos solicitar documentos para confirmar sua identidade.
                  </li>
                  <li>
                    Para urgências, contate o Encarregado em{" "}
                    <a href={`mailto:${LGPD.dpoEmail}`} className="text-primary hover:underline">
                      {LGPD.dpoEmail}
                    </a>
                    .
                  </li>
                </ul>
              </div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white rounded-2xl p-8 shadow-sm border border-border space-y-5"
                noValidate
              >
                <div>
                  <label htmlFor="request_type" className={labelClass}>
                    Tipo de solicitação *
                  </label>
                  <select
                    id="request_type"
                    {...register("request_type")}
                    className={inputClass + " bg-white"}
                  >
                    {REQUEST_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="full_name" className={labelClass}>
                    Nome completo *
                  </label>
                  <input
                    id="full_name"
                    type="text"
                    {...register("full_name")}
                    className={inputClass}
                    placeholder="Seu nome completo"
                  />
                  {errors.full_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className={labelClass}>
                      E-mail *
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register("email")}
                      className={inputClass}
                      placeholder="seu@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelClass}>
                      Telefone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phoneValue}
                      onChange={handlePhoneChange}
                      className={inputClass}
                      placeholder="(84) 99999-9999"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="cpf" className={labelClass}>
                      CPF <span className="font-normal text-muted">(opcional)</span>
                    </label>
                    <input
                      id="cpf"
                      type="text"
                      {...register("cpf")}
                      className={inputClass}
                      placeholder="000.000.000-00"
                    />
                    <p className="text-xs text-muted mt-1">
                      Armazenamos apenas hash criptográfico, nunca o CPF original.
                    </p>
                  </div>
                  <div>
                    <label htmlFor="relationship" className={labelClass}>
                      Vínculo com a Viver Saúde
                    </label>
                    <select
                      id="relationship"
                      {...register("relationship")}
                      className={inputClass + " bg-white"}
                      defaultValue=""
                    >
                      <option value="">Selecione</option>
                      {RELATIONSHIPS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="details" className={labelClass}>
                    Descreva sua solicitação *
                  </label>
                  <textarea
                    id="details"
                    rows={5}
                    {...register("details")}
                    className={inputClass + " resize-none"}
                    placeholder="Detalhe quais dados ou tratamentos sua solicitação se refere."
                  />
                  {errors.details && (
                    <p className="text-red-500 text-sm mt-1">{errors.details.message}</p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("consent_confirm")}
                      className="mt-1 w-4 h-4 accent-primary cursor-pointer"
                    />
                    <span className="text-sm text-foreground leading-relaxed">
                      Declaro que as informações fornecidas são verdadeiras e que sou o titular dos
                      dados ou seu representante legal, conforme art. 18 da LGPD. Estou ciente de
                      que dados falsos podem configurar crime.
                    </span>
                  </label>
                  {errors.consent_confirm && (
                    <p className="text-red-500 text-sm mt-2">{errors.consent_confirm.message}</p>
                  )}
                </div>

                <div style={{ display: "none" }} aria-hidden="true">
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("company_website")}
                  />
                </div>

                {submitError && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">{submitError}</div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar solicitação"}
                </Button>
              </form>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>
    </>
  );
}
