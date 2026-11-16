import Link from "next/link";
import { PageHeader } from "@/components/admin/ui";

/** Élément ou page introuvable dans le back-office : on reste dans le panneau. */
export default function AdminNotFound() {
  return (
    <>
      <PageHeader title="Introuvable" subtitle="Cet élément a peut-être été supprimé, ou l'adresse est incorrecte." />
      <Link href="/admin" className="adm-btn adm-btn-primary">
        Retour au tableau de bord
      </Link>
    </>
  );
}
