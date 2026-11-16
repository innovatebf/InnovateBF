import type { Metadata } from "next";
import Link from "next/link";
import { Empty, formatDateTime, ListToolbar, PageHeader, Pager, pageParam, textParam } from "@/components/admin/ui";
import { Icon } from "@/components/Icon";
import { categories, labelOf } from "@/content/candidature";
import { STATUS_LABELS, STATUS_TONE } from "@/lib/admin/labels";
import { CANDIDATURE_STATUSES, listCandidatures, type CandidatureStatus } from "@/server/admin-data";
import { requirePageUser } from "@/server/auth/guard";

export const metadata: Metadata = { title: "Candidatures" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function CandidaturesPage({ searchParams }: Props) {
  // Chaque page vérifie la session elle-même : le layout et la page sont rendus en parallèle
  await requirePageUser();
  const sp = await searchParams;
  const q = textParam(sp.q);
  const status = CANDIDATURE_STATUSES.includes(sp.status as CandidatureStatus) ? (sp.status as CandidatureStatus) : undefined;
  const data = await listCandidatures({ page: pageParam(sp.page), pageSize: 25, q, status });
  return (
    <>
      <PageHeader
        title="Candidatures EBC'26"
        subtitle="Dossiers déposés via le formulaire « Déposer ma candidature »."
        actions={
          <a href="/api/admin/candidatures?format=csv" download className="adm-btn adm-btn-ghost">
            <Icon name="download" className="size-4" /> Exporter (CSV)
          </a>
        }
      />
      <ListToolbar
        q={q}
        placeholder="Numéro, titre, porteur ou e-mail"
        extra={
          <select name="status" defaultValue={status ?? ""} className="adm-input mt-0 w-auto" aria-label="Statut">
            <option value="">Tous les statuts</option>
            {CANDIDATURE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        }
      />
      <div className="adm-card overflow-x-auto">
        {data.items.length === 0 ? (
          <Empty text={q || status ? "Aucun résultat." : "Aucune candidature pour le moment."} />
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Projet</th>
                <th>Porteur</th>
                <th>Catégorie</th>
                <th>Statut</th>
                <th>Reçu le</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((c) => (
                <tr key={c.id}>
                  <td className="whitespace-nowrap font-mono text-[13px]">
                    <Link href={`/admin/candidatures/${c.id}`} className="text-faso hover:underline">
                      {c.numero}
                    </Link>
                  </td>
                  <td className="font-semibold">
                    <Link href={`/admin/candidatures/${c.id}`} className="hover:underline">
                      {c.title}
                    </Link>
                  </td>
                  <td>
                    {c.applicantName}
                    <span className="block text-[13px] text-[#6b746f]">{c.email}</span>
                  </td>
                  <td>{labelOf(categories, c.category)}</td>
                  <td>
                    <span className={`adm-badge ${STATUS_TONE[c.status] ?? ""}`}>{STATUS_LABELS[c.status]}</span>
                  </td>
                  <td className="whitespace-nowrap text-[#5b6560]">{formatDateTime(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Pager page={data.page} pageSize={data.pageSize} total={data.total} base="/admin/candidatures" query={{ q, status }} />
    </>
  );
}
