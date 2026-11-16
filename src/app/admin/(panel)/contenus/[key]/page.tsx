import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SettingsEditor } from "@/components/admin/SettingsEditor";
import { PageHeader } from "@/components/admin/ui";
import { Icon } from "@/components/Icon";
import { isSettingsKey, settingsDefs, type SettingsKey } from "@/lib/content/definitions";
import { readAllSettings } from "@/server/content/repository";
import { requirePageUser } from "@/server/auth/guard";

type Props = { params: Promise<{ key: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { key } = await params;
  return { title: isSettingsKey(key) ? settingsDefs[key].label : "Contenu" };
}

export default async function SettingsPage({ params }: Props) {
  // Chaque page vérifie la session elle-même : le layout et la page sont rendus en parallèle
  await requirePageUser();
  const { key } = await params;
  if (!isSettingsKey(key)) notFound();
  const def = settingsDefs[key];
  const previewPath: Record<SettingsKey, string> = {
    site: "/contact",
    conference: "/innovons/conference",
    conferenceSocial: "/innovons/conference",
    calendar: "/innovons/conference/appel-a-contributions",
  };
  const value = (await readAllSettings())[key];
  return (
    <>
      <PageHeader
        title={def.label}
        subtitle={`${def.group} · ${def.description}`}
        actions={
          <Link href={previewPath[key]} target="_blank" className="adm-btn adm-btn-ghost">
            <Icon name="external" className="size-4" /> Voir sur le site
          </Link>
        }
      />
      <SettingsEditor key={key} settingsKey={key} initial={value as Record<string, unknown>} />
    </>
  );
}
