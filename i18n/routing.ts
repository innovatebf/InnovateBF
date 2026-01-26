import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // Liste des locales supportées
  locales: ["fr", "en"],

  // Locale par défaut (français)
  defaultLocale: "fr",

  // Utilise "as-needed" pour que le français n'ait pas de préfixe /fr
  localePrefix: "as-needed",
});

// Export des fonctions de navigation avec type-safety
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
