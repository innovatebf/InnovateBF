import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { IENavbar } from "@/components/innovons/IENavbar";
import { InscriptionForm } from "@/components/innovons/InscriptionForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "innovons.inscription" });
  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default async function InscriptionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("innovons.inscription");

  return (
    <div className="min-h-screen bg-gray-50">
      <IENavbar />

      <div className="mx-auto max-w-lg px-4 py-12">
        {/* En-tete */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 text-sm font-black text-white">
            IE
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t("subtitle")}
          </p>
        </div>

        {/* Carte formulaire */}
        <div className="rounded-2xl bg-white p-8 shadow-[0_20px_40px_rgba(25,28,29,0.05)]">
          <InscriptionForm />

          <p className="mt-5 text-center text-sm text-gray-500">
            {t("has_account")}{" "}
            <Link
              href="/innovons/connexion"
              className="font-semibold text-primary-600 hover:underline"
            >
              {t("login_link")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
