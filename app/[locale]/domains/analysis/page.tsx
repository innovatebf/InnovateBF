import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Lightbulb,
  MessageSquare,
  Clock,
  AlertTriangle,
  Wifi,
  GraduationCap,
  Network,
  Cpu,
  BarChart3,
  Radio,
  Bot,
  Database,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "domains.analysis" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

// ── Static data ────────────────────────────────────────────────────────────────

const DEFIS = [
  {
    icon: Network,
    titre: "Fragmentation",
    texte:
      "Initiatives isolées sans coordination réelle. Liaisons faibles entre recherche, formation et secteur privé.",
    color: "from-red-500/10 to-red-500/5 border-red-200",
    iconColor: "text-red-600 bg-red-50",
  },
  {
    icon: GraduationCap,
    titre: "Compétences",
    texte:
      "Déficit critique en IA, systèmes embarqués et IoT. Seulement 5 % de diplômées STEM féminines.",
    color: "from-amber-500/10 to-amber-500/5 border-amber-200",
    iconColor: "text-amber-600 bg-amber-50",
  },
  {
    icon: Wifi,
    titre: "Infrastructure",
    texte:
      "Faible pénétration internet en milieu rural (27 % national). Concentration urbaine des services digitaux.",
    color: "from-blue-500/10 to-blue-500/5 border-blue-200",
    iconColor: "text-blue-600 bg-blue-50",
  },
];

const APPROCHE = [
  {
    step: "01",
    icon: Brain,
    label: "Analyser",
    titre: "Diagnostic de l'écosystème",
    texte:
      "Cartographie des acteurs, identification des besoins sociétaux non couverts et évaluation de la maturité des initiatives technologiques sur le terrain.",
  },
  {
    step: "02",
    icon: Lightbulb,
    label: "Conceptualiser",
    titre: "Structuration des solutions",
    texte:
      "Co-construction de concepts alignés sur les valeurs socio-culturelles burkinabè, priorisation par impact sociétal et faisabilité d'implémentation.",
  },
  {
    step: "03",
    icon: MessageSquare,
    label: "Conseiller",
    titre: "Recommandations actionnables",
    texte:
      "Livrables concrets — note de positionnement, feuille de route technique, brief décisionnel — remis aux structures gouvernementales, privées et académiques.",
  },
];

const EXPERTISES = [
  { icon: Bot, label: "Intelligence Artificielle" },
  { icon: Database, label: "Big Data" },
  { icon: Cpu, label: "Systèmes Embarqués" },
  { icon: Radio, label: "IoT" },
  { icon: BarChart3, label: "Business Intelligence" },
  { icon: Network, label: "Cybersécurité" },
];

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tCommon = await getTranslations("common");

  return (
    <div className="min-h-screen bg-white">

      {/* ═══════════════════════════════════════════════════════════════════
          HERO — le défi des 24 heures
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0D0D0D] px-4 pb-24 pt-16 lg:px-8 lg:pb-32 lg:pt-24">
        {/* Grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-5xl">
          {/* Back link */}
          <Link
            href="/domains"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            {tCommon("domains")}
          </Link>

          {/* Eyebrow */}
          <div className="mt-10 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary-600/20 text-primary-400">
              <Brain className="size-6" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-widest text-primary-400">
              Domaine d'action
            </span>
          </div>

          {/* Title */}
          <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Analyse,{" "}
            <span className="text-primary-400">Concept</span>{" "}
            & Conseil
          </h1>

          {/* Scenario card — "Le Défi" */}
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm lg:p-8">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400">
                <Clock className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  Le défi concret
                </p>
                <blockquote className="mt-3 text-base leading-relaxed text-gray-300 lg:text-lg">
                  Un ministre informe ses Directeurs Généraux qu'il veut
                  budgétiser{" "}
                  <strong className="text-white">10 projets supplémentaires</strong>{" "}
                  dont les résultats seront rapportés au Conseil des Ministres au
                  prochain trimestre, en priorisant les solutions endogènes.
                </blockquote>
                <p className="mt-4 text-sm text-gray-400">
                  Le problème ? Le temps perdu à rassembler, aligner et décider.
                  Ces phases préparatoires seules peuvent durer{" "}
                  <span className="font-semibold text-white">
                    des mois, voire des années.
                  </span>
                </p>
              </div>
            </div>

            {/* KPI badge */}
            <div className="mt-6 inline-flex items-center gap-3 rounded-xl bg-primary-600/20 px-5 py-3">
              <span className="text-3xl font-black text-primary-300">&lt; 24h</span>
              <span className="text-sm leading-snug text-gray-300">
                Notre objectif : identifier les projets candidats et démarrer le
                triage grâce à une{" "}
                <span className="font-semibold text-white">
                  intelligence collective structurée.
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TROIS DÉFIS STRUCTURELS
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 px-4 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 shrink-0 text-amber-500" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">
              Pourquoi agir maintenant
            </h2>
          </div>
          <p className="mt-3 text-3xl font-black tracking-tight text-gray-900 lg:text-4xl">
            Trois défis structurels à résoudre
          </p>
          <p className="mt-4 max-w-2xl text-base text-gray-600">
            Notre analyse de l'écosystème technologique burkinabè révèle trois
            blocages fondamentaux qui freinent l'innovation endogène.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {DEFIS.map(({ icon: Icon, titre, texte, color, iconColor }) => (
              <div
                key={titre}
                className={`rounded-2xl border bg-gradient-to-br p-6 ${color}`}
              >
                <div
                  className={`inline-flex size-11 items-center justify-center rounded-xl ${iconColor}`}
                >
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">{titre}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {texte}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          NOTRE APPROCHE — Analyser → Conceptualiser → Conseiller
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-widest text-primary-600">
            Notre méthodologie
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900 lg:text-4xl">
            De l'analyse à l'action en trois étapes
          </h2>

          <div className="mt-14 space-y-8">
            {APPROCHE.map(({ step, icon: Icon, label, titre, texte }, i) => (
              <div
                key={step}
                className="relative flex flex-col gap-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:flex-row sm:items-start"
              >
                {/* Connector line */}
                {i < APPROCHE.length - 1 && (
                  <div
                    className="absolute -bottom-4 left-[2.75rem] hidden w-px bg-gray-200 sm:block"
                    style={{ height: "2rem" }}
                    aria-hidden="true"
                  />
                )}

                {/* Step badge */}
                <div className="flex shrink-0 flex-col items-center gap-2">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-primary-600 shadow-lg shadow-primary-600/30">
                    <Icon className="size-6 text-white" />
                  </div>
                  <span className="text-xs font-black text-gray-300">{step}</span>
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary-500">
                    {label}
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-gray-900">{titre}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {texte}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          DOMAINES D'EXPERTISE
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0D0D0D] px-4 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-widest text-secondary-400">
            Expertises techniques
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white lg:text-4xl">
            Nos domaines de compétences
          </h2>
          <p className="mt-4 max-w-xl text-base text-gray-400">
            Nos membres couvrent l'ensemble du spectre des technologies
            avancées pour des analyses complètes et croisées.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {EXPERTISES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition-colors hover:bg-white/10"
              >
                <Icon className="size-5 shrink-0 text-secondary-400" />
                <span className="text-sm font-medium text-gray-200">{label}</span>
              </div>
            ))}
          </div>

          {/* Vision quote */}
          <blockquote className="mt-14 border-l-4 border-primary-500 pl-6">
            <p className="text-lg font-medium italic leading-relaxed text-gray-300">
              &ldquo;Un avenir où la technologie et l'innovation, enracinées dans
              nos valeurs socio-culturelles, sont les moteurs du développement
              durable au Burkina Faso.&rdquo;
            </p>
            <footer className="mt-3 text-sm text-gray-500">
              — Vision InnovateBF, Hermann Bayala, Janvier 2026
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black tracking-tight text-gray-900 lg:text-4xl">
            Vous avez un besoin d'analyse ou de conseil ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-gray-600">
            Que vous soyez une structure gouvernementale, une entreprise privée
            ou une institution académique, notre équipe est prête à vous
            accompagner.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/30"
            >
              Nous contacter
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/innovons/besoins/deposer"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-7 py-3.5 text-sm font-bold text-gray-700 transition-all hover:border-primary-300 hover:text-primary-600"
            >
              Déposer un besoin
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
