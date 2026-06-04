"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EditPagePage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogImageUrl, setOgImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPage() {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("pages")
        .select("*")
        .eq("id", pageId)
        .single();

      if (fetchError || !data) {
        setError("Página não encontrada.");
        setLoading(false);
        return;
      }

      setTitle(data.title);
      setSlug(data.slug);
      setContent(typeof data.content === "object" ? JSON.stringify(data.content, null, 2) : String(data.content));
      setStatus(data.status);
      setMetaTitle(data.meta_title ?? "");
      setMetaDescription(data.meta_description ?? "");
      setOgImageUrl(data.og_image_url ?? "");
      setLoading(false);
    }
    fetchPage();
  }, [pageId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const supabase = createClient();

    let parsedContent: unknown;
    try {
      parsedContent = JSON.parse(content);
    } catch {
      parsedContent = { body: content };
    }

    const { error: updateError } = await supabase
      .from("pages")
      .update({
        title,
        slug,
        content: parsedContent,
        status,
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
        og_image_url: ogImageUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", pageId);

    if (updateError) {
      setError("Erro ao salvar: " + updateError.message);
      setSaving(false);
      return;
    }

    router.push("/ponti-admin/pages");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Editar Página</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div className="rounded-xl bg-white p-6 shadow-sm space-y-5">
          <div>
            <label htmlFor="page-title" className="mb-1.5 block text-sm font-medium text-gray-700">Título</label>
            <input id="page-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>

          <div>
            <label htmlFor="page-slug" className="mb-1.5 block text-sm font-medium text-gray-700">Slug</label>
            <input id="page-slug" type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>

          <div>
            <label htmlFor="page-content" className="mb-1.5 block text-sm font-medium text-gray-700">Conteudo (JSON)</label>
            <textarea id="page-content" value={content} onChange={(e) => setContent(e.target.value)} rows={16} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono" />
          </div>

          <div>
            <label htmlFor="page-status" className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setStatus("draft")} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${status === "draft" ? "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}>
                Rascunho
              </button>
              <button type="button" onClick={() => setStatus("published")} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${status === "published" ? "bg-green-50 text-green-700 ring-1 ring-green-200" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}>
                Publicada
              </button>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="rounded-xl bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">SEO</h2>
          <div>
            <label htmlFor="page-meta-title" className="mb-1.5 block text-sm font-medium text-gray-700">Meta Title</label>
            <input id="page-meta-title" type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            <p className="mt-1 text-xs text-gray-400">{metaTitle.length}/60</p>
          </div>
          <div>
            <label htmlFor="page-meta-description" className="mb-1.5 block text-sm font-medium text-gray-700">Meta Description</label>
            <textarea id="page-meta-description" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={2} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            <p className="mt-1 text-xs text-gray-400">{metaDescription.length}/160</p>
          </div>
          <div>
            <label htmlFor="page-og-image" className="mb-1.5 block text-sm font-medium text-gray-700">OG Image URL</label>
            <input id="page-og-image" type="text" value={ogImageUrl} onChange={(e) => setOgImageUrl(e.target.value)} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => router.push("/ponti-admin/pages")} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
            Cancelar
          </button>
          <button type="submit" disabled={saving} className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50">
            {saving ? "Salvando..." : "Salvar Página"}
          </button>
        </div>
      </form>
    </div>
  );
}
