// Índice de busca do site — curado e estático.
//
// O conteúdo institucional da Viver Saúde é majoritariamente estático (páginas,
// planos e notícias). Em vez de acoplar a busca a queries de DB frágeis, mantemos
// um índice curado aqui: rápido, previsível e fácil de manter. Cada entrada tem
// título, descrição, palavras-chave (para findability) e categoria (para agrupar
// e exibir um selo nos resultados).

export type SearchCategory =
  | "Página"
  | "Plano"
  | "Programa"
  | "Notícia"
  | "Atendimento";

export interface SearchEntry {
  title: string;
  description: string;
  href: string;
  category: SearchCategory;
  /** Termos extras que ajudam a encontrar a entrada (sinônimos, siglas etc.). */
  keywords?: string[];
  /** Link externo abre em nova aba. */
  external?: boolean;
}

export const SEARCH_INDEX: SearchEntry[] = [
  // ---------- Páginas principais ----------
  {
    title: "Início",
    description: "Página inicial da Viver Saúde — plano de saúde em Natal/RN.",
    href: "/",
    category: "Página",
    keywords: ["home", "principal", "viver saude"],
  },
  {
    title: "Quem Somos",
    description:
      "Conheça a Viver Saúde: propósito, valores e o jeito mais próximo, acolhedor e descomplicado de cuidar.",
    href: "/quem-somos",
    category: "Página",
    keywords: ["sobre", "história", "missão", "valores", "empresa", "operadora"],
  },
  {
    title: "Planos",
    description:
      "Todos os planos Viver Saúde para você, sua família ou sua empresa. Compare e escolha o ideal.",
    href: "/planos",
    category: "Página",
    keywords: ["planos de saúde", "comparar", "preço", "contratar", "tabela"],
  },
  {
    title: "Rede Credenciada",
    description:
      "Encontre hospitais, clínicas e médicos credenciados Viver Saúde em Natal/RN. Filtre por especialidade e urgência.",
    href: "/rede-credenciada",
    category: "Página",
    keywords: [
      "rede",
      "credenciados",
      "médicos",
      "hospitais",
      "clínicas",
      "especialidades",
      "guia médico",
      "urgência",
      "emergência",
      "pronto socorro",
    ],
  },
  {
    title: "Programas de Saúde",
    description:
      "Programas de cuidado, prevenção e bem-estar com acompanhamento contínuo — as linhas de cuidado Viver Saúde.",
    href: "/programas",
    category: "Página",
    keywords: [
      "viver melhor",
      "prevenção",
      "bem-estar",
      "linhas de cuidado",
      "acompanhamento",
      "medicina preventiva",
      "saúde",
    ],
  },
  {
    title: "Notícias e Mídia",
    description:
      "Notícias, comunicados e cobertura da Viver Saúde na imprensa de Natal/RN.",
    href: "/noticias",
    category: "Página",
    keywords: ["mídia", "imprensa", "novidades", "comunicados", "blog"],
  },
  {
    title: "Perguntas Frequentes (FAQ)",
    description:
      "Dúvidas sobre contratação, carência, rede, reembolso, boleto e uso do plano respondidas em um só lugar.",
    href: "/faq",
    category: "Página",
    keywords: [
      "dúvidas",
      "perguntas",
      "carência",
      "reembolso",
      "boleto",
      "ajuda",
      "suporte",
    ],
  },
  {
    title: "Contato e Ouvidoria",
    description:
      "Fale com a Viver Saúde: SAC, WhatsApp, e-mail e ouvidoria. Estamos prontos para ajudar.",
    href: "/contato",
    category: "Página",
    keywords: ["fale conosco", "sac", "ouvidoria", "telefone", "whatsapp", "e-mail", "atendimento"],
  },

  // ---------- Atendimento / conversão ----------
  {
    title: "Quero ser cliente",
    description:
      "Simule e contrate seu plano Viver Saúde. Deixe seus dados e nossa equipe entra em contato.",
    href: "/quero-ser-cliente",
    category: "Atendimento",
    keywords: ["contratar", "simular", "cotação", "orçamento", "assinar", "adquirir"],
  },
  {
    title: "Portal do Cliente",
    description:
      "Acesse seu plano, 2ª via de boleto, autorizações e serviços em ambiente seguro.",
    href: "https://solus.planoviversaude.com.br/portal_beneficiario/auth/login",
    category: "Atendimento",
    external: true,
    keywords: ["login", "beneficiário", "boleto", "2 via", "área do cliente"],
  },
  {
    title: "Área do Prestador",
    description:
      "Área exclusiva para prestadores credenciados acessarem recursos e informações.",
    href: "https://solus.planoviversaude.com.br/prestador/index.php",
    category: "Atendimento",
    external: true,
    keywords: ["prestador", "credenciado", "médico", "clínica", "login"],
  },
  {
    title: "Área Pessoa Jurídica",
    description:
      "Acesso exclusivo para empresas gerenciarem contratos e beneficiários.",
    href: "https://solus.planoviversaude.com.br/empresa/index.php",
    category: "Atendimento",
    external: true,
    keywords: ["empresa", "pj", "empresarial", "rh", "contrato", "login"],
  },

  // ---------- Planos ----------
  {
    title: "Plano Diamante",
    description: "Mais cuidado, mais conforto, mais tranquilidade.",
    href: "/planos/diamante",
    category: "Plano",
    keywords: ["premium", "completo", "obstetrícia"],
  },
  {
    title: "Plano Ametista",
    description: "Plano completo com obstetrícia para empresas e por adesão.",
    href: "/planos/ametista",
    category: "Plano",
    keywords: ["obstetrícia", "empresarial", "adesão", "completo"],
  },
  {
    title: "Plano Quartzo",
    description: "Saúde e acolhimento para todos os momentos.",
    href: "/planos/quartzo",
    category: "Plano",
    keywords: ["acolhimento", "familiar"],
  },
  {
    title: "Plano Turmalina",
    description:
      "Plano de atenção primária com obstetrícia para empresas e coletivo por adesão.",
    href: "/planos/turmalina",
    category: "Plano",
    keywords: ["atenção primária", "obstetrícia", "empresarial", "adesão"],
  },
  {
    title: "Plano Rubi",
    description: "Plano ambulatorial e hospitalar sem obstetrícia.",
    href: "/planos/rubi",
    category: "Plano",
    keywords: ["ambulatorial", "hospitalar"],
  },
  {
    title: "Plano Safira",
    description: "Um plano pensado para o bem-estar e a longevidade.",
    href: "/planos/safira",
    category: "Plano",
    keywords: ["sênior", "longevidade", "bem-estar", "idoso"],
  },
  {
    title: "Plano Topázio",
    description: "Plano ambulatorial empresarial com foco em consultas e prevenção.",
    href: "/planos/topazio",
    category: "Plano",
    keywords: ["ambulatorial", "empresarial", "consultas", "prevenção"],
  },

  // ---------- Privacidade / legal ----------
  {
    title: "Política de Privacidade (LGPD)",
    description:
      "Como a Viver Saúde trata seus dados pessoais conforme a Lei nº 13.709/2018 (LGPD).",
    href: "/politica-de-privacidade",
    category: "Página",
    keywords: ["lgpd", "privacidade", "dados pessoais", "cookies"],
  },
  {
    title: "Direitos do Titular (LGPD)",
    description:
      "Exerça seus direitos como titular de dados: acesso, correção, exclusão e portabilidade.",
    href: "/direitos-do-titular",
    category: "Página",
    keywords: ["lgpd", "titular", "direitos", "dados", "solicitação"],
  },
  {
    title: "Termos de Uso",
    description: "Termos e condições de uso do site Viver Saúde.",
    href: "/termos-de-uso",
    category: "Página",
    keywords: ["termos", "condições", "uso"],
  },
  {
    title: "Política de Cookies",
    description: "Como utilizamos cookies e como gerenciar suas preferências.",
    href: "/politica-de-cookies",
    category: "Página",
    keywords: ["cookies", "consentimento", "privacidade"],
  },
];

/** Remove acentos e normaliza para comparação case/diacritic-insensitive. */
export function normalize(value: string): string {
  return value
    .normalize("NFD") // separa acentos em marcas combinantes (U+0300–U+036F)
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export interface SearchResult extends SearchEntry {
  score: number;
}

/**
 * Busca no índice. Pontua por termo encontrado, com peso maior para o título.
 * Multi-termo: cada termo precisa casar em algum campo para a entrada pontuar.
 */
export function searchSite(query: string, index: SearchEntry[] = SEARCH_INDEX): SearchResult[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const results: SearchResult[] = [];

  for (const entry of index) {
    const title = normalize(entry.title);
    const description = normalize(entry.description);
    const keywords = normalize((entry.keywords ?? []).join(" "));

    let score = 0;
    let matchedAllTerms = true;

    for (const term of terms) {
      let termScore = 0;
      if (title.includes(term)) termScore += title.startsWith(term) ? 6 : 4;
      if (keywords.includes(term)) termScore += 3;
      if (description.includes(term)) termScore += 2;

      if (termScore === 0) {
        matchedAllTerms = false;
        break;
      }
      score += termScore;
    }

    if (matchedAllTerms) results.push({ ...entry, score });
  }

  return results.sort((a, b) => b.score - a.score);
}
