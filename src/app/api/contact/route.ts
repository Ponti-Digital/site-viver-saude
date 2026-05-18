import { NextRequest } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

const contactSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  email: z.string().email("Email inválido"),
  plan_interest: z.string().optional(),
  message: z.string().optional(),
  consent: z.boolean().optional(),
  consent_text: z.string().optional(),
  policy_version: z.string().optional(),
  purposes: z.array(z.string()).optional(),
});

function hashIP(ip: string): string {
  return crypto
    .createHash("sha256")
    .update(ip + (process.env.IP_HASH_SALT ?? "viver-saude-salt"))
    .digest("hex")
    .slice(0, 16);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot check
    if (body.company_website) {
      return Response.json({ success: true }); // silently accept
    }

    // Timestamp check (reject if submitted too quickly)
    if (body._rendered_at) {
      const elapsed = Date.now() - Number(body._rendered_at);
      if (elapsed < 3000) {
        return Response.json({ success: true }); // silently accept
      }
    }

    // Validate
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Dados inválidos", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, phone, email, plan_interest, message, consent, consent_text, policy_version, purposes } = result.data;

    // Hash IP for rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
    const ipHash = hashIP(ip);

    // Rate limit: 5 submissions per hour per IP
    const supabase = createAdminClient();
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { count } = await supabase
      .from("form_submissions")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", oneHourAgo);

    if ((count ?? 0) >= 5) {
      return Response.json(
        { error: "Muitas submissões. Tente novamente mais tarde." },
        { status: 429 }
      );
    }

    // Insert submission
    const { data: insertedRow, error: insertError } = await supabase
      .from("form_submissions")
      .insert({
        form_type: body.form_type ?? "contato",
        page_url: body.page_url ?? null,
        data: { name, phone, email, plan_interest, message },
        utm_source: body.utm_source ?? null,
        utm_medium: body.utm_medium ?? null,
        utm_campaign: body.utm_campaign ?? null,
        utm_term: body.utm_term ?? null,
        ip_hash: ipHash,
        is_spam: false,
        consent_granted: consent ?? false,
        consent_text: consent_text ?? null,
        policy_version: policy_version ?? null,
        purposes: purposes ?? [],
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return Response.json(
        { error: "Erro ao salvar formulário." },
        { status: 500 }
      );
    }

    // Registro de consentimento (LGPD art. 8º §1º — prova do consentimento)
    if (consent && consent_text) {
      const subjectHash = crypto
        .createHash("sha256")
        .update(email.toLowerCase().trim() + (process.env.IP_HASH_SALT ?? "viver-saude-salt"))
        .digest("hex")
        .slice(0, 32);

      const { error: consentErr } = await supabase.from("consent_logs").insert({
        subject_hash: subjectHash,
        source: "form-" + (body.form_type ?? "contato"),
        purposes: purposes ?? [],
        consent_text,
        policy_version: policy_version ?? "1.0",
        action: "granted",
        ip_hash: ipHash,
        user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
        page_url: body.page_url ?? null,
        related_submission_id: insertedRow?.id ?? null,
      });
      if (consentErr) {
        console.error("Consent log error (non-blocking):", consentErr);
      }
    }

    // Send to HStation CRM (requires Cloudflare whitelist on /api/ path)
    try {
      const hstationResponse = await fetch("https://planoviversaude.hstation.com.br/api/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_nome: name,
          lead_email: email,
          lead_telefone: phone,
          lead_posto_de_conversao: "Site Viver Saúde",
          lead_equipe: "equipe-rj",
        }),
      });

      if (!hstationResponse.ok) {
        const hstationBody = await hstationResponse.text().catch(() => "");
        console.error("HStation API failed:", hstationResponse.status, hstationBody.slice(0, 200));
      }
    } catch (hstationErr) {
      console.error("HStation API error:", hstationErr);
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return Response.json({ error: "Erro interno." }, { status: 500 });
  }
}
