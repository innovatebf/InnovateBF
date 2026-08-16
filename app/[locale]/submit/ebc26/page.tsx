import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";

export default async function EBC26LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "candidatures" });

  const CATEGORIES = [
    "ia",
    "iot",
    "big_data",
    "embarque_robotique",
    "impact_societal",
    "developpement_endogene",
    "jeune_innovateur",
    "startup_innovante",
    "projet_academique",
  ] as const;

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-[#0D0D0D] px-4 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-[#b70011]/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#dc2626]">
            EBC&apos;26 Awards
          </span>
          <h1 className="text-4xl font-bold lg:text-5xl">{t("appel.titre")}</h1>
          <p className="mt-4 text-gray-400">{t("appel.conference")}</p>
          <p className="mx-auto mt-6 max-w-xl text-gray-300">{t("appel.intro")}</p>
          <p className="mt-2 text-sm text-gray-500">{t("appel.gratuit")}</p>
          <div className="mt-8">
            <Link
              href="/submit/ebc26/soumettre"
              className="inline-flex items-center gap-2 rounded-xl bg-[#b70011] px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#9a0010]"
            >
              {t("appel.cta_soumettre")}
            </Link>
          </div>
        </div>
      </section>

      {/* Award categories */}
      <section className="px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
            {locale === "fr" ? "Catégories Awards" : "Award Categories"}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CATEGORIES.map((c) => (
              <div
                key={c}
                className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700"
              >
                {t(`categories.${c}` as Parameters<typeof t>[0])}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
