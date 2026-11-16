import type { Metadata } from "next";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { PageHeader } from "@/components/admin/ui";
import { listMedia } from "@/server/media";
import { requirePageUser } from "@/server/auth/guard";

export const metadata: Metadata = { title: "Médiathèque" };

export default async function MediaPage() {
  // Chaque page vérifie la session elle-même : le layout et la page sont rendus en parallèle
  await requirePageUser();
  const items = await listMedia();
  return (
    <>
      <PageHeader title="Médiathèque" subtitle="Images utilisables dans tous les contenus. Une image encore utilisée ne peut pas être supprimée." />
      <MediaLibrary initial={items} />
    </>
  );
}
