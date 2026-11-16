"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiClientError } from "@/lib/api-client";

type User = { id: number; email: string; name: string; role: "admin" | "editor"; disabled: boolean; lastLoginAt: string | null };

const fmt = (iso: string | null) =>
  iso ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Ouagadougou" }).format(new Date(iso)) : "Jamais";

export function UsersManager({ initial, currentId }: { initial: User[]; currentId: number }) {
  const router = useRouter();
  const [users, setUsers] = useState(initial);
  const [form, setForm] = useState({ name: "", email: "", role: "editor", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ kind: "error" | "success"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setMessage(null);
    try {
      await api("/api/admin/users", { method: "POST", body: form });
      setForm({ name: "", email: "", role: "editor", password: "" });
      setMessage({ kind: "success", text: "Compte créé. Communiquez le mot de passe à la personne par un canal sûr." });
      const { items } = await api<{ items: User[] }>("/api/admin/users");
      setUsers(items);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setErrors(err.fields);
        setMessage({ kind: "error", text: err.message });
      }
    } finally {
      setBusy(false);
    }
  }

  async function patch(user: User, body: Record<string, unknown>) {
    setMessage(null);
    try {
      const { item } = await api<{ item: User }>(`/api/admin/users/${user.id}`, { method: "PATCH", body });
      setUsers((list) => list.map((u) => (u.id === user.id ? { ...u, ...item } : u)));
      if (body.password) setMessage({ kind: "success", text: `Mot de passe de ${user.email} modifié.` });
    } catch (err) {
      setMessage({ kind: "error", text: err instanceof ApiClientError ? Object.values(err.fields)[0] ?? err.message : "Action impossible." });
    }
  }

  async function resetPassword(user: User) {
    const password = window.prompt(`Nouveau mot de passe pour ${user.email} (12 caractères minimum, lettres et chiffres) :`);
    if (password) await patch(user, { password });
  }

  async function remove(user: User) {
    if (!window.confirm(`Supprimer le compte ${user.email} ?`)) return;
    try {
      await api(`/api/admin/users/${user.id}`, { method: "DELETE" });
      setUsers((list) => list.filter((u) => u.id !== user.id));
    } catch (err) {
      setMessage({ kind: "error", text: err instanceof ApiClientError ? err.message : "Suppression impossible." });
    }
  }

  return (
    <div className="grid gap-6">
      {message && <p className={`adm-alert ${message.kind === "error" ? "adm-alert-error" : "adm-alert-success"}`}>{message.text}</p>}
      <div className="adm-card overflow-x-auto">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Rôle</th>
              <th>Dernière connexion</th>
              <th>État</th>
              <th>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <span className="font-semibold">{u.name}</span>
                  {u.id === currentId && <span className="adm-badge adm-badge-blue ml-2">Vous</span>}
                  <span className="block text-[13px] text-[#6b746f]">{u.email}</span>
                </td>
                <td>
                  <select
                    className="adm-input mt-0 w-auto"
                    value={u.role}
                    aria-label={`Rôle de ${u.email}`}
                    onChange={(e) => patch(u, { role: e.target.value })}
                  >
                    <option value="admin">Administrateur</option>
                    <option value="editor">Éditeur</option>
                  </select>
                </td>
                <td className="whitespace-nowrap text-[#5b6560]">{fmt(u.lastLoginAt)}</td>
                <td>{u.disabled ? <span className="adm-badge adm-badge-red">Désactivé</span> : <span className="adm-badge adm-badge-green">Actif</span>}</td>
                <td>
                  <div className="flex flex-wrap justify-end gap-2">
                    <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => resetPassword(u)}>
                      Mot de passe
                    </button>
                    {u.id !== currentId && (
                      <>
                        <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => patch(u, { disabled: !u.disabled })}>
                          {u.disabled ? "Réactiver" : "Désactiver"}
                        </button>
                        <button type="button" className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => remove(u)}>
                          Supprimer
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={create} className="adm-card adm-card-pad grid gap-4 sm:grid-cols-2">
        <h2 className="text-lg font-semibold sm:col-span-2">Créer un compte</h2>
        <label>
          <span className="adm-label">Nom</span>
          <input className="adm-input" required maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={!!errors.name} />
          {errors.name && <span className="adm-error">{errors.name}</span>}
        </label>
        <label>
          <span className="adm-label">E-mail</span>
          <input className="adm-input" type="email" required maxLength={200} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={!!errors.email} />
          {errors.email && <span className="adm-error">{errors.email}</span>}
        </label>
        <label>
          <span className="adm-label">Rôle</span>
          <select className="adm-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="editor">Éditeur (contenus et formulaires)</option>
            <option value="admin">Administrateur (tout, y compris les comptes)</option>
          </select>
        </label>
        <label>
          <span className="adm-label">Mot de passe initial</span>
          <input
            className="adm-input"
            type="password"
            required
            minLength={12}
            maxLength={200}
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            aria-invalid={!!errors.password}
          />
          <span className="adm-help">12 caractères minimum, avec au moins une lettre et un chiffre.</span>
          {errors.password && <span className="adm-error">{errors.password}</span>}
        </label>
        <div className="sm:col-span-2">
          <button type="submit" className="adm-btn adm-btn-primary" disabled={busy}>
            {busy ? "Création…" : "Créer le compte"}
          </button>
        </div>
      </form>
    </div>
  );
}
