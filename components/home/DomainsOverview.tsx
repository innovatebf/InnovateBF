import { useTranslations } from "next-intl";
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

export function DomainsOverview() {
  const t = useTranslations("home");
  const tDomains = useTranslations("domains");
  const tCommon = useTranslations("common");

  return (
    <section className="bg-gray-50 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-balance">
            {t("domains_title")}
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 text-pretty">
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
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-200/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-primary-500/50"
              >
                {/* Icon */}
                <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-50 to-secondary-50 text-primary-600 transition-all group-hover:from-primary-600 group-hover:to-secondary-600 group-hover:text-white group-hover:shadow-lg">
                  <Icon className="size-7" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900">
                  {tDomains(`${domain}.title`)}
                </h3>

                {/* Description */}
                <p className="mt-3 flex-1 text-sm leading-6 text-gray-600 text-pretty">
                  {tDomains(`${domain}.short_description`)}
                </p>

                {/* Arrow indicator */}
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary-600">
                  <span>{tCommon("readMore")}</span>
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
    </section>
  );
}
