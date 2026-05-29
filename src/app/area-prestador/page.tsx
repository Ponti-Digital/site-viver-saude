import { Button } from "@/components/ui/Button";
import { ScrollAnimationWrapper } from "@/components/shared/ScrollAnimationWrapper";
import { PORTALS, SITE, WHATSAPP_URL } from "@/lib/constants/site";

export const metadata = {
  title: "Área do Prestador",
  description:
    "Acesse a área exclusiva para prestadores credenciados da Viver Saúde. Consulte guias, autorizações e informações do seu cadastro.",
  alternates: { canonical: "/area-prestador" },
  robots: { index: false, follow: true },
};

export default function AreaPrestadorPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-dark to-primary text-white py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimationWrapper>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Área do Prestador
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Acesso exclusivo para prestadores credenciados.
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <ScrollAnimationWrapper>
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Acesso seguro para prestadores
              </h2>
              <p className="text-muted text-lg leading-relaxed mb-4">
                Ao clicar no botão abaixo, você será redirecionado para o portal exclusivo de prestadores credenciados da Viver Saúde, onde poderá consultar guias, autorizações e informações do seu cadastro.
              </p>
              <p className="text-muted leading-relaxed mb-10">
                O acesso é feito de forma segura através da plataforma Solus. Utilize as credenciais fornecidas pelo setor de credenciamento.
              </p>

              <Button
                href={PORTALS.prestador}
                variant="primary"
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                Acessar Área do Prestador
              </Button>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Support Note */}
      <section className="py-16 lg:py-20 bg-card">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimationWrapper>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Precisa de suporte?
            </h3>
            <p className="text-muted mb-6 max-w-lg mx-auto">
              Se você está com dificuldade para acessar o sistema ou precisa de suporte técnico, entre em contato pelo telefone{" "}
              <strong className="text-foreground">{SITE.phone}</strong> ou pelo WhatsApp.
            </p>
            <Button href={WHATSAPP_URL} variant="accent" size="md">
              Falar no WhatsApp
            </Button>
          </ScrollAnimationWrapper>
        </div>
      </section>
    </>
  );
}
