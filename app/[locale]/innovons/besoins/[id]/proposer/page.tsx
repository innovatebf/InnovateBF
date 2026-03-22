import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { IENavbar } from "@/components/innovons/IENavbar";
import { ProposerSolutionForm } from "@/components/innovons/ProposerSolutionForm";
import { getNeedBySlug } from "@/lib/innovons/queries";
import { Link } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const need = await getNeedBySlug(id);
  if (!need) return { title: "Not found" };

  const t = await getTranslations({ locale, namespace: "innovons.proposer" });
  return {
    title: `${t("title")} - ${need.titre}`,
    description: `${t("subtitle")} : ${need.titre}`,
  };
}

export default async function ProposerSolutionPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const need = await getNeedBySlug(id);
  if (!need) notFound();

  const t = await getTranslations("innovons.proposer");

  return (
    <div className="min-h-screen bg-gray-50">
      <IENavbar />

      {/* Header */}
      <section className="bg-[#0D0D0D] px-4 py-10 text-white lg:px-8 lg:py-14">
        <div className="mx-auto max-w-2xl">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/innovons" className="hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/innovons/besoins" className="hover:text-white transition-colors">
                  Besoins
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={`/innovons/besoins/${need.slug}`}
                  className="hover:text-white transition-colors"
                >
                  {need.titre.length > 40
                    ? need.titre.slice(0, 40) + "..."
                    : need.titre}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-white">{t("breadcrumb")}</li>
            </ol>
          </nav>

          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-gray-400">
            {t("subtitle")} :{" "}
            <span className="font-medium text-green-400">{need.titre}</span>
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="px-4 py-8 lg:px-8 lg:py-12">
        <ProposerSolutionForm
          needId={need.id}
          needTitle={need.titre}
          needSlug={need.slug}
        />
      </section>
    </div>
  );
}
