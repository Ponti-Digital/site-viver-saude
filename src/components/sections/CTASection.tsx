"use client";

import { ScrollAnimationWrapper } from "@/components/shared/ScrollAnimationWrapper";
import { Button } from "@/components/ui/Button";
import { WHATSAPP_URL } from "@/lib/constants/site";

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 lg:px-6 text-center relative z-10">
        <ScrollAnimationWrapper>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            <span className="text-accent-light">Vem viver</span> melhor com a gente
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Escolha a melhor proteção para você, sua família ou a sua empresa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/quero-ser-cliente"
              className="inline-flex items-center justify-center font-semibold rounded-lg px-8 py-4 text-lg bg-white text-primary hover:bg-gray-100 shadow-md hover:shadow-lg transition-all duration-300"
            >
              Simule seu plano
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center font-semibold rounded-lg px-8 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-300"
            >
              Fale Conosco
            </a>
          </div>
        </ScrollAnimationWrapper>
      </div>
    </section>
  );
}
