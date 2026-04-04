import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";

export const dynamic = 'force-dynamic';
import {
  FileText,
  Lightbulb,
  Megaphone,
  CalendarDays,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { IENavbar } from "@/components/innovons/IENavbar";
import { StatsGrid, StatsSkeleton } from "@/components/innovons/StatsGrid";
import { JsonLd } from "@/components/innovons/JsonLd";
import { ORGANIZATION_SCHEMA } from "@/lib/innovons/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "innovons" });
  return {
    title: "InnovonsEnsembleLeFaso | InnovateBF",
    description: t("hero.subtitle"),
    openGraph: {
      title: "InnovonsEnsembleLeFaso | InnovateBF",
      description: t("hero.subtitle"),
      url: "https://innovatebf.org/fr/innovons",
      siteName: "InnovateBF",
      locale: locale === "fr" ? "fr_BF" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "InnovonsEnsembleLeFaso | InnovateBF",
      description: t("hero.subtitle"),
    },
  };
}

// ── Types ────────────────────────────────────────────────────────────────────

interface FeatureCard {
  titleKey: string;
  descKey: string;
  href: string;
  icon: React.ElementType;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function InnovonsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("innovons");

  // Comment ca fonctionne — 4 cartes (Figma page 2)
  const features: FeatureCard[] = [
    {
      titleKey: "how.card1_title",
      descKey: "how.card1_desc",
      href: "/innovons/besoins",
      icon: FileText,
    },
    {
      titleKey: "how.card2_title",
      descKey: "how.card2_desc",
      href: "/innovons/appels",
      icon: Megaphone,
    },
    {
      titleKey: "how.card3_title",
      descKey: "how.card3_desc",
      href: "/innovons/innovation",
      icon: Lightbulb,
    },
    {
      titleKey: "how.card4_title",
      descKey: "how.card4_desc",
      href: "/innovons/conference",
      icon: CalendarDays,
    },
  ];

  const missionPoints = [
    t("mission.point1"),
    t("mission.point2"),
    t("mission.point3"),
  ];

  return (
    <div className="min-h-screen">
      <JsonLd data={ORGANIZATION_SCHEMA} />

      {/* ═══════════════════════════════════════════════════════════════════
          SOUS-NAVIGATION IE  — sticky sous le header InnovateBF
      ═══════════════════════════════════════════════════════════════════ */}
      <IENavbar />

      {/* ═══════════════════════════════════════════════════════════════════
          HERO  — fond tres sombre, typographie massive (Figma p.1)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0D0D0D] px-4 py-28 text-white lg:px-8 lg:py-40">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            {t("hero.title")}
          </h1>
          <p className="mt-6 max-w-2xl text-base text-gray-400 sm:text-lg lg:text-xl">
            {t("hero.subtitle")}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            {/* Bouton outline vert */}
            <Link
              href="/innovons/besoins"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-secondary-400 transition-all hover:border-secondary-400 hover:bg-white/5"
            >
              {t("hero.cta_needs")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            {/* Bouton plein rouge */}
            <Link
              href="/innovons/appels"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#b70011] to-[#dc2626] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {t("hero.cta_calls")}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          STATS — KI (Key Impact) — Server component avec Suspense
          PRD : KI-F01 grille 5 cols, KI-F02 responsive, KI-F05 cache 5min
      ═══════════════════════════════════════════════════════════════════ */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatsGrid />
      </Suspense>

      {/* ═══════════════════════════════════════════════════════════════════
          MISSION  (Figma p.1-2 : texte gauche + image droite)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Colonne gauche */}
            <div>
              <span className="inline-block rounded-full bg-secondary-100 px-4 py-1.5 text-xs font-semibold text-secondary-700">
                {t("mission.badge")}
              </span>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-gray-900 lg:text-4xl">
                {t("mission.title")}
              </h2>
              <p className="mt-4 text-gray-600">{t("mission.body")}</p>

              {/* 3 points cles avec icone CheckCircle vert */}
              <ul className="mt-6 space-y-4" role="list">
                {missionPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle
                      className="mt-0.5 size-5 shrink-0 text-secondary-600"
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-relaxed text-gray-700">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colonne droite — illustration mission */}
            <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
              <img
                src="/mission-innovation.svg"
                alt="Communauté burkinabè innovant ensemble — énergie solaire, numérique et collaboration"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          COMMENT CA FONCTIONNE  (Figma p.2 — 4 feature cards)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* En-tete centre */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 lg:text-4xl">
              {t("how.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-500">
              {t("how.subtitle")}
            </p>
          </div>

          {/* Grille 4 cartes */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ titleKey, descKey, href, icon: Icon }) => (
              <div
                key={titleKey}
                className="flex flex-col rounded-xl bg-white p-6 shadow-[0_20px_40px_rgba(25,28,29,0.05)] transition-shadow hover:shadow-[0_20px_40px_rgba(25,28,29,0.10)]"
              >
                {/* Carre vert avec icone blanc (Figma) */}
                <div className="flex size-11 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-500">
                  <Icon
                    className="size-5 text-white"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {t(titleKey)}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">
                  {t(descKey)}
                </p>
                <Link
                  href={href}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-secondary-600 transition-colors hover:text-secondary-700"
                >
                  {t("how.learn_more")}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA  — Rejoignez le mouvement (Figma p.2-3, fond sombre)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0D0D0D] py-20 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
          <h2 className="text-3xl font-bold lg:text-4xl">
            {t("cta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            {t("cta.subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/innovons/besoins/deposer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-secondary-400 transition-all hover:border-secondary-400 hover:bg-white/5"
            >
              {t("cta.deposit")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/innovons/inscription"
              className="inline-flex rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:from-primary-700 hover:to-primary-600"
            >
              {t("cta.register")}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          IE FOOTER  (Figma p.3 — fond marine, 3 colonnes)
      ═══════════════════════════════════════════════════════════════════ */}
      <footer
        className="bg-[#111827] py-12 text-gray-400"
        aria-label="Pied de page InnovonsEnsembleLeFaso"
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-3">
            {/* Branding */}
            <div>
              <div className="flex items-center gap-2">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-500 text-sm font-black text-white">
                  IE
                </div>
                <span className="font-bold text-white">
                  InnovonsEnsembleLeFaso
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed">
                {t("footer.tagline")}
              </p>
            </div>

            {/* Liens rapides */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-white">
                {t("footer.quick_links")}
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/innovons/besoins"
                    className="transition-colors hover:text-white"
                  >
                    {t("footer.link_catalog")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/innovons/appels"
                    className="transition-colors hover:text-white"
                  >
                    {t("footer.link_calls")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/innovons/conference"
                    className="transition-colors hover:text-white"
                  >
                    {t("footer.link_conference")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-white">
                {t("footer.contact")}
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="size-4 shrink-0 text-secondary-500" aria-hidden="true" />
                  <span>{t("footer.email")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="size-4 shrink-0 text-secondary-500" aria-hidden="true" />
                  <span>{t("footer.phone")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 text-secondary-500" aria-hidden="true" />
                  <span>{t("footer.location")}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs">
            {t("footer.copyright")}
          </div>
        </div>
      </footer>
    </div>
  );
}
