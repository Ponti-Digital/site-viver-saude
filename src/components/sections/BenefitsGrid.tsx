"use client";

import { ScrollAnimationWrapper } from "@/components/shared/ScrollAnimationWrapper";

type BenefitTheme = {
  iconBg: string;
  iconText: string;
  border: string;
  number: string;
};

const themes: BenefitTheme[] = [
  // 1 — Mata (institucional, acolhimento)
  { iconBg: "bg-mata-800", iconText: "text-areia-100", border: "border-mata-800", number: "text-mata-800/10" },
  // 2 — Céu (preventivo, informativo — alinhado ao PDF da marca)
  { iconBg: "bg-ceu-300", iconText: "text-mata-900", border: "border-ceu-300", number: "text-ceu-500/15" },
  // 3 — Menta (energia, agilidade de acesso)
  { iconBg: "bg-menta-400", iconText: "text-mata-900", border: "border-menta-400", number: "text-menta-600/15" },
  // 4 — Coral (acolhedor/humano — paleta expandida da marca)
  { iconBg: "bg-acent-coral", iconText: "text-mata-900", border: "border-acent-coral", number: "text-acent-coral/20" },
];

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
    <section className="py-16 lg:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <ScrollAnimationWrapper>
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-menta-400 text-mata-900 text-xs font-bold tracking-wider uppercase mb-4">
              Benefícios
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-mata-900 mt-3">
              Benefícios que{" "}
              <span className="hero-gradient-text">simplificam</span>{" "}
              sua rotina
            </h2>
          </div>
        </ScrollAnimationWrapper>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const theme = themes[index % themes.length];
            return (
              <ScrollAnimationWrapper key={index} delay={index * 0.1}>
                <div className={`relative bg-white border-l-4 ${theme.border} rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 h-full overflow-hidden`}>
                  <span className={`absolute top-2 right-3 text-5xl font-black ${theme.number} select-none leading-none`}>
                    0{index + 1}
                  </span>

                  <div className={`w-12 h-12 rounded-full ${theme.iconBg} ${theme.iconText} flex items-center justify-center mb-5`}>
                    {benefit.icon}
                  </div>

                  <h3 className="text-sm font-bold text-mata-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </ScrollAnimationWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
