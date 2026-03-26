import { getTranslations, setRequestLocale } from "next-intl/server";
import { IENavbar } from "@/components/innovons/IENavbar";
import { NeedsClient } from "@/components/innovons/NeedsClient";
import { getPublishedNeeds } from "@/lib/innovons/queries";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "innovons.besoins" });
  return {
    title: t("page_title"),
    description: t("page_desc"),
  };
}

export default async function BesoinsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("innovons.besoins");
  const needs = await getPublishedNeeds();

  // Compute unique domaines from actual data
  const nbDomaines = new Set(needs.map((n) => n.domaine)).size;

  return (
    <div className="min-h-screen">
      <IENavbar />

      {/* ── Header section ───────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] px-4 py-16 text-white lg:px-8 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            {t("page_title")}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-gray-400 sm:text-lg">
            {t("page_desc")}
          </p>
          <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
            <span className="rounded-full bg-white/10 px-3 py-1">
              {needs.length} {t("besoins_count_label")}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1">
              {nbDomaines} {t("domaines_count_label")}
            </span>
          </div>
        </div>
      </section>

      {/* ── Filterable needs grid ────────────────────────────────────── */}
      <NeedsClient initialNeeds={needs} locale={locale} />
    </div>
  );
}
