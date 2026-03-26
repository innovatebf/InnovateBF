import { setRequestLocale } from "next-intl/server";
import { requireRole } from "@/lib/auth/guards";
import sql from "@/lib/db/neon";
import { UserRoleManager } from "@/components/innovons/UserRoleManager";

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireRole("admin", locale);

  let users: Array<{
    id: string;
    name: string | null;
    email: string;
    role: string;
    created_at: string | null;
  }> = [];

  try {
    const rows = await sql`
      SELECT id, name, email, role, "createdAt" as created_at
      FROM "user"
      ORDER BY "createdAt" DESC
    `;
    users = rows as typeof users;
  } catch {
    // DB not configured — empty list
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Gestion des utilisateurs
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Attribuez les rôles <strong className="text-gray-200">éditeur</strong> aux membres qui peuvent soumettre des besoins.
        </p>
      </div>
      <UserRoleManager users={users} />
    </div>
  );
}
