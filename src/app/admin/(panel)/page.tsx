import type { Metadata } from "next";
import Link from "next/link";
import { AudiencePanel, VisitorCounter } from "@/components/admin/Audience";
import { formatDateTime, PageHeader } from "@/components/admin/ui";
import { Icon } from "@/components/Icon";
import { STATUS_LABELS, STATUS_TONE } from "@/lib/admin/labels";
import { collectionDefs, type CollectionName } from "@/lib/content/definitions";
import { formatDate, isCallOpen, LONG_DATE } from "@/lib/site";
import { getStats, listCandidatures, listMessages } from "@/server/admin-data";
import { AUDIENCE_PERIODS, getAudience, type AudiencePeriod } from "@/server/analytics";
import { requirePageUser } from "@/server/auth/guard";
import { countItems, readAllSettings } from "@/server/content/repository";

export const metadata: Metadata = { title: "Tableau de bord" };

function Stat({ label, value, href, hint }: { label: string; value: number; href: string; hint?: string }) {
  return (
    <Link href={href} className="adm-card adm-card-pad block transition hover:border-[#c5d2e3]">
      <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6b746f]">{label}</p>
      <p className="mt-1 font-[family-name:var(--font-antonio)] text-4xl font-semibold text-[#0a3a8f]">{value}</p>
      {hint && <p className="mt-1 text-[13px] text-[#6b746f]">{hint}</p>}
    </Link>
  );
}

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ periode?: string }> }) {
  const user = await requirePageUser();
  const { periode } = await searchParams;
  const days = (AUDIENCE_PERIODS.find((p) => String(p) === periode) ?? 30) as AudiencePeriod;
  const [stats, settings, recent, messages, audience] = await Promise.all([
    getStats(),
    readAllSettings(),
    listCandidatures({ page: 1, pageSize: 5 }),
    listMessages({ page: 1, pageSize: 5 }),
    getAudience(days),
  ]);
  const collections = await Promise.all(
    (Object.keys(collectionDefs) as CollectionName[]).map(async (c) => ({ c, n: await countItems(c) })),
  );
  const { calendar } = settings;
  const callOpen = isCallOpen(calendar);

  return (
    <>
      <PageHeader
        title={`Bonjour ${user.name.split(" ")[0]}`}
        subtitle="Vue d'ensemble du site InnovateBF et de la conférence EBC2026."
        actions={
          <Link href="/" target="_blank" className="adm-btn adm-btn-ghost">
            <Icon name="external" className="size-4" /> Voir le site
          </Link>
        }
      />

      <VisitorCounter {...audience.allTime} />

      <AudiencePanel data={audience} />

      <h2 className="mb-4 text-lg font-semibold">Formulaires et contenus</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Candidatures" value={stats.candidatures} href="/admin/candidatures" hint={`${stats.candidaturesByStatus.recu ?? 0} à traiter`} />
        {stats.registrations > 0 && <Stat label="Inscriptions" value={stats.registrations} href="/admin/inscriptions" />}
        <Stat label="Messages" value={stats.messages} href="/admin/messages" hint={`${stats.unreadMessages} non lu(s)`} />
        <Stat label="Images" value={stats.media} href="/admin/medias" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="adm-card adm-card-pad">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Ouverture des formulaires</h2>
            <Link href="/admin/contenus/calendar" className="text-sm text-faso hover:underline">
              Modifier les dates
            </Link>
          </div>
          <ul className="mt-3 grid gap-2 text-[14.5px]">
            <li className="flex items-center justify-between gap-3">
              <span>Appel à projets</span>
              <span className={`adm-badge ${callOpen ? "adm-badge-green" : "adm-badge-red"}`}>
                {callOpen ? `Ouvert jusqu'au ${formatDate(calendar.callCloses, LONG_DATE)}` : "Fermé"}
              </span>
            </li>
          </ul>
        </section>

        <section className="adm-card adm-card-pad">
          <h2 className="text-lg font-semibold">Contenus publiés</h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-[14.5px]">
            {collections.map(({ c, n }) => (
              <li key={c} className="flex justify-between gap-3">
                <Link href={`/admin/collections/${c}`} className="hover:underline">
                  {collectionDefs[c].label}
                </Link>
                <span className="tabular-nums text-[#6b746f]">{n}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="adm-card overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-4">
            <h2 className="text-lg font-semibold">Dernières candidatures</h2>
            <Link href="/admin/candidatures" className="text-sm text-faso hover:underline">
              Tout voir
            </Link>
          </div>
          {recent.items.length === 0 ? (
            <p className="px-5 py-6 text-[#6b746f]">Aucune candidature.</p>
          ) : (
            <ul className="mt-2">
              {recent.items.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 border-t border-[#eef0ee] px-5 py-3">
                  <Link href={`/admin/candidatures/${c.id}`} className="min-w-0 hover:underline">
                    <span className="block truncate font-semibold">{c.title}</span>
                    <span className="block text-[13px] text-[#6b746f]">
                      {c.applicantName} · {formatDateTime(c.createdAt)}
                    </span>
                  </Link>
                  <span className={`adm-badge ${STATUS_TONE[c.status] ?? ""}`}>{STATUS_LABELS[c.status]}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="adm-card overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-4">
            <h2 className="text-lg font-semibold">Derniers messages</h2>
            <Link href="/admin/messages" className="text-sm text-faso hover:underline">
              Tout voir
            </Link>
          </div>
          {messages.items.length === 0 ? (
            <p className="px-5 py-6 text-[#6b746f]">Aucun message.</p>
          ) : (
            <ul className="mt-2">
              {messages.items.map((m) => (
                <li key={m.id} className="border-t border-[#eef0ee] px-5 py-3">
                  <span className="block truncate font-semibold">
                    {!m.read && <span className="mr-2 inline-block size-2 rounded-full bg-[#0a3a8f] align-middle" aria-label="Non lu" />}
                    {m.subject}
                  </span>
                  <span className="block text-[13px] text-[#6b746f]">
                    {m.name} · {formatDateTime(m.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
