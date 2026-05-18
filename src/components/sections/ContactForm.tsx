"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { resolveUtm } from "@/lib/utils/utm";
import { formatPhone } from "@/lib/utils/phone-mask";
import { WHATSAPP_URL, LGPD } from "@/lib/constants/site";

const CONSENT_TEXT =
  "Autorizo a Viver Saúde a tratar meus dados pessoais (nome, telefone e e-mail) para responder a este contato, conforme a Política de Privacidade. Estou ciente dos meus direitos como titular (LGPD, art. 18).";

const formSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  phone: z.string().min(14, "Informe um telefone válido"),
  email: z.string().email("Informe um e-mail válido"),
  message: z.string().optional(),
  consent: z
    .boolean()
    .refine((v) => v === true, { message: "É necessário autorizar o tratamento dos dados." }),
  company_website: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function ContactForm() {
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
        form_type: "contato",
        page_url: window.location.href,
        consent_text: CONSENT_TEXT,
        policy_version: LGPD.privacyPolicyVersion,
        purposes: ["contato_comercial"],
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
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-border text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Mensagem enviada!</h3>
        <p className="text-muted mb-6">
          Recebemos seus dados. Em breve, nossa equipe vai falar com você.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="/" variant="primary" size="md">
            Voltar ao início
          </Button>
          <Button
            href={WHATSAPP_URL}
            variant="outline"
            size="md"
          >
            Falar no WhatsApp
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-2xl p-8 shadow-sm border border-border space-y-5"
    >
      <div>
        <h3 className="text-xl font-bold text-foreground mb-1">Envie sua mensagem</h3>
        <p className="text-sm text-muted">Preencha os campos e retornaremos em breve.</p>
      </div>

      {/* Nome */}
      <div>
        <label htmlFor="contact-name" className="block text-sm font-semibold text-foreground mb-2">
          Nome completo *
        </label>
        <input
          id="contact-name"
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
        <label htmlFor="contact-phone" className="block text-sm font-semibold text-foreground mb-2">
          Telefone *
        </label>
        <input
          id="contact-phone"
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
        <label htmlFor="contact-email" className="block text-sm font-semibold text-foreground mb-2">
          E-mail *
        </label>
        <input
          id="contact-email"
          type="email"
          {...register("email")}
          className="w-full px-4 py-3 rounded-lg border border-border text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          placeholder="seu@email.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Mensagem */}
      <div>
        <label htmlFor="contact-message" className="block text-sm font-semibold text-foreground mb-2">
          Mensagem <span className="text-muted font-normal">(opcional)</span>
        </label>
        <textarea
          id="contact-message"
          rows={4}
          {...register("message")}
          className="w-full px-4 py-3 rounded-lg border border-border text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
          placeholder="Como podemos ajudar?"
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
          <strong className="text-foreground">Finalidade da coleta:</strong> seus dados serão
          utilizados exclusivamente para responder a este contato e oferecer informações sobre
          nossos planos. Não compartilhamos com terceiros para fins de marketing.
        </p>
        <p>
          Você pode acessar, corrigir ou excluir seus dados a qualquer momento pela página{" "}
          <Link href="/direitos-do-titular" className="text-primary hover:underline font-medium">
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
          {CONSENT_TEXT.replace("Política de Privacidade", "")}{" "}
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
  );
}
