import { Link } from "@/i18n/routing";
import { CheckCircle2, Clock, Eye, FileWarning, Filter } from "lucide-react";
import { getModerationQueue } from "@/lib/innovons/admin-queries";
import type { ModerationItem } from "@/lib/innovons/admin-queries";
import { IENavbar } from "@/components/innovons/IENavbar";

// ── Status helpers ──────────────────────────────────────────────────────────

const MODERATION_STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  VALIDATION: {
    bg: "bg-amber-900/30",
    text: "text-amber-400",
    label: "En attente",
  },
  REVISION_REQUESTED: {
    bg: "bg-orange-900/30",
    text: "text-orange-400",
    label: "Revision demandee",
  },
  REVISION_DEMANDEE: {
    bg: "bg-orange-900/30",
    text: "text-orange-400",
    label: "Revision demandee",
  },
};

function StatusBadge({ status }: { status: string }) {
  const config = MODERATION_STATUS_BADGE[status] ?? {
    bg: "bg-gray-800",
    text: "text-gray-400",
    label: status,
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Table component ─────────────────────────────────────────────────────────

function ModerationTable({
  needs,
  filter,
}: {
  needs: ModerationItem[];
  filter: string;
}) {
  const filtered =
    filter === "all"
      ? needs
      : filter === "REVISION_DEMANDEE"
        ? needs.filter((n) => n.statut === "REVISION_DEMANDEE")
        : needs.filter((n) => n.statut === filter);

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl bg-white/5 py-16 shadow-[0_20px_40px_rgba(25,28,29,0.2)]">
        <CheckCircle2
          className="size-12 text-secondary-600"
          aria-hidden="true"
        />
        <p className="mt-4 text-lg font-semibold text-gray-200">
          File de moderation vide
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Aucun besoin ne necessite de moderation pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-white/5 shadow-[0_20px_40px_rgba(25,28,29,0.2)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
            <th className="px-5 py-3">Titre</th>
            <th className="px-5 py-3">Domaine</th>
            <th className="px-5 py-3">Niveau</th>
            <th className="px-5 py-3">Auteur</th>
            <th className="px-5 py-3">Soumis le</th>
            <th className="px-5 py-3">Statut</th>
            <th className="px-5 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/50">
          {filtered.map((need) => (
            <tr
              key={need.id}
              className="transition-colors hover:bg-gray-800/30"
            >
              <td className="max-w-xs truncate px-5 py-4 font-medium text-gray-200">
                {need.titre}
              </td>
              <td className="px-5 py-4 text-gray-400">{need.domaine}</td>
              <td className="px-5 py-4">
                <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-300">
                  {need.niveau}
                </span>
              </td>
              <td className="px-5 py-4 text-gray-400">{need.author_name}</td>
              <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                {formatDate(need.created_at)}
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={need.statut} />
              </td>
              <td className="px-5 py-4">
                <Link
                  href={`/innovons/admin/moderation/${need.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-secondary-600/20 px-3 py-1.5 text-xs font-medium text-secondary-400 transition-colors hover:bg-secondary-600/30"
                >
                  <Eye className="size-3.5" aria-hidden="true" />
                  Examiner
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function ModerationQueuePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ filtre?: string }>;
}) {
  const { locale: _locale } = await params;
  const { filtre } = await searchParams;

  const queue = await getModerationQueue();

  const pendingCount = queue.filter(
    (n) => n.statut === "VALIDATION",
  ).length;
  const revisionCount = queue.filter(
    (n) => n.statut === "REVISION_DEMANDEE",
  ).length;

  const activeFilter = filtre ?? "all";

  const tabs = [
    { key: "all", label: "Tous", count: queue.length },
    { key: "VALIDATION", label: "En attente", count: pendingCount },
    {
      key: "REVISION_REQUESTED",
      label: "Revision demandee",
      count: revisionCount,
    },
  ] as const;

  return (
    <div className="flex min-h-screen flex-col">
      <IENavbar />
      <div className="flex-1 bg-[#0D0D0D] px-4 py-10 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-secondary-600">
                <FileWarning className="size-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  File de moderation
                </h1>
                <p className="text-sm text-gray-500">
                  Examinez et validez les besoins soumis par la communaute
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-900/30 px-3 py-1 text-sm font-medium text-amber-400">
              <Clock className="size-3.5" aria-hidden="true" />
              {pendingCount} en attente
            </span>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-800 bg-gray-900/50 p-1">
            <Filter
              className="ml-2 size-4 text-gray-500"
              aria-hidden="true"
            />
            {tabs.map((tab) => (
              <Link
                key={tab.key}
                href={
                  tab.key === "all"
                    ? "/innovons/admin/moderation"
                    : `/innovons/admin/moderation?filtre=${tab.key}`
                }
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  activeFilter === tab.key
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-1.5 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-xs ${
                    activeFilter === tab.key
                      ? "bg-secondary-600/30 text-secondary-400"
                      : "bg-gray-800 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              </Link>
            ))}
          </div>

          {/* Table */}
          <ModerationTable needs={queue} filter={activeFilter} />
        </div>
      </div>
    </div>
  );
}
