import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ItemEditor } from "@/components/admin/ItemEditor";
import { PageHeader } from "@/components/admin/ui";
import { collectionDefs, isCollectionName } from "@/lib/content/definitions";
import { emptyValues } from "@/lib/content/fields";
import { getItem } from "@/server/content/repository";
import { ApiError } from "@/server/http";
import { requirePageUser } from "@/server/auth/guard";

type Props = { params: Promise<{ name: string; id: string }> };

export const metadata: Metadata = { title: "Modifier un élément" };

export default async function ItemPage({ params }: Props) {
  // Chaque page vérifie la session elle-même : le layout et la page sont rendus en parallèle
  await requirePageUser();
  const { name, id } = await params;
  if (!isCollectionName(name)) notFound();
  const def = collectionDefs[name];

  if (id === "nouveau") {
    return (
      <>
        <PageHeader title={`Nouveau ${def.singular}`} subtitle={def.label} />
        <ItemEditor name={name} id={null} initial={emptyValues(def.fields)} initialVisible />
      </>
    );
  }
  if (!/^[1-9]\d{0,9}$/.test(id)) notFound();
  const item = await getItem(name, Number(id)).catch((e) => {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  });
  if (!item) notFound();
  return (
    <>
      <PageHeader title={`Modifier le ${def.singular}`} subtitle={def.label} />
      <ItemEditor name={name} id={item.id} initial={item.data as Record<string, unknown>} initialVisible={item.visible} />
    </>
  );
}
