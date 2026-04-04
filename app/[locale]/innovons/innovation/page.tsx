import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  Lightbulb,
  Sprout,
  Users,
  BookOpen,
  Wrench,
  Globe,
  ArrowRight,
  CheckCircle,
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
  const t = await getTranslations({ locale, namespace: "innovons" });
  return {
    title: "Innovation Endogène | InnovonsEnsembleLeFaso",
    description:
      "Comprendre et promouvoir l'innovation endogène au Burkina Faso : solutions locales, savoirs traditionnels et technologies adaptées aux réalités burkinabè.",
  };
}

// ── Données statiques ────────────────────────────────────────────────────────

const PRINCIPES = [
  {
    icon: Sprout,
    titre: "Enracinement local",
    description:
      "L'innovation endogène naît des besoins réels des communautés burkinabè. Elle valorise les ressources, les savoirs et les savoir-faire locaux plutôt que de reproduire des modèles importés.",
  },
  {
    icon: Users,
    titre: "Participation communautaire",
    description:
      "Les populations sont les premières actrices de leur développement. L'innovation endogène implique les communautés à chaque étape : identification des besoins, conception, test et déploiement.",
  },
  {
    icon: BookOpen,
    titre: "Valorisation des savoirs traditionnels",
    description:
      "Le Burkina Faso dispose d'un patrimoine de connaissances traditionnelles en agriculture, médecine, architecture et gestion de l'eau. L'innovation endogène les intègre et les renforce.",
  },
  {
    icon: Wrench,
    titre: "Adaptation technologique",
    description:
      "Les technologies importées sont adaptées aux réalités locales (climate, infrastructure, langues, culture) plutôt qu'imposées telles quelles. La maintenabilité locale est un critère clé.",
  },
  {
    icon: Globe,
    titre: "Souveraineté technologique",
    description:
      "Réduire la dépendance aux solutions étrangères en développant des capacités locales de conception, de production et de maintenance technologique.",
  },
  {
    icon: CheckCircle,
    titre: "Impact mesurable",
    description:
      "Chaque innovation est évaluée sur son impact réel : amélioration des conditions de vie, création d'emplois, préservation de l'environnement et renforcement du tissu social.",
  },
];

const DOMAINES = [
  { label: "Santé & Médecine", exemples: ["Concentrateurs O₂ locaux", "Diagnostic mobile"], color: "bg-red-50 text-red-700 border-red-200" },
  { label: "Agriculture & Eau", exemples: ["Irrigation solaire", "Filtration communautaire"], color: "bg-green-50 text-green-700 border-green-200" },
  { label: "Énergie", exemples: ["Mini-réseaux solaires", "Biogaz domestique"], color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { label: "Éducation", exemples: ["Serveurs hors-ligne", "Apprentissage vocal"], color: "bg-blue-50 text-blue-700 border-blue-200" },
  { label: "Numérique & Gouvernance", exemples: ["Services publics mobiles", "État civil décentralisé"], color: "bg-purple-50 text-purple-700 border-purple-200" },
  { label: "Industrie & Transformation", exemples: ["Séchage solaire mangue", "Artisanat modernisé"], color: "bg-orange-50 text-orange-700 border-orange-200" },
];

const ETAPES = [
  { num: "01", titre: "Identifier", desc: "Recenser les besoins sociétaux réels à travers les communautés, les institutions et les experts de terrain." },
  { num: "02", titre: "Concevoir", desc: "Co-créer des solutions adaptées avec les bénéficiaires, en intégrant les contraintes locales dès le départ." },
  { num: "03", titre: "Prototyper", desc: "Développer des prototypes testables avec des matériaux et compétences disponibles localement." },
  { num: "04", titre: "Tester", desc: "Valider les solutions en conditions réelles, itérer rapidement et documenter les apprentissages." },
  { num: "05", titre: "Déployer", desc: "Passer à l'échelle avec un modèle économique viable et une maintenance assurée par les communautés." },
  { num: "06", titre: "Mesurer", desc: "Évaluer l'impact réel, partager les résultats et capitaliser pour la prochaine génération d'innovations." },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function InnovationEndogenePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tf = await getTranslations("innovons.footer");

  return (
    <div className="min-h-screen">
      <IENavbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] px-4 py-20 text-white lg:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-500">
              <Lightbulb className="size-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-sm font-medium text-secondary-400">
              InnovonsEnsembleLeFaso
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Innovation endogène
          </h1>
          <p className="mt-4 max-w-2xl text-base text-gray-400 sm:text-lg">
            Des solutions nées ici, pour ici. L'innovation endogène place les
            communautés burkinabè au cœur de leur propre développement
            technologique.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/innovons/besoins"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:from-primary-700 hover:to-primary-600"
            >
              Voir les besoins recensés
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/innovons/appels"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Appels à propositions
            </Link>
          </div>
        </div>
      </section>

      {/* ── Définition ────────────────────────────────────────────────────── */}
      <section className="bg-white px-4 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-secondary-600">
                Qu'est-ce que c'est ?
              </span>
              <h2 className="mt-3 text-3xl font-black text-gray-900 lg:text-4xl">
                Une innovation ancrée dans nos réalités
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-600">
                L'innovation endogène désigne tout processus de création,
                d'adaptation ou d'amélioration technologique qui prend sa source
                dans les besoins, les savoirs et les ressources d'une communauté.
                Au Burkina Faso, elle constitue le fondement d'un développement
                durable et souverain.
              </p>
              <p className="mt-4 text-base leading-relaxed text-gray-600">
                Contrairement à l'adoption passive de technologies venues de
                l'extérieur, l'innovation endogène part du terrain : elle
                mobilise les ingénieurs locaux, valorise les pratiques
                traditionnelles efficaces et crée des solutions maintenables
                sans dépendance externe.
              </p>
              <blockquote className="mt-6 border-l-4 border-primary-500 pl-4 italic text-gray-500">
                « Un avenir où la technologie et l'innovation, enracinées dans
                nos valeurs socio-culturelles, sont les moteurs du développement
                durable au Burkina Faso. »
                <footer className="mt-2 text-sm font-semibold not-italic text-gray-700">
                  — Vision InnovateBF
                </footer>
              </blockquote>
            </div>

            {/* Chiffres clés */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: "12", label: "Domaines d'innovation", sub: "couverts par la plateforme" },
                { val: "8", label: "Appels ouverts", sub: "en attente de solutions" },
                { val: "992K+", label: "Personnes impactées", sub: "objectif de la plateforme" },
                { val: "2030", label: "Horizon stratégique", sub: "ODD & Plan national" },
              ].map(({ val, label, sub }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
                >
                  <div className="text-3xl font-black text-primary-600">{val}</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">{label}</div>
                  <div className="mt-0.5 text-xs text-gray-500">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6 Principes ────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 px-4 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary-600">
              Nos fondements
            </span>
            <h2 className="mt-3 text-3xl font-black text-gray-900">
              Les 6 principes de l'innovation endogène
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPES.map(({ icon: Icon, titre, description }) => (
              <div
                key={titre}
                className="rounded-2xl bg-white p-6 shadow-[0_20px_40px_rgba(25,28,29,0.05)]"
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-500">
                  <Icon className="size-5 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-gray-900">{titre}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Domaines d'application ──────────────────────────────────────────── */}
      <section className="bg-white px-4 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary-600">
              Secteurs prioritaires
            </span>
            <h2 className="mt-3 text-3xl font-black text-gray-900">
              Où s'applique l'innovation endogène
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-gray-500">
              Six secteurs où le Burkina Faso dispose d'un potentiel endogène
              fort et de besoins urgents à résoudre.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DOMAINES.map(({ label, exemples, color }) => (
              <div
                key={label}
                className={`rounded-xl border p-5 ${color}`}
              >
                <h3 className="font-bold">{label}</h3>
                <ul className="mt-2 space-y-1">
                  {exemples.map((e) => (
                    <li key={e} className="flex items-center gap-2 text-sm opacity-80">
                      <span className="size-1 rounded-full bg-current" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Processus en 6 étapes ───────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] px-4 py-16 text-white lg:px-8 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary-400">
              Méthodologie
            </span>
            <h2 className="mt-3 text-3xl font-black">
              Le cycle de l'innovation endogène
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ETAPES.map(({ num, titre, desc }) => (
              <div
                key={num}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="mb-3 text-3xl font-black text-secondary-500">
                  {num}
                </div>
                <h3 className="text-base font-bold">{titre}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 px-4 py-16 text-white lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black lg:text-4xl">
            Participez à l'innovation endogène
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-100">
            Vous avez un besoin sociétal à documenter, une solution à proposer
            ou souhaitez soutenir un projet ? La plateforme InnovonsEnsembleLeFaso
            est ouverte à tous.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/innovons/besoins/deposer"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
            >
              Déposer un besoin
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/innovons/appels"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              Voir les appels ouverts
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer IE ────────────────────────────────────────────────────────── */}
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
                <li><Link href="/innovons/besoins" className="transition-colors hover:text-white">{tf("link_catalog")}</Link></li>
                <li><Link href="/innovons/appels" className="transition-colors hover:text-white">{tf("link_calls")}</Link></li>
                <li><Link href="/innovons/conference" className="transition-colors hover:text-white">{tf("link_conference")}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-white">{tf("contact")}</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2"><Mail className="size-4 shrink-0 text-secondary-500" aria-hidden="true" /><span>{tf("email")}</span></li>
                <li className="flex items-center gap-2"><Phone className="size-4 shrink-0 text-secondary-500" aria-hidden="true" /><span>{tf("phone")}</span></li>
                <li className="flex items-center gap-2"><MapPin className="size-4 shrink-0 text-secondary-500" aria-hidden="true" /><span>{tf("location")}</span></li>
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
