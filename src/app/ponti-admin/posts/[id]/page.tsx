"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const categories = [
  "Saude",
  "Bem-estar",
  "Nutricao",
  "Exercicios",
  "Noticias",
  "Planos",
];

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  // Guarda o status e published_at originais do banco para evitar sobrescrever a data
  const [originalStatus, setOriginalStatus] = useState<"draft" | "published">("draft");
  const [originalPublishedAt, setOriginalPublishedAt] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [existingCover, setExistingCover] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogImageUrl, setOgImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (fetchError || !data) {
        setError("Post não encontrado.");
        setLoading(false);
        return;
      }

      setTitle(data.title);
      setSlug(data.slug);
      setExcerpt(data.excerpt ?? "");
      setCategory(data.category ?? "");
      setContent(typeof data.content === "string" ? data.content : JSON.stringify(data.content));
      setStatus(data.status);
      setOriginalStatus(data.status);
      setOriginalPublishedAt(data.published_at ?? null);
      setExistingCover(data.cover_image_url);
      setTags(data.tags ?? []);
      setMetaTitle(data.meta_title ?? "");
      setMetaDescription(data.meta_description ?? "");
      setOgImageUrl(data.og_image_url ?? "");
      setLoading(false);
    }

    fetchPost();
  }, [postId]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    // Slug travado em posts já existentes: não regenerar ao editar título
    // (em posts/new/page.tsx o auto-slug permanece ativo)
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleAddTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("O título é obrigatório.");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    let cover_image_url = existingCover;

    if (coverFile) {
      const ext = coverFile.name.split(".").pop();
      const filePath = `posts/${slug}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, coverFile, { upsert: true });

      if (uploadError) {
        setError("Erro ao fazer upload da imagem: " + uploadError.message);
        setSaving(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(filePath);

      cover_image_url = publicUrl;
    }

    const updateData: Record<string, unknown> = {
      title,
      slug,
      excerpt: excerpt || null,
      category: category || null,
      content,
      status,
      cover_image_url,
      tags,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      og_image_url: ogImageUrl || null,
      updated_at: new Date().toISOString(),
    };

    // Só define published_at na transição draft → published.
    // Em saves de post já publicado, preserva a data original.
    if (status === "published") {
      if (originalStatus === "draft" || !originalPublishedAt) {
        updateData.published_at = new Date().toISOString();
      } else {
        updateData.published_at = originalPublishedAt;
      }
    }

    const { error: updateError } = await supabase
      .from("posts")
      .update(updateData)
      .eq("id", postId);

    if (updateError) {
      setError("Erro ao salvar post: " + updateError.message);
      setSaving(false);
      return;
    }

    router.push("/ponti-admin/posts");
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
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Editar Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-xl bg-white p-6 shadow-sm space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="post-title" className="mb-1.5 block text-sm font-medium text-gray-700">
              Titulo
            </label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="post-slug" className="mb-1.5 block text-sm font-medium text-gray-700">
              Slug
            </label>
            <input
              id="post-slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {status === "published" && (
              <p className="mt-1 text-xs text-amber-600">
                Alterar o slug muda a URL pública e pode quebrar links indexados.
              </p>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="post-excerpt" className="mb-1.5 block text-sm font-medium text-gray-700">
              Resumo
            </label>
            <textarea
              id="post-excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="post-category" className="mb-1.5 block text-sm font-medium text-gray-700">
              Categoria
            </label>
            <select
              id="post-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Selecionar categoria</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="post-tags" className="mb-1.5 block text-sm font-medium text-gray-700">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-500"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <input
              id="post-tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={handleAddTag}
              placeholder="Digite e pressione Enter"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="post-content" className="mb-1.5 block text-sm font-medium text-gray-700">
              Conteudo
            </label>
            <textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
            />
          </div>

          {/* Cover Image */}
          <div>
            <label htmlFor="post-cover" className="mb-1.5 block text-sm font-medium text-gray-700">
              Imagem de Capa
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer rounded-lg border border-dashed border-gray-300 px-6 py-4 text-sm text-gray-500 transition-colors hover:border-primary hover:text-primary">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {coverFile ? coverFile.name : "Trocar imagem"}
              </label>
              {(coverPreview || existingCover) && (
                <img
                  src={coverPreview ?? existingCover ?? ""}
                  alt="Preview"
                  className="h-16 w-24 rounded-lg object-cover"
                />
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="post-status" className="mb-1.5 block text-sm font-medium text-gray-700">
              Status
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStatus("draft")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  status === "draft"
                    ? "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                Rascunho
              </button>
              <button
                type="button"
                onClick={() => setStatus("published")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  status === "published"
                    ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                Publicado
              </button>
            </div>
          </div>
        </div>

        {/* SEO Section */}
        <div className="rounded-xl bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">SEO</h2>

          <div>
            <label htmlFor="post-meta-title" className="mb-1.5 block text-sm font-medium text-gray-700">
              Meta Title
            </label>
            <input
              id="post-meta-title"
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Título para mecanismos de busca"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <p className="mt-1 text-xs text-gray-400">{metaTitle.length}/60 caracteres</p>
          </div>

          <div>
            <label htmlFor="post-meta-description" className="mb-1.5 block text-sm font-medium text-gray-700">
              Meta Description
            </label>
            <textarea
              id="post-meta-description"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={2}
              placeholder="Descrição para mecanismos de busca"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <p className="mt-1 text-xs text-gray-400">{metaDescription.length}/160 caracteres</p>
          </div>

          <div>
            <label htmlFor="post-og-image" className="mb-1.5 block text-sm font-medium text-gray-700">
              OG Image URL
            </label>
            <input
              id="post-og-image"
              type="text"
              value={ogImageUrl}
              onChange={(e) => setOgImageUrl(e.target.value)}
              placeholder="URL da imagem para redes sociais"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/ponti-admin/posts")}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
