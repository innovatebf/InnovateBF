import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://innovatebf.org";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("meta_title"),
      template: "%s - InnovateBF",
    },
    description: t("meta_description"),
    keywords: [
      "InnovateBF",
      "Burkina Faso",
      "technologie",
      "innovation",
      "thinktank",
      "développement",
      "endogène",
    ],
    authors: [{ name: "InnovateBF" }],
    creator: "InnovateBF",
    publisher: "InnovateBF",
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_BF" : "en_US",
      url: siteUrl,
      title: t("meta_title"),
      description: t("meta_description"),
      siteName: "InnovateBF",
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta_title"),
      description: t("meta_description"),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Valider que la locale est supportée
  if (!routing.locales.includes(locale as "fr" | "en")) {
    notFound();
  }

  // Activer le support statique pour cette locale
  setRequestLocale(locale);

  // Récupérer les messages pour cette locale
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
