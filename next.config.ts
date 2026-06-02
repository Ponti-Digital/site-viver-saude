import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Inlina o CSS (Tailwind) em <style> no <head> em vez de <link rel="stylesheet">,
    // eliminando a requisição que bloqueava a renderização (PageSpeed: LCP/FCP).
    inlineCss: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // ===== Site antigo WordPress (planoviversaude.com.br/*) =====
      // O site antigo era essencialmente uma SPA com âncoras (/#sobre, /#planos, etc.)
      // Hashes não são processados no servidor, então só precisamos cobrir URLs reais
      // e padrões WordPress comuns que possam estar em backlinks externos.

      // URL real do site antigo
      { source: "/noticias.html", destination: "/noticias", permanent: true },
      { source: "/quero-ser-cliente/", destination: "/quero-ser-cliente", permanent: true },

      // Padrões WordPress / Yoast
      { source: "/category/:slug*", destination: "/noticias", permanent: true },
      { source: "/tag/:slug*", destination: "/noticias", permanent: true },
      { source: "/author/:slug*", destination: "/quem-somos", permanent: true },
      { source: "/feed", destination: "/noticias", permanent: true },
      { source: "/feed/:path*", destination: "/noticias", permanent: true },
      { source: "/comments/feed/:path*", destination: "/noticias", permanent: true },
      { source: "/wp-content/:path*", destination: "/", permanent: true },
      { source: "/wp-includes/:path*", destination: "/", permanent: true },

      // Variações de slugs (institucional)
      { source: "/sobre", destination: "/quem-somos", permanent: true },
      { source: "/sobre-nos", destination: "/quem-somos", permanent: true },
      { source: "/sobre-a-viver", destination: "/quem-somos", permanent: true },
      { source: "/empresa", destination: "/quem-somos", permanent: true },
      { source: "/institucional", destination: "/quem-somos", permanent: true },

      // Planos
      { source: "/planos-de-saude", destination: "/planos", permanent: true },
      { source: "/planos-de-saude/:slug", destination: "/planos/:slug", permanent: true },
      { source: "/plano/:slug", destination: "/planos/:slug", permanent: true },
      { source: "/nossos-planos", destination: "/planos", permanent: true },

      // Rede credenciada
      { source: "/rede", destination: "/rede-credenciada", permanent: true },
      { source: "/parceiros", destination: "/rede-credenciada", permanent: true },
      { source: "/credenciados", destination: "/rede-credenciada", permanent: true },
      { source: "/hospitais", destination: "/rede-credenciada", permanent: true },

      // FAQ / Dúvidas
      { source: "/duvidas", destination: "/faq", permanent: true },
      { source: "/duvidas-frequentes", destination: "/faq", permanent: true },
      { source: "/perguntas-frequentes", destination: "/faq", permanent: true },

      // Contato
      { source: "/fale-conosco", destination: "/contato", permanent: true },
      { source: "/contato-nos", destination: "/contato", permanent: true },
      { source: "/atendimento", destination: "/contato", permanent: true },

      // Portais
      { source: "/cliente", destination: "/portal-cliente", permanent: true },
      { source: "/login", destination: "/portal-cliente", permanent: true },
      { source: "/area-do-cliente", destination: "/portal-cliente", permanent: true },
      { source: "/portal-do-cliente", destination: "/portal-cliente", permanent: true },
      { source: "/prestador", destination: "/area-prestador", permanent: true },
      { source: "/area-do-prestador", destination: "/area-prestador", permanent: true },
      { source: "/portal-prestador", destination: "/area-prestador", permanent: true },

      // Blog / posts
      { source: "/blog", destination: "/noticias", permanent: true },
      { source: "/blog/:slug*", destination: "/noticias", permanent: true },

      // Programas Viver Melhor
      { source: "/viver-melhor", destination: "/programas", permanent: true },
      { source: "/programa", destination: "/programas", permanent: true },
      { source: "/programa/:slug*", destination: "/programas", permanent: true },
      { source: "/qualidade-de-vida", destination: "/programas", permanent: true },

      // Quero ser cliente / contratação
      { source: "/contratar", destination: "/quero-ser-cliente", permanent: true },
      { source: "/contrate", destination: "/quero-ser-cliente", permanent: true },
      { source: "/cotacao", destination: "/quero-ser-cliente", permanent: true },
      { source: "/orcamento", destination: "/quero-ser-cliente", permanent: true },
      { source: "/seja-cliente", destination: "/quero-ser-cliente", permanent: true },

      // Páginas legais (variações)
      { source: "/privacidade", destination: "/politica-de-privacidade", permanent: true },
      { source: "/politica-privacidade", destination: "/politica-de-privacidade", permanent: true },
      { source: "/cookies", destination: "/politica-de-cookies", permanent: true },
      { source: "/termos", destination: "/termos-de-uso", permanent: true },

      // ===== PDFs de condições gerais (footer do site antigo WP) =====
      // Backlinks externos antigos apontavam para /Condicoes-<PLANO>.pdf na raiz.
      // Mapeamos para os novos caminhos em /docs/condicoes-gerais/.
      { source: "/Condicoes-AMETISTA.pdf", destination: "/docs/condicoes-gerais/ametista-ce-qc.pdf", permanent: true },
      { source: "/Condicoes-DIAMANTE.pdf", destination: "/docs/condicoes-gerais/diamante-ce-qc.pdf", permanent: true },
      { source: "/Condicoes-DIAMANTE-QP.pdf", destination: "/docs/condicoes-gerais/diamante-ce-qp.pdf", permanent: true },
      { source: "/Condicoes-QUARTZO.pdf", destination: "/docs/condicoes-gerais/quartzo-ce-qc.pdf", permanent: true },
      { source: "/Condicoes-RUBI.pdf", destination: "/docs/condicoes-gerais/rubi-ce-qc.pdf", permanent: true },
      { source: "/Condicoes-SAFIRA.pdf", destination: "/docs/condicoes-gerais/safira-pf-qc.pdf", permanent: true },
      { source: "/Condicoes-TOPAZIO.pdf", destination: "/docs/condicoes-gerais/topazio-ce-ambulatorial.pdf", permanent: true },
      { source: "/Condicoes-TURMALINA.pdf", destination: "/docs/condicoes-gerais/turmalina-ce-qc.pdf", permanent: true },
      { source: "/Condicoes-TURQUESA.pdf", destination: "/docs/condicoes-gerais/turquesa-ce-qc.pdf", permanent: true },

      // ===== Health checks WordPress típicos =====
      { source: "/xmlrpc.php", destination: "/", permanent: true },
      { source: "/wp-json/:path*", destination: "/", permanent: true },
      { source: "/wp-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/wp-sitemap-:slug.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/wp-sitemap-:type-:slug.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/wp-login.php", destination: "/", permanent: true },
      { source: "/wp-admin", destination: "/", permanent: true },
      { source: "/wp-admin/:path*", destination: "/", permanent: true },

      // ===== Variações comuns de URL em backlinks do setor =====
      { source: "/planos-saude", destination: "/planos", permanent: true },
      { source: "/plano-de-saude", destination: "/planos", permanent: true },
      { source: "/plano-de-saude/:slug", destination: "/planos/:slug", permanent: true },
      { source: "/plano-saude-natal", destination: "/planos", permanent: true },
      { source: "/plano-saude-rn", destination: "/planos", permanent: true },
      { source: "/viver-saude", destination: "/quem-somos", permanent: true },
      { source: "/home", destination: "/", permanent: true },
      { source: "/inicio", destination: "/", permanent: true },

      // ===== Ouvidoria / SAC =====
      { source: "/ouvidoria", destination: "/contato", permanent: true },
      { source: "/sac", destination: "/contato", permanent: true },

      // ===== Trabalhe conosco / vagas (legado) =====
      { source: "/trabalhe-conosco", destination: "/contato", permanent: true },
      { source: "/vagas", destination: "/contato", permanent: true },
      { source: "/carreiras", destination: "/contato", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com",
              "connect-src 'self' https://*.supabase.co https://wa.me",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
