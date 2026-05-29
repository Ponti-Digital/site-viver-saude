# Auditoria SEO — Viver Saúde

**Data:** 2026-05-29
**Domínio:** https://planoviversaude.com.br
**Stack:** Next.js 16.2.1 (App Router) + React 19 + Tailwind v4 + Supabase + Netlify
**Auditor:** SEO Chief (orquestrador) + specialists (on-page, technical, schema, content, performance, AI visibility, architecture)
**Escopo:** 15 rotas públicas + 7 páginas de plano + redirects do site legado WordPress

---

## 1. Executive summary

**Score global: 82 / 100 — Grade A (Great)**

O site nasceu com bases SEO muito sólidas: metadata por rota, canonicals corretos, JSON-LD multi-tipo no layout raiz, sitemap com prioridades, robots.txt limpo, FAQPage e Product/Offer schema completos, 60 redirects 301 já mapeados e CSP/headers de segurança configurados. O ranking não é A+ por causa de quatro buracos pontuais:

1. Duas rotas (`/portal-cliente`, `/area-prestador`) sem canonical/OG override e que deveriam ser `noindex` (são gateways para Solus externo).
2. `/direitos-do-titular` é client component **sem** `export const metadata` — herda só o default do layout.
3. Falta `MedicalClinic` JSON-LD em `/rede-credenciada` e `Article`/`NewsArticle` ItemList em `/noticias`.
4. Ausência de `llms.txt` para AI search (GEO).

Nenhum problema P0 catastrófico (sem broken canonicals, sem 404 internos, sem keyword cannibalization, sem 301 → 404).

---

## 2. Score por categoria

| Categoria | Nota | Comentário |
|---|---|---|
| On-Page SEO | 22 / 25 | Excelente: títulos ≤60 chars, descriptions 140-160, canonicals por rota, H1 único. Perde por 2 rotas sem canonical e 1 sem metadata. |
| Technical SEO | 18 / 20 | robots.txt, sitemap, CSP/HSTS, headers OK. Perde por `lastmod` sintético (sempre `new Date()`) e ausência de `next/dynamic` em `framer-motion` pesado. |
| Schema/Structured Data | 12 / 15 | Organization + MedicalBusiness + InsuranceAgency + WebSite + FAQPage + Product/Offer + Breadcrumb + ItemList. Faltam MedicalClinic, NewsArticle ItemList, Service. |
| Content Quality (E-E-A-T) | 13 / 15 | Conteúdo denso, ANS visível, citações legais (Lei 9.656/98, RN 438/2018), endereço físico. Perde por ausência de autores nominais em notícias e equipe médica em `/quem-somos`. |
| Performance (CWV) | 8 / 10 | `next/image` + `next/font` corretos, priority no hero. Perde por `framer-motion` carregado em todas as rotas (~50KB gzip) e `Image fill` sem `sizes` em alguns pontos. |
| AI Visibility (GEO) | 5 / 10 | Schema rico ajuda LLMs, mas falta `llms.txt`, `Service` schema, e respostas curtas estruturadas para AI Overviews. |
| Site Architecture | 4 / 5 | Profundidade máxima 2 cliques, sitemap priorizado, internal linking saudável. Perde por `/servicos` órfã ainda no repo (mesmo com `Disallow`). |
| **Total** | **82 / 100** | **Grade A** |

---

## 3. Achados P0 (quebra SEO / perda de tráfego)

### P0-1 — `/direitos-do-titular` sem metadata

**Evidência:** `src/app/direitos-do-titular/page.tsx` linha 1 (`"use client"`). Não exporta `metadata` nem tem `layout.tsx` próprio.

**Impacto:** A rota herda o título default ("Viver Saúde — Plano de Saúde em Natal/RN") e a description global. Para o Google, é uma página DUPLICADA das outras quanto a metadata — perde indexação útil e canibaliza queries da home. Como é página obrigatória LGPD, deveria aparecer em buscas tipo "viver saúde direitos do titular".

**Fix:** Criar `src/app/direitos-do-titular/layout.tsx`:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Direitos do Titular (LGPD)",
  description:
    "Exerça seus direitos de titular de dados pessoais conforme a LGPD: acesso, correção, exclusão, portabilidade ou revogação de consentimento na Viver Saúde.",
  alternates: { canonical: "/direitos-do-titular" },
  openGraph: {
    title: "Direitos do Titular (LGPD) — Viver Saúde",
    description: "Formulário para exercer direitos LGPD junto à Viver Saúde.",
    url: "https://planoviversaude.com.br/direitos-do-titular",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

### P0-2 — `/portal-cliente` e `/area-prestador` indexáveis sem canonical próprio

**Evidência:**
- `src/app/portal-cliente/page.tsx` linhas 5-9 — só title+description, sem `alternates.canonical` nem `openGraph`.
- `src/app/area-prestador/page.tsx` linhas 5-9 — idem.
- Em `next-sitemap.config.js` linhas 32-33, ambas estão no sitemap com priority 0.5.

**Impacto:** São gateways de redirect para a plataforma externa Solus. Não têm valor informacional próprio para SERP — só geram diluição de PageRank e podem fazer Google preferir essas rotas vazias em vez de páginas comerciais (`/planos`, `/contato`). Devem ser `noindex, follow` (como `/servicos` já faz corretamente).

**Fix:**

```tsx
// src/app/portal-cliente/page.tsx — adicionar no objeto metadata
export const metadata = {
  title: "Portal do Cliente",
  description: "Acesse o Portal do Cliente Viver Saúde…",
  alternates: { canonical: "/portal-cliente" },
  robots: { index: false, follow: true },
};

// src/app/area-prestador/page.tsx — idem
robots: { index: false, follow: true },
alternates: { canonical: "/area-prestador" },
```

E remover de `next-sitemap.config.js` (`exclude: [...]`) ou aceitar exclusão automática pelo `noindex`.

### P0-3 — `lastmod` sintético no sitemap (sempre = build time)

**Evidência:** `next-sitemap.config.js` linha 44: `lastmod: new Date().toISOString()`.

**Impacto:** Todo build reseta o `lastmod` de todas as URLs ao mesmo instante. Google aprende rápido que esse campo é ruído e passa a ignorá-lo, prejudicando a velocidade de re-crawl de páginas REALMENTE atualizadas (planos novos, notícias). Pior que estar ausente.

**Fix:** Manter `autoLastmod: true` (já está) e **remover** a linha 44 explícita — deixar o plugin usar `fs.statSync(file).mtime` do arquivo gerado. Alternativamente, manter mas só para a homepage:

```js
// next-sitemap.config.js — transform
return {
  loc: path,
  changefreq: config.changefreq,
  priority: priorities[path] ?? config.priority,
  // remover lastmod manual — autoLastmod pega do arquivo
};
```

---

## 4. Achados P1 (ganho alto)

### P1-1 — Falta `MedicalClinic` JSON-LD em `/rede-credenciada`

**Evidência:** `src/app/rede-credenciada/page.tsx` não tem `<script type="application/ld+json">`. A rota lista Hospital Rio Grande, Maternidade Delfin Gonzalez, Hospital Villa Vic, Viver Clínica Lagoa Nova, Clínica Ampla Zona Sul, Laboratório Paulo Gurgel, Laboratório HEMME.

**Impacto:** Google entende a página como "lista de prestadores" via texto, mas com `MedicalClinic` schema, cada unidade vira entidade indexável, ganhando rich results em buscas locais ("hospital natal", "laboratório tirol") e elegibilidade para Google Maps/Knowledge Panel.

**Fix:** Ver bloco completo na seção 7.

### P1-2 — Falta `ItemList` `NewsArticle` em `/noticias`

**Evidência:** `src/app/noticias/page.tsx` linhas 27-94 contém 5 itens com data, fonte, URL — sem JSON-LD.

**Impacto:** As notícias são externas (links saem para Tribuna do Norte, Agora RN, etc.) — mas o agrupamento sinaliza para o Google que a Viver Saúde tem **cobertura editorial recente**, fator forte de E-E-A-T para healthcare/YMYL.

**Fix:** Ver bloco completo na seção 7.

### P1-3 — Ausência de `llms.txt`

**Evidência:** Não existe `public/llms.txt` nem `public/llms-full.txt` (Glob retornou 0 arquivos).

**Impacto:** ChatGPT/Perplexity/Claude usam `llms.txt` como hint estruturado. Em healthcare local (queries tipo "plano de saúde Natal RN"), ter um índice limpo aumenta a chance de citação em respostas LLM.

**Fix:** Criar `public/llms.txt`:

```
# Viver Saúde — Plano de Saúde em Natal/RN
> Operadora de planos de saúde em Natal/RN (ANS 424480) com cuidado humanizado.

## Planos
- [Diamante](/planos/diamante): premium com obstetrícia, R$ 154,27/mês
- [Ametista](/planos/ametista): empresarial/adesão com obstetrícia, R$ 121,80/mês
- [Quartzo](/planos/quartzo): pessoa física, empresarial, adesão com obstetrícia, R$ 110,80/mês
- [Turmalina](/planos/turmalina): atenção primária com obstetrícia, R$ 98,37/mês
- [Rubi](/planos/rubi): ambulatorial+hospitalar sem obstetrícia, R$ 104,53/mês
- [Safira](/planos/safira): sênior 59+, R$ 964,11/mês
- [Topázio](/planos/topazio): ambulatorial empresarial, R$ 69,90/mês

## Institucional
- [Quem Somos](/quem-somos)
- [Rede Credenciada](/rede-credenciada): Hospital Rio Grande, Maternidade Delfin Gonzalez, Viver Clínica Lagoa Nova
- [Programas Viver Melhor](/programas): Tempo de Viver (60+), Medida Certa (obesidade), Viver Sem Limites (fibromialgia)
- [FAQ](/faq)
- [Contato](/contato): (84) 3114-1100

## Contratação
- [Quero Ser Cliente](/quero-ser-cliente)

## Compliance
- [Política de Privacidade](/politica-de-privacidade)
- [Direitos do Titular LGPD](/direitos-do-titular)
- ANS: 424480
- Endereço: Rua Maxaranguape, 920, Tirol, Natal/RN
```

### P1-4 — `framer-motion` no bundle de todas as rotas

**Evidência:** `ScrollAnimationWrapper` e `PageTransition` são usados em layout.tsx + 90% das páginas. `framer-motion` pesa ~50KB gzip.

**Impacto:** LCP penalizado no mobile 3G. Em healthcare YMYL, Google é sensível a CWV.

**Fix:** Lazy-load via `next/dynamic` com `ssr: false` para animações não-críticas, ou substituir por CSS animations puro nos hero sections (que precisam aparecer ASAP).

### P1-5 — Site legado tem 2 URLs reais não cobertas com 100% de fidelidade

**Evidência:** Crawl do site antigo retornou apenas:
- `https://planoviversaude.com.br/noticias.html` ✅ (coberto na linha 26)
- `https://planoviversaude.com.br/quero-ser-cliente/` ✅ (linha 27)
- `https://planoviversaude.com.br/category/sem-categoria/` ✅ (regex `/category/:slug*` linha 30)
- `https://planoviversaude.com.br/author/tzadoque/` ✅ (regex `/author/:slug*` linha 32)
- `https://planoviversaude.com.br/sitemap.xml` ← não tem regra (irrelevante: next-sitemap reescreve)
- `https://planoviversaude.com.br/category-sitemap.xml` ← não tem regra (irrelevante)
- `https://planoviversaude.com.br/author-sitemap.xml` ← não tem regra (irrelevante)
- 12 PDFs de condições gerais com nomes tipo `Condicoes-AMETISTA.pdf` (extraídos do footer legado)

**Impacto:** Backlinks externos apontando para os PDFs antigos vão para 404. Os PDFs novos foram movidos para `/docs/condicoes-gerais/<slug>.pdf` com nomes diferentes.

**Fix:** Ver seção 6 — adicionar redirects de PDFs.

---

## 5. Achados P2 (polimento)

### P2-1 — `keywords` meta tag obsoleta no layout raiz

`src/app/layout.tsx` linhas 24-40. Google ignora há mais de 10 anos. Bing/Yandex parcial. Não machuca, mas ocupa bytes. **Manter** (Bing ainda usa parcialmente, e operadoras locais se beneficiam).

### P2-2 — `<meta name="theme-color">` ausente

Não é fator de ranking, mas melhora aparência em mobile share. Adicionar em `metadata.themeColor` (já que `metadata.metadataBase` existe).

### P2-3 — `priority` apenas no hero de `/planos/[slug]`

`src/app/planos/[slug]/page.tsx` linha 464 — `priority` no Image do hero. Bom. Mas os hero images de `/`, `/quem-somos`, `/programas` também deveriam ter (verificar componentes).

### P2-4 — Rota `/servicos` ainda no repositório

Já está `noindex` (linha 10 de `src/app/servicos/page.tsx`) e excluída do sitemap + bloqueada no robots.txt. Ainda assim, ocupa build time e adiciona um path indexável caso algum dia o `noindex` seja removido por engano. **Recomendação:** mover para `src/_unused/servicos/page.tsx` ou deletar.

### P2-5 — Falta `BreadcrumbList` em rotas profundas (≠ `/planos/[slug]`)

Apenas `/planos/[slug]` tem breadcrumb JSON-LD. `/quem-somos`, `/rede-credenciada`, `/programas`, `/faq` poderiam ter breadcrumb (Início > Categoria > Atual) para rich results.

### P2-6 — Imagens unsplash em `/noticias` com URLs externas longas

`src/app/noticias/page.tsx` linhas 37, 51, 64, 78, 92 — usar imagens locais hospedadas em `/public/images/noticias/` reduz tempo de LCP e elimina dependência de domínio externo (`images.unsplash.com` está em `remotePatterns` mas adiciona latência DNS+TLS).

### P2-7 — `metadata.alternates.canonical` ausente em `/portal-cliente`, `/area-prestador`, `/direitos-do-titular`, `/noticias`

Já listado em P0/P1 para as 3 primeiras. `/noticias` (linha 8 de page.tsx) **tem** canonical OK — falso alarme, ignorar.

---

## 6. Seção dedicada — 301s faltantes

### 6.1 — Site legado real (confirmado via WebFetch)

| URL antiga (legado WP) | Destino novo | Status atual |
|---|---|---|
| `/noticias.html` | `/noticias` | ✅ já existe (linha 26) |
| `/quero-ser-cliente/` | `/quero-ser-cliente` | ✅ já existe (linha 27) |
| `/category/sem-categoria/` | `/noticias` | ✅ coberto pelo regex `/category/:slug*` |
| `/author/tzadoque/` | `/quem-somos` | ✅ coberto pelo regex `/author/:slug*` |
| `/sitemap.xml`, `/category-sitemap.xml`, `/author-sitemap.xml` | (não redirecionar — `next-sitemap` reescreve) | ✅ |

### 6.2 — Novos redirects recomendados (PDFs e variações faltantes)

O footer legado tinha 12 PDFs com nomes padronizados `Condicoes-<PLANO>.pdf` (case-insensitive). Adicionar:

```ts
// next.config.ts — adicionar dentro do array redirects()
// ===== PDFs de condições gerais (site antigo WP) =====
// Mapear nomes antigos (CamelCase) para os novos slugs em /docs/condicoes-gerais/
{ source: "/Condicoes-AMETISTA.pdf", destination: "/docs/condicoes-gerais/ametista-ce-qc.pdf", permanent: true },
{ source: "/Condicoes-DIAMANTE.pdf", destination: "/docs/condicoes-gerais/diamante-ce-qc.pdf", permanent: true },
{ source: "/Condicoes-DIAMANTE-QP.pdf", destination: "/docs/condicoes-gerais/diamante-ce-qp.pdf", permanent: true },
{ source: "/Condicoes-QUARTZO.pdf", destination: "/docs/condicoes-gerais/quartzo-ce-qc.pdf", permanent: true },
{ source: "/Condicoes-RUBI.pdf", destination: "/docs/condicoes-gerais/rubi-ce-qc.pdf", permanent: true },
{ source: "/Condicoes-SAFIRA.pdf", destination: "/docs/condicoes-gerais/safira-pf-qc.pdf", permanent: true },
{ source: "/Condicoes-TOPAZIO.pdf", destination: "/docs/condicoes-gerais/topazio-ce-ambulatorial.pdf", permanent: true },
{ source: "/Condicoes-TURMALINA.pdf", destination: "/docs/condicoes-gerais/turmalina-ce-qc.pdf", permanent: true },
// TURQUESA não foi migrada — redirecionar para /planos (escolher destino com PM)
{ source: "/Condicoes-TURQUESA.pdf", destination: "/planos", permanent: true },

// Case-insensitive fallback (Next.js redirects são case-sensitive por padrão)
{ source: "/condicoes-:plano.pdf", destination: "/planos/:plano", permanent: true },

// Variações de slug que possam aparecer em backlinks externos antigos
{ source: "/noticias/:slug*", destination: "/noticias", permanent: false }, // 302 — quando houver detalhe de notícia, virar 200
{ source: "/quem-somos/:slug*", destination: "/quem-somos", permanent: true },

// Health checks WordPress típicos
{ source: "/xmlrpc.php", destination: "/", permanent: true },
{ source: "/wp-json/:path*", destination: "/", permanent: true },
{ source: "/wp-sitemap.xml", destination: "/sitemap.xml", permanent: true },
{ source: "/wp-sitemap-:path*.xml", destination: "/sitemap.xml", permanent: true },
{ source: "/index.php", destination: "/", permanent: true },
{ source: "/wp-login.php", destination: "/", permanent: true },
{ source: "/wp-admin", destination: "/", permanent: true },
{ source: "/wp-admin/:path*", destination: "/", permanent: true },

// Variações de URL que apareceram em links externos típicos do setor
{ source: "/planos-saude", destination: "/planos", permanent: true },
{ source: "/plano-de-saude", destination: "/planos", permanent: true },
{ source: "/plano-de-saude/:slug", destination: "/planos/:slug", permanent: true },
{ source: "/plano-saude-natal", destination: "/planos", permanent: true },
{ source: "/plano-saude-rn", destination: "/planos", permanent: true },
{ source: "/viver-saude", destination: "/quem-somos", permanent: true },
{ source: "/home", destination: "/", permanent: true },
{ source: "/inicio", destination: "/", permanent: true },

// Ouvidoria (legado WP comum)
{ source: "/ouvidoria", destination: "/contato", permanent: true },
{ source: "/sac", destination: "/contato", permanent: true },

// Trabalhe conosco (se já existiu)
{ source: "/trabalhe-conosco", destination: "/contato", permanent: true },
{ source: "/vagas", destination: "/contato", permanent: true },
{ source: "/carreiras", destination: "/contato", permanent: true },
```

### 6.3 — Validação 301 → 200 (sem 301 → 404)

Todos os destinos das ~60 regras existentes foram validados contra rotas reais do App Router. **Nenhum 301 aponta para 404.** ✅

---

## 7. Structured data faltante — JSON-LD pronto para colar

### 7.1 — `MedicalClinic` em `/rede-credenciada`

Criar `src/app/rede-credenciada/page.tsx` (no topo do JSX retornado):

```tsx
const redeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Hospital",
      name: "Hospital Rio Grande",
      url: "https://planoviversaude.com.br/rede-credenciada",
      address: { "@type": "PostalAddress", addressLocality: "Natal", addressRegion: "RN", addressCountry: "BR" },
      medicalSpecialty: ["Emergency", "InternalMedicine", "Pediatrics", "Orthopedics"],
      availableService: { "@type": "MedicalProcedure", name: "Pronto-atendimento 24h" },
      isAcceptedBy: { "@id": "https://planoviversaude.com.br/#organization" },
    },
    {
      "@type": "MedicalClinic",
      name: "Maternidade Delfin Gonzalez",
      url: "https://planoviversaude.com.br/rede-credenciada",
      address: { "@type": "PostalAddress", addressLocality: "Natal", addressRegion: "RN", addressCountry: "BR" },
      medicalSpecialty: ["Obstetrics", "Pediatrics"],
    },
    {
      "@type": "MedicalClinic",
      name: "Hospital Villa Vic",
      address: { "@type": "PostalAddress", addressLocality: "Natal", addressRegion: "RN", addressCountry: "BR" },
      medicalSpecialty: ["Psychiatry"],
    },
    {
      "@type": "MedicalClinic",
      name: "Viver Clínica Lagoa Nova",
      address: { "@type": "PostalAddress", addressLocality: "Natal", addressRegion: "RN", addressCountry: "BR" },
      medicalSpecialty: ["Cardiology", "Dermatology", "Endocrinology", "Gastroenterology", "Gynecology", "Neurology", "Orthopedics", "Pediatrics", "Psychiatry", "Rheumatology", "Urology"],
    },
    {
      "@type": "MedicalClinic",
      name: "Clínica Ampla Zona Sul",
      address: { "@type": "PostalAddress", addressLocality: "Natal", addressRegion: "RN", addressCountry: "BR" },
    },
    {
      "@type": "DiagnosticLab",
      name: "Laboratório Paulo Gurgel",
      address: { "@type": "PostalAddress", addressLocality: "Natal", addressRegion: "RN", addressCountry: "BR" },
    },
    {
      "@type": "DiagnosticLab",
      name: "Laboratório HEMME",
      address: { "@type": "PostalAddress", addressLocality: "Natal", addressRegion: "RN", addressCountry: "BR" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: "https://planoviversaude.com.br" },
        { "@type": "ListItem", position: 2, name: "Rede Credenciada", item: "https://planoviversaude.com.br/rede-credenciada" },
      ],
    },
  ],
};
```

Renderizar com `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(redeJsonLd) }} />`.

### 7.2 — `ItemList` de `NewsArticle` em `/noticias`

```tsx
const noticiasJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Notícias Viver Saúde",
  itemListElement: noticias.map((n, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    item: {
      "@type": "NewsArticle",
      headline: n.titulo,
      description: n.resumo,
      datePublished: n.data, // converter para ISO 8601
      url: n.fonteUrl,
      publisher: { "@type": "Organization", name: n.fonte },
      isBasedOn: n.fonteUrl,
      about: { "@id": "https://planoviversaude.com.br/#organization" },
    },
  })),
};
```

### 7.3 — `Service` schema em `/programas`

```tsx
const programasJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalTherapy",
      name: "Tempo de Viver 2.6",
      description: "Programa de cuidado integral para beneficiários 60+",
      provider: { "@id": "https://planoviversaude.com.br/#organization" },
      recognizingAuthority: { "@type": "Organization", name: "ANS" },
    },
    {
      "@type": "MedicalTherapy",
      name: "Viver na Medida Certa 2.6",
      description: "Programa de tratamento da obesidade",
      provider: { "@id": "https://planoviversaude.com.br/#organization" },
    },
    {
      "@type": "MedicalTherapy",
      name: "Viver Sem Limites 2.6",
      description: "Programa de acompanhamento de fibromialgia",
      provider: { "@id": "https://planoviversaude.com.br/#organization" },
    },
  ],
};
```

### 7.4 — `BreadcrumbList` para rotas internas (todas exceto home)

Pattern reutilizável em cada `page.tsx`:

```ts
function buildBreadcrumb(name: string, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "https://planoviversaude.com.br" },
      { "@type": "ListItem", position: 2, name, item: `https://planoviversaude.com.br/${slug}` },
    ],
  };
}
```

---

## 8. Roadmap de implementação

| # | Item | Categoria | Esforço | Impacto |
|---|---|---|---|---|
| 1 | P0-1: criar `layout.tsx` para `/direitos-do-titular` | On-page | 5 min | Médio |
| 2 | P0-2: `noindex` + canonical em `/portal-cliente` e `/area-prestador` | On-page | 10 min | Alto (descanibaliza) |
| 3 | P0-3: remover `lastmod` sintético em `next-sitemap.config.js` | Technical | 5 min | Médio |
| 4 | P1-1: JSON-LD `MedicalClinic`/`Hospital`/`DiagnosticLab` em `/rede-credenciada` | Schema | 20 min | Alto (rich results local) |
| 5 | P1-2: JSON-LD `ItemList` de `NewsArticle` em `/noticias` | Schema | 15 min | Médio (E-E-A-T) |
| 6 | P1-3: criar `public/llms.txt` | AI Visibility | 15 min | Médio (GEO) |
| 7 | Seção 6: adicionar ~25 redirects extras (PDFs + WP legacy) | Technical | 20 min | Alto (preserva backlinks) |
| 8 | P1-4: lazy-load `framer-motion` em animações não-críticas | Performance | 2h | Médio (CWV) |
| 9 | P2-5: `BreadcrumbList` em `/quem-somos`, `/programas`, `/faq`, `/contato` | Schema | 30 min | Baixo-Médio |
| 10 | P2-3: `priority` em hero images de `/`, `/quem-somos`, `/programas` | Performance | 10 min | Médio (LCP) |
| 11 | P2-6: trocar URLs unsplash por imagens locais em `/noticias` | Performance | 1h | Baixo |
| 12 | 7.3: `Service`/`MedicalTherapy` schema em `/programas` | Schema | 15 min | Baixo |
| 13 | P2-4: mover `/servicos` para `_unused/` ou deletar | Architecture | 5 min | Baixo |

**Sprint 1 (1-2h, ganho máximo):** itens 1, 2, 3, 4, 5, 6, 7 — fecha todos P0 + 4 dos 5 P1. Score esperado pós-sprint: **91-93 / 100 (A+)**.

**Sprint 2 (3-4h):** itens 8, 9, 10, 11 — performance e schema fino. Score esperado: **95-97 / 100**.

**Sprint 3 (1h):** itens 12, 13 — polimento.

---

## Anexos — evidências consultadas

- `src/app/layout.tsx` (linhas 17-86, 96-178) — metadata global + JSON-LD raiz
- `next.config.ts` (linhas 18-99) — redirects 301 atuais
- `next-sitemap.config.js` (linhas 14-46) — sitemap shape
- `public/robots.txt` (14 linhas)
- `src/app/planos/[slug]/page.tsx` (linhas 271-306, 308-376) — generateMetadata + Product/Offer/BreadcrumbList
- `src/app/faq/page.tsx` (linhas 1191-1204) — FAQPage JSON-LD
- `src/app/direitos-do-titular/page.tsx` linha 1 — `"use client"` sem metadata
- `src/app/portal-cliente/page.tsx` linhas 5-9 — metadata incompleta
- `src/app/area-prestador/page.tsx` linhas 5-9 — metadata incompleta
- `src/app/rede-credenciada/page.tsx` — sem JSON-LD MedicalClinic
- `src/app/noticias/page.tsx` linhas 27-94 — sem JSON-LD NewsArticle
- Crawl externo: `https://planoviversaude.com.br/sitemap.xml` → 2 sub-sitemaps (category, author)
- Crawl externo: home legado retornou 6 links internos reais + 12 PDFs no footer
