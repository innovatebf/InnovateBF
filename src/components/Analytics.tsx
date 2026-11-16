"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { stripLocale } from "@/i18n";
import { useLocale } from "@/i18n/client";

/**
 * Mesure d'audience sans cookie : signale chaque page vue au serveur
 * (src/server/analytics.ts). La première page d'une visite porte le site
 * d'origine ; ensuite, la navigation est interne.
 */
function isInternal(referrer: string) {
  try {
    return new URL(referrer).host === location.host;
  } catch {
    return false;
  }
}

export function Analytics() {
  const pathname = usePathname();
  const locale = useLocale();
  const last = useRef<string | null>(null);

  useEffect(() => {
    const path = stripLocale(pathname);
    if (last.current === path || navigator.webdriver) return;
    // Arrivée sur le site : premier affichage, sauf rechargement depuis une page du site (changement de langue)
    const entry = last.current === null && !isInternal(document.referrer);
    last.current = path;
    const body = JSON.stringify({ path, locale, referrer: entry ? document.referrer : "", entry });
    // text/plain : type accepté par sendBeacon sans requête préalable
    const sent = navigator.sendBeacon?.("/api/public/track", new Blob([body], { type: "text/plain" }));
    if (!sent) fetch("/api/public/track", { method: "POST", body, keepalive: true }).catch(() => {});
  }, [pathname, locale]);

  return null;
}
