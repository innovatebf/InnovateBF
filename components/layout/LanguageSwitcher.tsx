"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const newLocale = locale === "fr" ? "en" : "fr";

    // Construire le nouveau chemin avec la nouvelle locale
    const segments = pathname.split("/").filter(Boolean);

    // Si la première partie est une locale, la remplacer
    if (segments[0] === "fr" || segments[0] === "en") {
      segments[0] = newLocale;
    } else {
      // Si pas de locale dans l'URL (défaut FR), ajouter la nouvelle locale
      if (newLocale !== "fr") {
        segments.unshift(newLocale);
      }
    }

    const newPath = newLocale === "fr" ? `/${segments.slice(1).join("/")}` : `/${segments.join("/")}`;
    router.push(newPath || "/");
  };

  return (
    <button
      onClick={switchLocale}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
      aria-label={locale === "fr" ? "Switch to English" : "Passer en français"}
    >
      <Globe className="size-4" />
      <span>{locale === "fr" ? "EN" : "FR"}</span>
    </button>
  );
}
