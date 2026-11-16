import type { Metadata } from "next";
import { DeleteButton, ReadToggle } from "@/components/admin/RowActions";
import { Empty, formatDateTime, ListToolbar, PageHeader, Pager, pageParam, textParam } from "@/components/admin/ui";
import { listMessages } from "@/server/admin-data";
import { requirePageUser } from "@/server/auth/guard";

export const metadata: Metadata = { title: "Messages" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function MessagesPage({ searchParams }: Props) {
  const user = await requirePageUser();
  const sp = await searchParams;
  const q = textParam(sp.q);
  const data = await listMessages({ page: pageParam(sp.page), pageSize: 20, q });
  return (
    <>
      <PageHeader title="Messages" subtitle="Messages reçus via le formulaire de contact." />
      <ListToolbar q={q} placeholder="Nom, e-mail ou objet" />
      {data.items.length === 0 ? (
        <div className="adm-card">
          <Empty text={q ? "Aucun résultat." : "Aucun message pour le moment."} />
        </div>
      ) : (
        <ul className="grid gap-3">
          {data.items.map((m) => (
            <li key={m.id} className={`adm-card adm-card-pad ${m.read ? "" : "border-l-4 border-l-[#0a3a8f]"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold">
                    {m.subject} {!m.read && <span className="adm-badge adm-badge-green ml-1">Nouveau</span>}
                  </p>
                  <p className="text-sm text-[#5b6560]">
                    {m.name} ·{" "}
                    <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`} className="text-faso hover:underline">
                      {m.email}
                    </a>{" "}
                    · {formatDateTime(m.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <ReadToggle id={m.id} read={m.read} />
                  {user.role === "admin" && <DeleteButton url={`/api/admin/messages/${m.id}`} label={`le message de ${m.name}`} />}
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap break-words text-[14.5px] leading-relaxed text-[#2a332e]">{m.body}</p>
            </li>
          ))}
        </ul>
      )}
      <Pager page={data.page} pageSize={data.pageSize} total={data.total} base="/admin/messages" query={{ q }} />
    </>
  );
}
