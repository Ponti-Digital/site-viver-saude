"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "editor";
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", full_name: "", role: "editor" as "admin" | "editor" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const json = await res.json();
    setUsers(json.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error ?? "Erro ao criar usuário.");
      setSaving(false);
      return;
    }

    setShowForm(false);
    setFormData({ email: "", password: "", full_name: "", role: "editor" });
    setSaving(false);
    fetchUsers();
  };

  const handleRoleChange = async (userId: string, newRole: "admin" | "editor") => {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId, role: newRole }),
    });
    fetchUsers();
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Excluir o usuario "${userName}"? Esta acao nao pode ser desfeita.`)) return;

    const res = await fetch(`/api/admin/users?id=${userId}`, { method: "DELETE" });
    const json = await res.json();

    if (!res.ok) {
      alert(json.error ?? "Erro ao excluir.");
      return;
    }

    fetchUsers();
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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
          Novo Usuário
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Cadastrar Usuário</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="user-full-name" className="mb-1.5 block text-sm font-medium text-gray-700">Nome completo</label>
                <input
                  id="user-full-name"
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="user-email" className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                <input
                  id="user-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="user-password" className="mb-1.5 block text-sm font-medium text-gray-700">Senha</label>
                <input
                  id="user-password"
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="user-role" className="mb-1.5 block text-sm font-medium text-gray-700">Role</label>
                <select
                  id="user-role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as "admin" | "editor" })}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancelar
              </button>
              <button type="submit" disabled={saving} className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">
                {saving ? "Criando..." : "Criar Usuário"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3">Nome</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Criado em</th>
                <th className="px-6 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{user.full_name}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as "admin" | "editor")}
                        className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 focus:border-primary focus:outline-none"
                      >
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleDelete(user.id, user.full_name)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Excluir
                      </button>
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
