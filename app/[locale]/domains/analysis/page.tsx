import { getTranslations, setRequestLocale } from "next-intl/server";
import { DomainPage } from "@/components/domains/DomainPage";
import { Lightbulb } from "lucide-react";

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

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("domains.analysis");
  const tCommon = await getTranslations("common");

  return (
    <DomainPage
      icon={<Lightbulb className="size-8" />}
      title={t("title")}
      description={t("description")}
      backLabel={`← ${tCommon("domains")}`}
    />
  );
}
