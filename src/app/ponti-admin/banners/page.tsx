"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface Banner {
  id: string;
  title: string;
  image_url: string;
  image_mobile_url: string | null;
  link_url: string | null;
  link_target: string;
  alt_text: string | null;
  sort_order: number;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
}

const emptyForm = {
  title: "",
  image_url: "",
  image_mobile_url: "",
  link_url: "",
  link_target: "_self",
  alt_text: "",
  sort_order: 0,
  is_active: true,
  starts_at: "",
  ends_at: "",
};

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);

  const fetchBanners = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("banners")
      .select("*")
      .order("sort_order", { ascending: true });
    setBanners(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const uploadImage = async (
    file: File,
    setUpl: (v: boolean) => void
  ): Promise<string | null> => {
    setUpl(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const fileName = `banners/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from("media")
      .upload(fileName, file, { upsert: true });

    if (error) {
      alert("Erro no upload: " + error.message);
      setUpl(false);
      return null;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("media").getPublicUrl(fileName);

    setUpl(false);
    return publicUrl;
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "image_url" | "image_mobile_url"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const setUpl = field === "image_url" ? setUploading : setUploadingMobile;
    const url = await uploadImage(file, setUpl);
    if (url) setForm((f) => ({ ...f, [field]: url }));
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.image_url.trim()) {
      alert("Título e imagem são obrigatórios.");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const payload = {
      title: form.title,
      image_url: form.image_url,
      image_mobile_url: form.image_mobile_url || null,
      link_url: form.link_url || null,
      link_target: form.link_target,
      alt_text: form.alt_text || null,
      sort_order: form.sort_order,
      is_active: form.is_active,
      starts_at: form.starts_at || null,
      ends_at: form.ends_at || null,
      updated_at: new Date().toISOString(),
    };

    let saveError;
    if (editing) {
      const { error } = await supabase.from("banners").update(payload).eq("id", editing);
      saveError = error;
    } else {
      const { error } = await supabase.from("banners").insert(payload);
      saveError = error;
    }

    setSaving(false);

    if (saveError) {
      alert("Erro ao salvar banner: " + saveError.message);
      return;
    }

    setEditing(null);
    setForm(emptyForm);
    fetchBanners();
  };

  const handleEdit = (banner: Banner) => {
    setEditing(banner.id);
    setForm({
      title: banner.title,
      image_url: banner.image_url,
      image_mobile_url: banner.image_mobile_url ?? "",
      link_url: banner.link_url ?? "",
      link_target: banner.link_target,
      alt_text: banner.alt_text ?? "",
      sort_order: banner.sort_order,
      is_active: banner.is_active,
      starts_at: banner.starts_at ? banner.starts_at.slice(0, 16) : "",
      ends_at: banner.ends_at ? banner.ends_at.slice(0, 16) : "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este banner?")) return;
    const supabase = createClient();
    await supabase.from("banners").delete().eq("id", id);
    fetchBanners();
  };

  const handleToggle = async (id: string, active: boolean) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("banners")
      .update({ is_active: !active, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      alert("Erro ao alterar status do banner: " + error.message);
      return;
    }
    fetchBanners();
  };

  const handleCancel = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
      </div>

      {/* Form */}
      <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {editing ? "Editar banner" : "Novo banner"}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="banner-title" className={labelClass}>Título *</label>
            <input
              id="banner-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Ex: Campanha Dia das Mães"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="banner-alt-text" className={labelClass}>Texto alternativo</label>
            <input
              id="banner-alt-text"
              type="text"
              value={form.alt_text}
              onChange={(e) =>
                setForm((f) => ({ ...f, alt_text: e.target.value }))
              }
              placeholder="Descrição da imagem para acessibilidade"
              className={inputClass}
            />
          </div>

          {/* Desktop image */}
          <div>
            <label htmlFor="banner-image-desktop" className={labelClass}>Imagem Desktop *</label>
            <input
              id="banner-image-desktop"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "image_url")}
              className={inputClass}
            />
            {uploading && (
              <p className="mt-1 text-xs text-primary">Enviando...</p>
            )}
            {form.image_url && (
              <div className="mt-2 relative w-full h-24 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={form.image_url}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <input
              type="text"
              value={form.image_url}
              onChange={(e) =>
                setForm((f) => ({ ...f, image_url: e.target.value }))
              }
              placeholder="Ou cole a URL da imagem"
              className={`${inputClass} mt-2`}
            />
          </div>

          {/* Mobile image */}
          <div>
            <label className={labelClass}>Imagem Mobile (opcional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "image_mobile_url")}
              className={inputClass}
            />
            {uploadingMobile && (
              <p className="mt-1 text-xs text-primary">Enviando...</p>
            )}
            {form.image_mobile_url && (
              <div className="mt-2 relative w-full h-24 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={form.image_mobile_url}
                  alt="Preview mobile"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <input
              type="text"
              value={form.image_mobile_url}
              onChange={(e) =>
                setForm((f) => ({ ...f, image_mobile_url: e.target.value }))
              }
              placeholder="Ou cole a URL da imagem mobile"
              className={`${inputClass} mt-2`}
            />
          </div>

          <div>
            <label className={labelClass}>Link (URL de destino)</label>
            <input
              type="text"
              value={form.link_url}
              onChange={(e) =>
                setForm((f) => ({ ...f, link_url: e.target.value }))
              }
              placeholder="https://... ou /pagina"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Abrir em</label>
              <select
                value={form.link_target}
                onChange={(e) =>
                  setForm((f) => ({ ...f, link_target: e.target.value }))
                }
                className={inputClass}
              >
                <option value="_self">Mesma aba</option>
                <option value="_blank">Nova aba</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Ordem</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    sort_order: parseInt(e.target.value) || 0,
                  }))
                }
                className={inputClass}
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, is_active: e.target.checked }))
                  }
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Ativo</span>
              </label>
            </div>
          </div>

          <div>
            <label className={labelClass}>Início (opcional)</label>
            <input
              type="datetime-local"
              value={form.starts_at}
              onChange={(e) =>
                setForm((f) => ({ ...f, starts_at: e.target.value }))
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Fim (opcional)</label>
            <input
              type="datetime-local"
              value={form.ends_at}
              onChange={(e) =>
                setForm((f) => ({ ...f, ends_at: e.target.value }))
              }
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            {saving ? "Salvando..." : editing ? "Atualizar" : "Criar banner"}
          </button>
          {editing && (
            <button
              onClick={handleCancel}
              className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3">Banner</th>
                <th className="px-6 py-3">Título</th>
                <th className="px-6 py-3">Ordem</th>
                <th className="px-6 py-3">Status</th>
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
              ) : banners.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-sm text-gray-400"
                  >
                    Nenhum banner cadastrado.
                  </td>
                </tr>
              ) : (
                banners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <div className="relative w-32 h-14 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={banner.image_url}
                          alt={banner.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <p className="text-sm font-medium text-gray-900">
                        {banner.title}
                      </p>
                      {banner.link_url && (
                        <p className="text-xs text-gray-400 truncate max-w-[200px]">
                          {banner.link_url}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {banner.sort_order}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() =>
                          handleToggle(banner.id, banner.is_active)
                        }
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium cursor-pointer transition-colors ${
                          banner.is_active
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {banner.is_active ? "Ativo" : "Inativo"}
                      </button>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(banner)}
                          className="text-sm text-primary hover:underline"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(banner.id)}
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
