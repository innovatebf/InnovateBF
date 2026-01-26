import { getTranslations, setRequestLocale } from "next-intl/server";
import { Scale } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });

  return {
    title: `${t("legal")} - InnovateBF`,
    description: "Mentions légales et informations sur InnovateBF",
  };
}

export default async function LegalPage({
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
            <Scale className="size-8" />
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            {t("legal")}
          </h1>
        </div>

        {/* Content */}
        <div className="prose prose-lg mx-auto mt-16">
          <h2>1. Éditeur du site</h2>
          <p>
            <strong>Nom :</strong> InnovateBF
            <br />
            <strong>Email :</strong> contact@innovatebf.org
            <br />
            <strong>Pays :</strong> Burkina Faso
          </p>

          <h2>2. Hébergement</h2>
          <p>
            Ce site est hébergé par Vercel Inc.
            <br />
            Siège social : 340 S Lemon Ave #4133, Walnut, CA 91789, USA
            <br />
            Site web :{" "}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              vercel.com
            </a>
          </p>

          <h2>3. Propriété intellectuelle</h2>
          <p>
            L'ensemble de ce site relève de la législation sur les droits
            d'auteur et la propriété intellectuelle. Tous les droits de
            reproduction sont réservés, y compris pour les documents
            téléchargeables et les représentations iconographiques et
            photographiques.
          </p>

          <h2>4. Limitation de responsabilité</h2>
          <p>
            InnovateBF ne pourra être tenu responsable des dommages directs et
            indirects causés au matériel de l'utilisateur, lors de l'accès au
            site, et résultant soit de l'utilisation d'un matériel ne répondant
            pas aux spécifications indiquées, soit de l'apparition d'un bug ou
            d'une incompatibilité.
          </p>

          <h2>5. Litiges</h2>
          <p>
            Les présentes conditions sont régies par les lois burkinabè et
            toute contestation ou litiges qui pourraient naître de
            l'interprétation ou de l'exécution de celles-ci seront de la
            compétence exclusive des tribunaux du Burkina Faso.
          </p>
        </div>
      </div>
    </div>
  );
}
