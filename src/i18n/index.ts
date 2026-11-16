/**
 * Langues du site public : français (par défaut, adresses sans préfixe) et
 * anglais (adresses préfixées par /en). Le back-office reste en français.
 *
 * Deux façons d'écrire un texte bilingue :
 * - dans les contenus (src/content, src/lib/site) : tr("Accueil", "Home"),
 *   puis localize(objet, locale) avant l'affichage ;
 * - dans les composants : const t = translator(locale) (ou getT() / useT()),
 *   puis t("Accueil", "Home").
 */

export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

/** Cookie du choix de langue : posé par le sélecteur FR / EN, relu par le middleware. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const isLocale = (v: unknown): v is Locale => LOCALES.includes(v as Locale);

/** Balise de langue (Intl, attribut lang, Open Graph). */
export const LOCALE_TAGS = {
  fr: { intl: "fr-FR", og: "fr_FR", name: "Français" },
  en: { intl: "en-US", og: "en_US", name: "English" },
} as const satisfies Record<Locale, { intl: string; og: string; name: string }>;

/* ---------- Textes bilingues ---------- */

/** Texte en français et en anglais, résolu par localize(). */
export class Tr {
  constructor(
    readonly fr: string,
    readonly en: string,
  ) {}
}

export const tr = (fr: string, en: string) => new Tr(fr, en);

/** Type d'un contenu une fois ses textes bilingues résolus. */
export type Localize<T> = T extends Tr
  ? string
  : T extends (...args: never[]) => unknown
    ? T
    : T extends object
      ? { [K in keyof T]: Localize<T[K]> }
      : T;

/** Remplace chaque texte bilingue (à toute profondeur) par sa version dans la langue demandée. */
export function localize<T>(value: T, locale: Locale): Localize<T> {
  if (value instanceof Tr) return value[locale] as Localize<T>;
  if (Array.isArray(value)) return value.map((v) => localize(v, locale)) as Localize<T>;
  if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, localize(v, locale)])) as Localize<T>;
  }
  return value as Localize<T>;
}

export type Translate = (fr: string, en: string) => string;

/** t("Accueil", "Home") : le texte de la langue de la page. */
export const translator =
  (locale: Locale): Translate =>
  (fr, en) =>
    locale === "en" ? en : fr;

/* ---------- Adresses ---------- */

// Chemins hors site public (API, back-office, fichiers) : jamais préfixés
const UNPREFIXED = /^\/(api|admin|media|_next)(\/|$)/;

/** Ajoute le préfixe /en aux liens internes du site public (« /about » → « /en/about »). */
export function localizeHref(href: string, locale: Locale) {
  if (locale === DEFAULT_LOCALE || !href.startsWith("/") || href.startsWith("//")) return href;
  const cut = href.search(/[?#]/);
  const path = cut === -1 ? href : href.slice(0, cut);
  const suffix = cut === -1 ? "" : href.slice(cut);
  if (UNPREFIXED.test(path) || /\.[a-z0-9]+$/i.test(path) || /^\/(en|fr)(\/|$)/.test(path)) return href;
  return `/${locale}${path === "/" ? "" : path}${suffix}`;
}

/** Chemin sans préfixe de langue : « /en/about » → « /about ». */
export function stripLocale(pathname: string) {
  const m = pathname.match(/^\/(fr|en)(?=\/|$)/);
  return m ? pathname.slice(m[0].length) || "/" : pathname;
}

/** Même page dans une autre langue. */
export const switchLocaleHref = (pathname: string, target: Locale) => localizeHref(stripLocale(pathname), target);
