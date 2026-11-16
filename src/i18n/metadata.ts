import type { Metadata } from "next";
import { conferenceIdentity } from "@/content/conference";
import { LOCALES, LOCALE_TAGS, localize, localizeHref, type Locale, type Tr } from ".";

type PageMeta = { path: string; title?: string; description?: string; image?: { src: string; alt: string | Tr } };

/**
 * Métadonnées d'une page publique : titre, description, adresse canonique
 * dans la langue de la page et versions de chaque langue (hreflang).
 * `path` est le chemin français, sans préfixe (« /about »).
 */
export function pageMetadata(locale: Locale, { path, title, description, image = conferenceIdentity.logo }: PageMeta): Metadata {
  const url = localizeHref(path, locale);
  return {
    ...(title && { title }),
    ...(description && { description }),
    alternates: {
      canonical: url,
      languages: { ...Object.fromEntries(LOCALES.map((l) => [l, localizeHref(path, l)])), "x-default": path },
    },
    openGraph: {
      type: "website",
      siteName: "InnovateBF",
      url,
      locale: LOCALE_TAGS[locale].og,
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => LOCALE_TAGS[l].og),
      ...(title && { title }),
      ...(description && { description }),
      images: [{ url: image.src, alt: localize(image.alt, locale) }],
    },
  };
}
