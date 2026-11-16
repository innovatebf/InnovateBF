import { cookies } from "next/headers";
import { Sidebar, type NavGroup } from "@/components/admin/Sidebar";
import { SIDEBAR_COOKIE } from "@/lib/admin/labels";
import { collectionDefs, settingsDefs, type CollectionName, type SettingsKey } from "@/lib/content/definitions";
import { getStats } from "@/server/admin-data";
import { requirePageUser } from "@/server/auth/guard";

export const dynamic = "force-dynamic";

// Pictogrammes distincts : la barre réduite n'affiche que ceux-ci
const collectionIcons: Record<CollectionName, string> = {
  highlights: "star",
  resources: "file",
  speakers: "mic",
  inventors: "medal",
  programme: "calendar",
  partners: "building",
  stands: "booth",
};
const settingsIcons: Record<SettingsKey, string> = { site: "mail", conference: "pin", conferenceSocial: "users", calendar: "clock" };

const settingsOf = (group: string) =>
  (Object.keys(settingsDefs) as SettingsKey[])
    .filter((k) => settingsDefs[k].group === group)
    .map((k) => ({ href: `/admin/contenus/${k}`, label: settingsDefs[k].label, icon: settingsIcons[k] }));

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requirePageUser();
  const stats = await getStats();
  const groups: NavGroup[] = [
    { items: [{ href: "/admin", label: "Tableau de bord", icon: "home" }] },
    {
      title: "Contenus",
      items: (Object.keys(collectionDefs) as CollectionName[]).map((c) => ({
        href: `/admin/collections/${c}`,
        label: collectionDefs[c].label,
        icon: collectionIcons[c],
      })),
    },
    { title: "Médias", items: [{ href: "/admin/medias", label: "Médiathèque", icon: "image" }] },
    {
      title: "Formulaires",
      items: [
        { href: "/admin/candidatures", label: "Candidatures", icon: "trophy" },
        // Pas d'inscription formelle : la rubrique ne sert qu'aux inscriptions déjà reçues
        ...(stats.registrations > 0 ? [{ href: "/admin/inscriptions", label: "Inscriptions", icon: "users" }] : []),
        { href: "/admin/messages", label: "Messages", icon: "inbox", badge: stats.unreadMessages },
      ],
    },
    { title: "Paramètres", items: settingsOf("Paramètres") },
    {
      title: "Compte",
      items: [
        ...(user.role === "admin"
          ? [
              { href: "/admin/utilisateurs", label: "Utilisateurs", icon: "users" },
              { href: "/admin/journal", label: "Journal d'activité", icon: "list" },
            ]
          : []),
        { href: "/admin/compte", label: "Mon compte", icon: "lock" },
      ],
    },
  ];

  return (
    <div className="adm-shell">
      <Sidebar groups={groups} user={user} initialCollapsed={(await cookies()).get(SIDEBAR_COOKIE)?.value === "collapsed"} />
      <main className="adm-main">{children}</main>
    </div>
  );
}
