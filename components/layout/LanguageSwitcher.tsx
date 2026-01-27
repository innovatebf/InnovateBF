"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isChanging, setIsChanging] = useState(false);

  const switchLocale = () => {
    const newLocale = locale === "fr" ? "en" : "fr";
    setIsChanging(true);

    // Utiliser le router de next-intl qui gère automatiquement les locales
    router.replace(
      // @ts-expect-error -- TypeScript will validate that only known `params`
      // are used in combination with a given `pathname`. Since the two will
      // always match for the current route, we can skip runtime checks.
      { pathname, params },
      { locale: newLocale }
    );

    // Reset après une courte animation
    setTimeout(() => setIsChanging(false), 500);
  };

  return (
    <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1">
      <button
        onClick={() => locale === "en" && switchLocale()}
        disabled={isChanging}
        className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-all ${
          locale === "fr"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
        aria-label="Français"
        aria-current={locale === "fr" ? "true" : "false"}
      >
        FR
      </button>
      <button
        onClick={() => locale === "fr" && switchLocale()}
        disabled={isChanging}
        className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-all ${
          locale === "en"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
        aria-label="English"
        aria-current={locale === "en" ? "true" : "false"}
      >
        EN
      </button>
    </div>
  );
}
