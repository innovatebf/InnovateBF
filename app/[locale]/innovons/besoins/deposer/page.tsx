import { getTranslations, setRequestLocale } from "next-intl/server";
import { IENavbar } from "@/components/innovons/IENavbar";
import { NeedStepper } from "@/components/innovons/NeedStepper";
import { FileText } from "lucide-react";
import { requireRole } from "@/lib/auth/guards";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "innovons.deposer" });
  return {
    title: t("page_title"),
    description: t("page_desc"),
  };
}

export default async function DeposerBesoinPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireRole('editor', locale);
  setRequestLocale(locale);
  const t = await getTranslations("innovons.deposer");

  return (
    <div className="min-h-screen">
      <IENavbar />

      {/* Header */}
      <section className="bg-[#0D0D0D] px-4 py-16 text-white lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-600">
              <FileText className="size-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-sm font-medium text-green-400">
              InnovonsEnsembleLeFaso
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            {t("page_title")}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-gray-400 sm:text-lg">
            {t("page_desc")}
          </p>
        </div>
      </section>

      {/* Stepper */}
      <section className="bg-gray-50 px-4 py-10 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-4xl">
          <NeedStepper />
        </div>
      </section>
    </div>
  );
}
