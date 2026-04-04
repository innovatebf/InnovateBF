import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Megaphone, Mail, Phone, MapPin } from "lucide-react";
import { IENavbar } from "@/components/innovons/IENavbar";
import { getOpenCalls } from "@/lib/innovons/queries";
import { AppelsClient } from "@/components/innovons/AppelsClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "innovons.appels" });
  return {
    title: t("page_title"),
    description: t("page_desc"),
  };
}

export default async function AppelsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ta = await getTranslations("innovons.appels");
  const tf = await getTranslations("innovons.footer");

  const rawCalls = await getOpenCalls();

  // Mapper les appels DB vers le format d'affichage
  const appels = rawCalls.map((c) => ({
    id: c.id,
    need_id: c.need_id,
    titre: c.titre,
    domaine: c.domaine ?? (c.need?.domaine ?? "—"),
    description: c.description ?? "",
    budget: c.budget_alloue ?? 0,
    deadline: c.deadline ? new Date(c.deadline).toISOString().slice(0, 10) : "",
    statut: (c.statut ?? "OUVERT") as "OUVERT" | "FERME" | "SELECTIONNE",
    proposalsCount: c.nb_proposals ?? 0,
  }));

  const budgetTotal = appels.reduce((acc, a) => acc + a.budget, 0);
  const domainesUniques = new Set(appels.map((a) => a.domaine)).size;

  return (
    <div className="min-h-screen">
      <IENavbar />

      {/* Hero */}
      <section className="bg-[#0D0D0D] px-4 py-20 text-white lg:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-500">
              <Megaphone className="size-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-sm font-medium text-secondary-400">
              InnovonsEnsembleLeFaso
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            {ta("page_title")}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-gray-400 sm:text-lg">
            {ta("page_desc")}
          </p>
          <p className="mt-6 text-sm font-medium text-gray-300">
            {ta("stats_summary")}
          </p>
        </div>
      </section>

      {/* Client component : cards + filtres + modal */}
      <AppelsClient
        appels={appels}
        budgetTotal={budgetTotal}
        domainesUniques={domainesUniques}
        translations={{
          budget: ta("budget"),
          propose: ta("propose"),
          filter_status: ta("filter_status"),
          filter_domain: ta("filter_domain"),
          filter_deadline: ta("filter_deadline"),
          all_statuses: ta("all_statuses"),
          all_domains: ta("all_domains"),
          status_open: ta("status_open"),
          status_closed: ta("status_closed"),
          status_selected: ta("status_selected"),
          cta_title: ta("cta_title"),
          cta_desc: ta("cta_desc"),
          cta_button: ta("cta_button"),
        }}
      />

      {/* Footer IE */}
      <footer
        className="bg-[#111827] py-12 text-gray-400"
        aria-label="Pied de page InnovonsEnsembleLeFaso"
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-500 text-sm font-black text-white">
                  IE
                </div>
                <span className="font-bold text-white">InnovonsEnsembleLeFaso</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed">{tf("tagline")}</p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-white">{tf("quick_links")}</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/innovons/besoins" className="transition-colors hover:text-white">
                    {tf("link_catalog")}
                  </Link>
                </li>
                <li>
                  <Link href="/innovons/appels" className="transition-colors hover:text-white">
                    {tf("link_calls")}
                  </Link>
                </li>
                <li>
                  <Link href="/innovons/conference" className="transition-colors hover:text-white">
                    {tf("link_conference")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-white">{tf("contact")}</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="size-4 shrink-0 text-secondary-500" aria-hidden="true" />
                  <span>{tf("email")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="size-4 shrink-0 text-secondary-500" aria-hidden="true" />
                  <span>{tf("phone")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 text-secondary-500" aria-hidden="true" />
                  <span>{tf("location")}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs">
            {tf("copyright")}
          </div>
        </div>
      </footer>
    </div>
  );
}
