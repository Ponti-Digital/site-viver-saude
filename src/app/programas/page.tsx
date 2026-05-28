import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ScrollAnimationWrapper } from "@/components/shared/ScrollAnimationWrapper";
import { ProgramEnrollButton } from "@/components/sections/ProgramEnrollButton";

export const metadata = {
  title: "Programas Viver Melhor 2.6 — Qualidade de Vida",
  description:
    "Viver Melhor 2.6: programas de qualidade de vida sem custo adicional. Tempo de Viver (60+), Medida Certa (obesidade) e Viver Sem Limites (fibromialgia). Equipe multiprofissional na CASA em Tirol, Natal/RN.",
  alternates: { canonical: "/programas" },
  openGraph: {
    title: "Viver Melhor 2.6 — Programas Viver Saúde",
    description: "Programas de qualidade de vida sem custo adicional para beneficiários.",
    url: "https://planoviversaude.com.br/programas",
  },
};

const PHONE_1100_TEL = "tel:+558431141100";
const PHONE_1122_TEL = "tel:+558431141122";
const WHATSAPP_1100 = "https://wa.me/558431141100";
const CASA_ADDRESS = "Rua Maxaranguape, 920 — Tirol, Natal/RN";
const CASA_ADDRESS_PT = "Rua Maxaranguape, 920, Tirol, Natal/RN";

function programWhatsapp(programName: string) {
  const message = `Olá! Gostaria de participar do ${programName}.`;
  return `${WHATSAPP_1100}?text=${encodeURIComponent(message)}`;
}

function comingSoonWhatsapp(programName: string) {
  const message = `Olá! Gostaria de saber mais sobre o ${programName}.`;
  return `${WHATSAPP_1100}?text=${encodeURIComponent(message)}`;
}

function ProgramLogo({
  src,
  alt,
  size = "md",
}: {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg";
}) {
  if (!src) return null;
  const dims = { sm: 128, md: 160, lg: 224 };
  const px = dims[size];
  const containerClasses = {
    sm: "h-32 w-32",
    md: "h-40 w-40",
    lg: "h-56 w-full max-w-xs",
  };
  return (
    <div
      className={`relative flex items-center justify-center p-4 ${containerClasses[size]}`}
    >
      <Image
        src={src}
        alt={alt}
        width={px}
        height={px}
        className="object-contain w-full h-full"
      />
    </div>
  );
}

function SeloEndosso({ size = "sm" }: { size?: "sm" | "md" }) {
  const sizeClasses =
    size === "sm"
      ? "text-[10px] px-2 py-0.5 tracking-wider"
      : "text-xs px-3 py-1 tracking-wider";
  return (
    <span
      className={`inline-flex items-center rounded-full bg-primary/10 text-primary font-semibold uppercase border border-primary/20 ${sizeClasses}`}
      aria-label='Selo "Viver Melhor 2.6"'
    >
      {/* TODO: asset não encontrado em MEDIA_REFERENCES.md — selo "Viver Melhor 2.6" reduzido (80–100px) em SVG/PNG fundo transparente */}
      Viver Melhor 2.6
    </span>
  );
}

type AvailableLine = {
  slug: string;
  cardNumber: string;
  lineTitle: string;
  programName: string;
  cardName: string;
  cardSummary: string;
  status: "available";
  logoSrc?: string;
  introduction: string;
  aboutCondition?: { heading: string; text: string };
  benefits: string[];
  howItWorks: string;
  whoCanParticipate: string;
  registrationForm: string;
};

type ComingSoonLine = {
  slug: string;
  cardNumber: string;
  lineTitle: string;
  programName: string;
  cardName: string;
  cardSummary: string;
  status: "coming-soon";
  logoSrc?: string;
};

type LineOfCare = AvailableLine | ComingSoonLine;

const linesOfCare: LineOfCare[] = [
  {
    slug: "tempo-de-viver",
    cardNumber: "Linha de Cuidado 01",
    lineTitle: "Linha de Cuidado à Saúde Integral da Pessoa Idosa",
    programName: "Programa Tempo de Viver 2.6: A Cultura do Cuidado",
    cardName: "Tempo de Viver 2.6",
    cardSummary:
      "Cuidado integral com a saúde do idoso e envelhecimento ativo.",
    status: "available",
    logoSrc: "/images/programas/tempo-de-viver.png",
    introduction:
      "Programa de atendimento integrado à saúde dos beneficiários com 60 anos ou mais, com acompanhamento constante por uma equipe multiprofissional e interdisciplinar. Tem como objetivo desenvolver ações que estimulem o autocuidado, com o apoio da família ou de cuidadores, para promoção à saúde, prevenção de riscos e doenças típicas dessa fase da vida ou complicações de doenças pré-existentes. A coordenação do cuidado é realizada por uma equipe de profissionais da saúde, sem custos extras no plano de saúde.",
    benefits: [
      "Acompanhamento periódico por equipe multidisciplinar (médico, enfermeiro, nutricionista, psicólogo, educador físico, entre outros)",
      "Avaliação funcional do idoso pelo questionário IVCF-20",
      "Elaboração do mapa de saúde pela plataforma Life Up",
      "Plano de cuidado personalizado elaborado a partir das necessidades do participante",
      "Pasta da saúde impressa com informações pessoais e médicas do beneficiário",
      "App Life Up para acompanhamento do programa",
      "Atividades na CASA: confraternizações, cursos, treinamentos, oficinas de relaxamento, movimento, hidroginástica e artes",
      "Atividades em parques e ruas (corridas e caminhadas)",
      "Visita domiciliar com profissionais da equipe multidisciplinar, quando necessária",
      "Descontos com parceiros (farmácias, lojas, viagens, academias e clubes)",
      "Isenção de coparticipação em todos os atendimentos com a equipe de referência",
      "Isenção de coparticipação nos exames laboratoriais definidos no plano de cuidado",
      "Coleta de exame de sangue domiciliar na Grande Natal, quando solicitado pela equipe médica",
    ],
    howItWorks:
      "Participando do Programa Tempo de Viver 2.6, o cliente terá uma equipe multiprofissional dedicada ao seu cuidado integral. Após a avaliação inicial, será traçado um acompanhamento garantindo a assistência necessária em todos os níveis de atenção: primária, especializada, hospitalar, domiciliar e reabilitação, sem custos adicionais ao plano.",
    whoCanParticipate:
      "Clientes da Viver Saúde com idade igual ou acima de 60 anos, em dia com as obrigações do seu plano.",
    registrationForm:
      "Preenchendo e enviando o formulário do Programa Tempo de Viver no site da Viver Saúde, na seção Programas de Qualidade de Vida Viver Melhor.",
  },
  {
    slug: "viver-na-medida-certa",
    cardNumber: "Linha de Cuidado 02",
    lineTitle: "Linha de Cuidado da Obesidade",
    programName: "Programa Viver na Medida Certa 2.6",
    cardName: "Viver na Medida Certa 2.6",
    cardSummary:
      "Tratamento da obesidade com equipe multiprofissional e cuidado longitudinal.",
    status: "available",
    logoSrc: "/images/programas/viver-na-medida-certa.png",
    introduction:
      "Programa de atendimento integrado aos beneficiários da Viver Saúde com obesidade, com acompanhamento por equipe multiprofissional e interdisciplinar. Trata a obesidade como doença crônica, com manejo estruturado e escalonado, visando a redução de peso de forma saudável e sustentável. A coordenação do cuidado é realizada por uma equipe de saúde multidisciplinar, sem custos extras para o beneficiário.",
    aboutCondition: {
      heading: "O que é obesidade?",
      text: "A obesidade é uma doença crônica, recidivante e multifatorial, que decorre do acúmulo excessivo de tecido adiposo no organismo. Está associada ao desenvolvimento de complicações metabólicas que aumentam o risco de doenças cardiovasculares, diabetes mellitus tipo 2, diversos tipos de câncer, cirrose, entre outras — reduzindo a qualidade e a expectativa de vida. Quanto maior a medida da circunferência abdominal, maior o risco de doenças cardiovasculares, diabetes tipo 2 e mortalidade.",
    },
    benefits: [
      "Acompanhamento periódico por equipe multidisciplinar (médico, enfermeiro, nutricionista, psicólogo, educador físico, entre outros)",
      "Avaliação antropométrica com bioimpedância",
      "Elaboração do mapa de saúde pela plataforma Life Up",
      "Plano de acompanhamento personalizado a partir das necessidades do participante",
      "Pasta da saúde impressa com informações pessoais e médicas do beneficiário",
      "App Life Up para acompanhamento do programa",
      "Atividades na CASA: confraternizações, cursos, treinamentos, oficinas de movimento, culinária e hidroginástica",
      "Atividades em parques e ruas (corridas e caminhadas)",
      "Descontos com parceiros (farmácias, lojas, viagens, academias e clubes)",
      "Isenção de coparticipação em todos os atendimentos com a equipe de referência",
      "Isenção de coparticipação nos exames laboratoriais definidos no plano de cuidado",
      "Coleta de exame de sangue domiciliar na Grande Natal, quando solicitado pela equipe médica",
    ],
    howItWorks:
      "Participando do Programa Viver na Medida Certa 2.6, o cliente terá uma equipe multiprofissional dedicada ao seu cuidado integral. Após a avaliação inicial, será traçado um acompanhamento garantindo a assistência necessária em todos os níveis de atenção — primária, especializada, hospitalar e reabilitação — sem custos adicionais ao plano.",
    whoCanParticipate:
      "Clientes adultos da Operadora Viver Saúde com obesidade, com ou sem comorbidades. Subgrupos prioritários: diabetes, hipertensão, dislipidemia, apneia obstrutiva do sono, doença hepática metabólica, osteoartrose incapacitante e alto risco cardiovascular.",
    registrationForm:
      "Preenchendo e enviando o formulário do Programa Viver na Medida Certa no site da Viver Saúde, na seção Programas de Qualidade de Vida Viver Melhor.",
  },
  {
    slug: "viver-sem-limites",
    cardNumber: "Linha de Cuidado 03",
    lineTitle: "Linha de Cuidado da Dor Crônica",
    programName: "Programa Viver Sem Limites 2.6: Fibromialgia",
    cardName: "Viver Sem Limites 2.6",
    cardSummary:
      "Acompanhamento especializado para fibromialgia e dor crônica.",
    status: "available",
    logoSrc: "/images/programas/viver-sem-limites.png",
    introduction:
      "Programa de atendimento integrado aos beneficiários da Viver Saúde com diagnóstico de fibromialgia, com acompanhamento por equipe multiprofissional e interdisciplinar. Tem como objetivo melhorar a qualidade de vida dos pacientes, aliviando a dor, melhorando o sono e o humor, com manejo combinado de orientações sobre estilo de vida, abordagens cognitivas, farmacológicas e técnicas de reabilitação quando necessárias, com o foco no cuidado centrado no paciente.",
    aboutCondition: {
      heading: "O que é fibromialgia?",
      text: "A fibromialgia é uma síndrome caracterizada por dor crônica generalizada, geralmente envolvendo regiões de músculos e tendões, com outros sintomas como fadiga, humor negativo, diminuição da qualidade do sono e dificuldade de concentração. A causa não é totalmente conhecida, porém avanços científicos demonstram a participação da predisposição genética e que eventos emocionais traumáticos podem ser gatilhos, trazendo alterações no processamento da dor pelo sistema nervoso central.",
    },
    benefits: [
      "Acompanhamento periódico por equipe multidisciplinar (médico, enfermeiro, nutricionista, psicólogo, educador físico, entre outros)",
      "Avaliação antropométrica com bioimpedância",
      "Elaboração do mapa de saúde pela plataforma Life Up",
      "Plano de acompanhamento personalizado a partir das necessidades do participante",
      "Pasta da saúde impressa com informações pessoais e médicas do beneficiário",
      "App Life Up para acompanhamento do programa",
      "Atividades na CASA: confraternizações, cursos, treinamentos, oficinas de movimento, hidroginástica, gestão de estresse e culinária",
      "Atividades em parques e ruas (corridas e caminhadas)",
      "Descontos com parceiros (farmácias, lojas, viagens, academias e clubes)",
      "Isenção de coparticipação em todos os atendimentos com a equipe de referência",
      "Isenção de coparticipação nos exames laboratoriais definidos no plano de cuidado",
      "Coleta de exame de sangue domiciliar na Grande Natal, quando solicitado pela equipe médica",
    ],
    howItWorks:
      "Participando do Programa Viver Sem Limites 2.6, o cliente terá uma equipe multiprofissional dedicada ao seu cuidado integral. Após a avaliação inicial, será traçado um acompanhamento garantindo a assistência necessária em todos os níveis de atenção, de acordo com o plano terapêutico definido pela coordenação do cuidado, sem custos adicionais ao plano.",
    whoCanParticipate:
      "Clientes da Operadora Viver Saúde com diagnóstico de fibromialgia.",
    registrationForm:
      "Preenchendo e enviando o formulário do Programa Viver Sem Limites no site da Viver Saúde, na seção Programas de Qualidade de Vida Viver Melhor.",
  },
  {
    slug: "viver-cuidando-de-quem-cuida",
    cardNumber: "Linha de Cuidado 04",
    lineTitle: "Linha de Cuidado da Saúde do Trabalhador",
    programName: "Programa Viver Cuidando de Quem Cuida 2.6",
    cardName: "Viver Cuidando de Quem Cuida 2.6",
    cardSummary: "Saúde integral do trabalhador.",
    status: "coming-soon",
    logoSrc: "/images/programas/viver-cuidando-de-quem-cuida.png",
  },
  {
    slug: "viver-renova-mente",
    cardNumber: "Linha de Cuidado 05",
    lineTitle: "Linha de Cuidado da Saúde Mental",
    programName: "Programa Viver Renova Mente 2.6",
    cardName: "Viver Renova Mente 2.6",
    cardSummary: "Saúde mental com acolhimento e especialidade.",
    status: "coming-soon",
    logoSrc: "/images/programas/viver-renova-mente.png",
  },
  {
    slug: "viver-parto-adequado",
    cardNumber: "Linha de Cuidado 06",
    lineTitle: "Linha de Cuidado da Saúde Materno-Infantil",
    programName: "Programa Viver Parto Adequado 2.6",
    cardName: "Viver Parto Adequado 2.6",
    cardSummary:
      "Saúde materno-infantil, da gestação ao primeiro ano de vida.",
    status: "coming-soon",
    logoSrc: "/images/programas/viver-parto-adequado.png",
  },
  {
    slug: "viver-caminho-integrado",
    cardNumber: "Linha de Cuidado 07",
    lineTitle: "Coordenação de Cuidados de Casos Complexos",
    programName: "Programa Viver Caminho Integrado",
    cardName: "Viver Caminho Integrado",
    cardSummary: "Coordenação de cuidados de casos complexos.",
    status: "coming-soon",
    logoSrc: "/images/programas/viver-caminho-integrado.png",
  },
  {
    slug: "viver-acolhimento",
    cardNumber: "Linha de Cuidado 08",
    lineTitle: "Linha de Cuidado do Transtorno do Espectro Autista (TEA)",
    programName: "Programa Viver Acolhimento",
    cardName: "Viver Acolhimento",
    cardSummary:
      "Cuidado especializado para pessoas com TEA e suas famílias.",
    status: "coming-soon",
    // TODO: logo não disponível — aguardando asset "Viver Acolhimento" (PNG fundo transparente)
  },
  {
    slug: "viver-amigos-da-coluna",
    cardNumber: "Linha de Cuidado 09",
    lineTitle: "Linha de Cuidado da Coluna — Dor Lombar",
    programName: "Programa Viver Amigos da Coluna 2.6",
    cardName: "Viver Amigos da Coluna 2.6",
    cardSummary:
      "Saúde da coluna, prevenção e reabilitação para quem vive com dor lombar.",
    status: "coming-soon",
    // TODO: logo não disponível — aguardando asset "Viver Amigos da Coluna 2.6" (PNG fundo transparente)
  },
  {
    slug: "viver-em-movimento",
    cardNumber: "Linha de Cuidado 10",
    lineTitle: "Linha de Promoção à Atividade Física",
    programName: "Programa Viver Em Movimento 2.6",
    cardName: "Viver Em Movimento 2.6",
    cardSummary:
      "Promoção à atividade física para todos os perfis e idades.",
    status: "coming-soon",
    // TODO: logo não disponível — aguardando asset "Viver Em Movimento 2.6" (PNG fundo transparente)
  },
];

const CASA_ITEMS = [
  "Consultórios multidisciplinares modernos",
  "Auditório para capacitações e eventos",
  "Salas de acolhimento e de artes",
  "Sala de movimento (ioga, pilates, dança)",
  "Cozinha para treinamento em alimentação saudável",
  "Piscina para hidroginástica",
  "Área verde e rooftop",
  "Espaço gourmet para eventos e convivência",
];

export default function ProgramasPage() {
  return (
    <>
      {/* Bloco 1 — Hero */}
      <section className="bg-gradient-to-br from-primary-light via-white to-accent/5 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <ScrollAnimationWrapper>
            <div className="flex flex-col lg:flex-row lg:items-center gap-10">
              <div className="lg:w-1/3 flex justify-center lg:justify-start">
                <ProgramLogo
                  src="/images/programas/viver-melhor-2-6.png"
                  alt="Logotipo do Programa Viver Melhor 2.6 — marca-mãe"
                  size="lg"
                />
              </div>
              <div className="lg:w-2/3 max-w-3xl">
                <span className="text-accent-dark font-medium text-sm uppercase tracking-wider">
                  Programas de Qualidade de Vida
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-3 mb-6">
                  Viver Melhor 2.6
                </h1>
                <p className="text-xl text-foreground/80 leading-relaxed mb-5">
                  Um programa completo de qualidade de vida, organizado em linhas
                  de cuidado com identidade própria — cada uma focada em um
                  aspecto essencial da sua saúde e bem-estar.
                </p>
                <p className="text-lg text-muted leading-relaxed">
                  Na Viver Saúde, acreditamos que cuidar vai muito além do plano.
                  Por isso criamos o Viver Melhor 2.6: um ecossistema de programas
                  que acompanha você de perto, com especialidade, continuidade e
                  cuidado personalizado em cada fase da vida.
                </p>
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Bloco 2 — O que é o Viver Melhor 2.6 */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <ScrollAnimationWrapper>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              O que é o Viver Melhor 2.6?
            </h2>
            <div className="space-y-5 text-lg text-muted leading-relaxed">
              <p>
                O Viver Melhor 2.6 é o programa de qualidade de vida da Viver
                Saúde. Ele reúne linhas de cuidado com foco temático próprio
                conectadas pelo mesmo propósito: fazer você viver melhor.
              </p>
              <p>
                Cada linha de cuidado é um programa independente, com equipe
                especializada, acompanhamento contínuo e ações direcionadas.
                Juntas, cobrem as principais dimensões da saúde e bem-estar dos
                nossos beneficiários.
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Bloco 3 — A CASA */}
      <section id="a-casa" className="py-20 lg:py-28 bg-primary-light/40">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <ScrollAnimationWrapper>
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  A CASA: um espaço criado para o seu cuidado
                </h2>
                <p className="text-accent-dark font-semibold mb-6">
                  {CASA_ADDRESS}
                </p>
                <p className="text-lg text-muted leading-relaxed mb-8">
                  Os participantes dos programas Viver Melhor 2.6 têm acesso
                  exclusivo ao nosso Centro de Atenção à Saúde, a CASA, um espaço
                  moderno, acolhedor e completamente pensado para o seu cuidado
                  integral.
                </p>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  O que você encontra na CASA
                </h3>
                <ul className="space-y-3">
                  {CASA_ITEMS.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-muted">
                      <svg
                        className="flex-shrink-0 w-5 h-5 text-primary mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    src: "/images/programas/casa/casa-recepcao.jpg",
                    alt: "Recepção principal da CASA — Centro de Atenção à Saúde da Viver Saúde",
                  },
                  {
                    src: "/images/programas/casa/casa-lounge.jpg",
                    alt: "Lounge da CASA com sofás amarelos e iluminação acolhedora",
                  },
                  {
                    src: "/images/programas/casa/casa-cozinha.jpg",
                    alt: "Cozinha da CASA com bancada de madeira e banquetas para treinamentos em alimentação saudável",
                  },
                  {
                    src: "/images/programas/casa/casa-piscina.jpg",
                    alt: "Piscina e área verde da CASA",
                  },
                ].map((photo) => (
                  <div
                    key={photo.src}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-50"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Bloco 4 — Grade das linhas de cuidado */}
      <section id="linhas-de-cuidado" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <ScrollAnimationWrapper>
            <div className="max-w-3xl mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Nossas linhas de cuidado
              </h2>
              <p className="text-lg text-muted leading-relaxed">
                Cada linha de cuidado foi criada para um propósito específico.
                Conheça os programas e descubra qual foi feito para você.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {linesOfCare.map((line, index) => (
              <ScrollAnimationWrapper key={line.slug} delay={index * 0.05}>
                <article className="group h-full flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="h-48 bg-gradient-to-br from-areia-50 to-areia-100 border-b-2 border-menta-400 relative flex items-center justify-center p-6">
                    {line.logoSrc ? (
                      <Image
                        src={line.logoSrc}
                        alt={`Logotipo do Programa ${line.cardName}`}
                        width={200}
                        height={200}
                        className="object-contain max-h-full w-auto group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-mata-700 text-sm font-medium text-center px-2">
                        {line.cardName}
                      </span>
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge
                        variant={line.status === "available" ? "success" : "muted"}
                      >
                        {line.status === "available" ? "Disponível" : "Em breve"}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {line.cardName}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed mb-5">
                      {line.cardSummary}
                    </p>
                    <div className="mb-5">
                      <SeloEndosso size="sm" />
                    </div>
                    <div className="mt-auto">
                      <Button
                        href={`#${line.slug}`}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        Saiba mais
                      </Button>
                    </div>
                  </div>
                </article>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Bloco 5 — Detalhamento dos programas */}
      <section className="py-12 lg:py-16 bg-primary-light/30">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 space-y-10 lg:space-y-14">
          {linesOfCare.map((line) =>
            line.status === "available" ? (
              <AvailableProgramSection key={line.slug} line={line} />
            ) : (
              <ComingSoonProgramSection key={line.slug} line={line} />
            )
          )}
        </div>
      </section>

      {/* Bloco 6 — CTA final */}
      <section className="py-16 lg:py-20 bg-primary-light">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center">
          <ScrollAnimationWrapper>
            <div className="mb-6 flex justify-center">
              <SeloEndosso size="md" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pronto para começar?
            </h2>
            <p className="text-lg text-muted mb-8 leading-relaxed">
              Nossos programas são abertos a todos os beneficiários Viver Saúde.
              Entre em contato e descubra quais linhas de cuidado estão
              disponíveis para o seu plano.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href={PHONE_1100_TEL} size="lg">
                Quero participar — (84) 3114-1100
              </Button>
              <ProgramEnrollButton
                programName="Viver Melhor 2.6"
                variant="secondary"
                size="lg"
              />
              <Button href="#a-casa" variant="outline" size="lg">
                Visite a CASA
              </Button>
            </div>
            <p className="text-sm text-muted mt-6">
              Centro de Atenção à Saúde (CASA) — {CASA_ADDRESS_PT}
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>
    </>
  );
}

function AvailableProgramSection({ line }: { line: AvailableLine }) {
  return (
    <ScrollAnimationWrapper>
      <article
        id={line.slug}
        className="scroll-mt-24 bg-white rounded-2xl border border-gray-200 p-8 md:p-12"
      >
        <div className="flex flex-col md:flex-row gap-8 md:items-start mb-8">
          <div className="flex-shrink-0 flex flex-col items-center md:items-start gap-3">
            <ProgramLogo
              src={line.logoSrc}
              alt={`Logotipo do Programa ${line.cardName}`}
              size="md"
            />
            <SeloEndosso size="sm" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent-dark">
                {line.cardNumber}
              </span>
              <Badge variant="success">Disponível</Badge>
            </div>
            <p className="text-sm text-muted mb-2">{line.lineTitle}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {line.programName}
            </h2>
          </div>
        </div>

        <p className="text-muted leading-relaxed mb-8">{line.introduction}</p>

        {line.aboutCondition ? (
          <div className="mb-8 bg-primary-light/40 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-foreground mb-3">
              {line.aboutCondition.heading}
            </h3>
            <p className="text-muted leading-relaxed">
              {line.aboutCondition.text}
            </p>
          </div>
        ) : null}

        <h3 className="text-xl font-semibold text-foreground mb-4">
          Benefícios do programa
        </h3>
        <ul className="grid md:grid-cols-2 gap-3 mb-8">
          {line.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3 text-muted">
              <svg
                className="flex-shrink-0 w-5 h-5 text-primary mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm leading-relaxed">{benefit}</span>
            </li>
          ))}
        </ul>

        <h3 className="text-xl font-semibold text-foreground mb-3">
          Como funciona
        </h3>
        <p className="text-muted leading-relaxed mb-8">{line.howItWorks}</p>

        <h3 className="text-xl font-semibold text-foreground mb-3">
          Quem pode participar
        </h3>
        <p className="text-muted leading-relaxed mb-8">
          {line.whoCanParticipate}
        </p>

        <h3 className="text-xl font-semibold text-foreground mb-4">
          Como se inscreve
        </h3>
        <ul className="space-y-3 mb-8 text-muted">
          <li className="flex items-start gap-3">
            <span className="text-primary font-bold">•</span>
            <span>
              Telefone ou WhatsApp:{" "}
              <a
                href={PHONE_1122_TEL}
                className="text-accent-dark underline underline-offset-2 hover:text-primary"
              >
                (84) 3114-1122
              </a>{" "}
              ou{" "}
              <a
                href={PHONE_1100_TEL}
                className="text-accent-dark underline underline-offset-2 hover:text-primary"
              >
                (84) 3114-1100
              </a>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary font-bold">•</span>
            <span>
              Presencialmente no Centro de Atenção à Saúde (CASA) —{" "}
              {CASA_ADDRESS_PT}
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary font-bold">•</span>
            <span>{line.registrationForm}</span>
          </li>
        </ul>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button href={programWhatsapp(line.programName)} size="md">
            Quero participar — fale conosco
          </Button>
          <ProgramEnrollButton
            programName={line.programName}
            variant="outline"
            size="md"
          />
        </div>
      </article>
    </ScrollAnimationWrapper>
  );
}

function ComingSoonProgramSection({ line }: { line: ComingSoonLine }) {
  return (
    <ScrollAnimationWrapper>
      <article
        id={line.slug}
        className="scroll-mt-24 bg-white rounded-2xl border border-gray-200 p-8 md:p-10"
      >
        <div className="flex flex-col md:flex-row gap-6 md:items-center">
          <div className="flex-shrink-0 flex flex-col items-center md:items-start gap-2">
            <ProgramLogo
              src={line.logoSrc}
              alt={`Logotipo do Programa ${line.cardName}`}
              size="sm"
            />
            <SeloEndosso size="sm" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent-dark">
                {line.cardNumber}
              </span>
              <Badge variant="muted">Em breve</Badge>
            </div>
            <p className="text-sm text-muted mb-2">{line.lineTitle}</p>
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">
              {line.programName}
            </h2>
            <p className="text-muted leading-relaxed mb-5">
              Este programa estará disponível em breve. Fique de olho nas nossas
              novidades.
            </p>
            <Button
              href={comingSoonWhatsapp(line.programName)}
              variant="outline"
              size="sm"
            >
              Fale conosco para saber mais
            </Button>
          </div>
        </div>
      </article>
    </ScrollAnimationWrapper>
  );
}
