"use client";

import { createContext, useContext } from "react";
import { DEFAULT_LOCALE, translator, type Locale } from ".";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

/** Langue de la page, transmise aux composants client (posé par app/[locale]/layout.tsx). */
export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => useContext(LocaleContext);

/** t("Accueil", "Home") dans un composant client. */
export const useT = () => translator(useLocale());
