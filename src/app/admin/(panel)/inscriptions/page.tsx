import type { Metadata } from "next";
import { DeleteButton } from "@/components/admin/RowActions";
import { Empty, formatDateTime, ListToolbar, PageHeader, Pager, pageParam, textParam } from "@/components/admin/ui";
import { Icon } from "@/components/Icon";
import { listRegistrations } from "@/server/admin-data";
import { requirePageUser } from "@/server/auth/guard";

export const metadata: Metadata = { title: "Inscriptions" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function RegistrationsPage({ searchParams }: Props) {
  const user = await requirePageUser();
  const sp = await searchParams;
  const q = textParam(sp.q);
  const data = await listRegistrations({ page: pageParam(sp.page), pageSize: 25, q });
  return (
    <>
      <PageHeader
        title="Inscriptions à la conférence"
        subtitle="Personnes inscrites via le formulaire « S'inscrire à EBC2026 »."
        actions={
          <a href="/api/admin/registrations?format=csv" download className="adm-btn adm-btn-ghost">
            <Icon name="download" className="size-4" /> Exporter (CSV)
          </a>
        }
      />
      <ListToolbar q={q} placeholder="Nom, e-mail ou organisation" />
      <div className="adm-card overflow-x-auto">
        {data.items.length === 0 ? (
          <Empty text={q ? "Aucun résultat." : "Aucune inscription pour le moment."} />
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Nom</th>
                <th>E-mail</th>
                <th>Organisation</th>
                <th>Type</th>
                {user.role === "admin" && <th className="w-10"><span className="sr-only">Actions</span></th>}
              </tr>
            </thead>
            <tbody>
              {data.items.map((r) => (
                <tr key={r.id}>
                  <td className="whitespace-nowrap text-[#5b6560]">{formatDateTime(r.createdAt)}</td>
                  <td className="font-semibold">{r.name}</td>
                  <td>
                    <a href={`mailto:${r.email}`} className="text-faso hover:underline">
                      {r.email}
                    </a>
                  </td>
                  <td>{r.organization || "—"}</td>
                  <td>
                    <span className="adm-badge">{r.type}</span>
                  </td>
                  {user.role === "admin" && (
                    <td>
                      <DeleteButton url={`/api/admin/registrations/${r.id}`} label={`l'inscription de ${r.name}`} />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Pager page={data.page} pageSize={data.pageSize} total={data.total} base="/admin/inscriptions" query={{ q }} />
    </>
  );
}
