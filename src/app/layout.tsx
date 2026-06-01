import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/shared/FloatingWhatsApp";
import { UTMCapture } from "@/components/shared/UTMCapture";
import { PageTransition } from "@/components/shared/PageTransition";
import { CookieBanner } from "@/components/shared/CookieBanner";
import { GoogleAnalytics } from "@/components/shared/GoogleAnalytics";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Viver Saúde — Plano de Saúde em Natal/RN",
    template: "%s | Viver Saúde",
  },
  description:
    "Plano de saúde em Natal/RN com cuidado próximo, acolhedor e descomplicado. Conheça os planos Diamante, Ametista, Quartzo, Turmalina, Rubi, Safira e Topázio — para você, sua família ou sua empresa.",
  keywords: [
    "plano de saúde Natal",
    "plano de saúde RN",
    "Viver Saúde",
    "plano de saúde empresarial Natal",
    "plano de saúde familiar Natal",
    "plano de saúde individual RN",
    "plano de saúde com obstetrícia Natal",
    "plano de saúde sênior Natal",
    "operadora de saúde Rio Grande do Norte",
    "convênio médico Natal",
    "rede credenciada Natal",
    "ANS 424480",
    "Diamante Ametista Quartzo Rubi Safira Topázio",
    "Viver Melhor Natal",
    "CASA Viver Saúde Tirol",
  ],
  metadataBase: new URL("https://planoviversaude.com.br"),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Viver Saúde",
    url: "https://planoviversaude.com.br",
    title: "Viver Saúde — Plano de Saúde em Natal/RN",
    description:
      "Cuidado próximo, acolhedor e descomplicado em Natal/RN. Conheça os planos Viver Saúde.",
    images: [
      {
        url: "/images/og-viver-saude.jpg",
        width: 1200,
        height: 630,
        alt: "Viver Saúde — Plano de Saúde em Natal/RN",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Viver Saúde — Plano de Saúde em Natal/RN",
    description:
      "Cuidado próximo, acolhedor e descomplicado em Natal/RN.",
    images: ["/images/og-viver-saude.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "Viver Saúde" }],
  category: "Health Insurance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${workSans.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": ["Organization", "MedicalBusiness", "InsuranceAgency"],
                  "@id": "https://planoviversaude.com.br/#organization",
                  name: "Viver Saúde",
                  legalName: "Viver Saúde Operadora de Planos de Saúde",
                  alternateName: "Plano Viver Saúde",
                  url: "https://planoviversaude.com.br",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://planoviversaude.com.br/favicon.svg",
                  },
                  image: "https://planoviversaude.com.br/images/og-viver-saude.jpg",
                  description:
                    "Operadora de planos de saúde em Natal/RN (ANS 424480) com foco em acolhimento, cuidado humanizado e atendimento de qualidade. Planos Diamante, Ametista, Quartzo, Turmalina, Rubi, Safira e Topázio.",
                  identifier: {
                    "@type": "PropertyValue",
                    propertyID: "Registro ANS",
                    value: "424480",
                  },
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Natal",
                    addressRegion: "RN",
                    addressCountry: "BR",
                    streetAddress: "Rua Maxaranguape, 920, Tirol",
                  },
                  areaServed: [
                    { "@type": "City", name: "Natal" },
                    { "@type": "City", name: "Parnamirim" },
                    { "@type": "City", name: "São Gonçalo do Amarante" },
                    { "@type": "State", name: "Rio Grande do Norte" },
                  ],
                  telephone: "+55-84-3114-1100",
                  email: "contato@planoviversaude.com.br",
                  contactPoint: [
                    {
                      "@type": "ContactPoint",
                      telephone: "+55-84-3114-1100",
                      contactType: "customer service",
                      areaServed: "BR",
                      availableLanguage: ["Portuguese"],
                    },
                    {
                      "@type": "ContactPoint",
                      email: "ouvidoria@planoviversaude.com.br",
                      contactType: "Ouvidoria",
                      areaServed: "BR",
                      availableLanguage: ["Portuguese"],
                    },
                  ],
                  sameAs: [
                    "https://www.instagram.com/planoviversaude/",
                    "https://www.facebook.com/planoviversaude/",
                    "https://www.linkedin.com/company/planoviversaude/",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://planoviversaude.com.br/#website",
                  url: "https://planoviversaude.com.br",
                  name: "Viver Saúde",
                  description: "Plano de Saúde em Natal/RN",
                  publisher: { "@id": "https://planoviversaude.com.br/#organization" },
                  inLanguage: "pt-BR",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate: "https://planoviversaude.com.br/busca?q={search_term_string}",
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <UTMCapture />
        <Header />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <FloatingWhatsApp />
        <CookieBanner />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
