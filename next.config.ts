import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
