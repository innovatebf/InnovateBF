import type { Metadata } from "next";
import { CallCountdown } from "@/components/Countdown";
import { Icon } from "@/components/Icon";
import { InfoTable, PageHero, pageStyles, Section, Split, Upcoming } from "@/components/ui";
import { callContent } from "@/content/conference";
import { localize, translator } from "@/i18n";
import { Link } from "@/i18n/Link";
import { pageMetadata } from "@/i18n/metadata";
import { resolveLocale, type LocaleParams } from "@/i18n/server";
import { CandidatureForm } from "./CandidatureForm";
import { APPLY_URL, CONFERENCE_BASE, formatDate, formatTime, isCallOpen } from "@/lib/site";
import { storageEnabled } from "@/server/storage-config";
import { getPublicContent } from "@/server/content/repository";

const long = { day: "numeric", month: "long", year: "numeric" } as const;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  const { calendar } = (await getPublicContent(locale)).settings;
  const closes = formatDate(calendar.callCloses, long, locale);
  return pageMetadata(locale, {
    path: APPLY_URL,
    title: t("Déposer ma candidature · EBC'26", "Submit your application · EBC'26"),
    description: t(
      `Formulaire de candidature au concours EBC'26. Clôture des candidatures le ${closes}.`,
      `Application form for the EBC'26 competition. Applications close on ${closes}.`,
    ),
  });
}

export default async function CandidaterPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  const { site, calendar } = (await getPublicContent(locale)).settings;
  const call = localize(callContent, locale);
  const open = isCallOpen(calendar);
  // Jours restants recalculés chez le visiteur (components/Countdown.tsx)
  const left = { closes: calendar.callCloses, now: Date.now() };
  const closes = formatDate(calendar.callCloses, long, locale);
  // « 31 octobre 2026 à 23 h 59 » (« October 31, 2026 at 23:59 »)
  const deadline = t(`${closes} à ${formatTime("23:59", locale)}`, `${closes}, at ${formatTime("23:59", locale)}`);
  const stepCount = call.steps.length;
  return (
    <>
      <PageHero
        label={t("Candidature Projets EBC'26", "EBC'26 project application")}
        crumbs={[
          { href: CONFERENCE_BASE, label: "EBC2026" },
          { href: `${CONFERENCE_BASE}/appel-a-contributions`, label: t("Appel à contributions", "Call for contributions") },
          { href: APPLY_URL, label: t("Déposer ma candidature", "Submit your application") },
        ]}
        title={t("Déposer", "Submit")}
        highlight={t("ma candidature", "your application")}
        lead={call.intro}
        actions={
          open ? (
            <>
              <a href="#formulaire" className="btn btn-primary">
                {t("Commencer", "Get started")}
                <Icon name="arrow" className="size-[1.1em]" strokeWidth={2.2} />
              </a>
              <Link href={`${CONFERENCE_BASE}/appel-a-contributions`} className="btn btn-line">
                {t("Modalités de l'appel", "Call guidelines")}
              </Link>
            </>
          ) : undefined
        }
        stats={
          open
            ? [
                { value: t(`${stepCount} étapes`, `${stepCount} steps`), label: t("et un récapitulatif", "and a summary") },
                { value: t("Gratuit", "Free"), label: t("individuel ou en équipe", "individuals or teams") },
                { value: <CallCountdown {...left} format="short" />, label: t("avant la clôture", "before the deadline") },
              ]
            : undefined
        }
        aside={
          <InfoTable
            rows={[
              { icon: "check", term: t("Statut", "Status"), value: open ? t("Appel ouvert", "Call open") : t("Appel fermé", "Call closed") },
              { icon: "clock", term: t("Clôture", "Deadline"), value: deadline },
              { icon: "trophy", term: t("Participation", "Participation"), value: t("Gratuite", "Free") },
              { icon: "list", term: t("Durée", "Length"), value: t(`${stepCount} étapes et un récapitulatif`, `${stepCount} steps and a summary`) },
            ]}
          />
        }
      />
      <Section
        id="formulaire"
        label={t("Formulaire", "Form")}
        title={open ? t(`Clôture des candidatures : ${closes}`, `Application deadline: ${closes}`) : undefined}
        intro={open ? t("Les champs marqués d'un astérisque sont obligatoires.", "Fields marked with an asterisk are required.") : undefined}
        grey
      >
        {open ? (
          <Split
            main={<CandidatureForm uploadsEnabled={storageEnabled()} />}
            side={
              <>
                <div className={`${pageStyles.panel} ${pageStyles.panelNavy}`} data-reveal>
                  <p className={pageStyles.panelTitle}><CallCountdown {...left} format="long" /></p>
                  <p className={pageStyles.panelText}>
                    {t(
                      `Clôture le ${deadline}. Après cette date, aucune candidature ne peut être enregistrée.`,
                      `Closes on ${deadline}. After this date, applications can no longer be submitted.`,
                    )}
                  </p>
                </div>

                <div className={pageStyles.panel} data-reveal>
                  <p className={pageStyles.panelTitle}>{t("Avant de commencer", "Before you start")}</p>
                  <ul className="mt-3 grid gap-2.5 text-[14.5px] leading-snug text-ink-2">
                    {[
                      t("Un démonstrateur est obligatoire (vidéo, prototype, lien).", "A demonstrator is required (video, prototype, link)."),
                      call.files,
                      t(
                        "Votre saisie n'est pas enregistrée : gardez l'onglet ouvert jusqu'à l'envoi.",
                        "Your answers are not saved, so keep this tab open until you submit.",
                      ),
                    ].map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span className="mt-0.5 inline-flex size-5 flex-none items-center justify-center rounded-full bg-[#dcf5ec] text-[#069a68]">
                          <Icon name="check" className="size-3" strokeWidth={3} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={pageStyles.panel} data-reveal>
                  <p className={pageStyles.panelTitle}>{t(`Les ${stepCount} étapes`, `The ${stepCount} steps`)}</p>
                  <ol className="mt-3 grid gap-2">
                    {call.steps.map((st, i) => (
                      <li key={st.title} className="flex items-center gap-3 text-[14.5px] text-ink-2">
                        <span className="inline-flex size-7 flex-none items-center justify-center rounded-full bg-faso-tint text-xs font-bold text-blue">
                          {String.fromCharCode(65 + i)}
                        </span>
                        {st.title}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className={pageStyles.panel} data-reveal>
                  <p className={pageStyles.panelTitle}>{t("Une question ?", "Have a question?")}</p>
                  <p className={pageStyles.panelText}>{t("L'équipe d'organisation vous répond par e-mail.", "The organizing team will reply by email.")}</p>
                  <a href={`mailto:${site.email}`} className="more mt-3">
                    <Icon name="mail" className="size-4" />
                    {site.email}
                  </a>
                </div>
              </>
            }
          />
        ) : (
          <Upcoming
            icon="lock"
            title={t("L'appel n'est pas ouvert actuellement.", "The call is not currently open.")}
            text={t(
              `Les candidatures étaient ouvertes du ${formatDate(calendar.callOpens, long, locale)} au ${closes}.`,
              `Applications were open from ${formatDate(calendar.callOpens, long, locale)} to ${closes}.`,
            )}
          />
        )}
      </Section>
    </>
  );
}
