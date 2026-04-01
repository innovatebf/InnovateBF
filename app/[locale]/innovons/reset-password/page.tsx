import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { IENavbar } from "@/components/innovons/IENavbar";
import { ResetPasswordForm } from "@/components/innovons/ResetPasswordForm";
import { Loader2 } from "lucide-react";

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
            <Suspense
              fallback={
                <div className="flex justify-center py-8">
                  <Loader2 className="size-6 animate-spin text-primary-600" />
                </div>
              }
            >
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
