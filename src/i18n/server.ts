import "server-only";
import { cache } from "react";
import { DEFAULT_LOCALE, isLocale, translator, type Locale } from ".";

/**
 * Langue de la requête en cours, pour les composants serveur.
 * Chaque layout et chaque page l'initialisent avec resolveLocale(params) :
 * Next.js peut les rendre séparément, y compris pendant la génération statique.
 */
const current = cache((): { locale: Locale } => ({ locale: DEFAULT_LOCALE }));

export type LocaleParams = { params: Promise<{ locale: string }> };

export async function resolveLocale(params: LocaleParams["params"]): Promise<Locale> {
  const { locale } = await params;
  const value = isLocale(locale) ? locale : DEFAULT_LOCALE;
  current().locale = value;
  return value;
}

export const getLocale = (): Locale => current().locale;

/** t("Accueil", "Home") dans un composant serveur. */
export const getT = () => translator(getLocale());
