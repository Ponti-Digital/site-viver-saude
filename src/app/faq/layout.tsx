import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perguntas Frequentes — FAQ Viver Saúde",
  description:
    "Tire suas dúvidas sobre a Viver Saúde: contratação, carências, portabilidade, rede credenciada, portal do cliente, boletos, reajuste, ouvidoria e ANS. Respostas completas.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ — Viver Saúde",
    description: "Respostas para as dúvidas mais comuns sobre seu plano Viver Saúde.",
    url: "https://planoviversaude.com.br/faq",
  },
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
