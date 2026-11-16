import type { Metadata } from "next";
import { PasswordForm } from "@/components/admin/PasswordForm";
import { PageHeader } from "@/components/admin/ui";
import { requirePageUser } from "@/server/auth/guard";

export const metadata: Metadata = { title: "Mon compte" };

export default async function AccountPage() {
  const user = await requirePageUser();
  return (
    <>
      <PageHeader title="Mon compte" subtitle={`${user.name} · ${user.email} · ${user.role === "admin" ? "Administrateur" : "Éditeur"}`} />
      <PasswordForm />
    </>
  );
}
