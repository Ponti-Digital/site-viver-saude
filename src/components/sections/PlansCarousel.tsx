"use client";

import { useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ScrollAnimationWrapper } from "@/components/shared/ScrollAnimationWrapper";
import { Button } from "@/components/ui/Button";

const plans = [
  {
    name: "Topázio",
    slug: "topazio",
    tagline: "Plano ambulatorial empresarial com foco em consultas e prevenção.",
    image: "/images/plans/topázio.png",
    color: "from-amber-400 to-amber-600",
  },
  {
    name: "Rubi",
    slug: "rubi",
    tagline: "Cobertura completa para empresas e adesão, com rede ampla.",
    image: "/images/plans/rubi.png",
    color: "from-red-400 to-red-600",
  },
  {
    name: "Safira",
    slug: "safira",
    tagline: "Plano individual e por adesão, com foco em longevidade e prevenção.",
    image: "/images/plans/safira.png",
    color: "from-sky-400 to-sky-600",
  },
  {
    name: "Turmalina",
    slug: "turmalina",
    tagline: "Cuidado integral com acompanhamento contínuo da saúde.",
    image: "/images/plans/turmalina.png",
    color: "from-pink-400 to-pink-600",
  },
  {
    name: "Quartzo",
    slug: "quartzo",
    tagline: "Completo e prático, com atendimento ambulatorial e hospitalar.",
    image: "/images/plans/quartzo.png",
    color: "from-gray-400 to-gray-600",
  },
  {
    name: "Diamante",
    slug: "diamante",
    tagline: "Plano empresarial com opção de quarto privativo e cobertura completa.",
    image: "/images/plans/diamante.png",
    color: "from-cyan-300 to-cyan-500",
  },
];

interface PlansCarouselProps {
  slugOrder?: string[];
  activeSlugs?: string[];
}

export function PlansCarousel({ slugOrder = [], activeSlugs = [] }: PlansCarouselProps = {}) {
  const orderedPlans = (() => {
    const activeSet = new Set(activeSlugs);
    const filtered = activeSet.size > 0 ? plans.filter((p) => activeSet.has(p.slug)) : plans;
    if (slugOrder.length === 0) return filtered;
    const rank = new Map(slugOrder.map((s, i) => [s, i]));
    return [...filtered].sort((a, b) => {
      const ra = rank.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
      const rb = rank.get(b.slug) ?? Number.MAX_SAFE_INTEGER;
      return ra - rb;
    });
  })();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 3 },
    },
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="py-20 lg:py-28 bg-card">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <ScrollAnimationWrapper>
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                Nossos Planos
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
                Planos feitos para cuidar bem da <span className="text-primary">sua saúde</span>
              </h2>
              <p className="text-muted mt-3 max-w-lg">
                Planos descomplicados, com opções para diferentes perfis e fases da vida.
              </p>
            </div>
            <div className="hidden md:flex gap-2">
              <button
                onClick={scrollPrev}
                className="w-11 h-11 rounded-full border border-border hover:bg-primary hover:text-white hover:border-primary flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                aria-label="Plano anterior"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={scrollNext}
                className="w-11 h-11 rounded-full border border-border hover:bg-primary hover:text-white hover:border-primary flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                aria-label="Próximo plano"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </ScrollAnimationWrapper>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {orderedPlans.map((plan, index) => (
              <div
                key={plan.slug}
                className="flex-none w-[85%] md:w-[45%] lg:w-[30%]"
              >
                <ScrollAnimationWrapper delay={index * 0.1}>
                  <motion.div
                    className="group bg-white rounded-2xl shadow-sm border border-border overflow-hidden"
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                      y: -4,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className={`h-48 bg-gradient-to-br ${plan.color} relative flex items-center justify-center p-6`}>
                      <Image
                        src={plan.image}
                        alt={`Plano ${plan.name}`}
                        width={160}
                        height={160}
                        className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        Plano {plan.name}
                      </h3>
                      <p className="text-muted text-sm leading-relaxed mb-6">
                        {plan.tagline}
                      </p>
                      <div className="flex gap-3">
                        <Button
                          href={`/planos/${plan.slug}`}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          Ver detalhes
                        </Button>
                        <Button
                          href="/quero-ser-cliente"
                          size="sm"
                          className="flex-1"
                        >
                          Simule
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </ScrollAnimationWrapper>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Button href="/planos" variant="ghost" size="md">
            Ver todos os planos
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  );
}
