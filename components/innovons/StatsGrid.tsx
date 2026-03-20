import { getStats } from "@/lib/innovons/queries";
import { getTranslations } from "next-intl/server";
import {
  FileText,
  Lightbulb,
  Users,
  UsersRound,
  TrendingUp,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import type { ElementType } from "react";
import type { IEStats } from "@/lib/innovons/types";

// PRD KI-F03 : UsersRound obligatoire pour Population impactee
const STAT_CONFIG: Array<{
  key: keyof IEStats;
  labelKey: string;
  icon: ElementType;
  format: (v: number) => { display: string; currency?: string };
  href: string;
}> = [
  {
    key: "needsCount",
    labelKey: "needs_label",
    icon: FileText,
    format: (v) => ({ display: v.toLocaleString("fr-FR") }),
    href: "/innovons/besoins",
  },
  {
    key: "proposalsCount",
    labelKey: "solutions_label",
    icon: Lightbulb,
    format: (v) => ({ display: v.toLocaleString("fr-FR") }),
    href: "/innovons/appels",
  },
  {
    key: "parrainsCount",
    labelKey: "sponsors_label",
    icon: Users,
    format: (v) => ({ display: v.toLocaleString("fr-FR") }),
    href: "/innovons/parrains",
  },
  {
    key: "populationImpact",
    labelKey: "population_label",
    icon: UsersRound, // PRD KI-F03
    format: (v) => {
      if (v >= 1_000_000) {
        return { display: `${(v / 1_000_000).toFixed(1).replace(".", ",")}M+` };
      }
      if (v >= 1_000) {
        return { display: `${Math.floor(v / 1_000)}K+` };
      }
      return { display: String(v) };
    },
    href: "/innovons/impact",
  },
  {
    key: "budgetMobilise",
    labelKey: "budget_label",
    icon: TrendingUp,
    format: (v) => {
      if (v >= 1_000_000_000) {
        const mds = (v / 1_000_000_000).toFixed(1).replace(".", ",").replace(",0", "");
        return { display: `${mds} Mds`, currency: "FCFA" };
      }
      if (v >= 1_000_000) {
        return { display: `${Math.floor(v / 1_000_000)} M`, currency: "FCFA" };
      }
      return { display: String(v), currency: "FCFA" };
    },
    href: "/innovons/budget",
  },
];

/**
 * Server component qui fetch les stats depuis la couche queries
 * et affiche les 5 cartes KI (Key Impact).
 *
 * PRD : KI-F01 grille 5 cols, KI-F02 responsive, KI-F03 UsersRound,
 *       KI-F04 format K/M/Mds, KI-F06 accessibilite, KI-F07 i18n
 */
export async function StatsGrid() {
  const [stats, t] = await Promise.all([
    getStats(),
    getTranslations("innovons.stats"),
  ]);

  return (
    <section
      aria-label={t("section_label")}
      className="border-b border-gray-100 bg-white py-14"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* PRD KI-F02 : 5 cols >= 1280px, 2-3 tab, 1-2 mobile */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {STAT_CONFIG.map(({ key, labelKey, icon: Icon, format, href }) => {
            const { display, currency } = format(stats[key]);
            const label = t(labelKey);

            return (
              <Link
                key={key}
                href={href}
                className="group flex flex-col items-center text-center transition-transform hover:-translate-y-0.5"
                aria-label={`${display}${currency ? " " + currency : ""} ${label}`}
              >
                {/* Icone sur fond vert clair */}
                <div className="flex size-12 items-center justify-center rounded-lg bg-green-50 transition-colors group-hover:bg-green-100">
                  <Icon
                    className="size-6 text-green-600"
                    aria-hidden="true"
                  />
                </div>
                {/* Valeur numerique formatee — PRD KI-F04 */}
                <p className="mt-3 text-3xl font-black text-gray-900 lg:text-4xl">
                  {display}
                </p>
                {currency && (
                  <p className="text-xl font-black text-gray-900">
                    {currency}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">{label}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Skeleton pour Suspense fallback.
 * Affiche 5 cartes placeholder avec animation pulse.
 */
export function StatsSkeleton() {
  return (
    <section
      aria-label="Chargement des indicateurs"
      className="border-b border-gray-100 bg-white py-14"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center"
            >
              <div className="size-12 animate-pulse rounded-lg bg-gray-200" />
              <div className="mt-3 h-9 w-20 animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-4 w-24 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
