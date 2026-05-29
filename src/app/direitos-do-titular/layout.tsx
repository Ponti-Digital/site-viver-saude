import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Direitos do Titular (LGPD)",
  description:
    "Exerça seus direitos de titular de dados pessoais conforme a LGPD: acesso, correção, eliminação, portabilidade ou revogação de consentimento junto à Viver Saúde.",
  alternates: { canonical: "/direitos-do-titular" },
  openGraph: {
    title: "Direitos do Titular (LGPD) — Viver Saúde",
    description:
      "Formulário para exercer direitos de titular de dados pessoais (LGPD) junto à Viver Saúde.",
    url: "https://planoviversaude.com.br/direitos-do-titular",
  },
};

export default function DireitosDoTitularLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
