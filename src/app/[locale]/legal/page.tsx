import type { Metadata } from "next";
import { PageHero, Prose, Section } from "@/components/ui";
import { translator } from "@/i18n";
import { pageMetadata } from "@/i18n/metadata";
import { resolveLocale, type LocaleParams } from "@/i18n/server";
import { getPublicContent } from "@/server/content/repository";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  return pageMetadata(locale, {
    path: "/legal",
    title: t("Mentions légales", "Legal notice"),
    description: t("Mentions légales du site innovatebf.org.", "Legal notice for the innovatebf.org website."),
  });
}

// Contenu repris du site innovatebf.org actuel
export default async function LegalPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  const { site } = (await getPublicContent(locale)).settings;
  return (
    <>
      <PageHero
        label={t("Informations légales", "Legal information")}
        crumbs={[{ href: "/legal", label: t("Mentions légales", "Legal notice") }]}
        title={t("Mentions légales", "Legal notice")}
      />
      <Section label={t("Mentions légales", "Legal notice")}>
        <Prose>
          <h2>{t("1. Éditeur du site", "1. Site publisher")}</h2>
          <p>
            {t("Nom :", "Name:")} InnovateBF
            <br />
            {t("E-mail :", "Email:")}{" "}
            <a href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <br />
            {t("Pays :", "Country:")} Burkina Faso
          </p>
          <h2>{t("2. Hébergement", "2. Hosting")}</h2>
          <p>
            {t("Ce site est hébergé par Vercel Inc.", "This site is hosted by Vercel Inc.")}
            <br />
            {t("Siège social :", "Registered office:")} 340 S Lemon Ave #4133, Walnut, CA 91789, USA
            <br />
            {t("Site web :", "Website:")}{" "}
            <a href="https://vercel.com" target="_blank" rel="noopener">
              vercel.com
            </a>
          </p>
          <p>
            {t(
              "Les données du site et les fichiers envoyés (images, pièces jointes des candidatures) sont stockés par Supabase, sur des serveurs situés à Paris (France).",
              "Site data and uploaded files (images, application attachments) are stored by Supabase, on servers located in Paris, France.",
            )}
            <br />
            {t("Site web :", "Website:")}{" "}
            <a href="https://supabase.com" target="_blank" rel="noopener">
              supabase.com
            </a>
          </p>
          <h2>{t("3. Propriété intellectuelle", "3. Intellectual property")}</h2>
          <p>
            {t(
              "L'ensemble de ce site relève de la législation sur les droits d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.",
              "This entire site is subject to copyright and intellectual property law. All reproduction rights are reserved, including for downloadable documents, images and photographs.",
            )}
          </p>
          <h2>{t("4. Limitation de responsabilité", "4. Limitation of liability")}</h2>
          <p>
            {t(
              "InnovateBF ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l'utilisateur, lors de l'accès au site, et résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications indiquées, soit de l'apparition d'un bug ou d'une incompatibilité.",
              "InnovateBF cannot be held liable for any direct or indirect damage to the user's equipment occurring when accessing the site and resulting either from the use of equipment that does not meet the stated specifications or from a bug or an incompatibility.",
            )}
          </p>
          <h2>{t("5. Litiges", "5. Disputes")}</h2>
          <p>
            {t(
              "Les présentes conditions sont régies par les lois burkinabè et toute contestation ou litiges qui pourraient naître de l'interprétation ou de l'exécution de celles-ci seront de la compétence exclusive des tribunaux du Burkina Faso.",
              "These terms are governed by Burkinabè law, and any claim or dispute that may arise from their interpretation or performance shall fall under the exclusive jurisdiction of the courts of Burkina Faso.",
            )}
          </p>
        </Prose>
      </Section>
    </>
  );
}
