export const SITE = {
  name: "Viver Saúde",
  tagline: "Plano de Saúde em Natal/RN",
  phone: "(84) 3114-1100",
  phoneRaw: "558431141100",
  phoneSac: "(84) 3311-1411",
  email: "contato@planoviversaude.com.br",
  url: "https://planoviversaude.com.br",
  address: "Natal, RN",
  ansNumber: "424480",
} as const;

export const LGPD = {
  controllerName: "Viver Saúde Operadora de Planos de Saúde",
  controllerAddress: "Natal/RN",
  dpoName: "Encarregado de Proteção de Dados (DPO) — Viver Saúde",
  dpoEmail: "lgpd@planoviversaude.com.br",
  privacyPolicyVersion: "1.0",
  privacyPolicyDate: "2026-05-08",
} as const;

export const SOCIAL = {
  instagram: "https://www.instagram.com/planoviversaude/",
  facebook: "https://www.facebook.com/planoviversaude/",
  linkedin: "https://www.linkedin.com/company/planoviversaude/",
} as const;

export const PORTALS = {
  cliente: "https://solus.planoviversaude.com.br/portal_beneficiario/auth/login",
  prestador: "https://solus.planoviversaude.com.br/prestador/index.php",
  empresa: "https://solus.planoviversaude.com.br/empresa/index.php",
} as const;

export const APP_LINKS = {
  ios: "https://apps.apple.com/br/app/viver-sa%C3%BAde/id6755687857",
  android: "https://play.google.com/store/apps/details?id=br.com.mobilesaude.viversaude",
} as const;

export const NAV_ITEMS = [
  { label: "Início", href: "/" },
  { label: "Quem Somos", href: "/quem-somos" },
  {
    label: "Planos",
    href: "/planos",
    children: [
      { label: "Diamante", href: "/planos/diamante" },
      { label: "Quartzo", href: "/planos/quartzo" },
      { label: "Turmalina", href: "/planos/turmalina" },
      { label: "Rubi", href: "/planos/rubi" },
      { label: "Safira", href: "/planos/safira" },
      { label: "Topázio", href: "/planos/topazio" },
    ],
  },
  { label: "Rede Credenciada", href: "/rede-credenciada" },
  { label: "Programas", href: "/programas" },
  {
    label: "Mais",
    href: "#",
    children: [
      { label: "Notícias", href: "/noticias" },
      { label: "FAQ", href: "/faq" },
      { label: "Contato", href: "/contato" },
    ],
  },
] as const;

export const WHATSAPP_URL = `https://wa.me/${SITE.phoneRaw}?text=${encodeURIComponent("Olá! Gostaria de saber mais sobre os planos Viver Saúde.")}`;
