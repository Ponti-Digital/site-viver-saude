import { createClient } from "./server";

export interface Banner {
  id: string;
  title: string;
  image_url: string;
  image_mobile_url: string | null;
  link_url: string | null;
  link_target: string;
  alt_text: string | null;
}

/**
 * Busca os banners ativos no servidor (SSR).
 *
 * Carregar os banners no servidor — em vez de via useEffect no cliente —
 * coloca a imagem do primeiro slide já no HTML inicial. Com priority no
 * índice 0, o Next emite <link rel="preload" fetchpriority="high"> no <head>
 * em tempo de SSR, eliminando o "atraso no carregamento de recursos" do LCP
 * (antes ~2,3s no mobile: hidratar JS + fetch Supabase + render).
 */
export async function getBanners(): Promise<Banner[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("banners")
      .select("id, title, image_url, image_mobile_url, link_url, link_target, alt_text")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}
