import type { Metadata } from "next";
import { ContactForm } from "@/components/forms";
import { Icon } from "@/components/Icon";
import { socialLinks, SocialLinks } from "@/components/Social";
import { InfoTable, PageHero, pageStyles, Section, Split } from "@/components/ui";
import { translator } from "@/i18n";
import { Link } from "@/i18n/Link";
import { pageMetadata } from "@/i18n/metadata";
import { resolveLocale, type LocaleParams } from "@/i18n/server";
import { APPLY_URL, CONFERENCE_BASE, conferenceDates, isCallOpen } from "@/lib/site";
import { getPublicContent } from "@/server/content/repository";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  return pageMetadata(locale, {
    path: "/contact",
    title: t("Contact", "Contact"),
    description: t(
      "Contactez le think tank InnovateBF et l'équipe d'organisation de la conférence EBC2026.",
      "Contact the InnovateBF think tank and the EBC2026 conference organizing team.",
    ),
  });
}

// Icônes rondes des réseaux sociaux (fiche de contact, encadré de la conférence)
const SOCIAL = "flex flex-wrap gap-2 [&_a]:inline-flex [&_a]:size-9 [&_a]:items-center [&_a]:justify-center [&_a]:rounded-full [&_a]:transition [&_a]:duration-200 [&_a:hover]:-translate-y-0.5";

export default async function ContactPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  const { site, conference, calendar, conferenceSocial } = (await getPublicContent(locale)).settings;
  // Réseaux renseignés dans le back-office : sans lien, rien ne s'affiche
  const hasSocial = socialLinks(site).length > 0;
  const hasEbcSocial = socialLinks(conferenceSocial).length > 0;
  const shortcuts = [
    { href: CONFERENCE_BASE, icon: "users", label: t(`Découvrir ${conference.name}`, `Discover ${conference.name}`) },
    isCallOpen(calendar) && { href: APPLY_URL, icon: "trophy", label: t("Déposer une candidature", "Submit an application") },
    { href: `${CONFERENCE_BASE}/programme`, icon: "calendar", label: t("Consulter le programme", "View the program") },
    { href: "/domains/analysis", icon: "compass", label: t("Analyse, Concept et Conseil", "Analysis, Concept and Consulting") },
  ].filter((x): x is { href: string; icon: string; label: string } => Boolean(x));

  return (
    <>
      <PageHero
        label={t("Contact", "Contact")}
        crumbs={[{ href: "/contact", label: t("Contact", "Contact") }]}
        title={t("Parlons de", "Let's talk about")}
        highlight={t("vos projets", "your projects")}
        lead={t(
          "Une question sur InnovateBF, un partenariat, un sponsoring EBC2026 ou une demande presse : écrivez-nous, l'équipe vous répond.",
          "A question about InnovateBF, a partnership, EBC2026 sponsorship or a press inquiry? Write to us and our team will get back to you.",
        )}
        actions={
          <>
            <a href="#message" className="btn btn-primary">
              {t("Écrire un message", "Write a message")}
              <Icon name="arrow" className="size-[1.1em]" strokeWidth={2.2} />
            </a>
            <a href={`mailto:${site.email}`} className="btn btn-line">
              {site.email}
            </a>
          </>
        }
        aside={
          <InfoTable
            rows={[
              {
                icon: "mail",
                term: t("E-mail", "Email"),
                value: (
                  <a href={`mailto:${site.email}`} className="hover:text-blue hover:underline">
                    {site.email}
                  </a>
                ),
              },
              { icon: "pin", term: t("Siège", "Headquarters"), value: site.city },
              { icon: "calendar", term: conference.name, value: `${conferenceDates(conference, locale)}, ${conference.city}` },
              ...(hasSocial
                ? [
                    {
                      icon: "users",
                      term: t("Réseaux sociaux", "Social media"),
                      value: (
                        <SocialLinks
                          accounts={site}
                          owner={site.name}
                          on={t("sur", "on")}
                          iconClassName="size-4"
                          className={`${SOCIAL} mt-1 [&_a]:bg-sky [&_a]:text-navy [&_a:hover]:bg-navy [&_a:hover]:text-white`}
                        />
                      ),
                    },
                  ]
                : []),
            ]}
          />
        }
      />

      <Section
        id="message"
        label={t("Formulaire de contact", "Contact form")}
        title={t("Envoyer un message", "Send a message")}
        intro={t("Tous les champs sont obligatoires.", "All fields are required.")}
      >
        <Split
          main={
            <div className={pageStyles.formCard} data-reveal>
              <ContactForm />
            </div>
          }
          side={
            <>
              <div className={pageStyles.panel} data-reveal>
                <p className={pageStyles.panelTitle}>{t("Écrire directement", "Email us directly")}</p>
                <p className={pageStyles.panelText}>
                  {t(
                    "Pour une pièce jointe ou une demande détaillée, utilisez notre adresse.",
                    "To send an attachment or a detailed request, use our email address.",
                  )}
                </p>
                <a href={`mailto:${site.email}`} className="more mt-4">
                  <Icon name="mail" className="size-4" />
                  {site.email}
                </a>
              </div>

              <div className={`${pageStyles.panel} ${pageStyles.panelNavy}`} data-reveal>
                <p className={pageStyles.panelTitle}>{t(`Conférence ${conference.name}`, `${conference.name} Conference`)}</p>
                <p className={pageStyles.panelText}>
                  {conferenceDates(conference, locale)} · {conference.hours}
                  <br />
                  {conference.venue}, {conference.city}
                </p>
                <a href={conference.mapsUrl} target="_blank" rel="noopener" className="btn btn-line mt-5 border-white/30 bg-transparent text-white shadow-none hover:border-white">
                  {t("Itinéraire", "Directions")}
                  <Icon name="arrow-up-right" className="size-4" />
                </a>
                {hasEbcSocial && (
                  <div className="mt-6 border-t border-white/15 pt-5">
                    <p className="text-sm font-semibold text-white/75">{t(`Suivre ${conference.name}`, `Follow ${conference.name}`)}</p>
                    <SocialLinks
                      accounts={conferenceSocial}
                      owner={conference.name}
                      on={t("sur", "on")}
                      iconClassName="size-4"
                      className={`${SOCIAL} mt-3 [&_a]:bg-white/12 [&_a]:text-white [&_a:hover]:bg-white [&_a:hover]:text-navy`}
                    />
                  </div>
                )}
              </div>

              <div className={pageStyles.panel} data-reveal>
                <p className={pageStyles.panelTitle}>{t("Vous souhaitez plutôt…", "Would you rather…")}</p>
                <ul className="mt-3 grid gap-1">
                  {shortcuts.map((s) => (
                    <li key={s.href}>
                      <Link href={s.href} className="group flex items-center gap-3 rounded-2xl px-2 py-2.5 text-[15px] font-semibold text-ink transition-colors hover:bg-paper-2">
                        <span className="inline-flex size-9 items-center justify-center rounded-full bg-faso-tint text-blue">
                          <Icon name={s.icon} className="size-[18px]" />
                        </span>
                        {s.label}
                        <Icon name="arrow" className="ml-auto size-4 text-ink-3 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          }
        />
      </Section>
    </>
  );
}
