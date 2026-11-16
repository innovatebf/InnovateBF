import type { Metadata } from "next";
import { Empty, formatDateTime, ListToolbar, PageHeader, Pager, pageParam, textParam } from "@/components/admin/ui";
import { ACTION_LABELS } from "@/lib/admin/labels";
import { collectionDefs, isCollectionName, isSettingsKey, settingsDefs } from "@/lib/content/definitions";
import { listAudit } from "@/server/admin-data";
import { requirePageUser } from "@/server/auth/guard";

export const metadata: Metadata = { title: "Journal d'activité" };

function entityLabel(entity: string) {
  if (entity.startsWith("settings:")) {
    const key = entity.slice(9);
    return isSettingsKey(key) ? `Bloc « ${settingsDefs[key].label} »` : entity;
  }
  if (isCollectionName(entity)) return `Collection « ${collectionDefs[entity].label} »`;
  return { media: "Médiathèque", user: "Compte", session: "Session", registration: "Inscription", message: "Message", candidature: "Candidature" }[entity] ?? entity;
}

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AuditPage({ searchParams }: Props) {
  await requirePageUser("admin");
  const sp = await searchParams;
  const q = textParam(sp.q);
  const data = await listAudit({ page: pageParam(sp.page), pageSize: 50, q });
  return (
    <>
      <PageHeader title="Journal d'activité" subtitle="Toutes les actions effectuées dans le back-office." />
      <ListToolbar q={q} placeholder="E-mail ou élément" />
      <div className="adm-card overflow-x-auto">
        {data.items.length === 0 ? (
          <Empty text="Aucune activité." />
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Utilisateur</th>
                <th>Action</th>
                <th>Élément</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((a) => (
                <tr key={a.id}>
                  <td className="whitespace-nowrap text-[#5b6560]">{formatDateTime(a.createdAt)}</td>
                  <td>{a.userEmail ?? "—"}</td>
                  <td>{ACTION_LABELS[a.action] ?? (a.action.startsWith("status:") ? "Changement de statut" : a.action)}</td>
                  <td>
                    {entityLabel(a.entity)}
                    {a.entityId && <span className="text-[#8a928d]"> #{a.entityId}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Pager page={data.page} pageSize={data.pageSize} total={data.total} base="/admin/journal" query={{ q }} />
    </>
  );
}
