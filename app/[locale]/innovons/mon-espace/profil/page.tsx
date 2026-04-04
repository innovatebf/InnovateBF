import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/innovons/user-queries";
import { ProfilForm } from "@/components/innovons/ProfilForm";

export const dynamic = 'force-dynamic';

export default async function ProfilPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "innovons.mon_espace" });

  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <Link
              href="/innovons/mon-espace"
              className="hover:text-[#16a34a]"
            >
              {t("nav_dashboard")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-gray-900">{t("profil_title")}</li>
        </ol>
      </nav>

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900">{t("profil_title")}</h1>

      {/* Form */}
      {user && (
        <ProfilForm
          initialData={{
            full_name: user.name,
            organisation: user.organisation ?? "",
            bio: user.bio ?? "",
            role: user.role,
            avatar_url: user.avatar_url,
          }}
        />
      )}
    </div>
  );
}
