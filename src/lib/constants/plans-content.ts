/**
 * Fonte única de fallback para o conteúdo dos planos.
 *
 * Consumida por:
 *   - src/lib/supabase/plans.ts  (merge field-by-field com dados do banco)
 *   - src/app/planos/page.tsx    (cards da listagem)
 *   - src/components/sections/PlansCarousel.tsx (carousel da home)
 *
 * NUNCA altere este arquivo para mudar o conteúdo do site em produção.
 * Após aplicar a migration 006_plans_content.sql, edite pelo admin do Supabase.
 */

export interface PlanDocument {
  label: string;
  file: string;
}

export interface PlanBenefit {
  name: string;
  description: string;
  value: string;
}

export interface PlanContentFallback {
  name: string;
  slug: string;
  tagline: string;
  image: string;
  description: string;
  audienceLabel: string;
  coverageType: string;
  region: string;
  startingPrice: string;
  priceRaw: string;
  highlights: string[];
  targetAudience: string;
  benefits: PlanBenefit[];
  modalitiesText: string;
  priceFootnote: string;
  condicoesGerais: PlanDocument[];
  /** Cor do gradiente usada no carousel da home (não armazenada no banco) */
  color: string;
}

const REGION_NATAL_PARNAMIRIM_SGA = "Natal, Parnamirim, São Gonçalo do Amarante";
const REGION_AMETISTA =
  "Natal, Parnamirim, São Gonçalo do Amarante, Macaíba, Goianinha, Canguaretama, Extremoz, Ceará Mirim, São José de Mipibu";
const REGION_DIAMANTE =
  "Natal, Parnamirim, São Gonçalo do Amarante, Macaíba, Goianinha, Canguaretama, Extremoz, Ceará Mirim, São José de Mipibu, Macau, Alto do Rodrigues, Açu, Mossoró, Caicó, Currais Novos, Nísia Floresta, Guamaré, Pendências, Pau dos Ferros";

const BENEFIT_TELEMEDICINA: PlanBenefit = {
  name: "Telemedicina",
  description: "Consultas médicas online disponíveis 24h",
  value: "Incluso",
};

const seguroViagem = (valor: string): PlanBenefit => ({
  name: "Seguro Viagem",
  description: `Cobertura de R$ ${valor} em viagens`,
  value: "Incluso",
});

const baseBenefits = (seguroValor: string): PlanBenefit[] => [
  BENEFIT_TELEMEDICINA,
  seguroViagem(seguroValor),
];

const FOOTNOTE_PADRAO =
  "*Valor referente à faixa etária de 0 a 18 anos. Consulte condições para demais faixas etárias e regras de contratação.";

const FOOTNOTE_SAFIRA =
  "*Valor referente à faixa etária 59+. Consulte condições para demais faixas etárias e regras de contratação.";

export const PLANS_CONTENT_FALLBACK: Record<string, PlanContentFallback> = {
  diamante: {
    name: "Diamante",
    slug: "diamante",
    tagline: "Mais cuidado, mais conforto, mais tranquilidade.",
    image: "/images/plans/diamante.png",
    description:
      "O Viver Diamante é o plano de mais alto nível da Viver Saúde. Conta com cobertura ambulatorial, hospitalar e obstétrica, além de opções de acomodação em quarto coletivo ou privativo. É a escolha ideal para quem deseja o melhor cuidado em todas as fases da vida.",
    audienceLabel: "Empresarial e Coletivo por Adesão",
    coverageType: "Ambulatorial + Hospitalar com Obstetrícia",
    region: REGION_DIAMANTE,
    startingPrice: "A partir de R$ 154,27",
    priceRaw: "R$ 154,27",
    highlights: [
      "Cobertura ambulatorial e hospitalar com obstetrícia",
      "Opção de quarto privativo e coletivo",
    ],
    targetAudience:
      "Ideal para quem busca o mais alto padrão de cobertura, com assistência obstétrica e opções de acomodação em quarto privativo ou coletivo.",
    benefits: baseBenefits("50.000"),
    modalitiesText:
      "Disponível nas modalidades empresarial e coletivo por adesão, com opções de coparticipação básica ou completa e acomodação em quarto coletivo ou privativo.",
    priceFootnote: FOOTNOTE_PADRAO,
    condicoesGerais: [
      { label: "Diamante CE QC", file: "/docs/condicoes-gerais/diamante-ce-qc.pdf" },
      { label: "Diamante CE QP (Quarto Privativo)", file: "/docs/condicoes-gerais/diamante-ce-qp.pdf" },
    ],
    color: "from-cyan-300 to-cyan-500",
  },
  ametista: {
    name: "Ametista",
    slug: "ametista",
    tagline: "Plano completo com obstetrícia para empresas e por adesão",
    image: "/images/plans/ametista.png",
    description:
      "O Viver Ametista oferece cobertura ambulatorial e hospitalar completa, incluindo obstetrícia. Disponível para contratação empresarial e por adesão, combina segurança, acompanhamento próximo e atenção integral à saúde física e emocional dos beneficiários.",
    audienceLabel: "Empresarial e Por Adesão",
    coverageType: "Ambulatorial + Hospitalar com Obstetrícia",
    region: REGION_AMETISTA,
    startingPrice: "A partir de R$ 121,80",
    priceRaw: "R$ 121,80",
    highlights: [
      "Cobertura ambulatorial e hospitalar completa",
      "Cobertura obstétrica (parto e gestação)",
      "Atendimento de urgência e emergência",
      "Disponível para empresas e por adesão",
      "Abrangência em 9 municípios do RN",
    ],
    targetAudience:
      "Para empresas e entidades de adesão que buscam cobertura completa com obstetrícia e uma abrangência regional ampliada no Rio Grande do Norte.",
    benefits: baseBenefits("50.000"),
    modalitiesText:
      "Disponível para contratação empresarial e coletivo por adesão, com opções de coparticipação básica ou completa e acomodação em quarto coletivo.",
    priceFootnote: FOOTNOTE_PADRAO,
    condicoesGerais: [
      { label: "Ametista CE QC", file: "/docs/condicoes-gerais/ametista-ce-qc.pdf" },
    ],
    color: "from-purple-400 to-purple-600",
  },
  quartzo: {
    name: "Quartzo",
    slug: "quartzo",
    tagline: "Saúde e acolhimento para todos os momentos.",
    image: "/images/plans/quartzo.png",
    description:
      "O Viver Quartzo oferece cobertura ambulatorial e hospitalar com obstetrícia, garantindo cuidado completo em todas as fases da vida. Disponível nas modalidades pessoa física, empresarial e coletivo por adesão, é a escolha ideal para quem busca segurança, acolhimento e assistência integral.",
    audienceLabel: "Pessoa Física, Empresarial e Coletivo por Adesão",
    coverageType: "Ambulatorial + Hospitalar com Obstetrícia",
    region: REGION_NATAL_PARNAMIRIM_SGA,
    startingPrice: "A partir de R$ 110,80",
    priceRaw: "R$ 110,80",
    highlights: [
      "Cobertura ambulatorial e hospitalar com obstetrícia",
      "Opção de quarto privativo e coletivo",
      "Disponível para pessoa física, empresas e coletivo por adesão",
    ],
    targetAudience:
      "Ideal para quem busca cuidado completo, segurança e assistência em todas as fases da vida.",
    benefits: baseBenefits("30.000"),
    modalitiesText:
      "Disponível nas modalidades empresarial e coletivo por adesão, com opções de coparticipação básica ou completa e acomodação em quarto coletivo ou privativo.",
    priceFootnote: FOOTNOTE_PADRAO,
    condicoesGerais: [
      { label: "Quartzo CA QC", file: "/docs/condicoes-gerais/quartzo-ca-qc.pdf" },
      { label: "Quartzo CE QC", file: "/docs/condicoes-gerais/quartzo-ce-qc.pdf" },
    ],
    color: "from-gray-400 to-gray-600",
  },
  turmalina: {
    name: "Turmalina",
    slug: "turmalina",
    tagline:
      "Plano de atenção primária com obstetrícia para empresas e coletivo por adesão",
    image: "/images/plans/turmalina.png",
    description:
      "O Viver Turmalina é um plano de atenção primária à saúde, com cobertura ambulatorial e hospitalar com obstetrícia. Com foco no acompanhamento contínuo, prevenção e gestão da saúde, é ideal para quem valoriza cuidado regular e integral ao longo da vida.",
    audienceLabel: "Empresarial e Coletivo por Adesão",
    coverageType: "Ambulatorial + Hospitalar com Obstetrícia",
    region: REGION_NATAL_PARNAMIRIM_SGA,
    startingPrice: "A partir de R$ 98,37",
    priceRaw: "R$ 98,37",
    highlights: [
      "Cobertura ambulatorial e hospitalar com obstetrícia",
      "Foco em atenção primária e acompanhamento contínuo",
      "Disponível para empresas e coletivo por adesão",
    ],
    targetAudience:
      "Ideal para quem valoriza prevenção, acompanhamento contínuo e mais qualidade de vida no dia a dia.",
    benefits: baseBenefits("30.000"),
    modalitiesText:
      "Disponível para contratação empresarial e coletivo por adesão, com opções de coparticipação básica ou completa e acomodação em quarto coletivo.",
    priceFootnote: FOOTNOTE_PADRAO,
    condicoesGerais: [
      { label: "Turmalina CA QC", file: "/docs/condicoes-gerais/turmalina-ca-qc.pdf" },
      { label: "Turmalina CE QC", file: "/docs/condicoes-gerais/turmalina-ce-qc.pdf" },
    ],
    color: "from-pink-400 to-pink-600",
  },
  rubi: {
    name: "Rubi",
    slug: "rubi",
    tagline: "Plano ambulatorial e hospitalar sem obstetrícia.",
    image: "/images/plans/rubi.png",
    description:
      "O Viver Rubi foi pensado para quem busca praticidade, proteção e acesso facilitado à saúde no dia a dia. O plano oferece atendimento para consultas, exames, procedimentos e internações em uma rede credenciada qualificada.",
    audienceLabel: "Pessoa Física, Empresarial e Coletivo por Adesão",
    coverageType: "Ambulatorial + Hospitalar sem Obstetrícia",
    region: REGION_NATAL_PARNAMIRIM_SGA,
    startingPrice: "A partir de R$ 104,53",
    priceRaw: "R$ 104,53",
    highlights: [
      "Cobertura ambulatorial e hospitalar sem obstetrícia",
      "Disponível para pessoa física, empresas e coletivo por adesão",
    ],
    targetAudience:
      "Para quem deseja um plano para acompanhar a rotina de saúde com mais tranquilidade e conveniência.",
    benefits: baseBenefits("30.000"),
    modalitiesText:
      "Disponível para contratação pessoa física, empresarial e coletivo por adesão com opções de coparticipação básica ou completa e acomodação em quarto coletivo.",
    priceFootnote: FOOTNOTE_PADRAO,
    condicoesGerais: [
      { label: "Rubi CA QC", file: "/docs/condicoes-gerais/rubi-ca-qc.pdf" },
      { label: "Rubi CE QC", file: "/docs/condicoes-gerais/rubi-ce-qc.pdf" },
    ],
    color: "from-red-400 to-red-600",
  },
  safira: {
    name: "Safira",
    slug: "safira",
    tagline: "Um plano pensado para o bem-estar e a longevidade.",
    image: "/images/plans/safira.png",
    description:
      "O Viver Safira é um plano desenvolvido especialmente para o público sênior. Com cobertura ambulatorial e hospitalar sem obstetrícia, oferece atenção contínua às necessidades de saúde do idoso, com foco em prevenção, acompanhamento regular e qualidade de vida em cada fase.",
    audienceLabel: "Sênior",
    coverageType: "Ambulatorial + Hospitalar sem Obstetrícia",
    region: REGION_NATAL_PARNAMIRIM_SGA,
    startingPrice: "A partir de R$ 964,11 (faixa 59+ anos)",
    priceRaw: "R$ 964,11",
    highlights: [
      "Cobertura ambulatorial e hospitalar sem obstetrícia",
      "Desenvolvido para o perfil sênior",
      "Opção de quarto privativo e coletivo",
    ],
    targetAudience:
      "Para quem busca mais qualidade de vida, acompanhamento contínuo e um cuidado pensado especialmente para o público sênior.",
    benefits: baseBenefits("30.000"),
    modalitiesText:
      "Disponível para contratação empresarial, pessoa física e coletivo por adesão, com opções de coparticipação básica ou completa e acomodação em quarto coletivo ou privativo.",
    priceFootnote: FOOTNOTE_SAFIRA,
    condicoesGerais: [
      { label: "Safira CA QC", file: "/docs/condicoes-gerais/safira-ca-qc.pdf" },
      { label: "Safira PF QC", file: "/docs/condicoes-gerais/safira-pf-qc.pdf" },
    ],
    color: "from-sky-400 to-sky-600",
  },
  topazio: {
    name: "Topázio",
    slug: "topazio",
    tagline: "Plano ambulatorial empresarial com foco em consultas e prevenção",
    image: "/images/plans/topázio.png",
    description:
      "O Viver Topázio é um plano ambulatorial voltado para quem quer investir na saúde preventiva. Com acesso a consultas regulares, exames e acompanhamento médico contínuo, garante cuidado no dia a dia.",
    audienceLabel: "Empresarial e Coletivo por Adesão",
    coverageType: "Ambulatorial",
    region: REGION_NATAL_PARNAMIRIM_SGA,
    startingPrice: "A partir de R$ 69,90",
    priceRaw: "R$ 69,90",
    highlights: [
      "Consultas com clínico geral e especialistas",
      "Acompanhamento contínuo de saúde",
      "Atendimento humanizado e próximo",
    ],
    targetAudience:
      "Para quem busca um plano ambulatorial acessível, com foco em prevenção e acompanhamento regular da saúde.",
    benefits: baseBenefits("15.000"),
    modalitiesText:
      "Disponível para contratação empresarial e coletivo por adesão, com opções de coparticipação básica ou completa.",
    priceFootnote: FOOTNOTE_PADRAO,
    condicoesGerais: [
      { label: "Topázio CE (Ambulatorial)", file: "/docs/condicoes-gerais/topazio-ce-ambulatorial.pdf" },
    ],
    color: "from-amber-400 to-amber-600",
  },
};

/** Lista ordenada dos slugs fallback (ordem de exibição padrão) */
export const PLANS_SLUGS_ORDERED = Object.keys(PLANS_CONTENT_FALLBACK);
