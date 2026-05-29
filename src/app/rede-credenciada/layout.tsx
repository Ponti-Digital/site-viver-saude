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

const redeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Hospital",
      "@id": "https://planoviversaude.com.br/rede-credenciada#hospital-rio-grande",
      name: "Hospital Rio Grande",
      url: "https://planoviversaude.com.br/rede-credenciada",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Natal",
        addressRegion: "RN",
        addressCountry: "BR",
      },
      medicalSpecialty: [
        "Emergency",
        "InternalMedicine",
        "Pediatrics",
        "Orthopedics",
      ],
      availableService: {
        "@type": "MedicalProcedure",
        name: "Pronto-atendimento 24h",
      },
      isAcceptedAsCreditCard: false,
      isAcceptedBy: { "@id": "https://planoviversaude.com.br/#organization" },
    },
    {
      "@type": "MedicalClinic",
      "@id": "https://planoviversaude.com.br/rede-credenciada#maternidade-delfin",
      name: "Maternidade Delfin Gonzalez",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Natal",
        addressRegion: "RN",
        addressCountry: "BR",
      },
      medicalSpecialty: ["Obstetrics", "Pediatrics"],
    },
    {
      "@type": "MedicalClinic",
      "@id": "https://planoviversaude.com.br/rede-credenciada#hospital-villa-vic",
      name: "Hospital Villa Vic",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Natal",
        addressRegion: "RN",
        addressCountry: "BR",
      },
      medicalSpecialty: ["Psychiatry"],
    },
    {
      "@type": "MedicalClinic",
      "@id": "https://planoviversaude.com.br/rede-credenciada#viver-clinica-lagoa-nova",
      name: "Viver Clínica Lagoa Nova",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Natal",
        addressRegion: "RN",
        addressCountry: "BR",
      },
      medicalSpecialty: [
        "Cardiology",
        "Dermatology",
        "Endocrinology",
        "Gastroenterology",
        "Gynecology",
        "Neurology",
        "Orthopedics",
        "Pediatrics",
        "Psychiatry",
        "Rheumatology",
        "Urology",
      ],
    },
    {
      "@type": "MedicalClinic",
      "@id": "https://planoviversaude.com.br/rede-credenciada#clinica-ampla-zona-sul",
      name: "Clínica Ampla Zona Sul",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Natal",
        addressRegion: "RN",
        addressCountry: "BR",
      },
    },
    {
      "@type": "DiagnosticLab",
      "@id": "https://planoviversaude.com.br/rede-credenciada#lab-paulo-gurgel",
      name: "Laboratório Paulo Gurgel",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Natal",
        addressRegion: "RN",
        addressCountry: "BR",
      },
    },
    {
      "@type": "DiagnosticLab",
      "@id": "https://planoviversaude.com.br/rede-credenciada#lab-hemme",
      name: "Laboratório HEMME",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Natal",
        addressRegion: "RN",
        addressCountry: "BR",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Início",
          item: "https://planoviversaude.com.br",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Rede Credenciada",
          item: "https://planoviversaude.com.br/rede-credenciada",
        },
      ],
    },
  ],
};

export default function RedeCredenciadaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(redeJsonLd) }}
      />
      {children}
    </>
  );
}
