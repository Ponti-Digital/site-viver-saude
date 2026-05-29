import type { Metadata } from "next";
import Link from "next/link";
import { ScrollAnimationWrapper } from "@/components/shared/ScrollAnimationWrapper";
import { LGPD } from "@/lib/constants/site";
import { ManageCookiesButton } from "@/components/shared/ManageCookiesButton";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description:
    "Entenda quais cookies utilizamos no site da Viver Saúde, suas finalidades e como gerenciar suas preferências.",
  alternates: { canonical: "/politica-de-cookies" },
};

const cookieCategories = [
  {
    name: "Cookies necessários",
    required: true,
    purpose:
      "Necessários para o funcionamento básico do site (navegação, sessão, preferências de consentimento e segurança). Não podem ser desativados.",
    examples: [
      "vs_consent — armazena suas preferências de cookies",
      "sb-* — sessão de autenticação Supabase (somente em áreas logadas)",
    ],
    retention:
      "Durante a sessão de navegação ou por até 12 meses, conforme a finalidade específica do cookie e os requisitos de segurança da informação.",
  },
  {
    name: "Cookies funcionais",
    required: false,
    purpose:
      "Permitem que o site lembre escolhas que você faz (como preferências de exibição) e ofereça funcionalidades aprimoradas. Só são instalados após seu consentimento.",
    examples: [],
    retention: "Até 6 meses, podendo variar conforme a funcionalidade utilizada.",
  },
  {
    name: "Cookies analíticos / de desempenho",
    required: false,
    purpose:
      "Coletam informações agregadas sobre como os visitantes usam o site, ajudando-nos a melhorar a experiência. Só são instalados após seu consentimento.",
    examples: [
      "Google Analytics 4 (GA4), Google Tag Manager ou outras ferramentas de análise de navegação eventualmente utilizadas por nosso site",
    ],
    retention: "Até 14 meses.",
  },
  {
    name: "Cookies de marketing e publicidade",
    required: false,
    purpose:
      "Utilizados para personalização de anúncios, mensuração de campanhas e remarketing. Só são instalados após seu consentimento.",
    examples: [
      "Meta Pixel (Facebook/Instagram), Google Ads Conversion Tracking, Google Remarketing ou outras tecnologias de publicidade eventualmente utilizadas pela Viver",
    ],
    retention:
      "Até 6 meses, podendo variar conforme as configurações da plataforma parceira.",
  },
];

export default function PoliticaCookiesPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-dark to-primary text-white py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimationWrapper>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Política de Cookies
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Como utilizamos cookies e tecnologias semelhantes neste site.
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <ScrollAnimationWrapper>
              <article className="bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                  O que são cookies?
                </h2>
                <p className="text-muted leading-relaxed">
                  Cookies são pequenos arquivos de texto armazenados no seu navegador quando você visita um site.
                  Eles ajudam o site a se lembrar de informações sobre sua visita, como suas preferências e ações,
                  o que pode tornar a próxima visita mais útil e o site mais funcional.
                </p>
              </article>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper>
              <article className="bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                  Como utilizamos cookies
                </h2>
                <p className="text-muted leading-relaxed mb-4">
                  Adotamos uma abordagem de <strong>opt-in</strong>: cookies não essenciais só são instalados
                  após seu consentimento explícito no banner exibido na sua primeira visita.
                </p>
                <p className="text-muted leading-relaxed">
                  Você pode revisar e alterar suas escolhas a qualquer momento clicando no botão abaixo:
                </p>
                <div className="mt-4">
                  <ManageCookiesButton />
                </div>
              </article>
            </ScrollAnimationWrapper>

            {cookieCategories.map((cat, idx) => (
              <ScrollAnimationWrapper key={idx}>
                <article className="bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <h2 className="text-xl md:text-2xl font-bold text-foreground">{cat.name}</h2>
                    {cat.required ? (
                      <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                        Sempre ativos
                      </span>
                    ) : (
                      <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                        Opt-in
                      </span>
                    )}
                  </div>
                  <p className="text-muted leading-relaxed mb-4">{cat.purpose}</p>
                  {cat.examples.length > 0 && (
                    <>
                      <h3 className="font-semibold text-foreground text-sm mb-2">Exemplos:</h3>
                      <ul className="list-disc pl-6 space-y-1 text-muted text-sm mb-4">
                        {cat.examples.map((ex, i) => (
                          <li key={i}>{ex}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {cat.retention && (
                    <p className="text-muted text-sm leading-relaxed">
                      <strong className="text-foreground">Retenção típica:</strong> {cat.retention}
                    </p>
                  )}
                </article>
              </ScrollAnimationWrapper>
            ))}

            <ScrollAnimationWrapper>
              <article className="bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                  Como desativar cookies no navegador
                </h2>
                <p className="text-muted leading-relaxed mb-4">
                  Além das opções oferecidas pelo nosso banner, você pode bloquear ou apagar cookies pelas
                  configurações do seu navegador. Saiba como em:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted">
                  <li>Google Chrome: support.google.com/chrome/answer/95647</li>
                  <li>Mozilla Firefox: support.mozilla.org/pt-BR/kb/limpe-cookies-e-dados-de-sites-no-firefox</li>
                  <li>Safari: support.apple.com/pt-br/guide/safari/sfri11471/mac</li>
                  <li>Microsoft Edge: support.microsoft.com/pt-br/microsoft-edge</li>
                </ul>
                <p className="text-muted leading-relaxed mt-4 text-sm">
                  Observação: bloquear cookies essenciais pode impactar o funcionamento do site.
                </p>
              </article>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper>
              <article className="bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">Mais informações</h2>
                <p className="text-muted leading-relaxed">
                  Para detalhes completos sobre como tratamos dados pessoais, leia nossa{" "}
                  <Link href="/politica-de-privacidade" className="text-primary hover:underline font-medium">
                    Política de Privacidade
                  </Link>
                  . Em caso de dúvidas, entre em contato com nosso Encarregado de Proteção de Dados:{" "}
                  <a href={`mailto:${LGPD.dpoEmail}`} className="text-primary hover:underline font-medium">
                    {LGPD.dpoEmail}
                  </a>
                  .
                </p>
              </article>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>
    </>
  );
}
