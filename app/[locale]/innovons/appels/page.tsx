import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  ArrowRight,
  Clock,
  FileText,
  Filter,
  Megaphone,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { IENavbar } from "@/components/innovons/IENavbar";

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

type AppelStatus = "OUVERT" | "FERME" | "SELECTIONNE";

interface Appel {
  id: string;
  title: string;
  domain: string;
  description: string;
  budget: number;
  deadline: string;
  status: AppelStatus;
  proposalsCount: number;
}

const MOCK_APPELS: Appel[] = [
  {
    id: "AS-2026-001",
    title: "Plateforme de télémédecine pour zones rurales",
    domain: "Santé",
    description:
      "Développement d'une solution de télémédecine accessible via téléphones basiques (USSD/SMS) permettant aux populations rurales de consulter des professionnels de santé à distance. La solution doit fonctionner avec une connexion limitée et intégrer les langues locales.",
    budget: 350_000_000,
    deadline: "2026-06-30",
    status: "OUVERT",
    proposalsCount: 12,
  },
  {
    id: "AS-2026-002",
    title: "Système d'irrigation intelligente solaire",
    domain: "Agriculture",
    description:
      "Conception et déploiement d'un système d'irrigation alimenté par énergie solaire avec capteurs IoT pour optimiser la consommation d'eau. Le système doit être adapté aux cultures locales (mil, sorgho, maïs) et aux conditions climatiques sahéliennes.",
    budget: 500_000_000,
    deadline: "2026-07-15",
    status: "OUVERT",
    proposalsCount: 8,
  },
  {
    id: "AS-2026-003",
    title: "Application d'alphabétisation numérique",
    domain: "Éducation",
    description:
      "Création d'une application mobile d'alphabétisation en langues nationales (mooré, dioula, fulfuldé) utilisant la reconnaissance vocale et des contenus visuels adaptés au contexte culturel burkinabè.",
    budget: 150_000_000,
    deadline: "2026-08-01",
    status: "OUVERT",
    proposalsCount: 15,
  },
  {
    id: "AS-2026-004",
    title: "Stations de purification d'eau autonomes",
    domain: "Eau",
    description:
      "Développement de stations compactes de purification d'eau alimentées par énergie solaire, adaptées aux communautés de 500 à 2000 habitants. Les stations doivent être faciles à maintenir avec des composants disponibles localement.",
    budget: 450_000_000,
    deadline: "2026-09-01",
    status: "OUVERT",
    proposalsCount: 6,
  },
  {
    id: "AS-2026-005",
    title: "Micro-réseaux solaires communautaires",
    domain: "Énergie",
    description:
      "Conception de micro-réseaux électriques solaires pour villages non raccordés au réseau national. Solution incluant stockage par batteries, système de prépaiement mobile et maintenance prédictive par IA.",
    budget: 500_000_000,
    deadline: "2026-07-31",
    status: "OUVERT",
    proposalsCount: 10,
  },
  {
    id: "AS-2026-006",
    title: "Registre civil numérique décentralisé",
    domain: "Numérique",
    description:
      "Mise en place d'un système de registre civil numérique sécurisé et décentralisé permettant l'enregistrement des naissances, mariages et décès dans les zones reculées via des agents communautaires équipés de tablettes.",
    budget: 200_000_000,
    deadline: "2026-08-15",
    status: "OUVERT",
    proposalsCount: 4,
  },
  {
    id: "AS-2026-007",
    title: "Drones de surveillance agricole",
    domain: "Agriculture",
    description:
      "Développement d'une flotte de drones légers pour la surveillance des cultures, la détection précoce de maladies et l'optimisation de l'utilisation des intrants agricoles. Formation des agriculteurs locaux à l'utilisation incluse.",
    budget: 280_000_000,
    deadline: "2026-06-15",
    status: "OUVERT",
    proposalsCount: 9,
  },
  {
    id: "AS-2026-008",
    title: "Plateforme de traçabilité agroalimentaire",
    domain: "Industrie",
    description:
      "Création d'une plateforme de traçabilité de la chaîne de valeur agroalimentaire burkinabè, du producteur au consommateur, utilisant la blockchain et les QR codes pour garantir la qualité et l'origine des produits.",
    budget: 180_000_000,
    deadline: "2026-09-15",
    status: "OUVERT",
    proposalsCount: 7,
  },
];

function formatBudgetFCFA(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)} Mds FCFA`;
  }
  if (amount >= 1_000_000) {
    return `${Math.round(amount / 1_000_000)} M FCFA`;
  }
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}

function getDaysLeft(deadline: string): number {
  const now = new Date("2026-03-20");
  const dl = new Date(deadline);
  const diff = dl.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getStatusBadgeClasses(status: AppelStatus): string {
  switch (status) {
    case "OUVERT":
      return "bg-green-100 text-green-800";
    case "FERME":
      return "bg-gray-100 text-gray-600";
    case "SELECTIONNE":
      return "bg-blue-100 text-blue-800";
  }
}

function getStatusLabel(status: AppelStatus): string {
  switch (status) {
    case "OUVERT":
      return "Ouvert";
    case "FERME":
      return "Fermé";
    case "SELECTIONNE":
      return "Sélectionné";
  }
}

const ALL_DOMAINS = [
  "Santé",
  "Agriculture",
  "Éducation",
  "Eau",
  "Énergie",
  "Numérique",
  "Sécurité",
  "Industrie",
];

export default async function AppelsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("innovons");
  const ta = await getTranslations("innovons.appels");
  const tf = await getTranslations("innovons.footer");

  return (
    <div className="min-h-screen">
      <IENavbar />

      {/* Hero */}
      <section className="bg-[#0D0D0D] px-4 py-20 text-white lg:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-600">
              <Megaphone className="size-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-sm font-medium text-green-400">
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

      {/* Main content */}
      <section className="bg-gray-50 px-4 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
            {/* Cards */}
            <div className="space-y-6">
              {MOCK_APPELS.map((appel) => {
                const daysLeft = getDaysLeft(appel.deadline);
                const isOpen = appel.status === "OUVERT";

                return (
                  <article
                    key={appel.id}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="p-6">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeClasses(appel.status)}`}
                        >
                          {getStatusLabel(appel.status)}
                        </span>
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                          {appel.domain}
                        </span>
                        <span className="text-xs text-gray-400">
                          {appel.id}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900">
                        {appel.title}
                      </h3>

                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
                        {appel.description}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                          <span className="text-green-600">{ta("budget")} :</span>
                          {formatBudgetFCFA(appel.budget)}
                        </div>

                        {isOpen && (
                          <div className="flex items-center gap-1.5 text-amber-600">
                            <Clock className="size-4" aria-hidden="true" />
                            <span>{ta("days_left", { days: daysLeft })}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 text-gray-500">
                          <FileText className="size-4" aria-hidden="true" />
                          <span>
                            {ta("proposals_count", {
                              count: appel.proposalsCount,
                            })}
                          </span>
                        </div>
                      </div>

                      {isOpen && (
                        <div className="mt-5">
                          <Link
                            href="/innovons/appels"
                            className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                          >
                            {ta("propose")}
                            <ArrowRight
                              className="size-4"
                              aria-hidden="true"
                            />
                          </Link>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Filter className="size-4" aria-hidden="true" />
                  Filtres
                </div>

                {/* Status filter */}
                <div className="mb-5">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {ta("filter_status")}
                  </label>
                  <select className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                    <option>{ta("all_statuses")}</option>
                    <option>{ta("status_open")}</option>
                    <option>{ta("status_closed")}</option>
                    <option>{ta("status_selected")}</option>
                  </select>
                </div>

                {/* Domain filter */}
                <div className="mb-5">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {ta("filter_domain")}
                  </label>
                  <select className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                    <option>{ta("all_domains")}</option>
                    {ALL_DOMAINS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Deadline filter */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {ta("filter_deadline")}
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Stats sidebar */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  Statistiques
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Appels ouverts</span>
                    <span className="font-bold text-green-600">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Domaines couverts</span>
                    <span className="font-bold text-gray-900">6</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Budget total</span>
                    <span className="font-bold text-gray-900">2,61 Mds FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Propositions totales</span>
                    <span className="font-bold text-gray-900">71</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0D0D0D] py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
          <h2 className="text-3xl font-bold lg:text-4xl">
            {ta("cta_title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            {ta("cta_desc")}
          </p>
          <div className="mt-8">
            <Link
              href="/innovons/appels"
              className="inline-flex items-center gap-2 rounded-full bg-green-600 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-green-500"
            >
              {ta("cta_button")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer IE */}
      <footer
        className="bg-[#111827] py-12 text-gray-400"
        aria-label="Pied de page InnovonsEnsembleLeFaso"
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-green-600 text-sm font-black text-white">
                  IE
                </div>
                <span className="font-bold text-white">
                  InnovonsEnsembleLeFaso
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed">{tf("tagline")}</p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-white">
                {tf("quick_links")}
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/innovons/besoins"
                    className="transition-colors hover:text-white"
                  >
                    {tf("link_catalog")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/innovons/appels"
                    className="transition-colors hover:text-white"
                  >
                    {tf("link_calls")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/innovons/conference"
                    className="transition-colors hover:text-white"
                  >
                    {tf("link_conference")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-white">
                {tf("contact")}
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Mail
                    className="size-4 shrink-0 text-green-500"
                    aria-hidden="true"
                  />
                  <span>{tf("email")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone
                    className="size-4 shrink-0 text-green-500"
                    aria-hidden="true"
                  />
                  <span>{tf("phone")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin
                    className="size-4 shrink-0 text-green-500"
                    aria-hidden="true"
                  />
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
