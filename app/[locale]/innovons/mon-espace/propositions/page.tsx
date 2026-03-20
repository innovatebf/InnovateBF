import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Lightbulb } from "lucide-react";
import { getCurrentUser, getUserProposals } from "@/lib/innovons/user-queries";
import type { Proposal } from "@/lib/innovons/types";

const PROPOSAL_STATUS_BADGE: Record<Proposal["statut"], string> = {
  EN_ATTENTE: "bg-amber-100 text-amber-700",
  RETENU: "bg-green-100 text-green-700",
  REJETE: "bg-red-100 text-red-700",
};

const PROPOSAL_STATUS_LABEL: Record<Proposal["statut"], string> = {
  EN_ATTENTE: "En attente",
  RETENU: "Retenu",
  REJETE: "Rejete",
};

export default async function MesPropositionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "innovons.mon_espace" });

  const user = await getCurrentUser();
  const proposals = user ? await getUserProposals(user.id) : [];

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
          <li className="font-medium text-gray-900">
            {t("propositions_title")}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900">
        {t("propositions_title")}
      </h1>

      {proposals.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center rounded-xl bg-white py-16 shadow-sm">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100">
            <Lightbulb
              className="size-8 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <p className="mb-1 text-lg font-medium text-gray-900">
            {t("propositions_empty")}
          </p>
          <p className="mb-6 text-sm text-gray-500">
            Parcourez les appels pour soumettre une proposition.
          </p>
          <Link
            href="/innovons/appels"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
          >
            {t("cta_browse")}
          </Link>
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
                    Besoin associe
                  </th>
                  <th className="px-5 py-3 font-medium text-gray-500">
                    Statut
                  </th>
                  <th className="px-5 py-3 font-medium text-gray-500">
                    Date de soumission
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {proposals.map((proposal) => (
                  <tr key={proposal.id} className="hover:bg-gray-50/50">
                    <td className="max-w-xs truncate px-5 py-4 font-medium text-gray-900">
                      {proposal.titre}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {proposal.need_id}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${PROPOSAL_STATUS_BADGE[proposal.statut]}`}
                      >
                        {PROPOSAL_STATUS_LABEL[proposal.statut]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {new Date(proposal.created_at).toLocaleDateString(
                        locale,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {proposals.map((proposal) => (
              <div
                key={proposal.id}
                className="rounded-xl bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {proposal.titre}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${PROPOSAL_STATUS_BADGE[proposal.statut]}`}
                  >
                    {PROPOSAL_STATUS_LABEL[proposal.statut]}
                  </span>
                </div>
                <p className="mb-1 text-xs text-gray-500">
                  Besoin : {proposal.need_id}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(proposal.created_at).toLocaleDateString(locale)}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
