import { getTranslations, setRequestLocale } from "next-intl/server";
import { Target, Eye, Heart } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Page header */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            {t("title")}
          </h1>
        </div>

        {/* Vision & Mission */}
        <div className="mx-auto mt-16 max-w-4xl space-y-16">
          {/* Vision */}
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex size-16 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <Eye className="size-8" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              {t("vision_title")}
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              {t("vision_text")}
            </p>
          </div>

          {/* Mission */}
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex size-16 items-center justify-center rounded-full bg-secondary-100 text-secondary-600">
              <Target className="size-8" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              {t("mission_title")}
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              {t("mission_text")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
