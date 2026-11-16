import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { revealBootScript } from "@/components/RevealObserver";
import { SiteShell } from "@/components/SiteShell";
import { isLocale, LOCALES } from "@/i18n";
import { LocaleProvider } from "@/i18n/client";
import { pageMetadata } from "@/i18n/metadata";
import { resolveLocale, type LocaleParams } from "@/i18n/server";
import { getPublicContent } from "@/server/content/repository";
import { fontVariables } from "../fonts";

// Le décompte J- et le statut de l'appel dépendent de la date : régénération horaire
export const revalidate = 3600;

// Les deux langues sont générées au build (français sans préfixe, anglais sous /en)
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { site } = (await getPublicContent(locale)).settings;
  return {
    ...pageMetadata(locale, { path: "/", description: site.description }),
    title: { default: `${site.name} · ${site.tagline}`, template: `%s · ${site.name}` },
  };
}

export default async function SiteLayout({ children, params }: LocaleParams & { children: React.ReactNode }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = await resolveLocale(params);
  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealBootScript }} />
      </head>
      <body>
        <LocaleProvider locale={locale}>
          <SiteShell>{children}</SiteShell>
        </LocaleProvider>
      </body>
    </html>
  );
}
