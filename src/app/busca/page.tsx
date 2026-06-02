import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { searchSite, SEARCH_INDEX, type SearchCategory } from "@/lib/search";

export const metadata: Metadata = {
  title: "Busca",
  description: "Busque por planos, programas, rede credenciada e informações da Viver Saúde.",
  // Páginas de resultado de busca não devem ser indexadas.
  robots: { index: false, follow: true },
  alternates: { canonical: "/busca" },
};

const categoryBadge: Record<SearchCategory, "primary" | "accent" | "muted"> = {
  Página: "muted",
  Plano: "accent",
  Programa: "accent",
  Notícia: "primary",
  Atendimento: "primary",
};

// Atalhos exibidos quando não há consulta ou nenhum resultado.
const POPULAR = SEARCH_INDEX.filter((e) =>
  ["/planos", "/rede-credenciada", "/programas", "/quero-ser-cliente", "/faq", "/contato"].includes(
    e.href,
  ),
);

function ResultLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className="block">
      {children}
    </Link>
  );
}

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? searchSite(query) : [];

  return (
    <>
      {/* Banner */}
      <section className="bg-gradient-to-br from-primary-dark to-primary py-14 lg:py-18">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Busca
          </h1>
          {query && (
            <p className="mt-3 text-white/80">
              {results.length > 0
                ? `${results.length} ${results.length === 1 ? "resultado" : "resultados"} para `
                : "Nenhum resultado para "}
              <span className="font-semibold text-white">“{query}”</span>
            </p>
          )}

          {/* Form de refino */}
          <form action="/busca" method="get" role="search" className="mt-6 flex gap-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-mata-900/40">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </span>
              <input
                type="search"
                name="q"
                defaultValue={query}
                autoFocus
                aria-label="Buscar no site"
                placeholder="Buscar planos, programas, rede credenciada..."
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-transparent bg-white text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-menta-400 transition-all"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center font-semibold rounded-lg px-6 py-3 bg-menta-400 text-mata-900 hover:bg-menta-300 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-dark"
            >
              Buscar
            </button>
          </form>
        </div>
      </section>

      {/* Resultados */}
      <section className="py-12 lg:py-16 bg-areia-50 min-h-[40vh]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          {!query ? (
            <EmptyPrompt
              title="O que você procura?"
              message="Digite acima para buscar planos, programas, rede credenciada, notícias e mais."
            />
          ) : results.length > 0 ? (
            <ul className="space-y-4">
              {results.map((r) => (
                <li key={r.href}>
                  <ResultLink href={r.href} external={r.external}>
                    <article className="group bg-white rounded-xl border border-border p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-1.5">
                        <Badge variant={categoryBadge[r.category]}>{r.category}</Badge>
                        {r.external && (
                          <span className="text-xs text-muted inline-flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            link externo
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {r.title}
                      </h2>
                      <p className="text-sm text-muted leading-relaxed mt-1">
                        {r.description}
                      </p>
                    </article>
                  </ResultLink>
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <EmptyPrompt
                title="Nenhum resultado encontrado"
                message="Tente outras palavras ou explore os atalhos abaixo."
              />
              <PopularLinks />
            </div>
          )}

          {/* Atalhos populares também quando não há consulta */}
          {!query && <PopularLinks />}
        </div>
      </section>
    </>
  );
}

function EmptyPrompt({ title, message }: { title: string; message: string }) {
  return (
    <div className="text-center py-8">
      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-foreground mb-1.5">{title}</h2>
      <p className="text-muted max-w-md mx-auto">{message}</p>
    </div>
  );
}

function PopularLinks() {
  return (
    <div className="mt-10">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-primary text-center mb-4">
        Acessos rápidos
      </h3>
      <div className="flex flex-wrap justify-center gap-3">
        {POPULAR.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-border text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            {p.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
