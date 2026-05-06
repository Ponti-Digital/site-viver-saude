import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ScrollAnimationWrapper } from "@/components/shared/ScrollAnimationWrapper";
import { WHATSAPP_URL } from "@/lib/constants/site";

export const metadata = {
  title: "Quem Somos",
  description:
    "Conheça a Viver Saúde. Um plano de saúde em Natal/RN com acolhimento, organização e compromisso com o cuidado da sua família.",
};

const valores = [
  {
    title: "Missão",
    description:
      "Oferecer acesso a saúde de qualidade com acolhimento, transparência e compromisso, promovendo o bem-estar dos nossos beneficiários.",
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Visão",
    description:
      "Ser referência em plano de saúde no Rio Grande do Norte, reconhecida pela excelência no atendimento e pelo cuidado humanizado.",
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    title: "Valores",
    description:
      "Acolhimento, ética, transparência, melhoria contínua e compromisso com a saúde e o bem-estar de cada beneficiário.",
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

const diferenciais = [
  "Atendimento humanizado e próximo ao beneficiário",
  "Rede credenciada ampla e organizada em Natal/RN",
  "Planos acessíveis para diferentes perfis e necessidades",
  "Comunicação transparente e canais de fácil acesso",
  "Compromisso com a prevenção e o cuidado contínuo",
  "Equipe dedicada ao acolhimento e resolução rápida",
];

export default function QuemSomosPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-primary-dark to-primary text-white py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimationWrapper>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Quem Somos
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Saúde com acolhimento, organização e compromisso com o cuidado.
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Historia */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollAnimationWrapper direction="left">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/general/img-quem-somos.png"
                  alt="Equipe Viver Saúde"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper direction="right">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Nossa História
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                A Viver Saúde nasceu com o propósito de oferecer uma experiência diferente para quem busca um plano de saúde em Natal/RN. Acreditamos que saúde vai além de consultas e exames. É sobre cuidar de pessoas com respeito, agilidade e proximidade.
              </p>
              <p className="text-muted leading-relaxed mb-4">
                Temos uma rede credenciada organizada e um time comprometido. Nossos planos se adaptam ao que cada pessoa precisa, com acolhimento e qualidade no atendimento.
              </p>
              <p className="text-muted leading-relaxed mb-4">
                O Viver Saúde surgiu do desejo de resgatar a essência do cuidado: olhar para as pessoas com atenção, respeito e empatia. Em um cenário onde a saúde muitas vezes se torna automática e distante, sentimos a necessidade de construir algo diferente — mais humano, mais próximo e verdadeiramente comprometido com o bem-estar de cada indivíduo.
              </p>
              <p className="text-muted leading-relaxed mb-4">
                Desde o início, nosso propósito foi claro: colocar as pessoas no centro de tudo. Entendemos que saúde não se resume a consultas e exames, mas envolve acolhimento, escuta ativa e acompanhamento contínuo. Por isso, o Viver Saúde foi pensado para oferecer uma experiência mais sensível, onde cada pessoa é atendida de forma única, com suas necessidades e histórias valorizadas.
              </p>
              <p className="text-muted leading-relaxed mb-4">
                A motivação que nos move é transformar a forma como o cuidado é percebido e vivido. Queremos que cada pessoa se sinta segura, amparada e respeitada em todos os momentos — desde a prevenção até o tratamento. Acreditamos que uma assistência humanizada tem o poder de gerar confiança, fortalecer vínculos e promover uma vida mais equilibrada e saudável.
              </p>
              <p className="text-muted leading-relaxed">
                Assim, o Viver Saúde nasce como mais do que um plano: nasce como um compromisso com o cuidado integral, com a proximidade e com a valorização da vida em sua totalidade. Porque cuidar de pessoas é, acima de tudo, um ato de humanidade.
              </p>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Missao / Visao / Valores */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4">
          <ScrollAnimationWrapper>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Missão, Visão e Valores
            </h2>
          </ScrollAnimationWrapper>
          <div className="grid md:grid-cols-3 gap-8">
            {valores.map((item, idx) => (
              <ScrollAnimationWrapper key={item.title} delay={idx * 0.15}>
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow h-full">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <ScrollAnimationWrapper>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Nossos Diferenciais
            </h2>
          </ScrollAnimationWrapper>
          <div className="max-w-3xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-4">
              {diferenciais.map((item, idx) => (
                <ScrollAnimationWrapper key={idx} delay={idx * 0.1}>
                  <div className="flex items-start gap-3 p-4 bg-card rounded-xl">
                    <svg
                      className="w-6 h-6 text-accent flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-foreground">{item}</span>
                  </div>
                </ScrollAnimationWrapper>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary-dark to-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimationWrapper>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Venha fazer parte da Viver Saúde
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              Conheça nossos planos e veja como podemos cuidar de você.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/planos" variant="accent" size="lg">
                Conhecer planos
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
    </>
  );
}
