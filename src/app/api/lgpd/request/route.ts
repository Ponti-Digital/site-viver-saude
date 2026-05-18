import { NextRequest } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

const REQUEST_TYPES = [
  "access",
  "correction",
  "anonymization",
  "portability",
  "deletion",
  "consent_info",
  "consent_withdraw",
  "other",
] as const;

const requestSchema = z.object({
  request_type: z.enum(REQUEST_TYPES),
  full_name: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  cpf: z.string().max(20).optional(),
  relationship: z.string().max(50).optional(),
  details: z.string().max(4000).optional(),
  consent_confirm: z
    .boolean()
    .refine((v) => v === true, { message: "Você precisa confirmar a veracidade das informações." }),
  page_url: z.string().nullable().optional(),
  _rendered_at: z.number().optional(),
  company_website: z.string().optional(),
});

function hashIP(ip: string): string {
  return crypto
    .createHash("sha256")
    .update(ip + (process.env.IP_HASH_SALT ?? "viver-saude-salt"))
    .digest("hex")
    .slice(0, 16);
}

function hashCpf(cpf: string): string {
  const onlyDigits = cpf.replace(/\D/g, "");
  if (!onlyDigits) return "";
  return crypto
    .createHash("sha256")
    .update(onlyDigits + (process.env.IP_HASH_SALT ?? "viver-saude-salt"))
    .digest("hex")
    .slice(0, 32);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.company_website) {
      return Response.json({ success: true });
    }
    if (body._rendered_at && Date.now() - Number(body._rendered_at) < 3000) {
      return Response.json({ success: true });
    }

    const result = requestSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Dados inválidos", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
    const ipHash = hashIP(ip);

    const supabase = createAdminClient();

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("lgpd_requests")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", oneHourAgo);

    if ((count ?? 0) >= 3) {
      return Response.json(
        { error: "Muitas solicitações. Tente novamente mais tarde." },
        { status: 429 }
      );
    }

    const { error } = await supabase.from("lgpd_requests").insert({
      request_type: data.request_type,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone ?? null,
      cpf_hash: data.cpf ? hashCpf(data.cpf) : null,
      relationship: data.relationship ?? null,
      details: data.details ?? null,
      ip_hash: ipHash,
      page_url: data.page_url ?? null,
      status: "received",
    });

    if (error) {
      console.error("LGPD request insert error:", error);
      return Response.json({ error: "Erro ao registrar solicitação" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("LGPD request API error:", err);
    return Response.json({ error: "Erro interno" }, { status: 500 });
  }
}
