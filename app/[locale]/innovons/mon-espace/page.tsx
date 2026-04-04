import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  FileText,
  Lightbulb,
  Bell,
  CheckCircle,
  Calendar,
  ArrowRight,
} from "lucide-react";
import {
  getCurrentUser,
  getUserNeeds,
  getUserProposals,
} from "@/lib/innovons/user-queries";
import { getOpenCalls } from "@/lib/innovons/queries";
import { hasMinRole } from "@/lib/auth/roles";
import type { NeedStatus } from "@/lib/innovons/types";

export const dynamic = 'force-dynamic';

const STATUS_BADGE: Record<NeedStatus, string> = {
  BROUILLON: "bg-gray-100 text-gray-700",
  VALIDATION: "bg-amber-100 text-amber-700",
  PUBLIE: "bg-[#006e2d]/10 text-[#16a34a]",
  ARCHIVE: "bg-red-100 text-red-700",
};

const STATUS_LABEL: Record<NeedStatus, string> = {
  BROUILLON: "Brouillon",
  VALIDATION: "Validation",
  PUBLIE: "Publie",
  ARCHIVE: "Archive",
};

function RoleBadge({ role }: { role: string }) {
  const config: Record<string, { label: string; className: string }> = {
    admin:  { label: "Admin",    className: "bg-[#b70011]/10 text-[#dc2626]" },
    editor: { label: "Editeur",  className: "bg-[#006e2d]/10 text-[#16a34a]" },
    guest:  { label: "Invité",   className: "bg-[#e8eaeb] text-gray-600" },
    // Legacy fallback values
    ADMINISTRATEUR: { label: "Admin",      className: "bg-[#b70011]/10 text-[#dc2626]" },
    UTILISATEUR:    { label: "Utilisateur", className: "bg-[#e8eaeb] text-gray-600" },
  };

  const c = config[role] ?? config.guest!;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${c.className}`}
    >
      {c.label}
    </span>
  );
}

export default async function MonEspacePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "innovons.mon_espace" });

  const user = await getCurrentUser();
  const needs = user ? await getUserNeeds(user.id, user.email) : [];
  const proposals = user ? await getUserProposals(user.id) : [];
  const calls = await getOpenCalls();

  const userName = user?.name ?? "Utilisateur";
  console.log('[mon-espace] user.role =', user?.role);
  const canDeposit = hasMinRole(user?.role, 'editor');

  const stats = [
    {
      label: t("stat_besoins"),
      value: needs.length,
      icon: FileText,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: t("stat_propositions"),
      value: proposals.length,
      icon: Lightbulb,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: t("stat_appels"),
      value: calls.length,
      icon: Bell,
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: t("stat_compte"),
      value: t("stat_actif"),
      icon: CheckCircle,
      color: "text-[#16a34a] bg-[#006e2d]/10",
    },
  ];

  const recentNeeds = needs.slice(0, 3);
  const recentCalls = calls.slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("greeting")} {userName}
        </h1>
        {user && <RoleBadge role={user.role} />}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-[0_20px_40px_rgba(25,28,29,0.05)]"
          >
            <div className={`flex size-10 items-center justify-center rounded-lg ${color}`}>
              <Icon className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {t("recent_activity")}
        </h2>
        {recentNeeds.length > 0 ? (
          <div className="rounded-xl bg-white shadow-[0_20px_40px_rgba(25,28,29,0.05)]">
            {recentNeeds.map((need) => (
              <div
                key={need.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/innovons/besoins/${need.slug}`}
                    className="text-sm font-medium text-gray-900 hover:text-[#16a34a]"
                  >
                    {need.titre}
                  </Link>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {need.domaine}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[need.statut]}`}
                  >
                    {STATUS_LABEL[need.statut]}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(need.created_at).toLocaleDateString(locale)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">{t("besoins_empty")}</p>
        )}
      </section>

      {/* Open calls */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {t("open_calls")}
        </h2>
        {recentCalls.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentCalls.map((call) => {
              const daysLeft = Math.max(
                0,
                Math.ceil(
                  (new Date(call.deadline).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24),
                ),
              );
              return (
                <div
                  key={call.id}
                  className="rounded-xl bg-white p-5 shadow-[0_20px_40px_rgba(25,28,29,0.05)]"
                >
                  <h3 className="text-sm font-semibold text-gray-900">
                    {call.titre}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">{call.domaine}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="size-3.5" aria-hidden="true" />
                    <span>
                      {daysLeft > 0 ? `${daysLeft} jours restants` : "Expire"}
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-medium text-[#16a34a]">
                    {new Intl.NumberFormat(locale, {
                      style: "currency",
                      currency: "XOF",
                      maximumFractionDigits: 0,
                    }).format(call.budget_alloue)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Aucun appel ouvert.</p>
        )}
      </section>

      {/* CTAs */}
      <div className="flex flex-wrap gap-4">
        {canDeposit && (
          <Link
            href="/innovons/besoins/deposer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#b70011] to-[#dc2626] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {t("cta_submit")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        )}
        <Link
          href="/innovons/appels"
          className="inline-flex items-center gap-2 rounded-xl bg-[#e8eaeb] px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-[#f1f3f4]"
        >
          {t("cta_browse")}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
