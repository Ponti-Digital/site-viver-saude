"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface PlanBenefit {
  name: string;
  description: string;
  value: string;
}

interface PlanDocument {
  label: string;
  file: string;
}

function MessageBanner({
  message,
}: {
  message: { type: "success" | "error"; text: string } | null;
}) {
  if (!message) return null;
  return (
    <div
      className={`rounded-lg px-4 py-3 text-sm ${
        message.type === "success"
          ? "bg-green-50 text-green-700"
          : "bg-red-50 text-red-700"
      }`}
    >
      {message.text}
    </div>
  );
}

interface Plan {
  id: string;
  name: string;
  slug: string;
  display_name: string;
  tagline: string | null;
  description: string | null;
  target_audience: string | null;
  highlights: string[] | null;
  coverage_type: string | null;
  region: string | null;
  contract_types: string[] | null;
  image_url: string | null;
  pdf_url: string | null;
  sort_order: number | null;
  is_active: boolean | null;
  // Campos novos (migration 006)
  audience_label: string | null;
  starting_price: string | null;
  price_raw: string | null;
  benefits: PlanBenefit[] | null;
  modalities_text: string | null;
  price_footnote: string | null;
  condicoes_gerais: PlanDocument[] | null;
}

export default function EditPlanPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("id", id)
        .single();
      if (error || !data) {
        router.push("/ponti-admin/plans");
        return;
      }
      setPlan(data as Plan);
      setLoading(false);
    }
    load();
  }, [id, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;
    setSaving(true);
    setMessage(null);

    const supabase = createClient();
    const { data: updated, error } = await supabase
      .from("plans")
      .update({
        name: plan.name,
        slug: plan.slug,
        display_name: plan.display_name,
        tagline: plan.tagline || null,
        description: plan.description || null,
        target_audience: plan.target_audience || null,
        highlights: plan.highlights ?? [],
        coverage_type: plan.coverage_type || null,
        region: plan.region || null,
        image_url: plan.image_url || null,
        pdf_url: plan.pdf_url || null,
        sort_order: plan.sort_order ?? 0,
        is_active: plan.is_active ?? true,
        // Campos novos
        audience_label: plan.audience_label || null,
        starting_price: plan.starting_price || null,
        price_raw: plan.price_raw || null,
        benefits: plan.benefits ?? [],
        modalities_text: plan.modalities_text || null,
        price_footnote: plan.price_footnote || null,
        condicoes_gerais: plan.condicoes_gerais ?? [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id");

    setSaving(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    // Trata 0 linhas retornadas como erro de permissão (compatível com is_admin() RLS)
    if (!updated || updated.length === 0) {
      setMessage({
        type: "error",
        text: "Nenhuma linha alterada — verifique permissões ou tente novamente.",
      });
      return;
    }

    setMessage({ type: "success", text: "Plano salvo com sucesso." });

    // Revalidação on-demand das páginas públicas afetadas
    try {
      await fetch("/api/admin/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paths: ["/planos", `/planos/${plan.slug}`, "/"],
        }),
      });
    } catch {
      // Falha silenciosa — o ISR de 1h garante atualização eventual
    }
  };

  const update = (field: keyof Plan, value: unknown) => {
    setPlan((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  // --- Helpers para listas de string (highlights) ---
  const updateHighlight = (idx: number, value: string) => {
    const arr = [...(plan?.highlights ?? [])];
    arr[idx] = value;
    update("highlights", arr);
  };
  const addHighlight = () => update("highlights", [...(plan?.highlights ?? []), ""]);
  const removeHighlight = (idx: number) =>
    update("highlights", (plan?.highlights ?? []).filter((_, i) => i !== idx));

  // --- Helpers para benefits ---
  const updateBenefit = (idx: number, field: keyof PlanBenefit, value: string) => {
    const arr = [...(plan?.benefits ?? [])];
    arr[idx] = { ...arr[idx], [field]: value };
    update("benefits", arr);
  };
  const addBenefit = () =>
    update("benefits", [...(plan?.benefits ?? []), { name: "", description: "", value: "Incluso" }]);
  const removeBenefit = (idx: number) =>
    update("benefits", (plan?.benefits ?? []).filter((_, i) => i !== idx));

  // --- Helpers para condicoes_gerais ---
  const updateCondicao = (idx: number, field: keyof PlanDocument, value: string) => {
    const arr = [...(plan?.condicoes_gerais ?? [])];
    arr[idx] = { ...arr[idx], [field]: value };
    update("condicoes_gerais", arr);
  };
  const addCondicao = () =>
    update("condicoes_gerais", [...(plan?.condicoes_gerais ?? []), { label: "", file: "" }]);
  const removeCondicao = (idx: number) =>
    update("condicoes_gerais", (plan?.condicoes_gerais ?? []).filter((_, i) => i !== idx));

  if (loading || !plan) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Editar Plano: {plan.display_name}
        </h1>
        <button
          onClick={() => router.push("/ponti-admin/plans")}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Voltar
        </button>
      </div>

      {/* Mensagem no topo */}
      {message && (
        <div className="mb-4">
          <MessageBanner message={message} />
        </div>
      )}

      <form onSubmit={handleSave} className="rounded-xl bg-white p-6 shadow-sm space-y-6">
        {/* Identificação */}
        <fieldset className="space-y-5">
          <legend className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Identificação</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="plan-name" className="mb-1 block text-sm font-medium text-gray-700">Nome</label>
              <input id="plan-name" className={inputClass} value={plan.name} onChange={(e) => update("name", e.target.value)} />
            </div>
            <div>
              <label htmlFor="plan-slug" className="mb-1 block text-sm font-medium text-gray-700">Slug</label>
              <input id="plan-slug" className={inputClass} value={plan.slug} onChange={(e) => update("slug", e.target.value)} />
            </div>
            <div>
              <label htmlFor="plan-display-name" className="mb-1 block text-sm font-medium text-gray-700">Display Name</label>
              <input id="plan-display-name" className={inputClass} value={plan.display_name} onChange={(e) => update("display_name", e.target.value)} />
            </div>
            <div>
              <label htmlFor="plan-tagline" className="mb-1 block text-sm font-medium text-gray-700">Tagline</label>
              <input id="plan-tagline" className={inputClass} value={plan.tagline ?? ""} onChange={(e) => update("tagline", e.target.value)} />
            </div>
          </div>

          <div>
            <label htmlFor="plan-description" className="mb-1 block text-sm font-medium text-gray-700">Descrição</label>
            <textarea id="plan-description" className={inputClass + " min-h-[80px]"} value={plan.description ?? ""} onChange={(e) => update("description", e.target.value)} />
          </div>
        </fieldset>

        {/* Cobertura e região */}
        <fieldset className="space-y-5">
          <legend className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Cobertura e Região</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="plan-target-audience" className="mb-1 block text-sm font-medium text-gray-700">Público-alvo (descrição longa)</label>
              <input id="plan-target-audience" className={inputClass} value={plan.target_audience ?? ""} onChange={(e) => update("target_audience", e.target.value)} />
            </div>
            <div>
              <label htmlFor="plan-audience-label" className="mb-1 block text-sm font-medium text-gray-700">Rótulo de público (curto)</label>
              <input id="plan-audience-label" className={inputClass} value={plan.audience_label ?? ""} onChange={(e) => update("audience_label", e.target.value)} placeholder="Ex: Empresarial e Coletivo por Adesão" />
            </div>
            <div>
              <label htmlFor="plan-coverage-type" className="mb-1 block text-sm font-medium text-gray-700">Tipo de Cobertura</label>
              <input id="plan-coverage-type" className={inputClass} value={plan.coverage_type ?? ""} onChange={(e) => update("coverage_type", e.target.value)} />
            </div>
            <div>
              <label htmlFor="plan-region" className="mb-1 block text-sm font-medium text-gray-700">Região</label>
              <input id="plan-region" className={inputClass} value={plan.region ?? ""} onChange={(e) => update("region", e.target.value)} />
            </div>
          </div>
        </fieldset>

        {/* Preço */}
        <fieldset className="space-y-5">
          <legend className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Preço</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="plan-starting-price" className="mb-1 block text-sm font-medium text-gray-700">Preço &quot;A partir de&quot; (exibição)</label>
              <input id="plan-starting-price" className={inputClass} value={plan.starting_price ?? ""} onChange={(e) => update("starting_price", e.target.value)} placeholder="Ex: A partir de R$ 154,27" />
            </div>
            <div>
              <label htmlFor="plan-price-raw" className="mb-1 block text-sm font-medium text-gray-700">Preço sticky bar</label>
              <input id="plan-price-raw" className={inputClass} value={plan.price_raw ?? ""} onChange={(e) => update("price_raw", e.target.value)} placeholder="Ex: R$ 154,27" />
            </div>
          </div>
          <div>
            <label htmlFor="plan-price-footnote" className="mb-1 block text-sm font-medium text-gray-700">Nota de preço</label>
            <input id="plan-price-footnote" className={inputClass} value={plan.price_footnote ?? ""} onChange={(e) => update("price_footnote", e.target.value)} placeholder="*Valor referente à faixa etária..." />
          </div>
          <div>
            <label htmlFor="plan-modalities-text" className="mb-1 block text-sm font-medium text-gray-700">Texto de modalidades</label>
            <textarea id="plan-modalities-text" className={inputClass + " min-h-[60px]"} value={plan.modalities_text ?? ""} onChange={(e) => update("modalities_text", e.target.value)} />
          </div>
        </fieldset>

        {/* Destaques */}
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Destaques</legend>
          {(plan.highlights ?? []).map((h, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                id={`highlight-${idx}`}
                className={inputClass}
                value={h}
                onChange={(e) => updateHighlight(idx, e.target.value)}
                placeholder={`Destaque ${idx + 1}`}
              />
              <button
                type="button"
                onClick={() => removeHighlight(idx)}
                className="text-red-400 hover:text-red-600 text-xs px-2 py-1 rounded border border-red-200 hover:border-red-400 flex-shrink-0"
                aria-label="Remover destaque"
              >
                Remover
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addHighlight}
            className="text-sm text-primary hover:underline"
          >
            + Adicionar destaque
          </button>
        </fieldset>

        {/* Benefícios */}
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Benefícios inclusos</legend>
          {(plan.benefits ?? []).map((b, idx) => (
            <div key={idx} className="border border-gray-100 rounded-lg p-4 space-y-2">
              <div className="grid gap-2 sm:grid-cols-3">
                <div>
                  <label htmlFor={`benefit-name-${idx}`} className="mb-1 block text-xs font-medium text-gray-600">Nome</label>
                  <input id={`benefit-name-${idx}`} className={inputClass} value={b.name} onChange={(e) => updateBenefit(idx, "name", e.target.value)} placeholder="Ex: Telemedicina" />
                </div>
                <div>
                  <label htmlFor={`benefit-desc-${idx}`} className="mb-1 block text-xs font-medium text-gray-600">Descrição</label>
                  <input id={`benefit-desc-${idx}`} className={inputClass} value={b.description} onChange={(e) => updateBenefit(idx, "description", e.target.value)} placeholder="Ex: Consultas online 24h" />
                </div>
                <div>
                  <label htmlFor={`benefit-value-${idx}`} className="mb-1 block text-xs font-medium text-gray-600">Valor/Rótulo</label>
                  <input id={`benefit-value-${idx}`} className={inputClass} value={b.value} onChange={(e) => updateBenefit(idx, "value", e.target.value)} placeholder="Ex: Incluso" />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeBenefit(idx)}
                className="text-xs text-red-400 hover:text-red-600"
              >
                Remover benefício
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addBenefit}
            className="text-sm text-primary hover:underline"
          >
            + Adicionar benefício
          </button>
        </fieldset>

        {/* Condições Gerais */}
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Condições Gerais (PDFs)</legend>
          {(plan.condicoes_gerais ?? []).map((doc, idx) => (
            <div key={idx} className="flex gap-2 items-end">
              <div className="flex-1">
                <label htmlFor={`condicao-label-${idx}`} className="mb-1 block text-xs font-medium text-gray-600">Rótulo</label>
                <input id={`condicao-label-${idx}`} className={inputClass} value={doc.label} onChange={(e) => updateCondicao(idx, "label", e.target.value)} placeholder="Ex: Diamante CE QC" />
              </div>
              <div className="flex-1">
                <label htmlFor={`condicao-file-${idx}`} className="mb-1 block text-xs font-medium text-gray-600">Caminho do arquivo</label>
                <input id={`condicao-file-${idx}`} className={inputClass} value={doc.file} onChange={(e) => updateCondicao(idx, "file", e.target.value)} placeholder="/docs/condicoes-gerais/..." />
              </div>
              <button
                type="button"
                onClick={() => removeCondicao(idx)}
                className="text-xs text-red-400 hover:text-red-600 pb-2 flex-shrink-0"
              >
                Remover
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addCondicao}
            className="text-sm text-primary hover:underline"
          >
            + Adicionar documento
          </button>
        </fieldset>

        {/* Mídia e ordenação */}
        <fieldset className="space-y-5">
          <legend className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Mídia e Ordenação</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="plan-image-url" className="mb-1 block text-sm font-medium text-gray-700">URL da Imagem</label>
              <input id="plan-image-url" className={inputClass} value={plan.image_url ?? ""} onChange={(e) => update("image_url", e.target.value)} />
            </div>
            <div>
              <label htmlFor="plan-pdf-url" className="mb-1 block text-sm font-medium text-gray-700">URL do PDF</label>
              <input id="plan-pdf-url" className={inputClass} value={plan.pdf_url ?? ""} onChange={(e) => update("pdf_url", e.target.value)} />
            </div>
            <div>
              <label htmlFor="plan-sort-order" className="mb-1 block text-sm font-medium text-gray-700">Ordem</label>
              <input id="plan-sort-order" type="number" className={inputClass} value={plan.sort_order ?? 0} onChange={(e) => update("sort_order", parseInt(e.target.value) || 0)} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={plan.is_active ?? true}
              onChange={(e) => update("is_active", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">Ativo</label>
          </div>
        </fieldset>

        {/* Botões de ação + mensagem no rodapé */}
        <div className="border-t border-gray-100 pt-4 space-y-3">
          {/* Mensagem duplicada perto dos botões para visibilidade */}
          {message && <MessageBanner message={message} />}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/ponti-admin/plans")}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
