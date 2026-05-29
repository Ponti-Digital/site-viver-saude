import { Button } from "@/components/ui/Button";
import { ScrollAnimationWrapper } from "@/components/shared/ScrollAnimationWrapper";
import { PORTALS, SITE, WHATSAPP_URL } from "@/lib/constants/site";

export const metadata = {
  title: "Portal do Cliente",
  description:
    "Acesse o Portal do Cliente Viver Saúde para consultar boletos, autorizações, guias e informações do seu plano de saúde.",
  alternates: { canonical: "/portal-cliente" },
  robots: { index: false, follow: true },
};

export default function PortalClientePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-dark to-primary text-white py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimationWrapper>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Portal do Cliente
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Acesse suas informações de forma rápida e segura.
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Acesso seguro ao seu portal
              </h2>
              <p className="text-muted text-lg leading-relaxed mb-4">
                Ao clicar no botão abaixo, você será redirecionado para o portal seguro do beneficiário Viver Saúde, onde poderá consultar boletos, autorizações, guias, dados do seu plano e muito mais.
              </p>
              <p className="text-muted leading-relaxed mb-10">
                O acesso é feito de forma segura através da plataforma Solus. Utilize seu login e senha cadastrados para entrar.
              </p>

              <Button
                href={PORTALS.cliente}
                variant="primary"
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                Acessar Portal do Cliente
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
              Precisa de ajuda para acessar?
            </h3>
            <p className="text-muted mb-6 max-w-lg mx-auto">
              Se você está com dificuldade para acessar o portal, entre em contato com nossa equipe pelo telefone{" "}
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
