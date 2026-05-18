import { NextRequest } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

const consentSchema = z.object({
  source: z.string().min(1).max(64),
  purposes: z.array(z.string()).default([]),
  consent_text: z.string().min(1).max(4000),
  policy_version: z.string().default("1.0"),
  action: z.enum(["granted", "rejected", "withdrawn"]).default("granted"),
  subject_email: z.string().email().optional(),
  page_url: z.string().nullable().optional(),
  related_submission_id: z.string().uuid().optional(),
});

function hashIP(ip: string): string {
  return crypto
    .createHash("sha256")
    .update(ip + (process.env.IP_HASH_SALT ?? "viver-saude-salt"))
    .digest("hex")
    .slice(0, 16);
}

function hashSubject(value: string): string {
  return crypto
    .createHash("sha256")
    .update(value.toLowerCase().trim() + (process.env.IP_HASH_SALT ?? "viver-saude-salt"))
    .digest("hex")
    .slice(0, 32);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = consentSchema.safeParse(body);
    if (!result.success) {
      return Response.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const data = result.data;
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
    const ipHash = hashIP(ip);
    const userAgent = request.headers.get("user-agent")?.slice(0, 500) ?? null;

    const supabase = createAdminClient();
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
