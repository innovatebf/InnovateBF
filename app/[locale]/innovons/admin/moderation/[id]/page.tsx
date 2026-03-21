import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import {
  ArrowLeft,
  ChevronRight,
  Globe,
  Target,
  AlertTriangle,
  Lightbulb,
  MapPin,
  Briefcase,
  Users,
  Banknote,
  CalendarDays,
} from "lucide-react";
import { getNeedForReview, getModerationQueue } from "@/lib/innovons/admin-queries";
import { ModerationActionPanel } from "@/components/innovons/ModerationActionPanel";
import { IENavbar } from "@/components/innovons/IENavbar";
import type { ObstacleCriticite, ResultatHorizon, ResultatNiveau } from "@/lib/innovons/types";

// ── Helpers ─────────────────────────────────────────────────────────────────

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + "...";
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatBudget(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} Mds FCFA`;
  if (n >= 1_000_000) return `${Math.round(n / 1_000_000)} M FCFA`;
  return `${n.toLocaleString("fr-FR")} FCFA`;
}

function formatPopulation(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000).toLocaleString("fr-FR")}K`;
  return n.toLocaleString("fr-FR");
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  BROUILLON: { bg: "bg-gray-800", text: "text-gray-400", label: "Brouillon" },
  VALIDATION: { bg: "bg-amber-900/30", text: "text-amber-400", label: "En attente" },
  PUBLIE: { bg: "bg-green-900/30", text: "text-green-400", label: "Publie" },
  ARCHIVE: { bg: "bg-red-900/30", text: "text-red-400", label: "Archive" },
  REVISION_REQUESTED: { bg: "bg-orange-900/30", text: "text-orange-400", label: "Revision demandee" },
  REVISION_DEMANDEE: { bg: "bg-orange-900/30", text: "text-orange-400", label: "Revision demandee" },
  APPROVED: { bg: "bg-green-900/30", text: "text-green-400", label: "Approuve" },
  REJETE: { bg: "bg-red-900/30", text: "text-red-400", label: "Rejete" },
  REJECTED: { bg: "bg-red-900/30", text: "text-red-400", label: "Rejete" },
};

function criticiteColor(c: ObstacleCriticite) {
  const map: Record<ObstacleCriticite, { bg: string; text: string; border: string }> = {
    1: { bg: "bg-green-900/20", text: "text-green-400", border: "border-green-800" },
    2: { bg: "bg-amber-900/20", text: "text-amber-400", border: "border-amber-800" },
    3: { bg: "bg-red-900/20", text: "text-red-400", border: "border-red-800" },
  };
  return map[c];
}

const CRITICITE_LABEL: Record<ObstacleCriticite, string> = {
  1: "Faible",
  2: "Moyenne",
  3: "Elevee",
};

const HORIZON_LABEL: Record<ResultatHorizon, string> = {
  COURT: "Court terme",
  MOYEN: "Moyen terme",
  LONG: "Long terme",
};

const NIVEAU_LABEL: Record<ResultatNiveau, string> = {
  OUTPUT: "Output",
  OUTCOME: "Outcome",
  IMPACT: "Impact",
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function ModerationReviewPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;

  // Fetch need and moderation queue in parallel
  const [need, queue] = await Promise.all([
    getNeedForReview(id),
    getModerationQueue(),
  ]);

  if (!need) {
    notFound();
  }

  // Find author info from the moderation queue
  const moderationItem = queue.find((item) => item.id === need.id);
  const authorName = moderationItem?.author_name ?? "Auteur inconnu";
  const authorEmail = moderationItem?.author_email ?? "";

  const statusConfig = STATUS_CONFIG[need.statut] ?? STATUS_CONFIG.BROUILLON;

  return (
    <div className="flex min-h-screen flex-col">
      <IENavbar />
      <div className="flex-1 bg-[#0D0D0D] px-4 py-10 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500" aria-label="Fil d'Ariane">
            <Link
              href="/innovons/admin/moderation"
              className="transition-colors hover:text-gray-300"
            >
              Admin
            </Link>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <Link
              href="/innovons/admin/moderation"
              className="transition-colors hover:text-gray-300"
            >
              Moderation
            </Link>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <span className="text-gray-400">{truncate(need.titre, 40)}</span>
          </nav>

          {/* Back link */}
          <Link
            href="/innovons/admin/moderation"
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-green-400"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Retour a la file
          </Link>

          {/* Header */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-white">
                {need.titre}
              </h1>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
              >
                {statusConfig.label}
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-300">
                {need.domaine}
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-300">
                {need.niveau}
              </span>
            </div>
            {need.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {need.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-green-900/20 px-2 py-0.5 text-xs text-green-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Two columns */}
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Left column (2/3) */}
            <div className="flex-1 space-y-6 lg:w-2/3">
              {/* Contexte strategique */}
              <section className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Globe className="size-5 text-green-500" aria-hidden="true" />
                  <h2 className="text-base font-semibold text-white">
                    Contexte strategique
                  </h2>
                </div>
                <p className="whitespace-pre-line text-sm leading-relaxed text-gray-400">
                  {need.contexte_strategique}
                </p>
              </section>

              {/* Question centrale */}
              <section className="rounded-xl border border-green-800/30 bg-green-900/10 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Target className="size-5 text-green-500" aria-hidden="true" />
                  <h2 className="text-base font-semibold text-white">
                    Question centrale
                  </h2>
                </div>
                <p className="text-lg font-medium leading-relaxed text-gray-200">
                  {need.question_centrale}
                </p>
              </section>

              {/* Obstacles */}
              <section className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <AlertTriangle className="size-5 text-amber-500" aria-hidden="true" />
                  <h2 className="text-base font-semibold text-white">
                    Obstacles ({need.obstacles.length})
                  </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {need.obstacles.map((obs) => {
                    const col = criticiteColor(obs.criticite);
                    return (
                      <div
                        key={obs.id}
                        className={`rounded-xl border p-4 ${col.border} ${col.bg}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${col.text}`}>
                            C{obs.criticite} - {CRITICITE_LABEL[obs.criticite]}
                          </span>
                          <span className="rounded-full bg-gray-800/50 px-2 py-0.5 text-[11px] font-medium text-gray-400">
                            {obs.nature}
                          </span>
                        </div>
                        <h4 className="mt-2 text-sm font-semibold text-gray-200">
                          {obs.intitule}
                        </h4>
                        <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                          {obs.description}
                        </p>
                        <p className="mt-2 text-[11px] text-gray-600">
                          Controlabilite: {obs.controlabilite}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Resultats attendus */}
              <section className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Lightbulb className="size-5 text-green-500" aria-hidden="true" />
                  <h2 className="text-base font-semibold text-white">
                    Resultats attendus ({need.resultats.length})
                  </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {need.resultats.map((res) => (
                    <div
                      key={res.id}
                      className="rounded-xl border border-gray-800 bg-gray-800/30 p-4"
                    >
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-400">
                          {NIVEAU_LABEL[res.niveau]}
                        </span>
                        <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-400">
                          {HORIZON_LABEL[res.horizon]}
                        </span>
                      </div>
                      <h4 className="mt-2 text-sm font-semibold text-gray-200">
                        {res.intitule}
                      </h4>
                      <p className="mt-1 text-xs text-gray-500">
                        {res.quantification}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Perimetre */}
              <section className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <MapPin className="size-5 text-green-500" aria-hidden="true" />
                  <h2 className="text-base font-semibold text-white">
                    Perimetre
                  </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-gray-800/50 p-4">
                    <p className="text-xs font-medium uppercase text-gray-500">Region</p>
                    <p className="mt-1 text-sm font-semibold text-gray-200">{need.region}</p>
                  </div>
                  <div className="rounded-lg bg-gray-800/50 p-4">
                    <p className="text-xs font-medium uppercase text-gray-500">Secteur</p>
                    <p className="mt-1 text-sm font-semibold text-gray-200">{need.secteur}</p>
                  </div>
                  <div className="rounded-lg bg-gray-800/50 p-4">
                    <p className="text-xs font-medium uppercase text-gray-500">Pays</p>
                    <p className="mt-1 text-sm font-semibold text-gray-200">{need.pays}</p>
                  </div>
                </div>
              </section>

              {/* Parties prenantes */}
              {need.parties_prenantes.length > 0 && (
                <section className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Users className="size-5 text-green-500" aria-hidden="true" />
                    <h2 className="text-base font-semibold text-white">
                      Parties prenantes
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-800 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          <th className="pb-3 pr-4">Categorie</th>
                          <th className="pb-3 pr-4">Acteur</th>
                          <th className="pb-3 pr-4">Role</th>
                          <th className="pb-3">Position</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/50">
                        {need.parties_prenantes.map((pp) => (
                          <tr key={pp.id}>
                            <td className="py-3 pr-4">
                              <span className="rounded-full bg-green-900/20 px-2 py-0.5 text-xs font-medium text-green-400">
                                {pp.categorie}
                              </span>
                            </td>
                            <td className="py-3 pr-4 font-medium text-gray-200">
                              {pp.acteur}
                            </td>
                            <td className="py-3 pr-4 text-gray-400">
                              {pp.role}
                            </td>
                            <td className="py-3">
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                  pp.position === "Actif"
                                    ? "bg-green-900/20 text-green-400"
                                    : pp.position === "Oppose"
                                      ? "bg-red-900/20 text-red-400"
                                      : "bg-gray-800 text-gray-400"
                                }`}
                              >
                                {pp.position}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Stats sidebar (mobile: inline) */}
              <div className="grid gap-4 sm:grid-cols-3 lg:hidden">
                <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                  <Users className="size-5 text-green-500" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-gray-500">Population impactee</p>
                    <p className="text-lg font-bold text-white">
                      {formatPopulation(need.population_impact)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                  <Banknote className="size-5 text-green-500" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-gray-500">Budget estime</p>
                    <p className="text-lg font-bold text-white">
                      {formatBudget(need.budget)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                  <CalendarDays className="size-5 text-gray-400" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-gray-500">Soumis le</p>
                    <p className="text-sm font-medium text-white">
                      {formatDate(need.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Synthese narrative */}
              {need.synthese_narrative && (
                <section className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Briefcase className="size-5 text-green-500" aria-hidden="true" />
                    <h2 className="text-base font-semibold text-white">
                      Synthese narrative
                    </h2>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-400">
                    {need.synthese_narrative}
                  </p>
                </section>
              )}
            </div>

            {/* Right column (1/3) */}
            <aside className="w-full shrink-0 lg:w-80">
              <div className="sticky top-40 space-y-6">
                {/* Stats card - desktop only */}
                <div className="hidden space-y-4 rounded-xl border border-gray-800 bg-gray-900/50 p-5 lg:block">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-green-900/20">
                      <Users className="size-5 text-green-500" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Population impactee</p>
                      <p className="text-lg font-bold text-white">
                        {formatPopulation(need.population_impact)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-green-900/20">
                      <Banknote className="size-5 text-green-500" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Budget estime</p>
                      <p className="text-lg font-bold text-white">
                        {formatBudget(need.budget)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-gray-800/50">
                      <CalendarDays className="size-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Soumis le</p>
                      <p className="text-sm font-medium text-white">
                        {formatDate(need.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Moderation panel */}
                <ModerationActionPanel
                  needId={need.id}
                  currentStatus={need.statut}
                  needTitle={need.titre}
                  needSlug={need.slug}
                  authorEmail={authorEmail}
                  authorName={authorName}
                />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
