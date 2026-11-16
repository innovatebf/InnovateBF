import type { Metadata } from "next";
import { CallSection } from "@/components/CallSection";
import { ConferenceCountdown } from "@/components/Countdown";
import { PartnersBlock, PatronageBand, PosterBand } from "@/components/ebc";
import { Icon } from "@/components/Icon";
import { socialLinks, SocialLinks } from "@/components/Social";
import { Avatar, Card, Cards, InfoTable, PageHero, pageStyles, Section } from "@/components/ui";
import * as conferenceContent from "@/content/conference";
import { localize, translator } from "@/i18n";
import { Link } from "@/i18n/Link";
import { pageMetadata } from "@/i18n/metadata";
import { resolveLocale, type LocaleParams } from "@/i18n/server";
import { optionLabel, speakerTracks } from "@/lib/content/definitions";
import { delay } from "@/lib/motion";
import { orgLine } from "@/lib/speakers";
import { APPLY_URL, CONFERENCE_BASE, conferenceCountdown, conferenceDates, isCallOpen } from "@/lib/site";
import { getPublicContent } from "@/server/content/repository";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  const { conference } = (await getPublicContent(locale)).settings;
  return pageMetadata(locale, {
    path: CONFERENCE_BASE,
    title: t("Conférence EBC2026", "EBC2026 Conference"),
    description: `${conference.fullName}. ${conferenceDates(conference, locale)}, ${conference.venue}, ${conference.city}.`,
  });
}

export default async function ConferencePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  const { settings, collections } = await getPublicContent(locale);
  const { conference, calendar, conferenceSocial } = settings;
  // Textes fixes de la conférence (src/content/conference.ts), dans la langue de la page
  const { audience, callBlock, conferenceImages, objectives, patronage, poster, prioritySectors, summary, themes, village, youthZone } = localize(
    { ...conferenceContent },
    locale,
  );
  const callOpen = isCallOpen(calendar);
  // Décompte recalculé chez le visiteur (components/Countdown.tsx)
  const countdown = { start: conference.start, end: conference.end, now: Date.now() };
  const speakers = collections.speakers.slice(0, 4);
  const inventors = collections.inventors;
  // Réseaux d'EBC2026 renseignés dans le back-office : sans aucun compte, pas de bloc « Suivez »
  const hasSocial = socialLinks(conferenceSocial).length > 0;

  return (
    <>
      <PageHero
        label={`${conference.edition} · Embedded Bobo Conference`}
        crumbs={[{ href: CONFERENCE_BASE, label: t("Conférence EBC2026", "EBC2026 Conference") }]}
        title={t("L'innovation technologique et", "Technological innovation and")}
        highlight={t("le développement endogène", "endogenous development")}
        lead={t(
          `${conference.fullName}, organisée par le ${conference.organizer} au ${conference.venue}, à ${conference.city}.`,
          `${conference.fullName}, organized by ${conference.organizer}, at ${conference.venue}, ${conference.city}.`,
        )}
        actions={
          <>
            <Link href={`${CONFERENCE_BASE}/programme`} className="btn btn-primary">
              {t("Voir le programme", "View the program")}
              <Icon name="arrow" className="size-[1.1em]" strokeWidth={2.2} />
            </Link>
            {callOpen ? (
              <Link href={APPLY_URL} className="btn btn-line">
                {t("Soumettre un projet", "Submit a project")}
              </Link>
            ) : (
              <a href={conference.mapsUrl} target="_blank" rel="noopener" className="btn btn-line">
                {t("Itinéraire", "Directions")}
                <Icon name="arrow-up-right" className="size-4" />
              </a>
            )}
          </>
        }
        stats={[
          { value: t("2 jours", "2 days"), label: conferenceDates(conference, locale) },
          { value: String(collections.stands.length), label: t("stands d'exposition", "exhibition booths") },
          { value: String(inventors.length), label: t("inventeurs en compétition", "competing inventors") },
        ]}
        photo={{ ...conferenceImages.speaker, position: "60% 30%" }}
        chips={
          conferenceCountdown(conference, countdown.now)
            ? [{ icon: "clock", title: <ConferenceCountdown {...countdown} part="value" />, text: <ConferenceCountdown {...countdown} part="label" /> }]
            : undefined
        }
        aside={
          <InfoTable
            logo={{ src: conference.logo.src, alt: conference.logo.alt, width: 560, height: 218 }}
            rows={[
              { icon: "calendar", term: "Dates", value: conferenceDates(conference, locale) },
              { icon: "pin", term: t("Lieu", "Venue"), value: `${conference.venue}, ${conference.city}` },
            ]}
          />
        }
      />

      <PatronageBand label={patronage.label} items={patronage.items} />

      <PosterBand poster={poster} conference={conference} />

      <Section
        label={t("La conférence en bref", "The conference at a glance")}
        title={t("Le rendez-vous du génie technologique burkinabè.", "The meeting point for Burkinabè technological talent.")}
        intro={summary[0]}
      >
        <p className={pageStyles.bodyText} style={{ marginTop: 0, marginBottom: 36 }} data-reveal>
          {summary[1]}
        </p>
        <Cards cols={3}>
          <Card
            index={0}
            icon="trophy"
            accent="orange"
            kicker={t("Objectifs", "Objectives")}
            title={t("Ce que vise la conférence", "What the conference aims to achieve")}
            list={objectives}
          />
          <Card index={1} icon="grid" kicker={t("Six axes thématiques", "Six thematic areas")} title={t("Les thèmes abordés", "Topics covered")} list={themes}>
            <span className={pageStyles.cardText}>{t(`Secteurs prioritaires : ${prioritySectors}`, `Priority sectors: ${prioritySectors}`)}</span>
          </Card>
          <Card
            index={2}
            icon="users"
            accent="green"
            kicker={t("Public", "Audience")}
            title={t("À qui s'adresse EBC2026", "Who EBC2026 is for")}
            text={audience}
          />
        </Cards>
      </Section>

      <Section
        label={t("Expositions", "Exhibitions")}
        title={village.title}
        intro={village.text}
        more={{ href: `${CONFERENCE_BASE}/expositions`, label: t("Tous les stands", "All booths") }}
        grey
      >
        <Cards cols={3}>
          {village.spaces.map((sp, i) => (
            <Card key={sp.title} index={i} icon={sp.icon} accent={(["blue", "green", "orange", "navy"] as const)[i % 4]} title={sp.title} text={sp.text} />
          ))}
        </Cards>
      </Section>

      <Section
        label={t("Challenge Jeunesse", "Youth Challenge")}
        title={youthZone.title}
        intro={youthZone.text}
        more={{ href: `${CONFERENCE_BASE}/programme`, label: t("Voir le programme", "View the program") }}
      >
        <Cards cols={3}>
          {youthZone.activities.map((a, i) => (
            <Card key={a.title} index={i} icon={a.icon} accent={(["orange", "blue", "green", "navy"] as const)[i % 4]} title={a.title} text={a.text} />
          ))}
        </Cards>
      </Section>

      <Section
        label={speakers.length > 0 && !speakers.some((s) => s.demo) ? t("Intervenants invités", "Invited speakers") : t("Intervenants", "Speakers")}
        title={t("Ils prendront la parole.", "They will take the stage.")}
        intro={
          speakers.length > 0
            ? speakers.some((s) => s.demo)
              ? t(
                  "Chercheurs, entrepreneurs, décideurs et partenaires. Les fiches marquées « Exemple » sont fictives et seront remplacées par les intervenants confirmés.",
                  "Researchers, entrepreneurs, decision-makers and partners. Profiles marked “Example” are fictitious and will be replaced by confirmed speakers.",
                )
              : t(
                  "Chercheurs, entrepreneurs, décideurs et partenaires invités à intervenir lors des sessions d'EBC2026.",
                  "Researchers, entrepreneurs, decision-makers and partners invited to speak at the EBC2026 sessions.",
                )
            : t(
                "Les cinq inventeurs lauréats présentent leurs solutions en pitch. Les sessions réunissent chercheurs, entrepreneurs et partenaires ; les noms sont publiés dès confirmation.",
                "The Top 5 inventors pitch their solutions. The sessions bring together researchers, entrepreneurs and partners; names will be published as soon as they are confirmed.",
              )
        }
        more={{ href: `${CONFERENCE_BASE}/intervenants`, label: t("Tous les intervenants", "All speakers") }}
        grey
      >
        {speakers.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {speakers.map((s, i) => (
              <li key={`${s.name}-${i}`} className={`${pageStyles.panel} flex flex-col items-center text-center`} data-reveal>
                {s.demo && (
                  <span className="mb-3 rounded-full border border-dashed border-ink-3/40 px-2.5 py-0.5 text-[11px] font-semibold text-ink-3">
                    {t("Exemple", "Example")}
                  </span>
                )}
                <Avatar name={s.name} photo={s.photo} size={88} />
                <span className="mt-4 rounded-full bg-faso-tint px-3 py-1 text-[11px] font-bold tracking-wide text-blue uppercase">
                  {optionLabel(speakerTracks, s.track, locale)}
                </span>
                <p className="mt-3 text-[17px] font-bold text-ink">{s.name}</p>
                <p className="mt-1 text-sm text-ink-3">{[s.role, orgLine(s)].filter(Boolean).join(" · ")}</p>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {inventors.map((inv, i) => (
              <li key={inv.project} className={`${pageStyles.panel} flex flex-col items-center text-center`} data-reveal style={delay(i * 70)}>
                <Avatar name={inv.owner} photo={inv.photo} size={72} />
                <p className="mt-4 text-[15.5px] leading-snug font-bold text-ink">{inv.owner}</p>
                <p className="mt-1 text-sm text-ink-3">
                  {inv.project} · {inv.category}
                </p>
                <span className="mt-3 rounded-full bg-[#fde6dc] px-3 py-1 text-[11px] font-bold tracking-wide text-orange uppercase">Pitch</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <CallSection id="appel-conference" block={callBlock} calendar={calendar} />

      <Section label={t("Organisation", "Organization")} title={t("Organisateurs, co-organisateurs et sponsors.", "Organizers, co-organizers and sponsors.")}>
        <PartnersBlock partners={collections.partners} showSponsors />
      </Section>

      <Section
        id="infos"
        label={t("Infos pratiques", "Practical information")}
        title={t(`Venir à ${conference.name}`, `Attending ${conference.name}`)}
        grey
      >
        <ul className="grid gap-5 md:grid-cols-3">
          <li className={`${pageStyles.panel} ${pageStyles.panelNavy}`} data-reveal>
            <p className={pageStyles.panelTitle}>{t(`Rendez-vous à ${conference.city}`, `See you in ${conference.city}`)}</p>
            <p className={pageStyles.panelText}>
              {conferenceDates(conference, locale)} · {conference.hours}
              <br />
              {conference.venue}
            </p>
            <ConferenceCountdown
              {...countdown}
              className="mt-4 inline-flex items-baseline gap-2 rounded-full bg-white/12 px-4 py-2 text-sm text-white/85"
              strongClassName="text-base text-white"
            />
            <a href={conference.mapsUrl} target="_blank" rel="noopener" className="btn btn-line mt-5 border-white/30 bg-transparent text-white shadow-none hover:border-white">
              {t("Itinéraire", "Directions")}
              <Icon name="arrow-up-right" className="size-4" />
            </a>
          </li>
          <li className={pageStyles.panel} data-reveal style={delay(80)}>
            <p className={pageStyles.panelTitle}>{t("Au programme", "On the program")}</p>
            <p className={pageStyles.panelText}>
              {t(
                `Sessions thématiques, pitchs des Top 5 Inventeurs, Challenge Jeunesse, cérémonie des Awards et ${collections.stands.length} stands d'exposition.`,
                `Thematic sessions, Top 5 Inventors pitches, the Youth Challenge, the awards ceremony and ${collections.stands.length} exhibition ${collections.stands.length === 1 ? "booth" : "booths"}.`,
              )}
            </p>
            <Link href={`${CONFERENCE_BASE}/programme`} className="more mt-4">
              {t("Voir le programme", "View the program")}
              <Icon name="arrow" className="size-[1.1em]" strokeWidth={2.2} />
            </Link>
          </li>
          <li className={pageStyles.panel} data-reveal style={delay(160)}>
            <p className={pageStyles.panelTitle}>{t("Une question ?", "Have a question?")}</p>
            <p className={pageStyles.panelText}>
              {t(
                "Partenariat, sponsoring, presse ou participation : l'équipe d'organisation vous répond.",
                "Partnerships, sponsorship, press or attendance: the organizing team is here to help.",
              )}
            </p>
            <Link href="/contact" className="more mt-4">
              {t("Nous contacter", "Contact us")}
              <Icon name="arrow" className="size-[1.1em]" strokeWidth={2.2} />
            </Link>
          </li>
        </ul>
        {hasSocial && (
          <div
            className={`${pageStyles.panel} mt-5 flex flex-col gap-5 md:flex-row md:items-center md:justify-between`}
            data-reveal
            style={delay(240)}
          >
            <div>
              <p className={pageStyles.panelTitle}>{t(`Suivez ${conference.name}`, `Follow ${conference.name}`)}</p>
              <p className={pageStyles.panelText}>
                {t(
                  "Annonces, nouveautés du programme et temps forts de la conférence sur ses comptes officiels.",
                  "Announcements, program updates and highlights from the conference on its official accounts.",
                )}
              </p>
            </div>
            <SocialLinks
              accounts={conferenceSocial}
              owner={conference.name}
              on={t("sur", "on")}
              className="flex flex-wrap gap-2.5 md:shrink-0 [&_a]:inline-flex [&_a]:size-11 [&_a]:items-center [&_a]:justify-center [&_a]:rounded-full [&_a]:bg-sky [&_a]:text-navy [&_a]:transition [&_a]:duration-200 [&_a:hover]:-translate-y-0.5 [&_a:hover]:bg-navy [&_a:hover]:text-white"
            />
          </div>
        )}
      </Section>
    </>
  );
}
