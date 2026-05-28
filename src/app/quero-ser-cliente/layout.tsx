import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quero Ser Cliente — Contrate seu Plano Viver Saúde",
  description:
    "Solicite uma proposta de plano de saúde Viver Saúde em Natal/RN. Para pessoa física, empresas (MEI, pequenas e grandes) ou coletivo por adesão. Atendimento personalizado.",
  alternates: { canonical: "/quero-ser-cliente" },
  openGraph: {
    title: "Quero Ser Cliente — Viver Saúde",
    description: "Contrate seu plano Viver Saúde em Natal/RN.",
    url: "https://planoviversaude.com.br/quero-ser-cliente",
  },
};

export default function QueroSerClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
