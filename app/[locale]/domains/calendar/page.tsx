import { getTranslations, setRequestLocale } from "next-intl/server";
import { DomainPage } from "@/components/domains/DomainPage";
import { CalendarDays } from "lucide-react";

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
    <DomainPage
      icon={<CalendarDays className="size-8" />}
      title={t("title")}
      description={t("description")}
      backLabel={`← ${tCommon("domains")}`}
    />
  );
}
