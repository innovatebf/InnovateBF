import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  ClipboardList,
  CheckCircle2,
  RefreshCw,
  XCircle,
  ArrowRight,
  Activity,
} from "lucide-react";
import { getModerationStats } from "@/lib/innovons/admin-queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administration IE — InnovateBF",
  description:
    "Tableau de bord administrateur de la plateforme InnovonsEnsembleLeFaso.",
};

// Activite recente mockee
const RECENT_ACTIVITY = [
  {
    id: "act-1",
    action: "Besoin approuve",
    detail: "Digitalisation des services de sante communautaire",
    time: "Il y a 2 heures",
    color: "text-green-400",
  },
  {
    id: "act-2",
    action: "Revision demandee",
    detail: "Plateforme de commerce electronique pour artisans",
    time: "Il y a 5 heures",
    color: "text-orange-400",
  },
  {
    id: "act-3",
    action: "Besoin rejete",
    detail: "Projet hors perimetre — technologie non endogene",
    time: "Hier",
    color: "text-red-400",
  },
];

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const stats = await getModerationStats();

  const statCards = [
    {
      label: "En attente",
      value: stats.pending,
      icon: ClipboardList,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
    },
    {
      label: "Publies",
      value: stats.published,
      icon: CheckCircle2,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      label: "Revisions",
      value: stats.revision,
      icon: RefreshCw,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
    },
    {
      label: "Rejetes",
      value: stats.rejected,
      icon: XCircle,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
    },
  ];

  const quickActions = [
    {
      label: "Examiner la file",
      href: "/innovons/admin/moderation",
      description: `${stats.pending} besoin(s) en attente de validation`,
    },
    {
      label: "Voir tous les besoins",
      href: "/innovons/admin/besoins",
      description: `${stats.published} besoin(s) publies sur la plateforme`,
    },
    {
      label: "Gerer les appels",
      href: "/innovons/admin/appels",
      description: "Creer et gerer les appels a solutions",
    },
    {
      label: "Gérer les utilisateurs",
      href: "/innovons/admin/utilisateurs",
      description: "Attribuer les rôles éditeur et admin",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-white">
          Tableau de bord administrateur
        </h1>
        <span className="inline-flex items-center rounded-full bg-red-600/20 px-3 py-1 text-xs font-medium text-red-400">
          ADMIN
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {statCards.map(({ label, value, icon: Icon, color, bgColor }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-xl bg-gray-900 p-5 shadow-sm"
          >
            <div
              className={`flex size-10 items-center justify-center rounded-lg ${bgColor}`}
            >
              <Icon className={`size-5 ${color}`} aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-sm text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions rapides */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {quickActions.map(({ label, href, description }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col justify-between rounded-xl bg-gray-900 p-5 shadow-sm transition-colors hover:bg-gray-800"
            >
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-green-400">
                  {label}
                </h3>
                <p className="mt-1 text-xs text-gray-400">{description}</p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-green-400">
                Acceder
                <ArrowRight
                  className="size-3.5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Activite recente */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Activity className="size-5 text-gray-400" aria-hidden="true" />
          Activite recente
        </h2>
        <div className="divide-y divide-white/5 rounded-xl bg-gray-900 shadow-sm">
          {RECENT_ACTIVITY.map(({ id, action, detail, time, color }) => (
            <div
              key={id}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
            >
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium ${color}`}>{action}</p>
                <p className="mt-0.5 truncate text-xs text-gray-400">
                  {detail}
                </p>
              </div>
              <span className="text-xs text-gray-500">{time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
