import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getDossierByToken } from "@/lib/candidatures/db";
import { notFound } from "next/navigation";
import type { StatutDossier } from "@/lib/candidatures/enums";

export const dynamic = "force-dynamic";

const STATUTS_VISIBLES: Record<string, string> = {};

// Statuses to show as "notifie" until officially revealed
const HIDDEN_FROM_PORTEUR = new Set<StatutDossier>(["retenu", "non_retenu"]);

export default async function SuiviPage({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { locale, token } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "candidatures.suivi" });

  const dossier = await getDossierByToken(token);
  if (!dossier) notFound();

  const statutVisible: StatutDossier = HIDDEN_FROM_PORTEUR.has(dossier.statut)
    ? "notifie"
    : dossier.statut;

  const statutLabel = t(`statuts.${statutVisible}` as Parameters<typeof t>[0]);

  const statusColors: Record<string, string> = {
    soumis: "bg-blue-50 text-blue-700",
    recu: "bg-green-50 text-[#006e2d]",
    incomplet: "bg-amber-50 text-amber-700",
    recevable: "bg-green-50 text-[#006e2d]",
    en_evaluation: "bg-purple-50 text-purple-700",
    non_recevable: "bg-red-50 text-[#b70011]",
    notifie: "bg-gray-50 text-gray-700",
  };

  const colorCls = statusColors[statutVisible] ?? "bg-gray-50 text-gray-700";

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{t("titre")}</h1>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">{t("statut_label")}</span>
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${colorCls}`}>
            {statutLabel}
          </span>
        </div>

        <p className="text-sm text-gray-600">
          {t("soumis_le", {
            date: new Date(dossier.soumis_le).toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          })}
        </p>
        <p className="mt-1 font-mono text-xs text-gray-400">{dossier.dossier_numero}</p>

        {dossier.motif_non_recevabilite && dossier.statut === "non_recevable" && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">{dossier.motif_non_recevabilite}</p>
          </div>
        )}

        {dossier.statut === "incomplet" && (
          <div className="mt-6">
            <Link
              href={`/submit/ebc26/suivi/${token}/regulariser` as never}
              className="inline-flex items-center gap-2 rounded-xl bg-[#b70011] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9a0010]"
            >
              {t("regulariser")}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
