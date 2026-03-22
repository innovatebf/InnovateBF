import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://innovatebf.org";

  // List of all routes (without locale prefix)
  const routes = [
    "",
    "/about",
    "/domains",
    "/domains/analysis",
    "/domains/platform",
    "/domains/conference",
    "/domains/contribute",
    "/domains/calendar",
    "/domains/observatory",
    "/contact",
    "/privacy",
    "/legal",
    "/innovons",
    "/innovons/besoins",
    "/innovons/appels",
    "/innovons/conference",
    "/innovons/observatoire",
  ];

  const locales = ["fr", "en"];

  // Generate sitemap entries for all routes in both locales
  const sitemapEntries = routes.flatMap((route) => {
    return locales.map((locale) => ({
      url: `${baseUrl}${locale === "fr" ? "" : `/${locale}`}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
      priority: route === "" ? 1.0 : route.startsWith("/domains/") ? 0.7 : 0.8,
    }));
  });

  return sitemapEntries;
}
