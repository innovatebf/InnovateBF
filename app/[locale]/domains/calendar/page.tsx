import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { CalendarDays, ArrowLeft } from "lucide-react";
import { ConferenceList } from "@/components/calendar/ConferenceList";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "domains.calendar" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("domains.calendar");
  const tCommon = await getTranslations("common");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-secondary-600 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/domains"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/90 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            {tCommon("domains")}
          </Link>

          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <CalendarDays className="size-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">{t("title")}</h1>
              <p className="mt-2 text-lg text-white/90">{t("description")}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4 md:w-2/3">
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold">10+</div>
              <div className="text-sm text-white/80">{t("stats.conferences")}</div>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold">7</div>
              <div className="text-sm text-white/80">{t("stats.cities")}</div>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold">2026</div>
              <div className="text-sm text-white/80">{t("stats.year")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <ConferenceList />
        </div>
      </section>
    </div>
  );
}
