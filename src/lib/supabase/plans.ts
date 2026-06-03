import { createClient } from "./server";
import {
  PLANS_CONTENT_FALLBACK,
  PLANS_SLUGS_ORDERED,
  type PlanContentFallback,
  type PlanBenefit,
  type PlanDocument,
} from "@/lib/constants/plans-content";

export type { PlanContentFallback, PlanBenefit, PlanDocument };

// ---------------------------------------------------------------------------
// Helpers de ordenação (usados pelas páginas públicas)
// ---------------------------------------------------------------------------

export async function getPlansOrder(): Promise<{ slugs: string[]; activeSlugs: Set<string> }> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("plans")
      .select("slug, sort_order, is_active")
      .order("sort_order", { ascending: true });
    const rows = data ?? [];
    return {
      slugs: rows.map((r) => r.slug),
      activeSlugs: new Set(rows.filter((r) => r.is_active !== false).map((r) => r.slug)),
    };
  } catch {
    return { slugs: [], activeSlugs: new Set() };
  }
}

export function reorderBySlug<T extends { slug: string }>(
  items: T[],
  order: string[],
  activeSlugs?: Set<string>,
): T[] {
  const filtered =
    activeSlugs && activeSlugs.size > 0
      ? items.filter((i) => activeSlugs.has(i.slug))
      : items;
  if (order.length === 0) return filtered;
  const rank = new Map(order.map((s, i) => [s, i]));
  return [...filtered].sort((a, b) => {
    const ra = rank.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
    const rb = rank.get(b.slug) ?? Number.MAX_SAFE_INTEGER;
    return ra - rb;
  });
}

// ---------------------------------------------------------------------------
// Mapeamento de row do banco → PlanContentFallback (merge com fallback)
// ---------------------------------------------------------------------------

type DbRow = Record<string, unknown>;

function isNonEmptyArray(v: unknown): v is unknown[] {
  return Array.isArray(v) && v.length > 0;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim() !== "";
}

function mergePlanRow(row: DbRow, fb: PlanContentFallback): PlanContentFallback {
  // Para arrays jsonb (benefits, condicoes_gerais): valida que é array antes de usar
  const benefits = isNonEmptyArray(row.benefits)
    ? (row.benefits as PlanBenefit[])
    : fb.benefits;

  const condicoesGerais = isNonEmptyArray(row.condicoes_gerais)
    ? (row.condicoes_gerais as PlanDocument[])
    : fb.condicoesGerais;

  // Para highlights (text[] do Postgres)
  const highlights = isNonEmptyArray(row.highlights)
    ? (row.highlights as string[])
    : fb.highlights;

  return {
    name:           isNonEmptyString(row.name)            ? row.name            : fb.name,
    slug:           isNonEmptyString(row.slug)            ? row.slug            : fb.slug,
    tagline:        isNonEmptyString(row.tagline)         ? row.tagline         : fb.tagline,
    image:          isNonEmptyString(row.image_url)       ? row.image_url       : fb.image,
    description:    isNonEmptyString(row.description)     ? row.description     : fb.description,
    audienceLabel:  isNonEmptyString(row.audience_label)  ? row.audience_label  : fb.audienceLabel,
    coverageType:   isNonEmptyString(row.coverage_type)   ? row.coverage_type   : fb.coverageType,
    region:         isNonEmptyString(row.region)          ? row.region          : fb.region,
    startingPrice:  isNonEmptyString(row.starting_price)  ? row.starting_price  : fb.startingPrice,
    priceRaw:       isNonEmptyString(row.price_raw)       ? row.price_raw       : fb.priceRaw,
    targetAudience: isNonEmptyString(row.target_audience) ? row.target_audience : fb.targetAudience,
    modalitiesText: isNonEmptyString(row.modalities_text) ? row.modalities_text : fb.modalitiesText,
    priceFootnote:  isNonEmptyString(row.price_footnote)  ? row.price_footnote  : fb.priceFootnote,
    highlights,
    benefits,
    condicoesGerais,
    // color é exclusivo do fallback (não armazenado no banco)
    color: fb.color,
  };
}

// ---------------------------------------------------------------------------
// Funções públicas de conteúdo
// ---------------------------------------------------------------------------

/**
 * Busca conteúdo completo de um plano por slug.
 * Em caso de falha no banco, ou coluna ausente, ou campo null/vazio,
 * usa o valor do fallback hardcoded — zero regressão pré-migration.
 */
export async function getPlanContent(slug: string): Promise<PlanContentFallback | null> {
  const fb = PLANS_CONTENT_FALLBACK[slug];
  if (!fb) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return fb;
    return mergePlanRow(data as DbRow, fb);
  } catch {
    return fb;
  }
}

/**
 * Busca conteúdo de todos os planos ativos, já ordenados.
 * Fallback completo se o banco falhar.
 */
export async function getAllPlansContent(): Promise<PlanContentFallback[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return PLANS_SLUGS_ORDERED.map((s) => PLANS_CONTENT_FALLBACK[s]);
    }

    // Preserva slugs que existem no banco mas não há fallback (edge case futuro)
    return data.map((row) => {
      const slug = typeof row.slug === "string" ? row.slug : "";
      const fb = PLANS_CONTENT_FALLBACK[slug] ?? ({
        ...row,
        image: row.image_url ?? "",
        audienceLabel: row.audience_label ?? "",
        coverageType: row.coverage_type ?? "",
        startingPrice: row.starting_price ?? "",
        priceRaw: row.price_raw ?? "",
        targetAudience: row.target_audience ?? "",
        modalitiesText: row.modalities_text ?? "",
        priceFootnote: row.price_footnote ?? "",
        highlights: row.highlights ?? [],
        benefits: row.benefits ?? [],
        condicoesGerais: row.condicoes_gerais ?? [],
        color: "from-primary to-primary-dark",
      } as PlanContentFallback);
      return mergePlanRow(row as DbRow, fb);
    });
  } catch {
    return PLANS_SLUGS_ORDERED.map((s) => PLANS_CONTENT_FALLBACK[s]);
  }
}
