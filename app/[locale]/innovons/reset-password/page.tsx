import { getTranslations, setRequestLocale } from "next-intl/server";
import { IENavbar } from "@/components/innovons/IENavbar";
import { ResetPasswordForm } from "@/components/innovons/ResetPasswordForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "innovons.reset_password" });
  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("innovons.reset_password");

  return (
    <div className="min-h-screen bg-gray-50">
      <IENavbar />

      <div className="flex min-h-[calc(100vh-72px-56px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* En-tete */}
          <div className="mb-8 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-green-600 text-sm font-black text-white">
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
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
