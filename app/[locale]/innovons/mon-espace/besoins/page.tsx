import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { FileText, Plus, Eye, Pencil } from "lucide-react";
import { getCurrentUser, getUserNeeds } from "@/lib/innovons/user-queries";
import { hasMinRole } from "@/lib/auth/roles";
import type { NeedStatus, ObstacleCriticite } from "@/lib/innovons/types";

const STATUS_BADGE: Record<NeedStatus, string> = {
  BROUILLON: "bg-gray-100 text-gray-700",
  VALIDATION: "bg-amber-100 text-amber-700",
  PUBLIE: "bg-green-100 text-green-700",
  ARCHIVE: "bg-red-100 text-red-700",
};

const STATUS_LABEL: Record<NeedStatus, string> = {
  BROUILLON: "Brouillon",
  VALIDATION: "Validation",
  PUBLIE: "Publie",
  ARCHIVE: "Archive",
};

const CRITICITE_LABEL: Record<ObstacleCriticite, string> = {
  1: "C1",
  2: "C2",
  3: "C3",
};

const CRITICITE_BADGE: Record<ObstacleCriticite, string> = {
  1: "bg-gray-100 text-gray-600",
  2: "bg-amber-100 text-amber-600",
  3: "bg-red-100 text-red-600",
};

export default async function MesBesoinsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "innovons.mon_espace" });

  const user = await getCurrentUser();
  const needs = user ? await getUserNeeds(user.id, user.email) : [];
  console.log('[mon-espace/besoins] user.role =', user?.role);
  const canDeposit = hasMinRole(user?.role, 'editor');

  function getMaxCriticite(
    obstacles: { criticite: ObstacleCriticite }[],
  ): ObstacleCriticite {
    if (obstacles.length === 0) return 1;
    return Math.max(...obstacles.map((o) => o.criticite)) as ObstacleCriticite;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <Link
              href="/innovons/mon-espace"
              className="hover:text-green-600"
            >
              {t("nav_dashboard")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-gray-900">{t("besoins_title")}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("besoins_title")}
        </h1>
        {canDeposit && (
          <Link
            href="/innovons/besoins/deposer"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
          >
            <Plus className="size-4" aria-hidden="true" />
            {t("besoins_new")}
          </Link>
        )}
      </div>

      {needs.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center rounded-xl bg-white py-16 shadow-sm">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100">
            <FileText className="size-8 text-gray-400" aria-hidden="true" />
          </div>
          <p className="mb-1 text-lg font-medium text-gray-900">
            {t("besoins_empty")}
          </p>
          <p className="mb-6 text-sm text-gray-500">
            {canDeposit
              ? "Commencez par déposer un besoin sociétal."
              : "Aucun besoin soumis pour le moment."}
          </p>
          {canDeposit && (
            <Link
              href="/innovons/besoins/deposer"
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              <Plus className="size-4" aria-hidden="true" />
              {t("besoins_empty_cta")}
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-5 py-3 font-medium text-gray-500">
                    Titre
                  </th>
                  <th className="px-5 py-3 font-medium text-gray-500">
                    Domaine
                  </th>
                  <th className="px-5 py-3 font-medium text-gray-500">
                    Statut
                  </th>
                  <th className="px-5 py-3 font-medium text-gray-500">
                    Criticite
                  </th>
                  <th className="px-5 py-3 font-medium text-gray-500">Date</th>
                  <th className="px-5 py-3 font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {needs.map((need) => {
                  const maxC = getMaxCriticite(need.obstacles);
                  return (
                    <tr key={need.id} className="hover:bg-gray-50/50">
                      <td className="max-w-xs truncate px-5 py-4 font-medium text-gray-900">
                        {need.titre}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {need.domaine}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[need.statut]}`}
                        >
                          {STATUS_LABEL[need.statut]}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${CRITICITE_BADGE[maxC]}`}
                        >
                          {CRITICITE_LABEL[maxC]}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500">
                        {new Date(need.created_at).toLocaleDateString(locale)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/innovons/besoins/${need.slug}`}
                            className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                          >
                            <Eye className="size-3.5" aria-hidden="true" />
                            Voir
                          </Link>
                          {(need.statut === "BROUILLON" || need.statut === "VALIDATION") && (
                            <Link
                              href={`/innovons/mon-espace/besoins/${need.id}/modifier`}
                              className="inline-flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
                            >
                              <Pencil className="size-3.5" aria-hidden="true" />
                              Modifier
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {needs.map((need) => {
              const maxC = getMaxCriticite(need.obstacles);
              return (
                <div
                  key={need.id}
                  className="rounded-xl bg-white p-4 shadow-sm"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {need.titre}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[need.statut]}`}
                    >
                      {STATUS_LABEL[need.statut]}
                    </span>
                  </div>
                  <div className="mb-3 flex flex-wrap gap-2 text-xs text-gray-500">
                    <span>{need.domaine}</span>
                    <span>
                      {new Date(need.created_at).toLocaleDateString(locale)}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 font-medium ${CRITICITE_BADGE[maxC]}`}
                    >
                      {CRITICITE_LABEL[maxC]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/innovons/besoins/${need.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700"
                    >
                      <Eye className="size-3.5" aria-hidden="true" />
                      Voir
                    </Link>
                    {(need.statut === "BROUILLON" || need.statut === "VALIDATION") && (
                      <Link
                        href={`/innovons/mon-espace/besoins/${need.id}/modifier`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700"
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />
                        Modifier
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
