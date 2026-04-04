"use client";

import { useState } from "react";
import { Shield } from "lucide-react";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  created_at: string | null;
};

const ROLE_CONFIG: Record<string, { label: string; className: string }> = {
  admin: { label: "Admin", className: "bg-primary-500/20 text-primary-400 border-primary-500/30" },
  editor: { label: "Éditeur", className: "bg-secondary-500/20 text-secondary-400 border-secondary-500/30" },
  guest: { label: "Invité", className: "bg-white/10 text-gray-400 border-white/10" },
};

export function UserRoleManager({ users: initialUsers }: { users: UserRow[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateRole(userId: string, newRole: string) {
    setLoading(userId);
    setError(null);
    try {
      const res = await fetch(`/api/innovons/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur");
        return;
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl bg-primary-50 px-4 py-3 text-sm text-primary-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl bg-[#191c1d] shadow-[0_20px_40px_rgba(25,28,29,0.05)]">
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-white/5">
            <tr>
              {["Utilisateur", "Email", "Rôle", "Membre depuis", "Action"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => {
              const roleConf = ROLE_CONFIG[user.role] ?? ROLE_CONFIG["guest"]!;
              const isLoading = loading === user.id;
              const initials = (user.name ?? user.email).charAt(0).toUpperCase();
              return (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-500/20 text-primary-400 text-sm font-bold">
                        {initials}
                      </div>
                      <span className="text-sm font-medium text-white">
                        {user.name ?? "—"}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-400">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${roleConf.className}`}
                    >
                      <Shield className="size-3" aria-hidden="true" />
                      {roleConf.label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString("fr-FR")
                      : "—"}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={user.role}
                        disabled={isLoading}
                        onChange={(e) => updateRole(user.id, e.target.value)}
                        className="rounded-lg bg-white/10 px-2 py-1 text-sm text-gray-200 outline-none focus:bg-white/15 focus:ring-2 focus:ring-primary-500/30 disabled:opacity-50"
                        aria-label={`Rôle de ${user.name ?? user.email}`}
                      >
                        <option value="guest">Invité</option>
                        <option value="editor">Éditeur</option>
                        <option value="admin">Admin</option>
                      </select>
                      {isLoading && (
                        <span className="text-xs text-gray-500">
                          Sauvegarde...
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="px-6 py-12 text-center text-sm text-gray-500">
            Aucun utilisateur trouvé.
          </div>
        )}
      </div>

      <p className="text-xs text-gray-600">
        {users.length} utilisateur{users.length !== 1 ? "s" : ""} — Les
        changements de rôle prennent effet immédiatement.
      </p>
    </div>
  );
}
