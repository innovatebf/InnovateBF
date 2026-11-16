import Image from "next/image";
import { localize, type Localize } from "@/i18n";
import { Link } from "@/i18n/Link";
import { getLocale, getT } from "@/i18n/server";
import type { PatronageItem, Poster } from "@/content/conference";
import type { CollectionData } from "@/lib/content/definitions";
import type { ConferenceInfo } from "@/server/content/repository";
import { delay } from "@/lib/motion";
import { APPLY_URL, CONFERENCE_BASE, conferencePages, formatDate, isExternal } from "@/lib/site";
import styles from "./ebc.module.css";
import { Icon } from "./Icon";

type Partner = CollectionData<"partners">;

/* ---------- Bande Patronage ---------- */

export function PatronageBand({ label, items }: { label: string; items: Localize<PatronageItem>[] }) {
  if (items.length === 0) return null;
  return (
    <section className={styles.patron} aria-labelledby="patronage">
      <div className={styles.patronInner}>
        <h2 id="patronage" className={styles.patronLabel} data-reveal>
          {label}
        </h2>
        <div className={styles.patronItems}>
          {items.map((p, i) => (
            <div key={`${p.role}-${i}`} className={styles.patronItem} data-reveal style={delay(80 + i * 110)}>
              {p.minister ? (
                // Portrait du ministre, armoiries en pastille
                <span className={styles.patronPortrait}>
                  <Image src={p.minister.photo} alt={p.minister.name} width={160} height={160} className={styles.patronPhoto} />
                  <Image src={p.emblem.src} alt="" width={48} height={54} className={styles.patronBadge} />
                </span>
              ) : (
                <Image src={p.emblem.src} alt={p.emblem.alt} width={240} height={270} className={styles.patronEmblem} />
              )}
              <div>
                <p className={styles.patronRole}>{p.role}</p>
                <p className={styles.patronName}>
                  {p.lines.map((l, j) => (
                    <span key={j} className={styles.patronLine}>
                      {l}{" "}
                    </span>
                  ))}
                </p>
                {p.minister && <p className={styles.patronMinister}>{p.minister.name}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Affiche verte : slogan, photo, dates, cinq rubriques ---------- */

export function PosterBand({ poster, conference }: { poster: Localize<Poster>; conference: ConferenceInfo }) {
  const locale = getLocale();
  const t = getT();
  return (
    <section className={styles.poster} aria-label={conference.name}>
      <div className={styles.posterTop}>
        <p className={styles.slogan} data-reveal="left">
          {poster.sloganLines.map((l, i) => (
            <span key={i} className="block">
              {l}
            </span>
          ))}
        </p>
        <div className={`${styles.posterPhoto} settle`} data-reveal="fade" style={delay(150)}>
          {poster.image.src && (
            <Image
              src={poster.image.src}
              alt={poster.image.alt}
              fill
              sizes="(min-width: 1024px) 460px, 100vw"
              className="object-cover object-[50%_30%]"
            />
          )}
          <div className={styles.posterTint} aria-hidden="true" />
          <div className={styles.posterFade} aria-hidden="true" />
        </div>
        <div className={styles.dates} data-reveal="right" style={delay(250)}>
          <p className={styles.datesDays}>
            {formatDate(conference.start, { day: "numeric" }, locale)}
            {conference.end !== conference.start && `–${formatDate(conference.end, { day: "numeric" }, locale)}`}
          </p>
          <p className={styles.datesMonth}>{formatDate(conference.end, { month: "long", year: "numeric" }, locale)}</p>
          <p className={styles.datesCity}>{conference.city}</p>
          <span className={styles.datesBar} aria-hidden="true" />
          <p className={styles.datesVenue}>{conference.venue}</p>
        </div>
      </div>
      <nav aria-label={t("Rubriques de la conférence", "Conference sections")} className={styles.posterNav}>
        <ul>
          {localize(conferencePages, locale).map((p, i) => (
            <li key={p.slug} data-reveal style={delay(100 + i * 70)}>
              <Link href={`${CONFERENCE_BASE}/${p.slug}`} className={styles.navItem}>
                <span className={styles.navNum}>0{i + 1}</span>
                <span className={styles.navLabel}>
                  {p.label}
                  <Icon name="arrow" className="size-[1em]" strokeWidth={2.2} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}

/* ---------- Organisateurs, co-organisateurs, sponsors (page Conférence) ---------- */

export function LogoWall({ partners }: { partners: Partner[] }) {
  return (
    <ul className={styles.wall}>
      {partners.map((p, i) => {
        const content = p.logo.src ? (
          <>
            <Image
              src={p.logo.src}
              alt={p.caption ? "" : p.logo.alt || p.name}
              width={p.caption ? 120 : 240}
              height={p.caption ? 120 : 110}
              className={p.caption ? styles.tileBadge : styles.tileLogo}
            />
            {p.caption && <span className={styles.tileCaption}>{p.caption}</span>}
          </>
        ) : (
          <span className={styles.tileCaption}>{p.name}</span>
        );
        return (
          <li key={`${p.name}-${i}`} className={p.wide ? styles.tileWide : undefined} data-reveal="zoom" style={delay(i * 60)}>
            {p.href ? (
              <a href={p.href} {...(isExternal(p.href) && { target: "_blank", rel: "noopener noreferrer" })} className={styles.tile} aria-label={p.name}>
                {content}
              </a>
            ) : (
              <div className={styles.tile}>{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function PartnerGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className={styles.groupTitle} data-reveal>
        {title}
      </h3>
      {children}
    </div>
  );
}

export function PartnersBlock({ partners, showSponsors = false }: { partners: Partner[]; showSponsors?: boolean }) {
  const t = getT();
  const of = (group: Partner["group"]) => partners.filter((p) => p.group === group);
  const groups = [
    { title: t("Organisateur", "Organizer"), items: of("organisateur") },
    { title: t("Co-organisateurs", "Co-organizers"), items: of("co_organisateur") },
  ];
  const sponsors = of("sponsor");
  const media = of("media");
  return (
    <div className={styles.groups}>
      {groups.map(
        (g) =>
          g.items.length > 0 && (
            <PartnerGroup key={g.title} title={g.title}>
              <LogoWall partners={g.items} />
            </PartnerGroup>
          ),
      )}
      {showSponsors && (
        <PartnerGroup title="Sponsors">
          {sponsors.length > 0 ? (
            <LogoWall partners={sponsors} />
          ) : (
            <div className={styles.soon} data-reveal>
              <p>
                <b>{t("Bientôt disponible.", "Coming soon.")}</b>{" "}
                {t("Les sponsors d'EBC2026 seront annoncés ici.", "EBC2026 sponsors will be announced here.")}
              </p>
              <Link href="/contact" className="btn btn-line">
                {t("Devenir sponsor", "Become a sponsor")}
                <Icon name="arrow" className="size-4" />
              </Link>
            </div>
          )}
        </PartnerGroup>
      )}
      {media.length > 0 && (
        <PartnerGroup title={t("Partenaires médias et numérique", "Media and digital partners")}>
          <LogoWall partners={media} />
        </PartnerGroup>
      )}
    </div>
  );
}

/* ---------- Appel à projets ---------- */

export function CallButton({ open, className = "btn-primary" }: { open: boolean; className?: string }) {
  const t = getT();
  return open ? (
    <Link href={APPLY_URL} className={`btn ${className}`}>
      {t("Soumettre un projet", "Submit a project")}
      <Icon name="arrow" className="size-4" />
    </Link>
  ) : (
    <span className="btn" aria-disabled="true">
      {t("Candidatures closes", "Applications closed")}
    </span>
  );
}
