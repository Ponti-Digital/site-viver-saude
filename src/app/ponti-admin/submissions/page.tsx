"use client";

import { Fragment, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Submission {
  id: string;
  form_type: string;
  page_url: string;
  created_at: string;
  is_spam: boolean;
  ip_hash: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  data: Record<string, unknown>;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubmissions() {
      const supabase = createClient();
      const { data } = await supabase
        .from("form_submissions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      setSubmissions(data ?? []);
      setLoading(false);
    }

    fetchSubmissions();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Submissões de Formulário
      </h1>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3 w-8"></th>
                <th className="px-6 py-3">Tipo</th>
                <th className="px-6 py-3">Nome</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Página</th>
                <th className="px-6 py-3">Spam</th>
                <th className="px-6 py-3">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {submissions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-sm text-gray-400"
                  >
                    Nenhuma submissão encontrada.
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => {
                  const isExpanded = expandedId === sub.id;
                  const dataObj = sub.data as Record<string, string>;
                  const hasUtm =
                    sub.utm_source ||
                    sub.utm_medium ||
                    sub.utm_campaign ||
                    sub.utm_term;

                  return (
                    <Fragment key={sub.id}>
                      <tr
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleExpand(sub.id)}
                      >
                        <td className="px-6 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                          >
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                            {sub.form_type ?? "contato"}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-900">
                          {dataObj?.name ?? "-"}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {dataObj?.email ?? "-"}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-500 max-w-[200px] truncate">
                          {sub.page_url ?? "-"}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          {sub.is_spam ? (
                            <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                              Spam
                            </span>
                          ) : (
                            <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">
                              OK
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-500">
                          {new Date(sub.created_at).toLocaleDateString("pt-BR")}{" "}
                          {new Date(sub.created_at).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr key={`${sub.id}-details`}>
                          <td colSpan={7} className="bg-gray-50 px-6 py-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                              {/* Form data */}
                              <div>
                                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                  Dados do Formulário
                                </h4>
                                <div className="space-y-1">
                                  {Object.entries(sub.data ?? {}).map(
                                    ([key, value]) => (
                                      <div key={key} className="text-sm">
                                        <span className="font-medium text-gray-700">
                                          {key}:
                                        </span>{" "}
                                        <span className="text-gray-600">
                                          {String(value)}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>

                              {/* UTM data */}
                              <div>
                                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                  Dados UTM
                                </h4>
                                {hasUtm ? (
                                  <div className="space-y-1 text-sm">
                                    {sub.utm_source && (
                                      <div>
                                        <span className="font-medium text-gray-700">
                                          Source:
                                        </span>{" "}
                                        <span className="text-gray-600">
                                          {sub.utm_source}
                                        </span>
                                      </div>
                                    )}
                                    {sub.utm_medium && (
                                      <div>
                                        <span className="font-medium text-gray-700">
                                          Medium:
                                        </span>{" "}
                                        <span className="text-gray-600">
                                          {sub.utm_medium}
                                        </span>
                                      </div>
                                    )}
                                    {sub.utm_campaign && (
                                      <div>
                                        <span className="font-medium text-gray-700">
                                          Campaign:
                                        </span>{" "}
                                        <span className="text-gray-600">
                                          {sub.utm_campaign}
                                        </span>
                                      </div>
                                    )}
                                    {sub.utm_term && (
                                      <div>
                                        <span className="font-medium text-gray-700">
                                          Term:
                                        </span>{" "}
                                        <span className="text-gray-600">
                                          {sub.utm_term}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-400">
                                    Sem dados UTM
                                  </p>
                                )}
                                {sub.ip_hash && (
                                  <div className="mt-2 text-sm">
                                    <span className="font-medium text-gray-700">
                                      IP Hash:
                                    </span>{" "}
                                    <span className="font-mono text-xs text-gray-400">
                                      {sub.ip_hash}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
