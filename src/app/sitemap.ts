import type { MetadataRoute } from "next";
import { LOCALES, localizeHref } from "@/i18n";
import { PUBLIC_PATHS, SITE_URL } from "@/lib/site";

/** Plan du site : chaque page dans les deux langues, reliées entre elles (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (p: string) => new URL(p, SITE_URL).toString();
  return PUBLIC_PATHS.flatMap((path) => {
    const languages = { ...Object.fromEntries(LOCALES.map((l) => [l, url(localizeHref(path, l))])), "x-default": url(path) };
    return LOCALES.map((l) => ({ url: url(localizeHref(path, l)), changeFrequency: "weekly" as const, alternates: { languages } }));
  });
}
