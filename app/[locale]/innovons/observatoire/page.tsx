import { setRequestLocale } from "next-intl/server";
import { IENavbar } from "@/components/innovons/IENavbar";
import { ObservatoireClient } from "@/components/innovons/ObservatoireClient";
import {
  Globe,
  TrendingUp,
  Lightbulb,
  BookOpen,
  Calendar,
  ArrowRight,
} from "lucide-react";

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata = {
  title: "Observatoire Technologique | InnovonsEnsembleLeFaso",
  description:
    "Veille technologique et innovation au Burkina Faso et en Afrique de l'Ouest",
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface ImpactConfig {
  label: string;
  className: string;
}

// ── Static data ───────────────────────────────────────────────────────────────
// In production these would be fetched from RSS feeds or an aggregation API.

const VEILLE_ARTICLES = [
  {
    id: "1",
    titre: "L'IA générative au service de l'agriculture sahélienne",
    source: "Africa Tech Review",
    url: "#",
    categorie: "Agriculture & IA",
    date: "2026-03-20",
    resume:
      "Des chercheurs burkinabè utilisent des modèles de langage pour analyser les données climatiques et optimiser les calendriers agricoles dans les zones semi-arides.",
    tags: ["IA", "Agriculture", "Sahel"],
    impact: "ELEVE",
  },
  {
    id: "2",
    titre: "Financement de 50M$ pour les startups AgriTech en Afrique de l'Ouest",
    source: "Jeune Afrique Économie",
    url: "#",
    categorie: "Financement",
    date: "2026-03-18",
    resume:
      "Un nouveau fonds panafricain cible exclusivement les startups qui développent des solutions technologiques pour les petits producteurs agricoles.",
    tags: ["Financement", "AgriTech", "Startups"],
    impact: "ELEVE",
  },
  {
    id: "3",
    titre: "Réseau de capteurs IoT pour la surveillance des ressources en eau",
    source: "Tech Afrique",
    url: "#",
    categorie: "Eau & Environnement",
    date: "2026-03-15",
    resume:
      "Le projet pilote déployé dans 3 provinces du Burkina Faso permet de monitorer en temps réel les niveaux des retenues d'eau et d'optimiser l'irrigation.",
    tags: ["IoT", "Eau", "Environnement"],
    impact: "MOYEN",
  },
  {
    id: "4",
    titre: "Télémédecine : 200 villages connectés aux soins spécialisés",
    source: "Santé Afrique",
    url: "#",
    categorie: "Santé Numérique",
    date: "2026-03-12",
    resume:
      "Initiative nationale de télémédecine qui permet aux habitants des zones rurales d'accéder à des consultations spécialisées via des tablettes et une connexion satellite.",
    tags: ["Santé", "Télémédecine", "Rural"],
    impact: "ELEVE",
  },
  {
    id: "5",
    titre: "Formation en IA : 10 000 jeunes burkinabè d'ici 2027",
    source: "Innovation BF",
    url: "#",
    categorie: "Formation & Emploi",
    date: "2026-03-10",
    resume:
      "Programme gouvernemental en partenariat avec des universités locales et des acteurs privés pour former une nouvelle génération de spécialistes en intelligence artificielle.",
    tags: ["Formation", "IA", "Jeunesse"],
    impact: "ELEVE",
  },
  {
    id: "6",
    titre: "Énergie solaire : le Burkina dépasse les 500 MW installés",
    source: "Energie Africa",
    url: "#",
    categorie: "Énergie",
    date: "2026-03-08",
    resume:
      "Le cap des 500 mégawatts de capacité solaire installée a été franchi, avec plusieurs projets de stockage par batteries en cours de déploiement.",
    tags: ["Énergie", "Solaire", "Infrastructure"],
    impact: "MOYEN",
  },
];

const TENDANCES = [
  { label: "Intelligence Artificielle", score: 92, trend: "+12%" },
  { label: "AgriTech", score: 88, trend: "+8%" },
  { label: "HealthTech", score: 76, trend: "+15%" },
  { label: "FinTech Mobile", score: 71, trend: "+5%" },
  { label: "Énergie Renouvelable", score: 68, trend: "+3%" },
  { label: "EdTech", score: 62, trend: "+9%" },
];

const SOURCES_ACTIVES = [
  { nom: "Africa Tech Review", url: "#" },
  { nom: "Jeune Afrique Économie", url: "#" },
  { nom: "Tech Afrique", url: "#" },
  { nom: "Innovation BF", url: "#" },
];

const CATEGORIES = [
  "Tous",
  "Agriculture & IA",
  "Financement",
  "Eau & Environnement",
  "Santé Numérique",
  "Formation & Emploi",
  "Énergie",
];

const IMPACT_CONFIG: Record<string, ImpactConfig> = {
  ELEVE: {
    label: "Impact élevé",
    className:
      "bg-red-900/30 text-red-400 border border-red-800",
  },
  MOYEN: {
    label: "Impact moyen",
    className:
      "bg-amber-900/30 text-amber-400 border border-amber-800",
  },
  FAIBLE: {
    label: "Impact faible",
    className: "bg-gray-800 text-gray-400 border border-gray-700",
  },
};

const DEFAULT_IMPACT: ImpactConfig = {
  label: "Impact inconnu",
  className: "bg-gray-800 text-gray-400 border border-gray-700",
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ObservatoirePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ── Sub-navigation ── */}
      <IENavbar />

      {/* ═══════════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0D0D0D] px-4 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 text-green-400">
            <Globe className="size-5" aria-hidden="true" />
            <span className="text-sm font-semibold uppercase tracking-widest">
              Observatoire
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Observatoire Technologique
          </h1>
          <p className="mt-5 max-w-2xl text-base text-gray-400 sm:text-lg">
            Veille sur l&apos;innovation technologique au Burkina Faso et en
            Afrique de l&apos;Ouest
          </p>

          {/* Stat badges */}
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { icon: Lightbulb, label: "6 signaux cette semaine" },
              { icon: BookOpen, label: "4 domaines couverts" },
              { icon: Calendar, label: "Mis à jour le 22 mars 2026" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300"
              >
                <Icon className="size-4 text-green-400" aria-hidden="true" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          MAIN — two-column layout
      ═══════════════════════════════════════════════════════════════════ */}
      <main className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">

          {/* ── Left column — Signaux & Tendances ── */}
          <section aria-labelledby="signals-heading">
            <div className="mb-6 flex items-center gap-2.5">
              <Globe
                className="size-5 shrink-0 text-green-400"
                aria-hidden="true"
              />
              <h2
                id="signals-heading"
                className="text-xl font-bold text-white"
              >
                Signaux &amp; Tendances
              </h2>
            </div>

            {/* Client component handles filtering + rendering */}
            <ObservatoireClient
              articles={VEILLE_ARTICLES}
              categories={CATEGORIES}
              impactConfig={IMPACT_CONFIG}
              defaultImpact={DEFAULT_IMPACT}
            />
          </section>

          {/* ── Right column — sidebar ── */}
          <aside className="space-y-6" aria-label="Informations complémentaires">

            {/* Tendances du moment */}
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
              <div className="mb-5 flex items-center gap-2.5">
                <TrendingUp
                  className="size-5 shrink-0 text-green-400"
                  aria-hidden="true"
                />
                <h2 className="text-base font-bold text-white">
                  Tendances du moment
                </h2>
              </div>

              <ul className="space-y-4" role="list">
                {TENDANCES.map(({ label, score, trend }) => (
                  <li key={label}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-sm text-gray-300">{label}</span>
                      <span className="text-xs font-semibold text-green-400">
                        {trend}
                      </span>
                    </div>
                    <div
                      className="h-1.5 w-full overflow-hidden rounded-full bg-gray-800"
                      role="progressbar"
                      aria-valuenow={score}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${label} : ${score}/100`}
                    >
                      <div
                        className="h-full rounded-full bg-green-500 transition-all"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sources actives */}
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
              <h2 className="mb-4 text-base font-bold text-white">
                Sources actives
              </h2>
              <ul className="space-y-3" role="list">
                {SOURCES_ACTIVES.map(({ nom, url }) => (
                  <li key={nom} className="flex items-center gap-2.5">
                    <span
                      className="size-2 shrink-0 rounded-full bg-green-500"
                      aria-hidden="true"
                    />
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 transition-colors hover:text-white"
                    >
                      {nom}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </aside>
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════
          BOTTOM CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="border-t border-gray-800 bg-gray-900 px-4 py-14 lg:px-8"
        aria-labelledby="cta-heading"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="cta-heading"
            className="text-2xl font-bold text-white lg:text-3xl"
          >
            Contribuez à l&apos;Observatoire
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-400">
            Vous avez repéré une tendance ou une source pertinente ? Partagez
            un signal ou proposez une nouvelle source à notre équipe éditoriale.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/innovons/besoins/deposer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-green-400 transition-all hover:border-green-500 hover:bg-white/5"
            >
              Soumettre un signal
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="mailto:observatoire@innovatebf.org"
              className="inline-flex items-center gap-2 rounded-full bg-green-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-600"
            >
              Proposer une source
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
