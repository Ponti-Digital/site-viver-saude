// hashIP foi movido para "@/lib/utils/pii-hash" (HMAC + salt obrigatório).
// Reexportado aqui apenas para compatibilidade; prefira importar de pii-hash.
export { hashIP } from "@/lib/utils/pii-hash";

export function isHoneypotFilled(value: string | undefined | null): boolean {
  return !!value && value.trim().length > 0;
}

export function isSubmissionTooFast(
  renderedAt: number,
  minSeconds: number = 3
): boolean {
  const elapsed = (Date.now() - renderedAt) / 1000;
  return elapsed < minSeconds;
}

export async function isRateLimited(
  supabase: ReturnType<typeof import("@supabase/supabase-js").createClient>,
  ipHash: string,
  maxPerHour: number = 5
): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { count } = await supabase
    .from("form_submissions")
    .select("*", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", oneHourAgo);

  return (count ?? 0) >= maxPerHour;
}
