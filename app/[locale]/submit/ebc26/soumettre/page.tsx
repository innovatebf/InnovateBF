import { setRequestLocale, getTranslations } from "next-intl/server";
import { Wizard } from "@/components/candidatures/Wizard";

export default async function EBC26SoumettreePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "candidatures" });

  return (
    <main>
      <div className="border-b border-gray-100 bg-white px-4 py-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-xl font-bold text-gray-900">{t("appel.titre")}</h1>
          <p className="mt-1 text-sm text-gray-500">{t("appel.conference")}</p>
        </div>
      </div>
      <Wizard locale={locale} />
    </main>
  );
}
