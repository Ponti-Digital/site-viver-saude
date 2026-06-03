import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ScrollAnimationWrapper } from "@/components/shared/ScrollAnimationWrapper";
import { WHATSAPP_URL } from "@/lib/constants/site";
import { getAllPlansContent } from "@/lib/supabase/plans";
import { jsonLdString } from "@/lib/utils/json-ld";

export const revalidate = 3600;

export const metadata = {
  title: "Planos de Saúde — Diamante, Ametista, Quartzo, Rubi, Safira e Topázio",
  description:
    "Conheça os planos de saúde Viver Saúde em Natal/RN: Diamante, Ametista, Quartzo, Turmalina, Rubi, Safira e Topázio. Cobertura ambulatorial, hospitalar e obstétrica para pessoa física, empresas e adesão. A partir de R$ 69,90/mês.",
  alternates: { canonical: "/planos" },
  openGraph: {
    title: "Planos de Saúde Viver Saúde — Natal/RN",
    description:
      "Sete planos para diferentes perfis e necessidades. A partir de R$ 69,90/mês em Natal/RN.",
    url: "https://planoviversaude.com.br/planos",
  },
};

export default async function PlanosPage() {
  const orderedPlans = await getAllPlansContent();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Planos de Saúde Viver Saúde",
    itemListElement: orderedPlans.map((plan, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `https://planoviversaude.com.br/planos/${plan.slug}`,
      name: `Plano ${plan.name}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(itemListJsonLd) }}
      />
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-dark to-primary text-white py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimationWrapper>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Planos
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Encontre a proteção ideal para você e sua família.
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {orderedPlans.map((plan, idx) => (
              <ScrollAnimationWrapper key={plan.slug} delay={idx * 0.1}>
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-border overflow-hidden flex flex-col h-full">
                  <div className="relative aspect-[4/3] bg-card flex items-center justify-center p-8">
                    <Image
                      src={plan.image}
                      alt={`Plano ${plan.name}`}
                      width={240}
                      height={180}
                      className="object-contain"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {plan.name}
                    </h2>
                    <p className="text-muted mb-6 flex-1">{plan.tagline}</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button href={`/planos/${plan.slug}`} variant="primary" size="sm" className="flex-1">
                        Saiba mais
                      </Button>
                      <Button href={WHATSAPP_URL} variant="outline" size="sm" className="flex-1">
                        Contratar
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimationWrapper>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Precisa de ajuda para escolher?
            </h2>
            <p className="text-muted text-lg mb-8 max-w-xl mx-auto">
              Nossa equipe ajuda você a encontrar o plano certo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/quero-ser-cliente" variant="primary" size="lg">
                Quero ser cliente
              </Button>
              <Button href={WHATSAPP_URL} variant="accent" size="lg">
                Falar no WhatsApp
              </Button>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>
    </>
  );
}
