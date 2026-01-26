import { getTranslations, setRequestLocale } from "next-intl/server";
import { DomainPage } from "@/components/domains/DomainPage";
import { Calendar } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "domains.conference" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ConferencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("domains.conference");
  const tCommon = await getTranslations("common");

  return (
    <DomainPage
      icon={<Calendar className="size-8" />}
      title={t("title")}
      description={t("description")}
      backLabel={`← ${tCommon("domains")}`}
    />
  );
}
