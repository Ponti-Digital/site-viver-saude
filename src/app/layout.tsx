import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/shared/FloatingWhatsApp";
import { UTMCapture } from "@/components/shared/UTMCapture";
import { PageTransition } from "@/components/shared/PageTransition";
import { CookieBanner } from "@/components/shared/CookieBanner";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Viver Saúde - Plano de Saúde em Natal/RN",
    template: "%s | Viver Saúde",
  },
  description:
    "Um plano de saúde para cuidar de você de um jeito mais próximo, acolhedor e descomplicado. Conheça os planos Viver Saúde em Natal/RN.",
  metadataBase: new URL("https://planoviversaude.com.br"),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Viver Saúde",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
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
              "@type": "Organization",
              name: "Viver Saúde",
              url: "https://planoviversaude.com.br",
              logo: "https://planoviversaude.com.br/favicon.svg",
              description:
                "Operadora de planos de saúde em Natal/RN com foco em acolhimento, cuidado humanizado e atendimento de qualidade.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Natal",
                addressRegion: "RN",
                addressCountry: "BR",
              },
              telephone: "(84) 3114-1100",
              email: "contato@planoviversaude.com.br",
              sameAs: [
                "https://www.instagram.com/planoviversaude/",
                "https://www.facebook.com/planoviversaude/",
                "https://www.linkedin.com/company/planoviversaude/",
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
      </body>
    </html>
  );
}
