"use client";

import { useState } from "react";
import { ScrollAnimationWrapper } from "@/components/shared/ScrollAnimationWrapper";
import { PORTALS, SITE, WHATSAPP_URL } from "@/lib/constants/site";

interface FaqItem {
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    question: "Como acessar o Portal do Cliente?",
    answer: `Você pode acessar o Portal do Cliente diretamente pelo nosso site, na página "Portal do Cliente". Ao clicar no botão de acesso, você será redirecionado para a plataforma segura Solus, onde poderá consultar boletos, autorizações e informações do seu plano. Utilize seu login e senha cadastrados para entrar.`,
  },
  {
    question: "Onde encontro a Rede Credenciada?",
    answer: `A lista completa de prestadores credenciados está disponível na página "Rede Credenciada" do nosso site. Lá você encontra hospitais, clínicas, laboratórios e profissionais organizados por categoria, além dos principais destaques da nossa rede em Natal/RN.`,
  },
  {
    question: "Como falar conosco?",
    answer: `Você pode entrar em contato conosco pelo telefone ${SITE.phone}, pelo WhatsApp ou pelo e-mail ${SITE.email}. Nosso horário de atendimento é de segunda a sexta, das 8h às 17h. Estamos aqui para ajudar você.`,
  },
  {
    question: "Consigo comparar planos no site?",
    answer: `Sim! Na página "Planos" você encontra todos os planos disponíveis com suas principais características. Você pode clicar em cada plano para ver os detalhes completos. Se precisar de ajuda para escolher, entre em contato com nossa equipe pelo WhatsApp.`,
  },
  {
    question: "Sou prestador. Onde acesso o sistema?",
    answer: `Prestadores credenciados podem acessar o sistema pela página "Área do Prestador" no nosso site. O acesso é feito pela plataforma Solus com as credenciais fornecidas pelo setor de credenciamento. Em caso de dúvidas, entre em contato pelo telefone ${SITE.phone}.`,
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-dark to-primary text-white py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimationWrapper>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Perguntas Frequentes
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Encontre respostas rápidas para as dúvidas mais comuns sobre a Viver Saúde.
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 lg:py-24 bg-info-light">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item, idx) => (
              <ScrollAnimationWrapper key={idx} delay={idx * 0.1}>
                <div className="bg-white rounded-2xl border border-info/20 shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
                    aria-expanded={openIndex === idx}
                  >
                    <span className="font-semibold text-foreground text-lg pr-4">
                      {item.question}
                    </span>
                    <svg
                      className={`w-5 h-5 text-info-dark flex-shrink-0 transition-transform duration-300 ${
                        openIndex === idx ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openIndex === idx ? "max-h-[600px]" : "max-h-0"
                    }`}
                  >
                    <div className="px-6 pb-6 text-info-dark leading-relaxed">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-card">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimationWrapper>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Ainda tem dúvidas?
            </h2>
            <p className="text-muted mb-6 max-w-lg mx-auto">
              Fale com a gente pelo WhatsApp ou pela página de contato. Estamos aqui para ajudar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 px-6 py-3 bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md"
              >
                Falar no WhatsApp
              </a>
              <a
                href="/contato"
                className="inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white"
              >
                Página de contato
              </a>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>
    </>
  );
}
