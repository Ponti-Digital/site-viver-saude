import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ScrollAnimationWrapper } from "@/components/shared/ScrollAnimationWrapper";
import { WHATSAPP_URL } from "@/lib/constants/site";
import { getPlansOrder, reorderBySlug } from "@/lib/supabase/plans";

export const metadata = {
  title: "Planos",
  description:
    "Encontre o plano de saúde ideal para você e sua família. Conheça os planos Diamante, Ametista, Quartzo, Turmalina, Rubi, Safira e Topázio da Viver Saúde.",
};

const plans = [
  {
    name: "Diamante",
    slug: "diamante",
    tagline: "Plano empresarial completo, com obstetrícia e opção de quarto privativo",
    image: "/images/plans/diamante.png",
  },
  {
    name: "Ametista",
    slug: "ametista",
    tagline: "Plano completo com obstetrícia para empresas e por adesão",
    image: "/images/plans/ametista.png",
  },
  {
    name: "Quartzo",
    slug: "quartzo",
    tagline: "Plano completo com obstetrícia para empresas e pessoa física",
    image: "/images/plans/quartzo.png",
  },
  {
    name: "Turmalina",
    slug: "turmalina",
    tagline: "Plano de atenção primária com obstetrícia para empresas e pessoa física",
    image: "/images/plans/turmalina.png",
  },
  {
    name: "Rubi",
    slug: "rubi",
    tagline: "Plano ambulatorial e hospitalar para empresas e pessoa física",
    image: "/images/plans/rubi.png",
  },
  {
    name: "Safira",
    slug: "safira",
    tagline: "Plano sênior ambulatorial e hospitalar para pessoa física e por adesão",
    image: "/images/plans/safira.png",
  },
  {
    name: "Topázio",
    slug: "topazio",
    tagline: "Plano ambulatorial empresarial com foco em consultas e prevenção",
    image: "/images/plans/topázio.png",
  },
];

type CellValue = boolean | "partial" | string;

const comparisonRows: { label: string; bySlug: Record<string, CellValue>; note?: string }[] = [
  { label: "Consultas e exames ambulatoriais", bySlug: { diamante: true, ametista: true, quartzo: true, turmalina: true, rubi: true, safira: true, topazio: true } },
  { label: "Internação hospitalar", bySlug: { diamante: true, ametista: true, quartzo: true, turmalina: true, rubi: true, safira: true, topazio: false } },
  { label: "Cobertura obstétrica (parto)", bySlug: { diamante: true, ametista: true, quartzo: true, turmalina: true, rubi: "partial", safira: false, topazio: false }, note: "Rubi: disponível apenas na modalidade por adesão" },
  { label: "Urgência e emergência", bySlug: { diamante: true, ametista: true, quartzo: true, turmalina: true, rubi: true, safira: true, topazio: true } },
  { label: "Cirurgias e procedimentos", bySlug: { diamante: true, ametista: true, quartzo: true, turmalina: true, rubi: true, safira: true, topazio: false } },
  { label: "Quimioterapia e radioterapia", bySlug: { diamante: true, ametista: true, quartzo: true, turmalina: true, rubi: true, safira: true, topazio: true } },
  { label: "Opção de quarto privativo", bySlug: { diamante: true, ametista: false, quartzo: true, turmalina: false, rubi: false, safira: true, topazio: false } },
  { label: "Sem coparticipação", bySlug: { diamante: false, ametista: false, quartzo: false, turmalina: false, rubi: false, safira: false, topazio: false } },
  { label: "Telemedicina inclusa", bySlug: { diamante: true, ametista: true, quartzo: true, turmalina: true, rubi: true, safira: true, topazio: true } },
  { label: "Seguro de vida incluso", bySlug: { diamante: "R$ 50K", ametista: "R$ 50K", quartzo: "R$ 30K", turmalina: "R$ 30K", rubi: "R$ 30K", safira: "R$ 30K", topazio: "R$ 15K" } },
  { label: "Benefício Pet incluso", bySlug: { diamante: true, ametista: true, quartzo: true, turmalina: true, rubi: true, safira: true, topazio: true } },
  { label: "Disponível para empresas", bySlug: { diamante: true, ametista: true, quartzo: true, turmalina: true, rubi: true, safira: false, topazio: true } },
  { label: "Disponível para pessoa física", bySlug: { diamante: false, ametista: false, quartzo: true, turmalina: true, rubi: true, safira: true, topazio: false } },
  { label: "Disponível por adesão", bySlug: { diamante: true, ametista: true, quartzo: true, turmalina: false, rubi: true, safira: true, topazio: false } },
  { label: "Foco em atenção primária", bySlug: { diamante: false, ametista: false, quartzo: false, turmalina: true, rubi: false, safira: false, topazio: false } },
  { label: "Foco no público sênior", bySlug: { diamante: false, ametista: false, quartzo: false, turmalina: false, rubi: false, safira: true, topazio: false } },
];

const comparisonPlans = [
  { name: "Diamante", slug: "diamante" },
  { name: "Ametista", slug: "ametista" },
  { name: "Quartzo", slug: "quartzo" },
  { name: "Turmalina", slug: "turmalina" },
  { name: "Rubi", slug: "rubi" },
  { name: "Safira", slug: "safira" },
  { name: "Topázio", slug: "topazio" },
];

export default async function PlanosPage() {
  const { slugs, activeSlugs } = await getPlansOrder();
  const orderedPlans = reorderBySlug(plans, slugs, activeSlugs);
  const orderedComparisonPlans = reorderBySlug(comparisonPlans, slugs, activeSlugs);

  return (
    <>
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

      {/* Tabela Comparativa */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4">
          <ScrollAnimationWrapper>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Compare os planos
              </h2>
              <p className="text-muted text-lg max-w-2xl mx-auto">
                Veja lado a lado o que cada plano oferece e escolha o que faz mais sentido para você.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper>
            <div className="overflow-x-auto -mx-4 px-4 pb-4">
              <table className="w-full min-w-[800px] border-collapse">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-10 bg-white text-left py-4 px-4 text-sm font-semibold text-muted border-b-2 border-border min-w-[200px]">
                      Cobertura
                    </th>
                    {orderedComparisonPlans.map((p) => (
                      <th
                        key={p.slug}
                        className="py-4 px-3 text-center text-sm font-bold text-foreground border-b-2 border-border whitespace-nowrap"
                      >
                        <a href={`/planos/${p.slug}`} className="hover:text-primary transition-colors">
                          {p.name}
                        </a>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, rowIdx) => (
                    <tr
                      key={rowIdx}
                      className={rowIdx % 2 === 0 ? "bg-white" : "bg-card/50"}
                    >
                      <td className="sticky left-0 z-10 py-3.5 px-4 text-sm text-foreground font-medium border-b border-border/60 min-w-[200px]" style={{ backgroundColor: rowIdx % 2 === 0 ? "white" : "var(--color-card, #f8f9fa)" }}>
                        {row.label}
                        {row.note && (
                          <span className="block text-xs text-muted font-normal mt-0.5">
                            *{row.note}
                          </span>
                        )}
                      </td>
                      {orderedComparisonPlans.map((p) => {
                        const val = row.bySlug[p.slug];
                        return (
                        <td
                          key={p.slug}
                          className="py-3.5 px-3 text-center border-b border-border/60"
                        >
                          {val === true ? (
                            <svg className="w-6 h-6 mx-auto text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                              <circle cx="12" cy="12" r="10" strokeWidth={1.5} className="text-green-100" fill="currentColor" stroke="none" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 12.5l3 3 6-6" className="text-green-600" />
                            </svg>
                          ) : val === "partial" ? (
                            <svg className="w-6 h-6 mx-auto text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                              <circle cx="12" cy="12" r="10" strokeWidth={1.5} className="text-amber-100" fill="currentColor" stroke="none" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8" className="text-amber-500" />
                            </svg>
                          ) : typeof val === "string" ? (
                            <span className="inline-block px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold whitespace-nowrap">
                              {val}
                            </span>
                          ) : (
                            <svg className="w-6 h-6 mx-auto text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                              <circle cx="12" cy="12" r="10" strokeWidth={1.5} className="text-red-50" fill="currentColor" stroke="none" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l6 6M15 9l-6 6" className="text-red-400" />
                            </svg>
                          )}
                        </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-muted mt-4 text-center">
              * Todos os planos seguem o Rol de Procedimentos da ANS. Consulte as condições gerais de cada plano para detalhes completos.
            </p>
          </ScrollAnimationWrapper>
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
