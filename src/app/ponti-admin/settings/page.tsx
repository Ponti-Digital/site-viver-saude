"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Settings {
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  whatsapp_number: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  youtube_url: string;
}

const defaultSettings: Settings = {
  contact_phone: "",
  contact_email: "",
  contact_address: "",
  whatsapp_number: "",
  facebook_url: "",
  instagram_url: "",
  linkedin_url: "",
  youtube_url: "",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_settings")
        .select("key, value");

      if (data) {
        const mapped: Record<string, string> = {};
        data.forEach((row: { key: string; value: string }) => {
          mapped[row.key] = row.value ?? "";
        });
        setSettings((prev) => ({ ...prev, ...mapped }));
      }
      setLoading(false);
    }

    fetchSettings();
  }, []);

  const handleChange = (key: keyof Settings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    const upserts = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
    }));

    const { error: upsertError } = await supabase
      .from("site_settings")
      .upsert(upserts, { onConflict: "key" });

    if (upsertError) {
      setError("Erro ao salvar: " + upsertError.message);
    } else {
      setSuccess(true);
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const fieldGroups = [
    {
      title: "Informações de Contato",
      fields: [
        { key: "contact_phone" as const, label: "Telefone", type: "text" },
        { key: "contact_email" as const, label: "Email", type: "email" },
        { key: "contact_address" as const, label: "Endereço", type: "text" },
        {
          key: "whatsapp_number" as const,
          label: "WhatsApp",
          type: "text",
        },
      ],
    },
    {
      title: "Redes Sociais",
      fields: [
        { key: "facebook_url" as const, label: "Facebook URL", type: "url" },
        { key: "instagram_url" as const, label: "Instagram URL", type: "url" },
        { key: "linkedin_url" as const, label: "LinkedIn URL", type: "url" },
        { key: "youtube_url" as const, label: "YouTube URL", type: "url" },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Configurações</h1>

      <form onSubmit={handleSave} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            Configurações salvas com sucesso!
          </div>
        )}

        {fieldGroups.map((group) => (
          <div key={group.title} className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {group.title}
            </h2>
            <div className="space-y-4">
              {group.fields.map((field) => (
                <div key={field.key}>
                  <label htmlFor={field.key} className="mb-1.5 block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    id={field.key}
                    type={field.type}
                    value={settings[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar Configurações"}
          </button>
        </div>
      </form>
    </div>
  );
}
