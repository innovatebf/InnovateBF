import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { EditNeedForm } from "@/components/innovons/EditNeedForm";
import { getNeedBySlug } from "@/lib/innovons/queries";
import { getServerSession } from "@/lib/auth/server";
import { MOCK_NEEDS } from "@/lib/innovons/mock-data";
import type { Need } from "@/lib/innovons/types";

// Fetch need by ID (try slug match then id match from mock data)
async function getNeedById(id: string): Promise<Need | null> {
  // Try API fetch first
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/innovons/besoins/${id}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return data.need ?? null;
    }
  } catch {
    // fallthrough to mock
  }

  // Fallback: search mock data by id or slug
  return (
    MOCK_NEEDS.find((n) => n.id === id) ??
    MOCK_NEEDS.find((n) => n.slug === id) ??
    null
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "innovons.modifier" });
  return {
    title: t("title"),
  };
}

export default async function ModifierBesoinPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const need = await getNeedById(id);
  if (!need) notFound();

  // Auth & ownership check
  const session = await getServerSession();
  if (!session) {
    redirect(`/${locale}/innovons/connexion`);
  }
  if (need.auteur_email && need.auteur_email !== session.user.email) {
    notFound();
  }

  // Only allow editing BROUILLON or VALIDATION
  if (need.statut !== "BROUILLON" && need.statut !== "VALIDATION") {
    notFound();
  }

  const t = await getTranslations("innovons.modifier");
  const tEspace = await getTranslations("innovons.mon_espace");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <Link
              href="/innovons/mon-espace"
              className="hover:text-green-600"
            >
              {tEspace("nav_dashboard")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href="/innovons/mon-espace/besoins"
              className="hover:text-green-600"
            >
              {tEspace("besoins_title")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-gray-900">{t("breadcrumb")}</li>
        </ol>
      </nav>

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>

      {/* Form */}
      <EditNeedForm need={need} />
    </div>
  );
}
