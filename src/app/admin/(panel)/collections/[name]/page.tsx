import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionManager } from "@/components/admin/CollectionManager";
import { DemoSpeakers } from "@/components/admin/DemoSpeakers";
import { PageHeader } from "@/components/admin/ui";
import { Icon } from "@/components/Icon";
import { collectionDefs, isCollectionName } from "@/lib/content/definitions";
import { countDemoSpeakers, listItems } from "@/server/content/repository";
import { requirePageUser } from "@/server/auth/guard";

type Props = { params: Promise<{ name: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  return { title: isCollectionName(name) ? collectionDefs[name].label : "Collection" };
}

export default async function CollectionPage({ params }: Props) {
  // Chaque page vérifie la session elle-même : le layout et la page sont rendus en parallèle
  await requirePageUser();
  const { name } = await params;
  if (!isCollectionName(name)) notFound();
  const def = collectionDefs[name];
  const items = await listItems(name, { includeHidden: true });
  return (
    <>
      <PageHeader
        title={def.label}
        subtitle={`${def.description} L'ordre de la liste est celui du site.`}
        actions={
          <Link href={`/admin/collections/${name}/nouveau`} className="adm-btn adm-btn-primary">
            <Icon name="plus" className="size-4" /> Ajouter un {def.singular}
          </Link>
        }
      />
      {name === "speakers" && <DemoSpeakers count={await countDemoSpeakers()} />}
      <CollectionManager key={items.map((i) => `${i.id}:${i.position}:${i.visible}`).join(",")} name={name} initial={items as never} />
    </>
  );
}
