/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://planoviversaude.com.br",
  generateRobotsTxt: false,
  exclude: [
    "/ponti-admin/*",
    "/api/*",
    "/busca",
    "/servicos", // rota órfã — não exposta na navegação
  ],
  changefreq: "weekly",
  priority: 0.7,
  autoLastmod: true,
  transform: async (config, path) => {
    const priorities = {
      "/": 1.0,
      "/planos": 0.9,
      "/planos/diamante": 0.85,
      "/planos/ametista": 0.85,
      "/planos/quartzo": 0.85,
      "/planos/turmalina": 0.85,
      "/planos/rubi": 0.85,
      "/planos/safira": 0.85,
      "/planos/topazio": 0.85,
      "/quero-ser-cliente": 0.9,
      "/quem-somos": 0.8,
      "/rede-credenciada": 0.8,
      "/programas": 0.8,
      "/contato": 0.8,
      "/faq": 0.7,
      "/noticias": 0.6,
      "/portal-cliente": 0.5,
      "/area-prestador": 0.5,
      "/politica-de-privacidade": 0.3,
      "/politica-de-cookies": 0.3,
      "/termos-de-uso": 0.3,
      "/direitos-do-titular": 0.3,
    };

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priorities[path] ?? config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};
