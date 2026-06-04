import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ScrollAnimationWrapper } from "@/components/shared/ScrollAnimationWrapper";
import { PlanStickyBar } from "@/components/sections/PlanStickyBar";
import { WHATSAPP_URL } from "@/lib/constants/site";
import { jsonLdString } from "@/lib/utils/json-ld";
import { getPlanContent } from "@/lib/supabase/plans";
import { PLANS_SLUGS_ORDERED } from "@/lib/constants/plans-content";
import type { PlanContentFallback } from "@/lib/supabase/plans";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateStaticParams() {
  return PLANS_SLUGS_ORDERED.map((slug) => ({ slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const plan = await getPlanContent(slug);

  if (!plan) {
    return { title: "Plano não encontrado" };
  }

  const description = `${plan.tagline} Cobertura ${plan.coverageType.toLowerCase()} a partir de ${plan.priceRaw}/mês. ${plan.audienceLabel}. Conheça o plano ${plan.name} da Viver Saúde em Natal/RN.`;

  return {
    title: `Plano ${plan.name} — A partir de ${plan.priceRaw}/mês`,
    description,
    alternates: { canonical: `/planos/${plan.slug}` },
    openGraph: {
      title: `Plano ${plan.name} — Viver Saúde`,
      description,
      url: `https://planoviversaude.com.br/planos/${plan.slug}`,
      type: "website",
      images: [
        {
          url: plan.image,
          alt: `Plano ${plan.name} — Viver Saúde`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Plano ${plan.name} — Viver Saúde`,
      description,
      images: [plan.image],
    },
  };
}

function buildPlanJsonLd(plan: PlanContentFallback) {
  const priceNumeric = parseFloat(
    plan.priceRaw.replace("R$ ", "").replace(".", "").replace(",", ".")
  );
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `https://planoviversaude.com.br/planos/${plan.slug}#product`,
        name: `Plano ${plan.name}`,
        description: plan.description,
        image: `https://planoviversaude.com.br${plan.image}`,
        brand: {
          "@type": "Brand",
          name: "Viver Saúde",
        },
        category: "Plano de Saúde",
        audience: {
          "@type": "Audience",
          audienceType: plan.audienceLabel,
        },
        offers: {
          "@type": "Offer",
          url: `https://planoviversaude.com.br/planos/${plan.slug}`,
          priceCurrency: "BRL",
          price: priceNumeric.toFixed(2),
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: priceNumeric.toFixed(2),
            priceCurrency: "BRL",
            unitText: "MONTH",
          },
          availability: "https://schema.org/InStock",
          areaServed: plan.region.split(", ").map((city) => ({
            "@type": "City",
            name: city,
          })),
          seller: {
            "@id": "https://planoviversaude.com.br/#organization",
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Início",
            item: "https://planoviversaude.com.br",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Planos",
            item: "https://planoviversaude.com.br/planos",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: plan.name,
            item: `https://planoviversaude.com.br/planos/${plan.slug}`,
          },
        ],
      },
    ],
  };
}

export default async function PlanPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const plan = await getPlanContent(slug);

  if (!plan) {
    notFound();
  }

  const jsonLd = buildPlanJsonLd(plan);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      {/* Plan Header / Hero */}
      <section className="bg-gradient-to-br from-primary-dark to-primary text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollAnimationWrapper direction="left">
              <p className="text-accent font-semibold mb-2 uppercase tracking-wide text-sm">
                Plano
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                {plan.name}
              </h1>
              <p className="text-xl text-white/90 mb-6">{plan.tagline}</p>
              <p className="text-white/80 leading-relaxed mb-8">
                {plan.description}
              </p>

              {/* Preço inline tipográfico */}
              <ScrollAnimationWrapper>
                {(() => {
                  const value = plan.priceRaw.replace("R$ ", "");
                  const [inteiro, centavos] = value.split(",");
                  return (
                    <div className="mt-8 mb-8">
                      <p className="text-xs font-medium tracking-[0.18em] uppercase text-accent/90 mb-2">
                        A partir de
                      </p>
                      <div className="flex items-baseline gap-1 text-white">
                        <span className="text-2xl md:text-3xl font-medium text-white/70 mr-1">R$</span>
                        <span className="text-6xl md:text-7xl font-bold leading-none tracking-tight tabular-nums">
                          {inteiro}
                        </span>
                        {centavos && (
                          <span className="text-3xl md:text-4xl font-bold leading-none text-white/85 tabular-nums">
                            ,{centavos}
                          </span>
                        )}
                        <span className="text-base md:text-lg font-medium text-white/60 ml-2">/mês</span>
                      </div>
                      {plan.slug === "safira" && (
                        <p className="text-sm text-white/60 mt-2">faixa 59+ anos</p>
                      )}
                    </div>
                  );
                })()}
              </ScrollAnimationWrapper>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/quero-ser-cliente" variant="accent" size="lg">
                  Quero este plano
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
            <ScrollAnimationWrapper direction="right">
              <div className="flex items-center justify-center">
                <Image
                  src={plan.image}
                  alt={`Plano ${plan.name}`}
                  width={400}
                  height={300}
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Sentinel for sticky bar — rendered right after hero */}
      <PlanStickyBar price={plan.priceRaw} planName={plan.name} />

      {/* Resumo do plano */}
      <section className="py-12 lg:py-16 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <ScrollAnimationWrapper>
            <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">
                  Público-alvo
                </p>
                <p className="text-foreground font-medium">{plan.audienceLabel}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">
                  Tipo de cobertura
                </p>
                <p className="text-foreground font-medium">{plan.coverageType}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">
                  Abrangência
                </p>
                <p className="text-foreground text-sm leading-relaxed">{plan.region}</p>
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <ScrollAnimationWrapper>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              O que o plano {plan.name} oferece
            </h2>
          </ScrollAnimationWrapper>
          <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-4">
            {plan.highlights.map((highlight, idx) => (
              <ScrollAnimationWrapper key={idx} delay={idx * 0.1}>
                <div className="flex items-start gap-3 p-5 bg-card rounded-xl">
                  <svg
                    className="w-6 h-6 text-accent flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-foreground">{highlight}</span>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 text-center">
          <ScrollAnimationWrapper>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Para quem é indicado?
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
              {plan.targetAudience}
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Benefícios inclusos */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Benefícios inclusos no plano
              </h2>
              <p className="text-muted text-lg max-w-2xl mx-auto">
                Todos os itens abaixo já estão inclusos no preço do plano.
              </p>
            </div>
          </ScrollAnimationWrapper>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {plan.benefits.map((benefit, idx) => (
              <ScrollAnimationWrapper key={benefit.name} delay={idx * 0.08}>
                <div className="bg-card border border-border rounded-xl p-6 h-full flex flex-col">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{benefit.name}</h3>
                  <p className="text-sm text-muted flex-1">{benefit.description}</p>
                  <span className="inline-block mt-3 text-xs font-semibold text-primary uppercase tracking-wide">
                    {benefit.value}
                  </span>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Modalidades disponíveis */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <ScrollAnimationWrapper>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Modalidades disponíveis
              </h2>
              <p className="text-foreground text-lg leading-relaxed mb-4">
                {plan.modalitiesText}
              </p>
              <p className="text-sm text-muted">
                {plan.priceFootnote}
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Condições Gerais Download */}
      {plan.condicoesGerais && plan.condicoesGerais.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <ScrollAnimationWrapper>
              <div className="max-w-2xl mx-auto text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  Condições Gerais
                </h2>
                <p className="text-muted mb-8">
                  Consulte os documentos com as condições gerais do plano {plan.name}.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {plan.condicoesGerais.map((doc) => (
                    <a
                      key={doc.file}
                      href={doc.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 bg-card border border-border rounded-xl text-foreground hover:border-primary hover:text-primary transition-colors text-sm font-medium"
                    >
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      {doc.label}
                    </a>
                  ))}
                </div>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </section>
      )}

      {/* CTA Bar */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-primary-dark to-primary text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 text-center">
          <ScrollAnimationWrapper>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pronto para começar?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              Fale com nossa equipe e contrate o plano {plan.name} hoje mesmo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/quero-ser-cliente" variant="accent" size="lg">
                Quero ser cliente
              </Button>
              <Button
                href={WHATSAPP_URL}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                Falar no WhatsApp
              </Button>
              <Button href="/planos" variant="ghost" size="lg" className="text-white hover:bg-white/10">
                Ver todos os planos
              </Button>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>
    </>
  );
}
