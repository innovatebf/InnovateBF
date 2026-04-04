import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  Lightbulb,
  Users,
  Calendar,
  Heart,
  CalendarDays,
  BarChart3,
} from "lucide-react";

const domainIcons = {
  analysis: Lightbulb,
  platform: Users,
  conference: Calendar,
  contribute: Heart,
  calendar: CalendarDays,
  observatory: BarChart3,
};

const domains = [
  "analysis",
  "platform",
  "conference",
  "contribute",
  "calendar",
  "observatory",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return {
    title: t("domains_title"),
    description: t("domains_subtitle"),
  };
}

export default async function DomainsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tDomains = await getTranslations("domains");

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Page header */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            {t("domains_title")}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {t("domains_subtitle")}
          </p>
        </div>

        {/* Domains grid */}
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3">
          {domains.map((domain) => {
            const Icon = domainIcons[domain];
            return (
              <Link
                key={domain}
                href={domain === "platform" ? "/innovons" : domain === "conference" ? "/innovons/conference" : domain === "observatory" ? "/innovons/observatoire" : `/domains/${domain}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white p-8 shadow-md ring-1 ring-gray-200 transition-all hover:shadow-xl hover:ring-primary-500"
              >
                <div className="mb-6 inline-flex size-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                  <Icon className="size-6" />
                </div>

                <h2 className="text-xl font-semibold text-gray-900 transition-colors group-hover:text-primary-600">
                  {tDomains(`${domain}.title`)}
                </h2>

                <p className="mt-4 flex-1 text-base leading-7 text-gray-600">
                  {tDomains(`${domain}.description`)}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary-600">
                  <span>En savoir plus</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
