import type { Metadata } from "next";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { Avatar, Callout, PageHero, Section, Upcoming } from "@/components/ui";
import { localize, translator } from "@/i18n";
import { kindLabel } from "@/i18n/labels";
import { Link } from "@/i18n/Link";
import { pageMetadata } from "@/i18n/metadata";
import { resolveLocale, type LocaleParams } from "@/i18n/server";
import { optionLabel, speakerTracks } from "@/lib/content/definitions";
import { delay } from "@/lib/motion";
import { conferenceImages } from "@/content/conference";
import { CONFERENCE_BASE, conferenceDay, formatDate, formatTime, formatTimeRange, isExternal, isPitchSession } from "@/lib/site";
import { orgLine, speakersFor, topicMatches } from "@/lib/speakers";
import { getPublicContent } from "@/server/content/repository";
import styles from "./speakers.module.css";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  return pageMetadata(locale, {
    path: `${CONFERENCE_BASE}/intervenants`,
    title: t("Intervenants EBC2026", "EBC2026 Speakers"),
    description: t(
      "Les intervenants de la conférence EBC2026 à Bobo-Dioulasso : intervenants des sessions, chercheurs de CITADEL et pitchs des Top 5 Inventeurs.",
      "Speakers at the EBC2026 conference in Bobo-Dioulasso: session speakers, CITADEL researchers and Top 5 Inventors pitches.",
    ),
  });
}

// Formats du programme où des intervenants prennent la parole (valeurs françaises du back-office)
const STAGE_KINDS = ["Session", "Keynote", "Pitchs", "Compétition", "Talks", "Panel", "Table ronde", "Pitchs étudiants", "Partenaires", "Atelier"];

export default async function SpeakersPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  const { settings, collections } = await getPublicContent(locale);
  const { conference } = settings;
  const images = localize(conferenceImages, locale);
  const speakers = collections.speakers;
  const inventors = collections.inventors;
  const hasDemo = speakers.some((s) => s.demo);
  const pitch = collections.programme.find(isPitchSession);
  const organizers = collections.partners.filter((p) => (p.group === "organisateur" || p.group === "co_organisateur") && p.logo.src);
  // Session du programme de chaque intervenant (d'après le sujet saisi dans le back-office)
  const sessionOf = (topic: string) => collections.programme.find((slot) => topicMatches(topic, slot.key));
  // Qui prend la parole : intervenants du back-office, intervenant saisi au programme, sinon les participants connus
  // Personnes affichées sur une session : intervenants rattachés, sinon les Top Inventeurs pour la session de pitchs
  const peopleFor = (s: (typeof collections.programme)[number]) => {
    const attached = speakersFor(s.key, speakers);
    if (attached.length > 0) return attached.map((sp) => ({ name: sp.name, photo: sp.photo, demo: sp.demo }));
    if (isPitchSession(s) && !s.speaker) return inventors.map((inv) => ({ name: inv.owner, photo: inv.photo, demo: false }));
    return [];
  };
  const whoSpeaks = (s: (typeof collections.programme)[number]) =>
    s.speaker || (s.kind === "Pitchs étudiants" ? t("Équipes étudiantes UNB et BSB", "UNB and BSB student teams") : "");
  // Sessions qui ont des intervenants désignés (la clôture n'en a pas)
  const sessions = collections.programme.filter((s) => STAGE_KINDS.includes(s.kind) && (peopleFor(s).length > 0 || whoSpeaks(s)));
  const dayLabel = (day: string) =>
    formatDate(conferenceDay(conference, Number(day) - 1), { weekday: "long", day: "numeric", month: "long" }, locale);

  return (
    <>
      <PageHero
        label={t("Intervenants", "Speakers")}
        crumbs={[
          { href: CONFERENCE_BASE, label: "EBC2026" },
          { href: `${CONFERENCE_BASE}/intervenants`, label: t("Intervenants", "Speakers") },
        ]}
        title={t("Les voix de", "The voices of")}
        highlight={t("l'innovation endogène", "indigenous innovation")}
        lead={t(
          "Chercheurs, inventeurs, entrepreneurs, décideurs publics et partenaires prennent la parole pendant les deux jours de la conférence.",
          "Researchers, inventors, entrepreneurs, policymakers and partners take the stage over the two days of the conference.",
        )}
        actions={
          <>
            <Link href="/contact" className="btn btn-primary">
              {t("Proposer une intervention", "Propose a talk")}
              <Icon name="arrow" className="size-[1.1em]" strokeWidth={2.2} />
            </Link>
            <Link href={`${CONFERENCE_BASE}/programme`} className="btn btn-line">
              {t("Voir le programme", "View the program")}
            </Link>
          </>
        }
        stats={[
          ...(speakers.length > 0
            ? [{ value: String(speakers.length), label: hasDemo ? t("intervenants (exemples)", "speakers (examples)") : t("intervenants confirmés", "confirmed speakers") }]
            : []),
          { value: String(inventors.length), label: t("inventeurs en pitch", "inventors pitching") },
          { value: String(organizers.length), label: t("structures organisatrices", "organizing bodies") },
          ...(speakers.length > 0 ? [] : [{ value: String(sessions.length), label: t("sessions", "sessions") }]),
        ]}
        photo={{ ...images.speaker, alt: t("Intervenant au pupitre", "Speaker at the podium"), position: "62% 30%" }}
        chips={[
          { icon: "mic", title: t("Sessions thématiques", "Thematic sessions"), text: t("IA, souveraineté numérique, financement", "AI, digital sovereignty, funding") },
          { icon: "trophy", title: t("Top 5 Inventeurs", "Top 5 Inventors"), text: t("cinq pitchs de 8 minutes", "five 8-minute pitches") },
        ]}
      />

      <Section
        label={hasDemo ? t("Intervenants", "Speakers") : t("Intervenants invités", "Invited speakers")}
        title={speakers.length > 0 ? t("Ils prendront la parole.", "They will take the stage.") : undefined}
        intro={
          hasDemo
            ? t(
                "Les fiches marquées « Exemple » sont fictives : elles seront remplacées par les intervenants confirmés.",
                "Profiles marked “Example” are fictitious and will be replaced by confirmed speakers.",
              )
            : undefined
        }
      >
        {speakers.length === 0 ? (
          <Upcoming
            icon="mic"
            title={t("Liste des intervenants à venir", "Speaker list coming soon")}
            text={t(
              "Les intervenants seront présentés ici dès leur confirmation par le comité d'organisation.",
              "Speakers will be featured here as soon as the organizing committee confirms them.",
            )}
          />
        ) : (
          <ul className={styles.grid}>
            {speakers.map((s, i) => {
              // Le sujet est saisi en français : en anglais, intitulé de la session rattachée (sinon le sujet saisi)
              const slot = s.topic ? sessionOf(s.topic) : undefined;
              return (
                <li key={`${s.name}-${i}`} data-reveal style={delay(Math.min(i, 8) * 70)}>
                  <article className={styles.speaker}>
                    {s.demo && <span className={styles.demo}>{t("Exemple", "Example")}</span>}
                    <div className={styles.speakerTop}>
                      <Avatar name={s.name} photo={s.photo} size={96} />
                    </div>
                    <span className={styles.track}>{optionLabel(speakerTracks, s.track, locale)}</span>
                    <h3 className={styles.name}>{s.name}</h3>
                    {s.role && <p className={styles.role}>{s.role}</p>}
                    {orgLine(s) && <p className={styles.org}>{orgLine(s)}</p>}
                    {/* Sujet en anglais : intitulé de la session rattachée, sinon sa version saisie dans le back-office */}
                    {s.topic && <p className={styles.topic}>{t(`« ${s.topic} »`, `“${slot?.title ?? (s.topicEn || s.topic)}”`)}</p>}
                    {slot && (
                      <p className={styles.slot}>
                        <Icon name="calendar" className="size-3.5" />
                        {t(`Jour ${slot.day}`, `Day ${slot.day}`)} · {formatTimeRange(slot.time, slot.end, locale)}
                      </p>
                    )}
                    {s.linkedin && (
                      <a
                        href={s.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.linkedin}
                        aria-label={t(`${s.name} sur LinkedIn`, `${s.name} on LinkedIn`)}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
                          <path d="M6.9 8.8H3.6V20h3.3V8.8zM5.2 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8zM20.4 13.7c0-3.1-1.7-5.1-4.4-5.1-1.6 0-2.6.9-3.1 1.6V8.8H9.7V20H13v-5.9c0-1.5.5-2.8 2-2.8s1.9 1.3 1.9 2.9V20h3.4v-6.3z" />
                        </svg>
                        LinkedIn
                      </a>
                    )}
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      {inventors.length > 0 && (
        <Section
          label={t("Pitchs · Top 5 Inventeurs", "Pitches · Top 5 Inventors")}
          title={t("Cinq inventeurs face au jury et au public.", "Five inventors face the jury and the audience.")}
          intro={
            pitch
              ? t(
                  `Session « ${pitch.title} », ${dayLabel(pitch.day)}, ${formatTimeRange(pitch.time, pitch.end, locale)}.`,
                  `“${pitch.title}” session, ${dayLabel(pitch.day)}, ${formatTimeRange(pitch.time, pitch.end, locale)}.`,
                )
              : t("Les cinq inventions lauréates sont présentées en pitch.", "The Top 5 inventions are pitched on stage.")
          }
          more={{ href: `${CONFERENCE_BASE}/highlights`, label: t("Découvrir les projets", "Discover the projects") }}
          grey
        >
          <ul className={styles.inventors}>
            {inventors.map((inv, i) => (
              <li key={inv.project} data-reveal style={delay(i * 70)}>
                <article className={styles.inventor}>
                  <span className={styles.rank}>{String(i + 1).padStart(2, "0")}</span>
                  <Avatar name={inv.owner} photo={inv.photo} size={64} />
                  <div>
                    <h3 className={styles.inventorName}>{inv.owner}</h3>
                    <p className={styles.inventorProject}>
                      {inv.project}
                      {inv.org && inv.org !== inv.project && <span> · {inv.org}</span>}
                    </p>
                    <p className={styles.inventorPitch}>{inv.pitch}</p>
                    <span className={styles.category}>{inv.category}</span>
                    {inv.link && (
                      <a href={inv.link} target="_blank" rel="noopener noreferrer" className={styles.inventorLink}>
                        {t("Site du projet", "Project website")}
                        <Icon name="arrow-up-right" className="size-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {organizers.length > 0 && (
        <Section
          label={t("Organisation", "Organization")}
          title={t("Ils portent la deuxième édition.", "The organizations behind the second edition.")}
          intro={t(
            "Organisateurs et co-organisateurs animent les sessions, accueillent les stands et accompagnent les projets présentés.",
            "Organizers and co-organizers lead the sessions, host the booths and support the projects on display.",
          )}
        >
          <ul className={styles.orgs}>
            {organizers.map((p, i) => {
              // Logo accompagné de son nom quand le back-office renseigne une légende (ex. LeGuideIA)
              const logo = p.caption ? (
                <span className={styles.orgWithCaption}>
                  <Image src={p.logo.src} alt="" width={120} height={120} className={styles.orgBadge} />
                  <span className={styles.orgCaption}>{p.caption}</span>
                </span>
              ) : (
                <Image src={p.logo.src} alt={p.logo.alt || p.name} width={200} height={90} className={styles.orgLogo} />
              );
              return (
                <li key={p.name} data-reveal="zoom" style={delay(i * 60)}>
                  {p.href ? (
                    <a href={p.href} {...(isExternal(p.href) && { target: "_blank", rel: "noopener noreferrer" })} className={styles.orgTile} title={p.name}>
                      {logo}
                    </a>
                  ) : (
                    <div className={styles.orgTile} title={p.name}>
                      {logo}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {sessions.length > 0 && (
        <Section
          label={t("Prises de parole", "Speaking sessions")}
          title={t("Les sessions.", "The sessions.")}
          intro={t("Les intervenants de chaque session sont annoncés au fil des confirmations.", "Speakers for each session are announced as they are confirmed.")}
          more={{ href: `${CONFERENCE_BASE}/programme`, label: t("Programme complet", "Full program") }}
          grey
        >
          <ul className={styles.sessions}>
            {sessions.map((s, i) => (
              <li key={s.day + s.time} data-reveal style={delay(Math.min(i, 8) * 50)}>
                <article className={`${styles.session} ${s.highlight ? styles.sessionHot : ""}`}>
                  <div className={styles.sessionWhen}>
                    <span className={styles.sessionDay}>{t(`Jour ${s.day}`, `Day ${s.day}`)}</span>
                    <span className={styles.sessionTime}>{formatTime(s.time, locale)}</span>
                    {s.end && <span className={styles.sessionEnd}>– {formatTime(s.end, locale)}</span>}
                  </div>
                  <div>
                    <span className={styles.kind}>{kindLabel(s.kind, locale, s.kindEn)}</span>
                    <h3 className={styles.sessionTitle}>{s.title}</h3>
                    {s.detail && <p className={styles.sessionDetail}>{s.detail}</p>}
                    {peopleFor(s).length > 0 ? (
                      <ul className={styles.sessionPeople}>
                        {peopleFor(s).map((sp) => (
                          <li key={sp.name} className={styles.sessionPerson}>
                            <Avatar name={sp.name} photo={sp.photo} size={30} />
                            <span>
                              {sp.name}
                              {sp.demo && <span className={styles.sessionDemo}>{t(" · exemple", " · example")}</span>}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={styles.sessionSpeaker}>
                        <Icon name="mic" className="size-4" />
                        {whoSpeaks(s)}
                      </p>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section label={t("Participer", "Get involved")}>
        <Callout
          text={t("Vous souhaitez intervenir à EBC2026 ?", "Would you like to speak at EBC2026?")}
          sub={t("Écrivez au comité d'organisation : il reviendra vers vous.", "Write to the organizing committee and they will get back to you.")}
        >
          <Link href="/contact" className="btn btn-primary">
            {t("Proposer une intervention", "Propose a talk")}
            <Icon name="arrow" className="size-[1.1em]" strokeWidth={2.2} />
          </Link>
          <Link href="/contact" className="btn btn-line">
            {t("Nous contacter", "Contact us")}
          </Link>
        </Callout>
      </Section>
    </>
  );
}
