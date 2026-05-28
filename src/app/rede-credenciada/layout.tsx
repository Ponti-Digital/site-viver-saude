import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rede Credenciada — Hospitais, Clínicas e Laboratórios",
  description:
    "Rede credenciada Viver Saúde em Natal/RN: Hospital Rio Grande 24h, Maternidade Delfin Gonzalez, Viver Clínica Lagoa Nova, Clínica Ampla Zona Sul, Laboratórios Paulo Gurgel e HEMME. Mais de 25 especialidades.",
  alternates: { canonical: "/rede-credenciada" },
  openGraph: {
    title: "Rede Credenciada — Viver Saúde",
    description: "Hospitais, clínicas e laboratórios da rede Viver Saúde em Natal/RN.",
    url: "https://planoviversaude.com.br/rede-credenciada",
  },
};

export default function RedeCredenciadaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
