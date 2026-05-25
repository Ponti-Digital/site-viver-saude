import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ScrollAnimationWrapper } from "@/components/shared/ScrollAnimationWrapper";
import { WHATSAPP_URL } from "@/lib/constants/site";
import type { Metadata } from "next";

interface PlanDocument {
  label: string;
  file: string;
}

interface PlanBenefit {
  name: string;
  description: string;
  value: string;
}

interface PlanModality {
  coparticipacao: string;
  acomodacao: string;
  contratacao: string;
}

interface PlanData {
  name: string;
  slug: string;
  tagline: string;
  image: string;
  description: string;
  audienceLabel: string;
  coverageType: string;
  region: string;
  startingPrice: string;
  highlights: string[];
  targetAudience: string;
  benefits: PlanBenefit[];
  modalities: PlanModality[];
  condicoesGerais?: PlanDocument[];
}

const REGION_NATAL_PARNAMIRIM_SGA = "Natal, Parnamirim, São Gonçalo do Amarante";
const REGION_AMETISTA =
  "Natal, Parnamirim, São Gonçalo do Amarante, Macaíba, Goianinha, Canguaretama, Extremoz, Ceará Mirim, São José de Mipibu";
const REGION_DIAMANTE =
  "Natal, Parnamirim, São Gonçalo do Amarante, Macaíba, Goianinha, Canguaretama, Extremoz, Ceará Mirim, São José de Mipibu, Macau, Alto do Rodrigues, Açu, Mossoró, Caicó, Currais Novos, Nísia Floresta, Guamaré, Pendências, Pau dos Ferros";

const BENEFIT_TELEMEDICINA: PlanBenefit = {
  name: "Telemedicina",
  description: "Consultas médicas online disponíveis 24h",
  value: "Incluso",
};
const BENEFIT_REMOCAO: PlanBenefit = {
  name: "Remoção",
  description: "Serviço de remoção de pacientes",
  value: "Incluso",
};
const BENEFIT_PET: PlanBenefit = {
  name: "Benefício Pet",
  description: "Cobertura de saúde para pets",
  value: "Incluso",
};
const seguroVida = (valor: string): PlanBenefit => ({
  name: "Seguro de Vida",
  description: `Seguro de vida R$ ${valor}`,
  value: "Incluso",
});

const baseBenefits = (seguroValor: string): PlanBenefit[] => [
  BENEFIT_TELEMEDICINA,
  BENEFIT_REMOCAO,
  BENEFIT_PET,
  seguroVida(seguroValor),
];

const plansData: Record<string, PlanData> = {
  diamante: {
    name: "Diamante",
    slug: "diamante",
    tagline:
      "Plano empresarial completo, com obstetrícia e opção de quarto privativo",
    image: "/images/plans/diamante.png",
    description:
      "O Viver Diamante é o plano empresarial de mais alto nível da Viver Saúde. Com cobertura ambulatorial e hospitalar completa, incluindo obstetrícia, e opção de quarto privativo, é a escolha para empresas que querem oferecer o melhor aos seus colaboradores em qualquer fase da vida.",
    audienceLabel: "Empresarial",
    coverageType: "Ambulatorial + Hospitalar com Obstetrícia",
    region: REGION_DIAMANTE,
    startingPrice: "A partir de R$ 171,41",
    highlights: [
      "Cobertura ambulatorial e hospitalar completa",
      "Cobertura obstétrica (parto e gestação)",
      "Opção de quarto privativo",
      "Atendimento de urgência e emergência",
      "Abrangência em todo o Rio Grande do Norte",
    ],
    targetAudience:
      "Para empresas que buscam o mais alto padrão de cobertura, com obstetrícia e opção de quarto privativo para seus colaboradores.",
    benefits: baseBenefits("50.000"),
    modalities: [
      { coparticipacao: "Com coparticipação completa", acomodacao: "Quarto Coletivo", contratacao: "Empresarial" },
      { coparticipacao: "Com coparticipação completa", acomodacao: "Quarto Privativo", contratacao: "Empresarial" },
      { coparticipacao: "Com coparticipação básica", acomodacao: "Quarto Coletivo", contratacao: "Empresarial" },
      { coparticipacao: "Com coparticipação básica", acomodacao: "Quarto Privativo", contratacao: "Empresarial" },
      { coparticipacao: "Com coparticipação completa", acomodacao: "Quarto Coletivo", contratacao: "Por Adesão" },
      { coparticipacao: "Com coparticipação completa", acomodacao: "Quarto Privativo", contratacao: "Por Adesão" },
      { coparticipacao: "Com coparticipação básica", acomodacao: "Quarto Coletivo", contratacao: "Por Adesão" },
      { coparticipacao: "Com coparticipação básica", acomodacao: "Quarto Privativo", contratacao: "Por Adesão" },
    ],
    condicoesGerais: [
      { label: "Diamante CE QC", file: "/docs/condicoes-gerais/diamante-ce-qc.pdf" },
      { label: "Diamante CE QP (Quarto Privativo)", file: "/docs/condicoes-gerais/diamante-ce-qp.pdf" },
    ],
  },
  ametista: {
    name: "Ametista",
    slug: "ametista",
    tagline: "Plano completo com obstetrícia para empresas e por adesão",
    image: "/images/plans/ametista.png",
    description:
      "O Viver Ametista oferece cobertura ambulatorial e hospitalar completa, incluindo obstetrícia. Disponível para contratação empresarial e por adesão, combina segurança, acompanhamento próximo e atenção integral à saúde física e emocional dos beneficiários.",
    audienceLabel: "Empresarial e Por Adesão",
    coverageType: "Ambulatorial + Hospitalar com Obstetrícia",
    region: REGION_AMETISTA,
    startingPrice: "A partir de R$ 121,80",
    highlights: [
      "Cobertura ambulatorial e hospitalar completa",
      "Cobertura obstétrica (parto e gestação)",
      "Atendimento de urgência e emergência",
      "Disponível para empresas e por adesão",
      "Abrangência em 9 municípios do RN",
    ],
    targetAudience:
      "Para empresas e entidades de adesão que buscam cobertura completa com obstetrícia e uma abrangência regional ampliada no Rio Grande do Norte.",
    benefits: baseBenefits("50.000"),
    modalities: [
      { coparticipacao: "Com coparticipação completa", acomodacao: "Quarto Coletivo", contratacao: "Empresarial" },
      { coparticipacao: "Com coparticipação básica", acomodacao: "Quarto Coletivo", contratacao: "Empresarial" },
      { coparticipacao: "Com coparticipação completa", acomodacao: "Quarto Coletivo", contratacao: "Por Adesão" },
      { coparticipacao: "Com coparticipação básica", acomodacao: "Quarto Coletivo", contratacao: "Por Adesão" },
    ],
    condicoesGerais: [
      { label: "Ametista CE QC", file: "/docs/condicoes-gerais/ametista-ce-qc.pdf" },
    ],
  },
  quartzo: {
    name: "Quartzo",
    slug: "quartzo",
    tagline: "Plano completo com obstetrícia para empresas e pessoa física",
    image: "/images/plans/quartzo.png",
    description:
      "O Viver Quartzo oferece cobertura ambulatorial e hospitalar completa, com obstetrícia. Disponível tanto para contratação empresarial quanto para pessoa física, é um plano robusto para quem quer proteção integral em todas as fases da vida, incluindo a chegada de um filho.",
    audienceLabel: "Empresarial e Pessoa Física",
    coverageType: "Ambulatorial + Hospitalar com Obstetrícia",
    region: REGION_NATAL_PARNAMIRIM_SGA,
    startingPrice: "A partir de R$ 110,80",
    highlights: [
      "Cobertura ambulatorial e hospitalar completa",
      "Cobertura obstétrica (parto e gestação)",
      "Opção de quarto privativo (modalidade QP)",
      "Atendimento de urgência e emergência",
      "Disponível para empresas e pessoa física",
    ],
    targetAudience:
      "Para quem busca um plano completo, com cobertura ambulatorial, hospitalar e obstétrica, disponível tanto para contratação empresarial quanto individual.",
    benefits: baseBenefits("30.000"),
    modalities: [
      { coparticipacao: "Com coparticipação completa", acomodacao: "Quarto Coletivo", contratacao: "Empresarial" },
      { coparticipacao: "Com coparticipação completa", acomodacao: "Quarto Privativo", contratacao: "Empresarial" },
      { coparticipacao: "Com coparticipação básica", acomodacao: "Quarto Coletivo", contratacao: "Empresarial" },
      { coparticipacao: "Com coparticipação básica", acomodacao: "Quarto Privativo", contratacao: "Empresarial" },
      { coparticipacao: "Com coparticipação completa", acomodacao: "Quarto Coletivo", contratacao: "Por Adesão" },
      { coparticipacao: "Com coparticipação completa", acomodacao: "Quarto Privativo", contratacao: "Por Adesão" },
      { coparticipacao: "Com coparticipação básica", acomodacao: "Quarto Coletivo", contratacao: "Por Adesão" },
      { coparticipacao: "Com coparticipação básica", acomodacao: "Quarto Privativo", contratacao: "Por Adesão" },
      { coparticipacao: "Com coparticipação completa", acomodacao: "Quarto Coletivo", contratacao: "Pessoa Física" },
      { coparticipacao: "Com coparticipação completa", acomodacao: "Quarto Privativo", contratacao: "Pessoa Física" },
      { coparticipacao: "Com coparticipação básica", acomodacao: "Quarto Coletivo", contratacao: "Pessoa Física" },
      { coparticipacao: "Com coparticipação básica", acomodacao: "Quarto Privativo", contratacao: "Pessoa Física" },
    ],
    condicoesGerais: [
      { label: "Quartzo CA QC", file: "/docs/condicoes-gerais/quartzo-ca-qc.pdf" },
      { label: "Quartzo CE QC", file: "/docs/condicoes-gerais/quartzo-ce-qc.pdf" },
    ],
  },
  turmalina: {
    name: "Turmalina",
    slug: "turmalina",
    tagline:
      "Plano de atenção primária com obstetrícia para empresas e pessoa física",
    image: "/images/plans/turmalina.png",
    description:
      "O Viver Turmalina é um plano de atenção primária à saúde, com cobertura ambulatorial e hospitalar completa, incluindo obstetrícia. Com foco no acompanhamento contínuo, prevenção e gestão da saúde, é ideal para quem valoriza cuidado regular e integral ao longo da vida.",
    audienceLabel: "Empresarial e Pessoa Física",
    coverageType: "Ambulatorial + Hospitalar com Obstetrícia",
    region: REGION_NATAL_PARNAMIRIM_SGA,
    startingPrice: "A partir de R$ 98,37",
    highlights: [
      "Cobertura ambulatorial e hospitalar completa",
      "Cobertura obstétrica (parto e gestação)",
      "Foco em atenção primária e acompanhamento contínuo",
      "Atendimento de urgência e emergência",
      "Disponível para empresas e pessoa física",
    ],
    targetAudience:
      "Para quem busca um plano com foco em prevenção, acompanhamento regular e cobertura completa, incluindo obstetrícia.",
    benefits: baseBenefits("30.000"),
    modalities: [
      { coparticipacao: "Com coparticipação completa", acomodacao: "Quarto Coletivo", contratacao: "Empresarial" },
      { coparticipacao: "Com coparticipação básica", acomodacao: "Quarto Coletivo", contratacao: "Empresarial" },
      { coparticipacao: "Com coparticipação completa", acomodacao: "Quarto Coletivo", contratacao: "Pessoa Física" },
      { coparticipacao: "Com coparticipação básica", acomodacao: "Quarto Coletivo", contratacao: "Pessoa Física" },
    ],
    condicoesGerais: [
      { label: "Turmalina CA QC", file: "/docs/condicoes-gerais/turmalina-ca-qc.pdf" },
      { label: "Turmalina CE QC", file: "/docs/condicoes-gerais/turmalina-ce-qc.pdf" },
    ],
  },
  rubi: {
    name: "Rubi",
    slug: "rubi",
    tagline: "Plano ambulatorial e hospitalar para empresas e pessoa física",
    image: "/images/plans/rubi.png",
    description:
      "O Viver Rubi oferece cobertura ambulatorial e hospitalar completa para quem busca segurança no dia a dia e nas situações que exigem internação. Disponível para contratação empresarial e pessoa física, combina acesso a consultas, exames e procedimentos com uma rede credenciada qualificada.",
    audienceLabel: "Empresarial e Pessoa Física",
    coverageType: "Ambulatorial + Hospitalar",
    region: REGION_NATAL_PARNAMIRIM_SGA,
    startingPrice: "A partir de R$ 104,53",
    highlights: [
      "Cobertura ambulatorial e hospitalar completa",
      "Consultas com clínico geral e especialistas",
      "Exames e procedimentos cirúrgicos",
      "Atendimento de urgência e emergência",
      "Disponível para empresas e pessoa física",
    ],
    targetAudience:
      "Para quem busca cobertura ambulatorial e hospitalar completa, com bom custo-benefício, tanto na modalidade empresarial quanto individual.",
    benefits: baseBenefits("30.000"),
    modalities: [
      { coparticipacao: "Com coparticipação completa", acomodacao: "Quarto Coletivo", contratacao: "Empresarial" },
      { coparticipacao: "Com coparticipação básica", acomodacao: "Quarto Coletivo", contratacao: "Empresarial" },
      { coparticipacao: "Com coparticipação completa", acomodacao: "Quarto Coletivo", contratacao: "Pessoa Física" },
      { coparticipacao: "Com coparticipação básica", acomodacao: "Quarto Coletivo", contratacao: "Pessoa Física" },
    ],
    condicoesGerais: [
      { label: "Rubi CA QC", file: "/docs/condicoes-gerais/rubi-ca-qc.pdf" },
      { label: "Rubi CE QC", file: "/docs/condicoes-gerais/rubi-ce-qc.pdf" },
    ],
  },
  safira: {
    name: "Safira",
    slug: "safira",
    tagline:
      "Plano sênior ambulatorial e hospitalar para pessoa física e por adesão",
    image: "/images/plans/safira.png",
    description:
      "O Viver Safira é um plano desenvolvido especialmente para o público sênior. Com cobertura ambulatorial e hospitalar, oferece atenção contínua às necessidades de saúde do idoso, com foco em prevenção, acompanhamento regular e qualidade de vida em cada fase.",
    audienceLabel: "Sênior",
    coverageType: "Ambulatorial + Hospitalar",
    region: REGION_NATAL_PARNAMIRIM_SGA,
    startingPrice: "A partir de R$ 964,11 (faixa 59+ anos)",
    highlights: [
      "Cobertura ambulatorial e hospitalar completa",
      "Desenvolvido para o perfil sênior",
      "Opção de quarto privativo (modalidade QP)",
      "Atendimento de urgência e emergência",
      "Disponível para pessoa física e por adesão",
    ],
    targetAudience:
      "Para pessoas que buscam um plano desenvolvido para as necessidades do público sênior, com cobertura ambulatorial e hospitalar, disponível para pessoa física e por adesão.",
    benefits: baseBenefits("30.000"),
    modalities: [
      { coparticipacao: "Com coparticipação completa", acomodacao: "Quarto Coletivo", contratacao: "Empresarial" },
      { coparticipacao: "Com coparticipação básica", acomodacao: "Quarto Coletivo", contratacao: "Empresarial" },
      { coparticipacao: "Com coparticipação completa", acomodacao: "Quarto Coletivo", contratacao: "Por Adesão" },
      { coparticipacao: "Com coparticipação completa", acomodacao: "Quarto Privativo", contratacao: "Por Adesão" },
      { coparticipacao: "Com coparticipação básica", acomodacao: "Quarto Coletivo", contratacao: "Por Adesão" },
      { coparticipacao: "Com coparticipação básica", acomodacao: "Quarto Privativo", contratacao: "Por Adesão" },
      { coparticipacao: "Com coparticipação completa", acomodacao: "Quarto Coletivo", contratacao: "Pessoa Física" },
      { coparticipacao: "Com coparticipação completa", acomodacao: "Quarto Privativo", contratacao: "Pessoa Física" },
      { coparticipacao: "Com coparticipação básica", acomodacao: "Quarto Coletivo", contratacao: "Pessoa Física" },
      { coparticipacao: "Com coparticipação básica", acomodacao: "Quarto Privativo", contratacao: "Pessoa Física" },
    ],
    condicoesGerais: [
      { label: "Safira CA QC", file: "/docs/condicoes-gerais/safira-ca-qc.pdf" },
      { label: "Safira PF QC", file: "/docs/condicoes-gerais/safira-pf-qc.pdf" },
    ],
  },
  topazio: {
    name: "Topázio",
    slug: "topazio",
    tagline: "Plano ambulatorial empresarial com foco em consultas e prevenção",
    image: "/images/plans/topázio.png",
    description:
      "O Viver Topázio é um plano ambulatorial voltado para empresas que querem investir na saúde preventiva dos seus colaboradores. Com acesso a consultas regulares, exames e acompanhamento médico contínuo, garante cuidado no dia a dia sem necessidade de cobertura hospitalar.",
    audienceLabel: "Empresarial",
    coverageType: "Ambulatorial",
    region: REGION_NATAL_PARNAMIRIM_SGA,
    startingPrice: "A partir de R$ 69,90",
    highlights: [
      "Consultas com clínico geral e especialistas",
      "Exames preventivos e de rotina",
      "Acompanhamento contínuo de saúde",
      "Atendimento humanizado e próximo",
      "Plano exclusivo para contratação empresarial",
    ],
    targetAudience:
      "Para empresas que buscam um plano ambulatorial acessível, com foco em prevenção e acompanhamento regular da saúde dos colaboradores.",
    benefits: baseBenefits("15.000"),
    modalities: [
      { coparticipacao: "Com coparticipação completa", acomodacao: "Não se aplica (ambulatorial)", contratacao: "Empresarial" },
      { coparticipacao: "Com coparticipação básica", acomodacao: "Não se aplica (ambulatorial)", contratacao: "Empresarial" },
    ],
    condicoesGerais: [
      { label: "Topázio CE (Ambulatorial)", file: "/docs/condicoes-gerais/topazio-ce-ambulatorial.pdf" },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(plansData).map((slug) => ({ slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const plan = plansData[slug];

  if (!plan) {
    return { title: "Plano não encontrado" };
  }

  return {
    title: `Plano ${plan.name}`,
    description: `${plan.tagline}. Conheça o plano ${plan.name} da Viver Saúde em Natal/RN.`,
  };
}

export default async function PlanPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const plan = plansData[slug];

  if (!plan) {
    notFound();
  }

  return (
    <>
      {/* Plan Header */}
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

      {/* Highlights + preço */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <ScrollAnimationWrapper>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-3">
              O que o plano {plan.name} oferece
            </h2>
            <p className="text-center text-2xl md:text-3xl font-bold text-primary mb-12">
              {plan.startingPrice}
            </p>
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
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
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Modalidades disponíveis
              </h2>
              <p className="text-muted text-lg max-w-2xl mx-auto">
                Este plano está disponível nas combinações de coparticipação, acomodação e contratação abaixo.
              </p>
            </div>
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper>
            <div className="max-w-4xl mx-auto overflow-x-auto -mx-4 px-4">
              <table className="w-full min-w-[600px] bg-white rounded-xl overflow-hidden border border-border">
                <thead>
                  <tr className="bg-primary/5">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Coparticipação</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Acomodação</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Contratação</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.modalities.map((m, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-card/40"}>
                      <td className="py-3 px-4 text-sm text-foreground border-t border-border/60">{m.coparticipacao}</td>
                      <td className="py-3 px-4 text-sm text-foreground border-t border-border/60">{m.acomodacao}</td>
                      <td className="py-3 px-4 text-sm text-foreground border-t border-border/60">{m.contratacao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
