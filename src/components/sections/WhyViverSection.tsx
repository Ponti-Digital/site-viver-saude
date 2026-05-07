"use client";

import { ScrollAnimationWrapper } from "@/components/shared/ScrollAnimationWrapper";

const benefits = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "Acolhimento e clareza em cada etapa",
    description: "Da contratação ao uso do plano, você conta com orientação e suporte em todas as etapas da sua jornada de saúde.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Rede preparada para cuidar de você",
    description: "Atendimento de qualidade para você e sua família, com profissionais preparados em Natal/RN.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Organização e praticidade",
    description: "Acesso fácil a informações, serviços e canais digitais para resolver o que precisa sem burocracia.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Agilidade no atendimento",
    description: "Processos simplificados para que você tenha o cuidado que precisa no tempo certo.",
  },
];

export function WhyViverSection() {
  return (
    <section className="py-20 lg:py-28 bg-warm-neutral">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: heading */}
          <ScrollAnimationWrapper direction="left">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Por que Viver Saúde?
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
              Cuidado que acompanha você <span className="text-primary">de verdade</span>
            </h2>
            <p className="text-muted leading-relaxed max-w-md">
              A Viver Saúde foi pensada para oferecer um plano de saúde mais humano, próximo e descomplicado.
            </p>
          </ScrollAnimationWrapper>

          {/* Right: list with icons */}
          <div className="flex flex-col gap-1">
            {benefits.map((benefit, index) => (
              <ScrollAnimationWrapper key={index} delay={index * 0.1} direction="right">
                <div className="group flex items-start gap-5 p-5 rounded-xl hover:bg-primary-light transition-colors duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-light text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {benefit.icon}
                  </div>
                  <div className="pt-0.5">
                    <h3 className="text-base font-semibold text-foreground mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
