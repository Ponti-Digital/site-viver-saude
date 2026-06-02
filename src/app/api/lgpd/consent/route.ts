import { NextRequest } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { clientIp, hashIP, hashSubject } from "@/lib/utils/pii-hash";

const consentSchema = z.object({
  source: z.string().min(1).max(64),
  purposes: z.array(z.string()).max(50).default([]),
  consent_text: z.string().min(1).max(4000),
  policy_version: z.string().max(32).default("1.0"),
  action: z.enum(["granted", "rejected", "withdrawn"]).default("granted"),
  subject_email: z.string().email().optional(),
  page_url: z.string().nullable().optional(),
  related_submission_id: z.string().uuid().optional(),
  // Anti-spam (opcionais)
  _rendered_at: z.number().optional(),
  company_website: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot + timing (silenciosamente aceita, igual aos demais formulários)
    if (body.company_website) {
      return Response.json({ success: true });
    }
    if (body._rendered_at && Date.now() - Number(body._rendered_at) < 1500) {
      return Response.json({ success: true });
    }

    const result = consentSchema.safeParse(body);
    if (!result.success) {
      return Response.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const data = result.data;
    const ipHash = hashIP(clientIp(request.headers));
    const userAgent = request.headers.get("user-agent")?.slice(0, 500) ?? null;

    const supabase = createAdminClient();

    // Rate limit: 20 registros de consentimento por hora por IP
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("consent_logs")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", oneHourAgo);

    if ((count ?? 0) >= 20) {
      return Response.json(
        { error: "Muitas solicitações. Tente novamente mais tarde." },
        { status: 429 }
      );
    }

    const { error } = await supabase.from("consent_logs").insert({
      subject_hash: data.subject_email ? hashSubject(data.subject_email) : null,
      source: data.source,
      purposes: data.purposes,
      consent_text: data.consent_text,
      policy_version: data.policy_version,
      action: data.action,
      ip_hash: ipHash,
      user_agent: userAgent,
      page_url: data.page_url ?? null,
      related_submission_id: data.related_submission_id ?? null,
    });

    if (error) {
      console.error("Consent log error:", error);
      return Response.json({ error: "Erro ao registrar consentimento" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Consent API error:", err);
    return Response.json({ error: "Erro interno" }, { status: 500 });
  }
}
