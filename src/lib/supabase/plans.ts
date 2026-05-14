import { createClient } from "./server";

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
  const filtered = activeSlugs && activeSlugs.size > 0 ? items.filter((i) => activeSlugs.has(i.slug)) : items;
  if (order.length === 0) return filtered;
  const rank = new Map(order.map((s, i) => [s, i]));
  return [...filtered].sort((a, b) => {
    const ra = rank.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
    const rb = rank.get(b.slug) ?? Number.MAX_SAFE_INTEGER;
    return ra - rb;
  });
}
