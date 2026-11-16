import type { Metadata } from "next";
import { PageHero, Prose, Section } from "@/components/ui";
import { LOCALE_COOKIE, translator } from "@/i18n";
import { pageMetadata } from "@/i18n/metadata";
import { resolveLocale, type LocaleParams } from "@/i18n/server";
import { getPublicContent } from "@/server/content/repository";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  return pageMetadata(locale, {
    path: "/privacy",
    title: t("Politique de confidentialité", "Privacy policy"),
    description: t("Politique de confidentialité du site innovatebf.org.", "Privacy policy for the innovatebf.org website."),
  });
}

// Contenu repris du site innovatebf.org actuel, complété par la mesure d'audience et le cookie de langue (section 4)
export default async function PrivacyPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  const { site } = (await getPublicContent(locale)).settings;
  return (
    <>
      <PageHero
        label={t("Informations légales", "Legal information")}
        crumbs={[{ href: "/privacy", label: t("Politique de confidentialité", "Privacy policy") }]}
        title={t("Politique de confidentialité", "Privacy policy")}
        lead={t("Dernière mise à jour : 27 octobre 2026.", "Last updated: October 27, 2026.")}
      />
      <Section label={t("Politique de confidentialité", "Privacy policy")}>
        <Prose>
          <h2>{t("1. Collecte des données", "1. Data collection")}</h2>
          <p>
            {t(
              "InnovateBF collecte uniquement les données nécessaires au bon fonctionnement de ses services. Nous nous engageons à respecter votre vie privée et à protéger vos données personnelles.",
              "InnovateBF collects only the data necessary for its services to work properly. We are committed to respecting your privacy and protecting your personal data.",
            )}
          </p>
          <h2>{t("2. Utilisation des données", "2. Use of data")}</h2>
          <p>
            {t(
              "Les données collectées via nos formulaires de contact et de candidature sont utilisées uniquement pour répondre à vos demandes et améliorer nos services. Nous ne partageons pas vos données avec des tiers.",
              "Data collected through our contact and application forms is used only to respond to your requests and improve our services. We do not share your data with third parties.",
            )}
          </p>
          <h2>{t("3. Cookies", "3. Cookies")}</h2>
          <p>
            {t(
              "Notre site utilise des cookies essentiels pour son fonctionnement. Aucun cookie de tracking publicitaire n'est utilisé.",
              "Our site uses cookies that are essential to its operation. No advertising tracking cookies are used.",
            )}
          </p>
          <h2>{t("4. Mesure d'audience et cookie de langue", "4. Audience measurement and language cookie")}</h2>
          <p>
            {t(
              "Afin de mieux connaître la fréquentation du site, nous mesurons son audience sans cookie. Pour chaque page consultée, nous enregistrons uniquement :",
              "To better understand traffic on the site, we measure its audience without using cookies. For each page viewed, we record only:",
            )}
          </p>
          <ul>
            <li>{t("l'adresse de la page, sans ses éventuels paramètres ;", "the page address, without any query parameters;")}</li>
            <li>{t("la langue de la page ;", "the page language;")}</li>
            <li>
              {t(
                "le nom de domaine du site d'où vous venez, si vous arrivez depuis un autre site ;",
                "the domain name of the site you came from, if you arrived from another site;",
              )}
            </li>
            <li>
              {t(
                "le type d'appareil (mobile, tablette ou ordinateur), déduit de votre navigateur ;",
                "the type of device (mobile, tablet or computer), inferred from your browser;",
              )}
            </li>
            <li>
              {t(
                "le pays, déduit de votre adresse IP par notre hébergeur (Vercel).",
                "the country, inferred from your IP address by our hosting provider (Vercel).",
              )}
            </li>
          </ul>
          <p>
            {t(
              "Votre adresse IP n'est jamais enregistrée. Pour compter les visiteurs uniques de chaque jour, le serveur calcule un identifiant pseudonyme par hachage (SHA-256) de votre adresse IP, des caractéristiques de votre navigateur (user agent) et d'une valeur aléatoire renouvelée chaque jour, puis supprimée le lendemain. Cet identifiant ne permet pas de vous reconnaître d'un jour à l'autre et, une fois la valeur aléatoire supprimée, il ne peut plus être rapproché de votre adresse IP.",
              "Your IP address is never stored. To count unique visitors each day, the server computes a pseudonymous identifier by hashing (SHA-256) your IP address, your browser's user agent and a random value that is regenerated every day and deleted the next day. This identifier cannot be used to recognize you from one day to the next and, once the random value has been deleted, it can no longer be linked to your IP address.",
            )}
          </p>
          <p>
            {t(
              "Cette mesure n'utilise ni cookie ni stockage dans votre navigateur. Les données ne sont jamais utilisées à des fins publicitaires ni partagées avec des tiers. Conservées 13 mois, elles servent uniquement à établir des statistiques globales (nombre de visiteurs, pages vues, provenance des visites, appareils, langues et pays), consultables dans l'espace d'administration du site. Les visites des robots (moteurs de recherche, etc.) ne sont pas comptées.",
              "This measurement uses no cookies and stores nothing in your browser. The data is never used for advertising or shared with third parties. It is kept for 13 months and used only to produce aggregate statistics (number of visitors, page views, traffic sources, devices, languages and countries), available in the site's administration area. Visits from bots (search engines, etc.) are not counted.",
            )}
          </p>
          <p>
            {t(
              `Enfin, si vous choisissez FR ou EN dans le sélecteur de langue, ce choix est mémorisé pendant un an dans un cookie fonctionnel nommé ${LOCALE_COOKIE}. Il sert uniquement à ouvrir le site dans la langue choisie.`,
              `Finally, if you select FR or EN in the language switcher, your choice is stored for one year in a functional cookie named ${LOCALE_COOKIE}. This cookie is used only to open the site in the language you chose.`,
            )}
          </p>
          <h2>{t("5. Vos droits", "5. Your rights")}</h2>
          <p>
            {t(
              "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Contactez-nous à",
              "In accordance with the GDPR, you have the right to access, rectify and delete your personal data. Contact us at",
            )}{" "}
            <a href={`mailto:${site.email}`}>
              {site.email}
            </a>{" "}
            {t("pour exercer ces droits.", "to exercise these rights.")}
          </p>
          <h2>{t("6. Sécurité", "6. Security")}</h2>
          <p>
            {t(
              "Nous mettons en œuvre toutes les mesures techniques et organisationnelles nécessaires pour garantir la sécurité de vos données.",
              "We implement all the technical and organizational measures necessary to ensure the security of your data.",
            )}
          </p>
        </Prose>
      </Section>
    </>
  );
}
