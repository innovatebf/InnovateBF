import Image from "next/image";
import { ConferenceCountdown } from "@/components/Countdown";
import { Icon } from "@/components/Icon";
import { localize, localizeHref, translator } from "@/i18n";
import { Link } from "@/i18n/Link";
import { resolveLocale, type LocaleParams } from "@/i18n/server";
import type { CollectionData } from "@/lib/content/definitions";
import { optionLabel, resourceTags } from "@/lib/content/definitions";
import { delay } from "@/lib/motion";
import {
  APPLY_URL,
  CONFERENCE_BASE,
  conferenceDates,
  formatDate,
  isCallOpen,
  isConferenceAhead,
  isExternal,
  LONG_DATE,
} from "@/lib/site";
import { getPublicContent } from "@/server/content/repository";
import * as home from "@/content/home";
import { FeaturedCarousel } from "./FeaturedCarousel";
import styles from "./landing.module.css";

const SHORT_DATE = { day: "numeric", month: "short", year: "numeric" } as const;

/** En-tête de section : trait orange, intitulé, titre ; texte ou lien à droite. */
function SectionHead({ id, label, title, aside }: { id: string; label: string; title: string; aside?: React.ReactNode }) {
  return (
    <div className={styles.head}>
      <div data-reveal>
        <p className="label">{label}</p>
        <h2 id={id} className={styles.h2}>
          {title}
        </h2>
      </div>
      {aside && (
        <div className={styles.headAside} data-reveal style={delay(120)}>
          {aside}
        </div>
      )}
    </div>
  );
}

function MoreLink({ href, label }: { href: string; label: string }) {
  if (!href || !label) return null;
  return (
    <Link href={href} className={styles.moreLink}>
      {label}
      <Icon name="arrow" className="size-[1.1em]" strokeWidth={2.2} />
    </Link>
  );
}

function PartnerLogo({ partner }: { partner: CollectionData<"partners"> }) {
  const body = partner.caption ? (
    <span className={styles.logoWithCaption}>
      <Image src={partner.logo.src} alt="" width={56} height={56} className={styles.logoEmblem} />
      <span className={styles.logoCaption}>{partner.caption}</span>
    </span>
  ) : (
    <Image src={partner.logo.src} alt={partner.logo.alt || partner.name} width={200} height={90} className={styles.logoImg} />
  );
  return partner.href ? (
    <a href={partner.href} {...(isExternal(partner.href) && { target: "_blank", rel: "noopener noreferrer" })} className={styles.logo} aria-label={partner.name}>
      {body}
    </a>
  ) : (
    <div className={styles.logo} title={partner.name}>
      {body}
    </div>
  );
}

export default async function Home({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = translator(locale);
  const { settings, collections } = await getPublicContent(locale);
  // Textes fixes de l'accueil, dans la langue de la page
  const { cta, ecosystem: eco, eventBlock: event, eventIntro, featured, intro, pillars, programs, programsBlock, resourcesBlock: res, statsBlock } =
    localize({ ...home }, locale);
  const { conference, calendar } = settings;
  const callOpen = isCallOpen(calendar);
  const callCloses = formatDate(calendar.callCloses, LONG_DATE, locale);
  // Formulaire de candidature : lien simple, dans la langue de la page
  const applyHref = localizeHref(APPLY_URL, locale);
  // Jusqu'au dernier jour de la conférence, la une met EBC2026 en avant
  const conferenceAhead = isConferenceAhead(conference);
  const coOrganizers = collections.partners.filter((p) => (p.group === "organisateur" || p.group === "co_organisateur") && p.logo.src);
  // Décompte recalculé chez le visiteur (components/Countdown.tsx)
  const countdown = { start: conference.start, end: conference.end, now: Date.now() };
  const logos = collections.partners.filter((p) => p.showOnHome && p.logo.src);
  const proofLogos = logos.filter((p) => !p.caption).slice(0, 4);
  // Chiffres clés calculés à partir des contenus : toujours exacts
  const conferenceDays = Math.round((Date.parse(conference.end) - Date.parse(conference.start)) / 86_400_000) + 1;
  const plural = conferenceDays > 1 ? "s" : "";
  const stats = [
    { icon: "calendar", value: t(`${conferenceDays} jour${plural}`, `${conferenceDays} day${plural}`), label: t("De conférence et d'expositions", "of conference and exhibitions") },
    { icon: "booth", value: String(collections.stands.length), label: t("Stands d'exposition", "Exhibition booths") },
    { icon: "building", value: String(collections.partners.length), label: t("Organisateurs et partenaires", "Organizers and partners") },
    { icon: "trophy", value: String(collections.inventors.length), label: t("Inventeurs en compétition", "Competing inventors") },
  ].filter((s) => s.value !== "0");

  return (
    <>
      {/* 1. Une : EBC2026 pendant la période de la conférence, puis une habituelle */}
      {conferenceAhead ? (
        <section className={`${styles.hero} ${styles.ebcHero}`} aria-labelledby="titre-une">
          <div className={styles.frame}>
            <div className={styles.ebcGrid}>
              <div className={styles.ebcText}>
                <p className={styles.badge} data-reveal>
                  {t(`Conférence ${conference.name} · ${conference.edition}`, `${conference.name} Conference · ${conference.edition}`)}
                </p>
                <h1 id="titre-une" className={styles.h1} data-reveal style={delay(80)}>
                  <span className="sr-only">
                    {conference.name}, {conference.fullName}.{" "}
                  </span>
                  <span>{eventIntro.title[0]}</span>
                  <span className={styles.tBlue}>{eventIntro.title[1]}</span>
                  <span className={styles.tOrange}>{eventIntro.title[2]}</span>
                </h1>
                <p className={styles.ebcWhen} data-reveal style={delay(140)}>
                  <span>
                    <Icon name="calendar" className="size-[1.1em]" />
                    {conferenceDates(conference, locale)}
                  </span>
                  <span>
                    <Icon name="pin" className="size-[1.1em]" />
                    {conference.venue}, {conference.city}
                  </span>
                </p>
                <p className={styles.heroLead} data-reveal style={delay(180)}>
                  {eventIntro.paragraph}
                </p>
                <div className={styles.heroActions} data-reveal style={delay(230)}>
                  <Link href={eventIntro.primary.href} className="btn btn-primary">
                    {eventIntro.primary.label}
                    <Icon name="arrow" className="size-[1.1em]" strokeWidth={2.2} />
                  </Link>
                  {callOpen ? (
                    <a href={applyHref} className="btn btn-line">
                      {t("Soumettre un projet", "Submit a project")}
                    </a>
                  ) : (
                    <Link href={eventIntro.secondary.href} className="btn btn-line">
                      {eventIntro.secondary.label}
                    </Link>
                  )}
                </div>
                {coOrganizers.length > 0 && (
                  <div className={styles.ebcOrgs} data-reveal style={delay(300)}>
                    <p className={styles.ebcOrgsLabel}>{t("Organisée par", "Organized by")}</p>
                    <ul className={styles.ebcOrgsList}>
                      {coOrganizers.map((p) => (
                        <li key={p.name} className={styles.proofLogo} title={p.name}>
                          {p.href ? (
                            <a href={p.href} {...(isExternal(p.href) && { target: "_blank", rel: "noopener noreferrer" })} className="size-full">
                              <Image src={p.logo.src} alt={p.name} width={64} height={64} />
                            </a>
                          ) : (
                            <Image src={p.logo.src} alt={p.name} width={64} height={64} />
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className={styles.ebcVisual} data-reveal="fade" style={delay(60)}>
                <div className={`${styles.ebcPhoto} settle`}>
                  <Image
                    src="/images/hero-bobo-dioulasso.jpg"
                    alt={t("Monument de Bobo-Dioulasso", "Bobo-Dioulasso monument")}
                    fill
                    priority
                    sizes="(min-width: 1024px) 560px, 90vw"
                    className="object-cover"
                  />
                </div>
                <Link href={CONFERENCE_BASE} className={styles.ebcCard} aria-label={t(`Découvrir la conférence ${conference.name}`, `Discover the ${conference.name} conference`)}>
                  <Image src={conference.logo.src} alt={conference.logo.alt} width={560} height={218} priority className={styles.ebcLogo} />
                  <p className={styles.ebcCardText}>
                    {conference.slogan}
                    <Icon name="arrow" className={styles.ebcCardArrow} strokeWidth={2.2} />
                  </p>
                </Link>
                <ConferenceCountdown {...countdown} className={styles.ebcCountdown} />
              </div>
            </div>
          </div>
        </section>
      ) : (
      <section className={styles.hero} aria-labelledby="titre-une">
        <div className={styles.heroMedia}>
          {intro.image.src && (
            <Image
              src={intro.image.src}
              alt={intro.image.alt}
              fill
              priority
              sizes="(min-width: 1024px) 62vw, 100vw"
              className={styles.heroImg}
            />
          )}
          {intro.script.length > 0 && (
            <p className={styles.script} data-reveal="fade" style={delay(600)}>
              {intro.script.map((l, i) => (
                <span key={i}>{l}</span>
              ))}
            </p>
          )}
        </div>

        <div className={styles.frame}>
          <div className={styles.heroText}>
            {intro.badge && (
              <p className={styles.badge} data-reveal>
                {intro.badge}
              </p>
            )}
            <h1 id="titre-une" className={styles.h1} data-reveal style={delay(80)}>
              <span>{intro.title[0]}</span>
              <span className={styles.tBlue}>{intro.title[1]}</span>
              <span className={styles.tOrange}>{intro.title[2]}</span>
              <span className={styles.tInk}>{intro.title[3]}</span>
            </h1>
            <p className={styles.heroLead} data-reveal style={delay(160)}>
              {intro.paragraph}
            </p>
            <div className={styles.heroActions} data-reveal style={delay(230)}>
              <Link href={intro.primary.href} className="btn btn-primary">
                {intro.primary.label}
                <Icon name="arrow" className="size-[1.1em]" strokeWidth={2.2} />
              </Link>
              <Link href={intro.secondary.href} className="btn btn-line">
                {intro.secondary.label}
              </Link>
            </div>
            <Link href={CONFERENCE_BASE} className={styles.proof} data-reveal style={delay(300)}>
              {proofLogos.length > 0 && (
                <span className={styles.proofLogos} aria-hidden="true">
                  {proofLogos.map((p) => (
                    <span key={p.name} className={styles.proofLogo}>
                      <Image src={p.logo.src} alt="" width={64} height={64} />
                    </span>
                  ))}
                </span>
              )}
              <span>
                <strong className={styles.proofTitle}>
                  {conference.name} · {conference.edition}
                </strong>
                <span className={styles.proofText}>
                  {conferenceDates(conference, locale)}, {conference.city}
                </span>
              </span>
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* 2. Piliers */}
      {pillars.length > 0 && (
        <section className={styles.pillarsWrap} aria-label={t("Nos piliers", "Our pillars")}>
          <ul className={styles.pillars} data-reveal>
            {pillars.map((p, i) => (
              <li key={i} className={styles.pillar}>
                <div className={styles.pillarMedia}>
                  <div className={styles.pillarPhoto}>
                    <Image
                      src={p.image.src}
                      alt={p.image.alt}
                      fill
                      sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 92px"
                      className={styles.pillarImg}
                    />
                  </div>
                  <span className={styles.pillarIcon}>
                    <Icon name={p.icon} className="size-6" strokeWidth={1.9} />
                  </span>
                </div>
                <p className={styles.pillarTitle}>{p.title}</p>
                <p className={styles.pillarText}>{p.text}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 3. À la une */}
      <section className={styles.section} aria-labelledby="titre-une-actu">
        <div className={`${styles.frame} ${styles.featured}`}>
          <div className={styles.featuredText} data-reveal>
            <p className="label">{featured.label}</p>
            <h2 id="titre-une-actu" className={styles.h2}>
              {featured.title}
            </h2>
            <p className={styles.para}>{featured.text}</p>
            {featured.button && (
              <Link href={featured.button.href} className="btn btn-primary">
                {featured.button.label}
                <Icon name="arrow" className="size-[1.1em]" strokeWidth={2.2} />
              </Link>
            )}
          </div>
          <div data-reveal="right" style={delay(120)}>
            <FeaturedCarousel slides={collections.highlights} />
          </div>
        </div>
      </section>

      {/* 4. Conférence EBC2026 : infos pratiques, décompte et statut de l'appel */}
      <section className={styles.sectionTight} aria-labelledby="titre-evenement">
        <div className={styles.frame}>
          <div className={styles.event} data-reveal>
            <div className={styles.eventText}>
              <p className="label">{event.label}</p>
              <h2 id="titre-evenement" className={styles.h2}>
                {event.title}
              </h2>
              <p className={styles.para}>{event.text}</p>
              <div className={styles.eventActions}>
                <Link href={`${CONFERENCE_BASE}/programme`} className="btn btn-primary">
                  {t("Voir le programme", "View the program")}
                  <Icon name="arrow" className="size-[1.1em]" strokeWidth={2.2} />
                </Link>
                {callOpen ? (
                  <a href={applyHref} className="btn btn-line">
                    {t("Soumettre un projet", "Submit a project")}
                  </a>
                ) : (
                  <span className="btn btn-line" aria-disabled="true">
                    {t("Candidatures closes", "Applications closed")}
                  </span>
                )}
              </div>
            </div>
            <div className={styles.eventPanel}>
              <div className={styles.eventTop}>
                {conference.logo.src && (
                  <Image src={conference.logo.src} alt={conference.logo.alt} width={300} height={110} className={styles.eventLogo} />
                )}
                <ConferenceCountdown {...countdown} className={styles.countdown} />
              </div>
              <dl className={styles.facts}>
                <div className={styles.fact}>
                  <Icon name="calendar" className={styles.factIcon} />
                  <dt>Dates</dt>
                  <dd>{conferenceDates(conference, locale)}</dd>
                </div>
                <div className={styles.fact}>
                  <Icon name="pin" className={styles.factIcon} />
                  <dt>{t("Lieu", "Venue")}</dt>
                  <dd>
                    {conference.venue}, {conference.city}
                  </dd>
                </div>
                <div className={styles.fact}>
                  <Icon name="clock" className={styles.factIcon} />
                  <dt>{t("Horaires", "Hours")}</dt>
                  <dd>{conference.hours}</dd>
                </div>
                <div className={styles.fact}>
                  <Icon name="trophy" className={styles.factIcon} />
                  <dt>{t("Appel à projets", "Call for projects")}</dt>
                  <dd>
                    <span className={`${styles.status} ${callOpen ? "" : styles.statusOff}`} aria-hidden="true" />
                    {callOpen ? t(`Ouvert jusqu'au ${callCloses}`, `Open until ${callCloses}`) : t("Candidatures closes", "Applications closed")}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Chiffres clés */}
      {stats.length > 0 && (
        <section className={styles.section} aria-labelledby="titre-chiffres">
          <div className={styles.frame}>
            <SectionHead id="titre-chiffres" label={statsBlock.label} title={statsBlock.title} aside={<p className={styles.para}>{statsBlock.text}</p>} />
            <ul className={styles.stats}>
              {stats.map((s, i) => (
                <li key={i} className={styles.stat} data-reveal style={delay(i * 80)}>
                  <Icon name={s.icon} className={styles.statIcon} strokeWidth={1.7} />
                  <span>
                    <span className={styles.statValue}>{s.value}</span>
                    <span className={styles.statLabel}>{s.label}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 6. Nos programmes */}
      {programs.length > 0 && (
        <section id="programmes" className={styles.section} aria-labelledby="titre-programmes">
          <div className={styles.frame}>
            <SectionHead
              id="titre-programmes"
              label={programsBlock.label}
              title={programsBlock.title}
              aside={<MoreLink href={programsBlock.more.href} label={programsBlock.more.label} />}
            />
            <ul className={styles.cards3}>
              {programs.map((p, i) => {
                const inner = (
                  <>
                    <span className={styles.programMedia}>
                      {p.image.src && (
                        <Image src={p.image.src} alt={p.image.alt} fill sizes="(min-width: 1024px) 400px, 100vw" className={styles.cover} />
                      )}
                    </span>
                    <span className={styles.programBody}>
                      <span className={styles.programSide}>
                        <span className={`${styles.programIcon} ${styles[p.accent]}`}>
                          <Icon name={p.icon} className="size-6" strokeWidth={1.9} />
                        </span>
                        <Icon name="plus" className={styles.programPlus} strokeWidth={2} />
                      </span>
                      <span>
                        <span className={styles.cardTitle}>{p.title}</span>
                        <span className={styles.cardText}>{p.text}</span>
                      </span>
                    </span>
                  </>
                );
                return (
                  <li key={i} data-reveal style={delay(i * 90)}>
                    {p.href ? (
                      <Link href={p.href} className={styles.program}>
                        {inner}
                      </Link>
                    ) : (
                      <div className={styles.program}>{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* 7. Écosystème */}
      {logos.length > 0 && (
        <section className={styles.section} aria-labelledby="titre-ecosysteme">
          <div className={styles.frame}>
            <SectionHead id="titre-ecosysteme" label={eco.label} title={eco.title} aside={<p className={styles.para}>{eco.text}</p>} />
            <div className={styles.logos} data-reveal>
              {logos.map((p) => (
                <PartnerLogo key={p.name} partner={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Ressources */}
      {collections.resources.length > 0 && (
        <section className={styles.section} aria-labelledby="titre-ressources">
          <div className={styles.frame}>
            <SectionHead id="titre-ressources" label={res.label} title={res.title} aside={<MoreLink href={res.more.href} label={res.more.label} />} />
            <ul className={styles.cards3}>
              {collections.resources.map((r, i) => (
                <li key={i} data-reveal style={delay(i * 90)}>
                  <Link href={r.href} className={styles.resource}>
                    <span className={styles.resourceMedia}>
                      {r.image.src && (
                        <Image src={r.image.src} alt={r.image.alt} fill sizes="(min-width: 1024px) 400px, 100vw" className={styles.cover} />
                      )}
                    </span>
                    <span className={styles.resourceBody}>
                      <span>
                        <span className={styles.tag}>{optionLabel(resourceTags, r.tag, locale)}</span>
                        <span className={styles.cardTitle}>{r.title}</span>
                        {r.date && (
                          <time dateTime={r.date} className={styles.date}>
                            {formatDate(r.date, SHORT_DATE, locale)}
                          </time>
                        )}
                      </span>
                      <span className={styles.roundArrow} aria-hidden="true">
                        <Icon name="arrow" className="size-4" strokeWidth={2.2} />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 9. Bandeau final */}
      <section className={styles.cta} aria-labelledby="titre-cta">
        {cta.image.src && <Image src={cta.image.src} alt="" fill sizes="100vw" className={styles.ctaImg} />}
        <div className={`${styles.frame} ${styles.ctaInner}`}>
          <div data-reveal>
            <h2 id="titre-cta" className={styles.ctaTitle}>
              {cta.title}
            </h2>
            <p className={styles.ctaText}>{cta.text}</p>
          </div>
          {cta.button && (
            <Link href={cta.button.href} className={`btn ${styles.ctaBtn}`} data-reveal style={delay(120)}>
              {cta.button.label}
              <Icon name="arrow" className="size-[1.1em]" strokeWidth={2.2} />
            </Link>
          )}
        </div>
      </section>
    </>
  );
}
