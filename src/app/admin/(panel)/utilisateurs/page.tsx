import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { UsersManager } from "@/components/admin/UsersManager";
import { listUsers } from "@/server/admin-data";
import { requirePageUser } from "@/server/auth/guard";

export const metadata: Metadata = { title: "Utilisateurs" };

export default async function UsersPage() {
  const user = await requirePageUser("admin");
  const users = await listUsers();
  return (
    <>
      <PageHeader
        title="Utilisateurs"
        subtitle="Les éditeurs gèrent les contenus et consultent les formulaires ; les administrateurs gèrent aussi les comptes et peuvent supprimer des données."
      />
      <UsersManager initial={users} currentId={user.id} />
    </>
  );
}
