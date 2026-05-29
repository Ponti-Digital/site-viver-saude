/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://planoviversaude.com.br",
  generateRobotsTxt: false,
  exclude: [
    "/ponti-admin",
    "/ponti-admin/*",
    "/api/*",
    "/busca",
    "/servicos", // rota órfã — não exposta na navegação
    "/portal-cliente", // gateway noindex (redirect externo Solus)
    "/area-prestador", // gateway noindex (redirect externo Solus)
  ],
  changefreq: "weekly",
  priority: 0.7,
  autoLastmod: true,
  additionalPaths: async (config) => [
    // Rotas que o auto-discover do next-sitemap pula no build do Next 16 (sem .html físico).
    await config.transform(config, "/"),
    await config.transform(config, "/planos"),
  ],
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
      "/politica-de-privacidade": 0.3,
      "/politica-de-cookies": 0.3,
      "/termos-de-uso": 0.3,
      "/direitos-do-titular": 0.3,
    };

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priorities[path] ?? config.priority,
      // lastmod intencionalmente omitido: autoLastmod usa mtime real do arquivo gerado.
      // lastmod sintético (= build time) é ignorado pelo Google e prejudica re-crawl.
    };
  },
};
