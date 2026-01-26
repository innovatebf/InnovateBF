import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  ArrowLeft,
  Users,
  Lightbulb,
  TrendingUp,
  Heart,
  CheckCircle,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "domains.platform" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PlatformPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("domains.platform");
  const tCommon = await getTranslations("common");

  return (
    <div className="bg-white">
      {/* Back link */}
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <Link
          href="/domains"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-500"
        >
          <ArrowLeft className="size-4" />
          {tCommon("domains")}
        </Link>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <div className="mx-auto inline-flex size-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
            <Users className="size-10" />
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-100">
            {t("description")}
          </p>
        </div>
      </section>

      {/* Stats Dashboard */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="rounded-xl border-b-4 border-primary-600 bg-white p-6 text-center shadow-md">
              <h3 className="text-4xl font-bold text-gray-900">142</h3>
              <p className="mt-2 text-sm text-gray-600">{t("stats.projects")}</p>
            </div>
            <div className="rounded-xl border-b-4 border-secondary-600 bg-white p-6 text-center shadow-md">
              <h3 className="text-4xl font-bold text-gray-900">56</h3>
              <p className="mt-2 text-sm text-gray-600">{t("stats.experts")}</p>
            </div>
            <div className="rounded-xl border-b-4 border-accent-500 bg-white p-6 text-center shadow-md">
              <h3 className="text-4xl font-bold text-gray-900">10</h3>
              <p className="mt-2 text-sm text-gray-600">{t("stats.domains")}</p>
            </div>
            <div className="rounded-xl border-b-4 border-primary-500 bg-white p-6 text-center shadow-md">
              <h3 className="text-4xl font-bold text-gray-900">03</h3>
              <p className="mt-2 text-sm text-gray-600">{t("stats.pilots")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Piliers Stratégiques */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              {t("pillars.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              {t("pillars.subtitle")}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-white p-8 shadow-md transition-transform hover:-translate-y-1">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                <Users className="size-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                {t("pillars.federate.title")}
              </h3>
              <p className="text-sm text-gray-600">
                {t("pillars.federate.description")}
              </p>
            </div>

            <div className="rounded-xl bg-white p-8 shadow-md transition-transform hover:-translate-y-1">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-secondary-100 text-secondary-600">
                <Lightbulb className="size-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                {t("pillars.train.title")}
              </h3>
              <p className="text-sm text-gray-600">
                {t("pillars.train.description")}
              </p>
            </div>

            <div className="rounded-xl bg-white p-8 shadow-md transition-transform hover:-translate-y-1">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-accent-100 text-accent-700">
                <TrendingUp className="size-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                {t("pillars.finance.title")}
              </h3>
              <p className="text-sm text-gray-600">
                {t("pillars.finance.description")}
              </p>
            </div>

            <div className="rounded-xl bg-white p-8 shadow-md transition-transform hover:-translate-y-1">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                <Heart className="size-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                {t("pillars.contribute.title")}
              </h3>
              <p className="text-sm text-gray-600">
                {t("pillars.contribute.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tableau des Projets */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">
            Projets en Cours
          </h2>

          <div className="overflow-x-auto rounded-xl bg-white shadow-lg">
            <table className="w-full min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    {t("table.problem")}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    {t("table.solution")}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    {t("table.structure")}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    {t("table.maturity")}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    {t("table.needs")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <strong className="text-gray-900">
                      {t("projects_sample.health.problem")}
                    </strong>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {t("projects_sample.health.solution")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {t("projects_sample.health.structure")}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                      {t("projects_sample.health.maturity")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {t("projects_sample.health.needs")}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <strong className="text-gray-900">
                      {t("projects_sample.security.problem")}
                    </strong>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {t("projects_sample.security.solution")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {t("projects_sample.security.structure")}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                      {t("projects_sample.security.maturity")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {t("projects_sample.security.needs")}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <strong className="text-gray-900">
                      {t("projects_sample.agriculture.problem")}
                    </strong>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {t("projects_sample.agriculture.solution")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {t("projects_sample.agriculture.structure")}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                      {t("projects_sample.agriculture.maturity")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {t("projects_sample.agriculture.needs")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Roadmap 2026 */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Impacts */}
            <div>
              <h2 className="mb-8 text-3xl font-bold text-gray-900">
                {t("roadmap.impacts")}
              </h2>

              <div className="space-y-6">
                <div className="rounded-xl bg-white p-6 shadow-md">
                  <div className="mb-3 flex items-center gap-3">
                    <CheckCircle className="size-6 text-secondary-600" />
                    <h3 className="text-lg font-semibold text-secondary-600">
                      {t("roadmap.autonomy.title")}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    {t("roadmap.autonomy.description")}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-md">
                  <div className="mb-3 flex items-center gap-3">
                    <CheckCircle className="size-6 text-secondary-600" />
                    <h3 className="text-lg font-semibold text-secondary-600">
                      {t("roadmap.sovereignty.title")}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    {t("roadmap.sovereignty.description")}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h2 className="mb-8 text-3xl font-bold text-gray-900">
                {t("roadmap.title")}
              </h2>

              <div className="space-y-6">
                <div className="relative border-l-4 border-primary-600 pl-6">
                  <div className="absolute -left-2.5 top-0 size-5 rounded-full bg-primary-600"></div>
                  <p className="text-gray-700">{t("roadmap.q1")}</p>
                </div>

                <div className="relative border-l-4 border-primary-600 pl-6">
                  <div className="absolute -left-2.5 top-0 size-5 rounded-full bg-primary-600"></div>
                  <p className="text-gray-700">{t("roadmap.q2")}</p>
                </div>

                <div className="relative border-l-4 border-primary-600 pl-6">
                  <div className="absolute -left-2.5 top-0 size-5 rounded-full bg-primary-600"></div>
                  <p className="text-gray-700">{t("roadmap.q3")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
