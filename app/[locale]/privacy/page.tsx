import { getTranslations, setRequestLocale } from "next-intl/server";
import { Shield } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });

  return {
    title: `${t("privacy")} - InnovateBF`,
    description: "Politique de confidentialité et protection des données personnelles - InnovateBF",
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("footer");

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        {/* Page header */}
        <div className="text-center">
          <div className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-primary-100 text-primary-600">
            <Shield className="size-8" />
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            {t("privacy")}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Dernière mise à jour : {new Date().toLocaleDateString(locale)}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg mx-auto mt-16">
          <h2>1. Collecte des données</h2>
          <p>
            InnovateBF collecte uniquement les données nécessaires au bon
            fonctionnement de ses services. Nous nous engageons à respecter
            votre vie privée et à protéger vos données personnelles.
          </p>

          <h2>2. Utilisation des données</h2>
          <p>
            Les données collectées via notre formulaire de contact sont
            utilisées uniquement pour répondre à vos demandes et améliorer nos
            services. Nous ne partageons pas vos données avec des tiers.
          </p>

          <h2>3. Cookies</h2>
          <p>
            Notre site utilise des cookies essentiels pour son fonctionnement.
            Aucun cookie de tracking publicitaire n'est utilisé.
          </p>

          <h2>4. Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez d'un droit d'accès, de
            rectification et de suppression de vos données personnelles.
            Contactez-nous à contact@innovatebf.org pour exercer ces droits.
          </p>

          <h2>5. Sécurité</h2>
          <p>
            Nous mettons en œuvre toutes les mesures techniques et
            organisationnelles nécessaires pour garantir la sécurité de vos
            données.
          </p>
        </div>
      </div>
    </div>
  );
}
