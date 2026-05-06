import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ScrollAnimationWrapper } from "@/components/shared/ScrollAnimationWrapper";
import { WHATSAPP_URL } from "@/lib/constants/site";

export const metadata = {
  title: "Planos",
  description:
    "Encontre o plano de saúde ideal para você e sua família. Conheça os planos Topázio, Rubi, Safira, Turmalina, Quartzo e Diamante da Viver Saúde.",
};

const plans = [
  {
    name: "Topázio",
    slug: "topazio",
    tagline: "Plano ambulatorial empresarial com foco em consultas e prevenção",
    image: "/images/plans/topázio.png",
  },
  {
    name: "Rubi",
    slug: "rubi",
    tagline: "Cobertura completa para empresas e adesão, com rede ampla",
    image: "/images/plans/rubi.png",
  },
  {
    name: "Safira",
    slug: "safira",
    tagline: "Plano individual e por adesão, com foco em longevidade e prevenção",
    image: "/images/plans/safira.png",
  },
  {
    name: "Turmalina",
    slug: "turmalina",
    tagline: "Cuidado integral com acompanhamento contínuo da saúde",
    image: "/images/plans/turmalina.png",
  },
  {
    name: "Quartzo",
    slug: "quartzo",
    tagline: "Completo e prático, com atendimento ambulatorial e hospitalar",
    image: "/images/plans/quartzo.png",
  },
  {
    name: "Diamante",
    slug: "diamante",
    tagline: "Plano empresarial com opção de quarto privativo e cobertura completa",
    image: "/images/plans/diamante.png",
  },
];

export default function PlanosPage() {
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
            {plans.map((plan, idx) => (
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
                    {[
                      { name: "Topázio", slug: "topazio" },
                      { name: "Quartzo", slug: "quartzo" },
                      { name: "Rubi", slug: "rubi" },
                      { name: "Turmalina", slug: "turmalina" },
                      { name: "Safira", slug: "safira" },
                      { name: "Diamante", slug: "diamante" },
                    ].map((p) => (
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
                  {[
                    {
                      label: "Consultas e exames ambulatoriais",
                      values: [true, true, true, true, true, true],
                    },
                    {
                      label: "Internação hospitalar",
                      values: [false, true, true, true, true, true],
                    },
                    {
                      label: "Cobertura obstétrica (parto)",
                      values: [false, true, "partial", true, true, true],
                      note: "Rubi: disponível apenas na modalidade por adesão",
                    },
                    {
                      label: "Urgência e emergência",
                      values: [true, true, true, true, true, true],
                    },
                    {
                      label: "Cirurgias e procedimentos",
                      values: [false, true, true, true, true, true],
                    },
                    {
                      label: "Quimioterapia e radioterapia",
                      values: [true, true, true, true, true, true],
                    },
                    {
                      label: "Opção de quarto privativo",
                      values: [false, false, false, false, false, true],
                    },
                    {
                      label: "Sem coparticipação",
                      values: [false, false, false, false, false, false],
                    },
                    {
                      label: "Disponível para pessoa física",
                      values: [false, false, false, false, true, false],
                    },
                    {
                      label: "Disponível por adesão",
                      values: [false, true, true, true, true, false],
                    },
                    {
                      label: "Foco no público sênior",
                      values: [false, false, false, false, false, false],
                    },
                  ].map((row, rowIdx) => (
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
                      {row.values.map((val, colIdx) => (
                        <td
                          key={colIdx}
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
                          ) : (
                            <svg className="w-6 h-6 mx-auto text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                              <circle cx="12" cy="12" r="10" strokeWidth={1.5} className="text-red-50" fill="currentColor" stroke="none" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l6 6M15 9l-6 6" className="text-red-400" />
                            </svg>
                          )}
                        </td>
                      ))}
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
