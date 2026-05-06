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

interface PlanData {
  name: string;
  slug: string;
  tagline: string;
  image: string;
  description: string;
  highlights: string[];
  targetAudience: string;
  condicoesGerais?: PlanDocument[];
}

const plansData: Record<string, PlanData> = {
  topazio: {
    name: "Topázio",
    slug: "topazio",
    tagline: "Plano ambulatorial empresarial com foco em consultas e prevenção",
    image: "/images/plans/topázio.png",
    description:
      "O plano Topázio é ambulatorial e voltado para empresas que buscam cuidado preventivo para seus colaboradores. Com foco em consultas regulares, exames e orientação médica, ele garante acompanhamento contínuo sem necessidade de cobertura hospitalar.",
    highlights: [
      "Consultas com clínico geral e especialistas",
      "Exames preventivos e de rotina",
      "Acompanhamento contínuo de saúde",
      "Acesso à rede credenciada organizada",
      "Atendimento humanizado e próximo",
    ],
    targetAudience:
      "Ideal para quem busca um plano com foco em prevenção e acompanhamento regular, com custo acessível.",
    condicoesGerais: [
      { label: "Topázio CE (Ambulatorial)", file: "/docs/condicoes-gerais/topazio-ce-ambulatorial.pdf" },
    ],
  },
  rubi: {
    name: "Rubi",
    slug: "rubi",
    tagline: "Cobertura completa para todas as fases da vida",
    image: "/images/plans/rubi.png",
    description:
      "O plano Rubi oferece cobertura abrangente para toda a família. Com acesso amplo a especialidades, exames e procedimentos, ele é a escolha certa para quem deseja tranquilidade em todas as fases da vida.",
    highlights: [
      "Ampla cobertura de especialidades médicas",
      "Exames de média e alta complexidade",
      "Internações e procedimentos cirúrgicos",
      "Cobertura para todas as faixas etárias",
      "Rede credenciada completa",
    ],
    targetAudience:
      "Perfeito para famílias que buscam cobertura completa e segurança em todas as situações de saúde.",
    condicoesGerais: [
      { label: "Rubi CA QC", file: "/docs/condicoes-gerais/rubi-ca-qc.pdf" },
      { label: "Rubi CE QC", file: "/docs/condicoes-gerais/rubi-ce-qc.pdf" },
    ],
  },
  safira: {
    name: "Safira",
    slug: "safira",
    tagline: "Plano individual e por adesão, com foco em longevidade e prevenção",
    image: "/images/plans/safira.png",
    description:
      "O plano Safira é para quem busca cuidado individual de qualidade. Disponível para contratação por pessoa física e por adesão, oferece acesso a uma rede de atenção primária com foco em prevenção e longevidade.",
    highlights: [
      "Atendimento ágil e sem burocracia",
      "Acesso a profissionais de alta qualidade",
      "Exames e procedimentos com rapidez",
      "Rede credenciada premium",
      "Suporte dedicado ao beneficiário",
    ],
    targetAudience:
      "Ideal para quem busca alta qualidade no atendimento com agilidade e conforto.",
    condicoesGerais: [
      { label: "Safira CA QC", file: "/docs/condicoes-gerais/safira-ca-qc.pdf" },
      { label: "Safira PF QC", file: "/docs/condicoes-gerais/safira-pf-qc.pdf" },
    ],
  },
  turmalina: {
    name: "Turmalina",
    slug: "turmalina",
    tagline: "Cobertura essencial para internações",
    image: "/images/plans/turmalina.png",
    description:
      "O plano Turmalina oferece a cobertura essencial para situações que exigem internação. Uma opção estratégica para quem deseja estar protegido nos momentos mais críticos, com segurança e respaldo médico.",
    highlights: [
      "Cobertura para internações clínicas e cirúrgicas",
      "Atendimento de urgência e emergência",
      "Acompanhamento hospitalar completo",
      "Acesso a rede de hospitais credenciados",
      "Proteção nos momentos mais importantes",
    ],
    targetAudience:
      "Indicado para quem busca proteção essencial focada em internações e situações de urgência.",
    condicoesGerais: [
      { label: "Turmalina CA QC", file: "/docs/condicoes-gerais/turmalina-ca-qc.pdf" },
      { label: "Turmalina CE QC", file: "/docs/condicoes-gerais/turmalina-ce-qc.pdf" },
    ],
  },
  quartzo: {
    name: "Quartzo",
    slug: "quartzo",
    tagline: "Proteção acessível para necessidades essenciais",
    image: "/images/plans/quartzo.png",
    description:
      "O plano Quartzo foi pensado para oferecer proteção acessível sem abrir mão do essencial. Com cobertura para as principais necessidades de saúde, é a porta de entrada para quem quer começar a cuidar de si com qualidade.",
    highlights: [
      "Consultas com clínico geral",
      "Exames básicos e essenciais",
      "Atendimento acessível e humanizado",
      "Cobertura para necessidades fundamentais",
      "Melhor custo-benefício da categoria",
    ],
    targetAudience:
      "Perfeito para quem busca um plano acessível que cubra as necessidades essenciais de saúde.",
    condicoesGerais: [
      { label: "Quartzo CA QC", file: "/docs/condicoes-gerais/quartzo-ca-qc.pdf" },
      { label: "Quartzo CE QC", file: "/docs/condicoes-gerais/quartzo-ce-qc.pdf" },
    ],
  },
  ametista: {
    name: "Ametista",
    slug: "ametista",
    tagline: "Voltado ao público sênior, com acompanhamento próximo e segurança",
    image: "/images/plans/ametista.avif",
    description:
      "O plano Ametista foi pensado para o público sênior que busca tranquilidade e cuidado dedicado. Com cobertura empresarial e foco em acompanhamento próximo, oferece segurança e atenção especializada para quem precisa de cuidados contínuos.",
    highlights: [
      "Acompanhamento dedicado ao público sênior",
      "Cobertura hospitalar com quarto coletivo",
      "Consultas com especialistas em geriatria",
      "Exames preventivos e de rotina",
      "Atendimento humanizado e próximo",
    ],
    targetAudience:
      "Voltado para empresas que desejam oferecer cobertura de saúde dedicada a colaboradores e dependentes sêniores.",
    condicoesGerais: [
      { label: "Ametista CE QC", file: "/docs/condicoes-gerais/ametista-ce-qc.pdf" },
    ],
  },
  diamante: {
    name: "Diamante",
    slug: "diamante",
    tagline: "Plano empresarial com opção de quarto privativo e cobertura completa",
    image: "/images/plans/diamante.png",
    description:
      "O plano Diamante é o plano empresarial com o mais alto nível de conforto. Com opção de quarto privativo e cobertura completa, oferece cuidado eficiente e estrutura hospitalar e ambulatorial para quem valoriza privacidade e qualidade.",
    highlights: [
      "Opção de quarto privativo (exclusivo Diamante)",
      "Cobertura hospitalar e ambulatorial completa",
      "Atendimento de urgência e emergência",
      "Rede credenciada ampla e qualificada",
      "Conforto e privacidade no atendimento",
    ],
    targetAudience:
      "Para empresas que buscam o mais alto padrão de cobertura, com opção de quarto privativo para seus colaboradores.",
    condicoesGerais: [
      { label: "Diamante CE QC", file: "/docs/condicoes-gerais/diamante-ce-qc.pdf" },
      { label: "Diamante CE QP (Quarto Privativo)", file: "/docs/condicoes-gerais/diamante-ce-qp.pdf" },
    ],
  },
  turquesa: {
    name: "Turquesa",
    slug: "turquesa",
    tagline: "Plano empresarial com cobertura hospitalar de alto padrão",
    image: "/images/plans/turquesa.avif",
    description:
      "O plano Turquesa oferece cobertura hospitalar de alto padrão para empresas que valorizam qualidade no atendimento. Com acesso a uma rede credenciada diferenciada, garante cuidado completo e seguro para seus beneficiários.",
    highlights: [
      "Cobertura hospitalar de alto padrão",
      "Atendimento de urgência e emergência",
      "Rede credenciada diferenciada",
      "Internações e procedimentos cirúrgicos",
      "Suporte dedicado ao beneficiário",
    ],
    targetAudience:
      "Para empresas que buscam cobertura hospitalar de qualidade com atendimento diferenciado.",
    condicoesGerais: [
      { label: "Turquesa CE QC", file: "/docs/condicoes-gerais/turquesa-ce-qc.pdf" },
    ],
  },
};

const COMING_SOON_SLUGS = ["ametista", "turquesa"];

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

  if (COMING_SOON_SLUGS.includes(slug)) {
    return {
      title: `Plano ${plan.name} — em breve`,
      description: `Plano ${plan.name} da Viver Saúde em Natal/RN. Em breve.`,
    };
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

  if (COMING_SOON_SLUGS.includes(slug)) {
    return (
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-32 lg:py-40">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimationWrapper>
            <p className="text-accent font-semibold mb-3 uppercase tracking-wide text-sm">
              Plano {plan.name}
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Em breve
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-xl mx-auto mb-10">
              Estamos preparando esta página. Em breve você poderá conhecer o
              plano {plan.name} aqui mesmo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/planos" variant="accent" size="lg">
                Ver outros planos
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
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Plan Header */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20 lg:py-28">
        <div className="container mx-auto px-4">
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

      {/* Highlights */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
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
        <div className="container mx-auto px-4 text-center">
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

      {/* Condições Gerais Download */}
      {plan.condicoesGerais && plan.condicoesGerais.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
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
      <section className="py-16 lg:py-20 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
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
