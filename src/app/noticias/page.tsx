import Image from "next/image";
import { ScrollAnimationWrapper } from "@/components/shared/ScrollAnimationWrapper";

export const metadata = {
  title: "Notícias e Mídia — Viver Saúde",
  description:
    "Notícias, comunicados e cobertura da Viver Saúde na mídia. Novidades sobre rede credenciada, programas de saúde, benefícios e orientações de saúde em Natal/RN.",
  alternates: { canonical: "/noticias" },
  openGraph: {
    title: "Notícias — Viver Saúde",
    description: "Cobertura da mídia e novidades da Viver Saúde.",
    url: "https://planoviversaude.com.br/noticias",
  },
};

interface NoticiaItem {
  id: string;
  titulo: string;
  resumo: string;
  data: string;
  dataIso: string;
  fonte: string;
  fonteUrl: string;
  categoria: string;
  thumbnail?: string;
}

const noticias: NoticiaItem[] = [
  {
    id: "tribuna-norte-blog-thiago-cavalcanti",
    titulo: "Viver Saúde",
    resumo:
      "O colunista Thiago Cavalcanti destaca a chegada de um novo plano de saúde em Natal com proposta focada em atendimento integrado e medicina preventiva.",
    data: "11 de novembro de 2025",
    dataIso: "2025-11-11",
    fonte: "Tribuna do Norte — Blog Thiago Cavalcanti",
    fonteUrl: "https://blog.tribunadonorte.com.br/thiagocavalcanti/viver-saude/",
    categoria: "Na mídia",
    thumbnail:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: "agorarn-medicina-integrativa",
    titulo: "Viver Saúde chega a Natal com proposta inovadora em medicina integrativa",
    resumo:
      "Sob liderança da CEO Dra. Eva Rodrigues, o Viver Saúde estreia em Natal oferecendo planos adaptáveis, programas de atenção à saúde e acompanhamento contínuo.",
    data: "11 de novembro de 2025",
    dataIso: "2025-11-11",
    fonte: "Agora RN",
    fonteUrl:
      "https://agorarn.com.br/ultimas/viver-saude-chega-a-natal-proposta-inovadora-medicina-integrativa/",
    categoria: "Na mídia",
    thumbnail:
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: "chegada-viver-saude-movimenta-planos-rn",
    titulo: "Chegada do Viver Saúde movimenta segmento de planos no estado",
    resumo:
      "O setor de saúde complementar do Rio Grande do Norte recebe novo operador com o lançamento do Viver Saúde em Natal, com foco em atenção integral e prevenção.",
    data: "10 de novembro de 2025",
    dataIso: "2025-11-10",
    fonte: "Tribuna do Norte",
    fonteUrl:
      "https://tribunadonorte.com.br/economia/chegada-do-viver-saude-movimenta-segmento-de-planos-no-estado/",
    categoria: "Na mídia",
    thumbnail:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: "novonoticias-cuidado-integrado-medicina-preventiva",
    titulo:
      "Viver Saúde chega ao RN com proposta inovadora de cuidado integrado e medicina preventiva",
    resumo:
      "Uma operadora de saúde inédita é lançada em Natal com modelo focado em prevenção e atenção integral, com clínicas próprias nas zonas Norte, Sul e Central.",
    data: "10 de novembro de 2025",
    dataIso: "2025-11-10",
    fonte: "NOVO Notícias",
    fonteUrl:
      "https://www.novonoticias.com.br/viver-saude-chega-ao-rn-com-proposta-inovadora-de-cuidado-integrado-e-medicina-preventiva/",
    categoria: "Na mídia",
    thumbnail:
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: "blogdobg-cuidado-integrado-medicina-preventiva",
    titulo:
      "Viver Saúde chega ao Rio Grande do Norte com proposta inovadora de cuidado integrado e medicina preventiva",
    resumo:
      "O Viver Saúde é lançado em Natal com foco em medicina integrativa e prevenção, contando com clínicas próprias estrategicamente distribuídas pela capital potiguar.",
    data: "10 de novembro de 2025",
    dataIso: "2025-11-10",
    fonte: "Blog do BG",
    fonteUrl:
      "https://www.blogdobg.com.br/viver-saude-chega-ao-rio-grande-do-norte-com-proposta-inovadora-de-cuidado-integrado-e-medicina-preventiva/",
    categoria: "Na mídia",
    thumbnail:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop",
  },
];

const noticiasJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Notícias Viver Saúde",
  description: "Cobertura da mídia sobre a Viver Saúde em Natal/RN.",
  numberOfItems: noticias.length,
  itemListElement: noticias.map((n, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    item: {
      "@type": "NewsArticle",
      headline: n.titulo,
      description: n.resumo,
      datePublished: n.dataIso,
      url: n.fonteUrl,
      isBasedOn: n.fonteUrl,
      publisher: { "@type": "Organization", name: n.fonte },
      about: { "@id": "https://planoviversaude.com.br/#organization" },
      ...(n.thumbnail ? { image: n.thumbnail } : {}),
    },
  })),
};

export default function NoticiasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(noticiasJsonLd) }}
      />
      {/* Header banner */}
      <section className="bg-gradient-to-br from-primary-dark to-primary py-14 lg:py-18">
        <div className="container mx-auto px-4">
          <ScrollAnimationWrapper>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Notícias
            </h1>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Grid de cards */}
      <section className="py-16 lg:py-24 bg-areia-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {noticias.map((noticia, idx) => (
              <ScrollAnimationWrapper key={noticia.id} delay={idx * 0.08}>
                <article className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full">
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-primary/10">
                    {noticia.thumbnail ? (
                      <Image
                        src={noticia.thumbnail}
                        alt={`Imagem ilustrativa — ${noticia.titulo}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-3 p-6 w-full h-full">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                            />
                          </svg>
                        </div>
                        <span className="text-xs font-semibold text-primary/60 uppercase tracking-wider">
                          {noticia.categoria}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="text-base font-bold text-foreground mb-2 leading-snug line-clamp-3">
                      <a
                        href={noticia.fonteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        {noticia.titulo}
                      </a>
                    </h2>
                    <p className="text-sm text-muted leading-relaxed mb-4 flex-1 line-clamp-3">
                      {noticia.resumo}
                    </p>

                    {/* Rodapé do card */}
                    <div className="flex items-center gap-1.5 text-xs text-muted mt-auto pt-3 border-t border-areia-200">
                      <svg
                        className="w-3.5 h-3.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <time>{noticia.data}</time>
                    </div>
                  </div>
                </article>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
