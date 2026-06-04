"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  category: string | null;
  created_at: string;
  updated_at: string;
}

interface StatusCounts {
  all: number;
  published: number;
  draft: number;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [counts, setCounts] = useState<StatusCounts>({ all: 0, published: 0, draft: 0 });

  const loadCounts = useCallback(async () => {
    const supabase = createClient();
    const [{ count: all }, { count: published }, { count: draft }] = await Promise.all([
      supabase.from("posts").select("*", { count: "exact", head: true }),
      supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "draft"),
    ]);
    return { all: all ?? 0, published: published ?? 0, draft: draft ?? 0 };
  }, []);

  const fetchPosts = useCallback(async () => {
    const supabase = createClient();
    let query = supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    if (search.trim()) {
      query = query.ilike("title", `%${search.trim()}%`);
    }

    const { data } = await query;
    setPosts(data ?? []);
    setLoading(false);
  }, [search, statusFilter]);

  // Carrega contadores uma vez no mount — função interna para evitar set-state-in-effect
  useEffect(() => {
    async function initCounts() {
      const result = await loadCounts();
      setCounts(result);
    }
    initCounts();
  }, [loadCounts]);

  // Debounce: aguarda 300ms antes de buscar (padrão de rede-credenciada/page.tsx:80-83)
  useEffect(() => {
    const timer = setTimeout(fetchPosts, 300);
    return () => clearTimeout(timer);
  }, [fetchPosts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      alert("Erro ao excluir post: " + error.message);
      return;
    }
    setPosts((prev) => prev.filter((p) => p.id !== id));
    const result = await loadCounts();
    setCounts(result);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
        <Link
          href="/ponti-admin/posts/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
          Novo Post
        </Link>
      </div>

      {/* Filtros por status estilo WordPress */}
      <div className="mb-3 flex flex-wrap items-center gap-x-2 text-sm text-gray-500">
        {(
          [
            { key: "all", label: "Todos", count: counts.all },
            { key: "published", label: "Publicados", count: counts.published },
            { key: "draft", label: "Rascunhos", count: counts.draft },
          ] as const
        ).map((item, i, arr) => (
          <span key={item.key} className="flex items-center gap-x-2">
            <button
              onClick={() => setStatusFilter(item.key)}
              className={`hover:underline ${statusFilter === item.key ? "font-bold text-primary" : ""}`}
            >
              {item.label} ({item.count})
            </button>
            {i < arr.length - 1 && <span>|</span>}
          </span>
        ))}
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Buscar por título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3">Título</th>
                <th className="px-6 py-3">Categoria</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Data</th>
                <th className="px-6 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-sm text-gray-400"
                  >
                    Nenhum post encontrado.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <p className="text-sm font-medium text-gray-900">
                        {post.title}
                      </p>
                      <p className="text-xs text-gray-400">/{post.slug}</p>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {post.category ?? "-"}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          post.status === "published"
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {post.status === "published" ? "Publicado" : "Rascunho"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/ponti-admin/posts/${post.id}`}
                          className="text-sm text-primary hover:underline"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-sm text-red-500 hover:underline"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
