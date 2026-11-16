import { getLocale } from "@/i18n/server";
import { CONFERENCE_BASE, isConferenceAhead } from "@/lib/site";
import { getPublicContent } from "@/server/content/repository";
import { Analytics } from "./Analytics";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { RevealObserver } from "./RevealObserver";

/** Mise en page du site public : en-tête, contenu, pied de page. */
export async function SiteShell({ children }: { children: React.ReactNode }) {
  const locale = getLocale();
  const en = locale === "en";
  const content = await getPublicContent(locale);
  const { conference } = content.settings;
  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        {en ? "Skip to content" : "Aller au contenu"}
      </a>
      <div className="page">
        <Header
          cta={
            isConferenceAhead(conference)
              ? { label: en ? `${conference.name} program` : `Programme ${conference.name}`, href: `${CONFERENCE_BASE}/programme` }
              : { label: en ? "Contact us" : "Nous contacter", href: "/contact" }
          }
        />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <Footer content={content} />
      </div>
      <RevealObserver />
      <Analytics />
    </>
  );
}
