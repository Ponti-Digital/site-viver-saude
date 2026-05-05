"use client";

import { ScrollAnimationWrapper } from "@/components/shared/ScrollAnimationWrapper";

const benefits = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "Atendimento com orientação e suporte",
    description: "Apoio com informações e direcionamento de forma clara e acolhedora.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Programas de cuidado e prevenção",
    description: "Acompanhamento para apoiar prevenção e bem-estar contínuo.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: "Acesso rápido a informações do plano",
    description: "Consulte informações e serviços do seu plano com facilidade.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: "Serviços de saúde organizados",
    description: "Encontre profissionais e serviços por categoria com facilidade.",
  },
];

export function BenefitsGrid() {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-primary to-primary-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <ScrollAnimationWrapper>
          <div className="text-center mb-12">
            <span className="text-accent-light font-medium text-sm uppercase tracking-wider">
              Benefícios
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">
              Benefícios que simplificam sua rotina
            </h2>
          </div>
        </ScrollAnimationWrapper>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden">
          {benefits.map((benefit, index) => (
            <ScrollAnimationWrapper key={index} delay={index * 0.1}>
              <div className="bg-primary/80 p-8 flex flex-col items-center text-center h-full hover:bg-primary transition-colors duration-300">
                <div className="w-12 h-12 rounded-full bg-accent/20 text-accent-light flex items-center justify-center mb-5">
                  {benefit.icon}
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </ScrollAnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
