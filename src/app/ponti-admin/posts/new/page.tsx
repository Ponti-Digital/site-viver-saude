"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const categories = [
  "Saude",
  "Bem-estar",
  "Nutricao",
  "Exercicios",
  "Noticias",
  "Planos",
];

export default function NewPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogImageUrl, setOgImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

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

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(slugify(value));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
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

    let cover_image_url: string | null = null;

    // Upload cover image if selected
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

    const insertData: Record<string, unknown> = {
      title,
      slug,
      excerpt,
      category: category || null,
      content,
      status,
      cover_image_url,
      tags,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      og_image_url: ogImageUrl || null,
    };

    if (status === "published") {
      insertData.published_at = new Date().toISOString();
    }

    const { error: insertError } = await supabase.from("posts").insert(insertData);

    if (insertError) {
      setError("Erro ao salvar post: " + insertError.message);
      setSaving(false);
      return;
    }

    router.push("/ponti-admin/posts");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Novo Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-xl bg-white p-6 shadow-sm space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="new-post-title" className="mb-1.5 block text-sm font-medium text-gray-700">
              Titulo
            </label>
            <input
              id="new-post-title"
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Digite o título do post"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="new-post-slug" className="mb-1.5 block text-sm font-medium text-gray-700">
              Slug
            </label>
            <input
              id="new-post-slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="new-post-excerpt" className="mb-1.5 block text-sm font-medium text-gray-700">
              Resumo
            </label>
            <textarea
              id="new-post-excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              placeholder="Breve resumo do post"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="new-post-category" className="mb-1.5 block text-sm font-medium text-gray-700">
              Categoria
            </label>
            <select
              id="new-post-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Selecionar categoria</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="new-post-tags" className="mb-1.5 block text-sm font-medium text-gray-700">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">&times;</button>
                </span>
              ))}
            </div>
            <input
              id="new-post-tags"
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
            <label htmlFor="new-post-content" className="mb-1.5 block text-sm font-medium text-gray-700">
              Conteudo
            </label>
            <textarea
              id="new-post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              placeholder="Escreva o conteudo do post aqui..."
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
            />
          </div>

          {/* Cover Image */}
          <div>
            <label htmlFor="new-post-cover" className="mb-1.5 block text-sm font-medium text-gray-700">
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
                {coverFile ? coverFile.name : "Escolher imagem"}
              </label>
              {coverPreview && (
                <img
                  src={coverPreview}
                  alt="Preview"
                  className="h-16 w-24 rounded-lg object-cover"
                />
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
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

        {/* SEO */}
        <div className="rounded-xl bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">SEO</h2>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Meta Title</label>
            <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Título para mecanismos de busca" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            <p className="mt-1 text-xs text-gray-400">{metaTitle.length}/60 caracteres</p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Meta Description</label>
            <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={2} placeholder="Descrição para mecanismos de busca" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            <p className="mt-1 text-xs text-gray-400">{metaDescription.length}/160 caracteres</p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">OG Image URL</label>
            <input type="text" value={ogImageUrl} onChange={(e) => setOgImageUrl(e.target.value)} placeholder="URL da imagem para redes sociais" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
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
            {saving ? "Salvando..." : "Salvar Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
