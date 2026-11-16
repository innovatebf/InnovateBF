import Image from "next/image";
import { Link } from "@/i18n/Link";
import { getT } from "@/i18n/server";
import { delay } from "@/lib/motion";
import { Icon } from "./Icon";
import styles from "./page.module.css";

type Photo = { src: string; alt: string };
export type Accent = "blue" | "green" | "orange" | "navy";

/* ---------- En-tête des pages intérieures ---------- */

/**
 * En-tête dans le langage de la maquette 2026 : fond bleu ciel à halos,
 * fil d'Ariane en pastille, intitulé à trait orange, titre (fin en dégradé
 * bleu facultative), chiffres clés en pastilles. À droite : photo arrondie
 * (avec cartes flottantes), fiche, ou les deux superposées.
 */
export function PageHero({
  label,
  title,
  highlight,
  lead,
  crumbs = [],
  actions,
  stats,
  aside,
  photo,
  chips,
}: {
  label: string;
  title: React.ReactNode;
  /** Fin du titre, en dégradé bleu */
  highlight?: string;
  lead?: React.ReactNode;
  crumbs?: { href: string; label: string }[];
  actions?: React.ReactNode;
  stats?: { value: React.ReactNode; label: string }[];
  aside?: React.ReactNode;
  photo?: Photo & { position?: string };
  /** Cartes flottantes sur la photo */
  chips?: { icon: string; title: React.ReactNode; text?: React.ReactNode }[];
}) {
  const layout = photo ? styles.heroMedia : aside ? styles.heroAsideOnly : styles.heroSolo;
  const t = getT();
  return (
    <section className={styles.hero}>
      <span className={styles.heroDecor} aria-hidden="true" />
      <div className={styles.frame}>
        <nav aria-label={t("Fil d'Ariane", "Breadcrumb")} className={styles.crumbs} data-reveal="fade">
          <Link href="/">{t("Accueil", "Home")}</Link>
          {crumbs.map((c, i) => (
            <span key={c.href} className="contents">
              <Icon name="arrow" className={styles.crumbSep} strokeWidth={2} />
              {i === crumbs.length - 1 ? (
                <span aria-current="page">{c.label}</span>
              ) : (
                <Link href={c.href}>{c.label}</Link>
              )}
            </span>
          ))}
        </nav>
        <div className={`${styles.heroGrid} ${layout}`}>
          <div className={styles.heroText}>
            <p className="label" data-reveal>
              {label}
            </p>
            <h1 className={styles.heroTitle} data-reveal style={delay(90)}>
              {title}
              {highlight && (
                <>
                  {" "}
                  <span className={styles.heroHighlight}>{highlight}</span>
                </>
              )}
            </h1>
            {lead && (
              <p className={styles.heroLead} data-reveal style={delay(170)}>
                {lead}
              </p>
            )}
            {actions && (
              <div className={styles.heroActions} data-reveal style={delay(240)}>
                {actions}
              </div>
            )}
            {stats && stats.length > 0 && (
              <ul className={styles.heroStats} data-reveal style={delay(300)}>
                {stats.map((s) => (
                  <li key={s.label} className={styles.heroStat}>
                    <span className={styles.heroStatValue}>{s.value}</span>
                    <span className={styles.heroStatLabel}>{s.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {photo ? (
            <div className={styles.heroVisual} data-reveal="fade" style={delay(80)}>
              <div className={`${styles.heroPhoto} settle`}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 600px, 100vw"
                  className="object-cover"
                  style={{ objectPosition: photo.position ?? "50% 50%" }}
                />
              </div>
              {chips?.map((c, i) => (
                <div key={i} className={`${styles.chip} ${i === 0 ? styles.chipA : styles.chipB}`}>
                  <span className={styles.chipIcon}>
                    <Icon name={c.icon} className="size-5" />
                  </span>
                  <span>
                    <span className={styles.chipTitle}>{c.title}</span>
                    {c.text && <span className={styles.chipText}>{c.text}</span>}
                  </span>
                </div>
              ))}
              {aside && <div className={styles.heroAsideOver}>{aside}</div>}
            </div>
          ) : (
            aside && (
              <div className={styles.heroAside} data-reveal="right" style={delay(200)}>
                {aside}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- Section ---------- */

export function Section({
  id,
  label,
  title,
  intro,
  more,
  grey = false,
  children,
}: {
  id?: string;
  label: string;
  title?: React.ReactNode;
  intro?: React.ReactNode;
  more?: { href: string; label: string };
  grey?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className={`${styles.section} ${grey ? styles.sectionGrey : ""}`}>
      <div className={styles.frame}>
        <div className={styles.sectionHead}>
          <div data-reveal>
            {title ? <p className="label">{label}</p> : <h2 className="label">{label}</h2>}
            {title && <h2 className={styles.sectionTitle}>{title}</h2>}
            {intro && <p className={styles.sectionIntro}>{intro}</p>}
          </div>
          {more && (
            <Link href={more.href} className={styles.more} data-reveal style={delay(120)}>
              {more.label}
              <Icon name="arrow" className="size-[1.1em]" strokeWidth={2.2} />
            </Link>
          )}
        </div>
        {children && <div className={styles.sectionBody}>{children}</div>}
      </div>
    </section>
  );
}

/* ---------- Fiche (terme / valeur) ---------- */

export function InfoTable({
  rows,
  logo,
}: {
  rows: { term: string; value: React.ReactNode; icon?: string }[];
  logo?: { src: string; alt: string; width: number; height: number; href?: string };
}) {
  const logoImg = logo && <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} priority />;
  return (
    <div className={styles.info}>
      {logo &&
        (logo.href ? (
          <Link href={logo.href} className={styles.infoLogo}>
            {logoImg}
          </Link>
        ) : (
          <div className={styles.infoLogo}>{logoImg}</div>
        ))}
      <dl>
        {rows.map((r) => (
          <div key={r.term} className={`${styles.infoRow} ${r.icon ? styles.infoRowIcon : ""}`}>
            {r.icon && <Icon name={r.icon} className={styles.infoIcon} />}
            <dt className={styles.infoTerm}>{r.term}</dt>
            <dd className={styles.infoDef}>{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ---------- Cartes ---------- */

export function Cards({ cols = 3, children }: { cols?: 2 | 3 | 4; children: React.ReactNode }) {
  const c = cols === 2 ? styles.cols2 : cols === 4 ? styles.cols4 : styles.cols3;
  return <ul className={`${styles.cards} ${c}`}>{children}</ul>;
}

export function Card({
  index = 0,
  num,
  icon,
  accent = "blue",
  kicker,
  title,
  text,
  list,
  href,
  foot,
  footMuted,
  children,
}: {
  index?: number;
  num?: string;
  icon?: string;
  accent?: Accent;
  kicker?: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  list?: React.ReactNode[];
  href?: string;
  foot?: string;
  footMuted?: string;
  children?: React.ReactNode;
}) {
  const body = (
    <>
      {(icon || num) && (
        <span className={styles.cardTop}>
          {icon && (
            <span className={`${styles.cardIcon} ${styles[accent]}`}>
              <Icon name={icon} className="size-6" strokeWidth={1.9} />
            </span>
          )}
          {num && <span className={icon ? styles.cardNumGhost : styles.cardNum}>{num}</span>}
        </span>
      )}
      {kicker && <span className={styles.cardKicker}>{kicker}</span>}
      <span className={styles.cardTitle}>{title}</span>
      {text && <span className={styles.cardText}>{text}</span>}
      {list && (
        <ul className={styles.cardList}>
          {list.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      )}
      {children}
      {foot && (
        <span className={styles.cardFoot}>
          {foot} <Icon name="arrow" className="size-[1.05em]" strokeWidth={2.2} />
        </span>
      )}
      {footMuted && <span className={styles.cardFootMuted}>{footMuted}</span>}
    </>
  );
  return (
    <li data-reveal style={delay(60 + index * 80)}>
      {href ? (
        <Link href={href} className={`${styles.card} ${styles.cardLink}`}>
          {body}
        </Link>
      ) : (
        <div className={styles.card}>{body}</div>
      )}
    </li>
  );
}

/* ---------- Étapes (frise verticale) ---------- */

export function NumRows({
  items,
}: {
  items: { title: React.ReactNode; text?: React.ReactNode; meta?: React.ReactNode }[];
}) {
  return (
    <ol className={styles.rows}>
      {items.map((it, i) => (
        <li key={i} className={styles.row} data-reveal="left" style={delay(60 + i * 70)}>
          <span className={styles.rowNum}>{String(i + 1).padStart(2, "0")}</span>
          <div className={styles.rowBody}>
            <p className={styles.rowTitle}>{it.title}</p>
            {it.text && <p className={styles.rowText}>{it.text}</p>}
            {it.meta && <div className={styles.rowMeta}>{it.meta}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------- Citation, encadrés ---------- */

export function Quote({ text, caption }: { text: React.ReactNode; caption?: string }) {
  return (
    <figure className={styles.quoteCard} data-reveal>
      <span className={styles.quoteMark} aria-hidden="true">
        “
      </span>
      <blockquote className={styles.quote}>{text}</blockquote>
      {caption && <figcaption className={styles.quoteCaption}>{caption}</figcaption>}
    </figure>
  );
}

/** Contenu non encore fourni (exigence T5). */
export function Upcoming({ title, text, icon = "clock" }: { title: string; text?: string; icon?: string }) {
  return (
    <div className={styles.upcoming} data-reveal>
      <span className={styles.upcomingIcon}>
        <Icon name={icon} className="size-6" />
      </span>
      <p className={styles.upcomingKicker}>{getT()("À venir", "Coming soon")}</p>
      <p className={styles.upcomingTitle}>{title}</p>
      {text && <p className={styles.upcomingText}>{text}</p>}
    </div>
  );
}

/** Bandeau d'appel à l'action, bleu nuit. */
export function Callout({ text, sub, children }: { text: React.ReactNode; sub?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={styles.callout} data-reveal>
      <div>
        <p className={styles.calloutText}>{text}</p>
        {sub && <p className={styles.calloutSub}>{sub}</p>}
      </div>
      <div className={styles.calloutActions}>{children}</div>
    </div>
  );
}

export function LogoTile({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) {
  return (
    <div className={styles.logoTile}>
      <Image src={src} alt={alt} width={width} height={height} />
    </div>
  );
}

/** Pastilles à pictogramme (expertises, mots-clés). */
export function Chips({ items }: { items: { icon: string; label: string }[] }) {
  return (
    <ul className={styles.chips}>
      {items.map((c, i) => (
        <li key={c.label} className={styles.chipItem} data-reveal style={delay(40 + i * 60)}>
          <span className={styles.chipItemIcon}>
            <Icon name={c.icon} className="size-5" />
          </span>
          {c.label}
        </li>
      ))}
    </ul>
  );
}

/** Deux colonnes : contenu principal et colonne latérale (collante sur ordinateur). */
export function Split({ main, side, reverse = false }: { main: React.ReactNode; side: React.ReactNode; reverse?: boolean }) {
  return (
    <div className={`${styles.split} ${reverse ? styles.splitReverse : ""}`}>
      <div className={styles.splitMain}>{main}</div>
      <aside className={styles.splitSide}>{side}</aside>
    </div>
  );
}

/** Pastille ronde aux initiales (intervenants sans photo). */
// Mots ignorés pour les initiales : titres, articles, mots d'organisation (français et anglais)
const SKIP = new Set([
  "dr", "dre", "pr", "de", "du", "des", "la", "le", "les", "l", "d", "et", "équipe", "direction", "représentants", "réseau", "responsables", "innovateurs",
  "the", "of", "and", "from", "team", "management", "managers", "representatives", "innovators", "network",
]);

export function Avatar({ name, photo, size = 72 }: { name: string; photo?: Photo; size?: number }) {
  const words = name
    .split(/[\s/'’·-]+/)
    .filter((w) => /^\p{L}/u.test(w) && !SKIP.has(w.toLowerCase()));
  const initials = (words.length === 1 ? words[0].slice(0, 2) : `${words[0]?.[0] ?? ""}${words[words.length - 1]?.[0] ?? ""}`).toUpperCase();
  return photo?.src ? (
    <Image src={photo.src} alt={photo.alt || name} width={size} height={size} className={styles.avatar} style={{ width: size, height: size }} />
  ) : (
    <span className={styles.avatarInitials} style={{ width: size, height: size, fontSize: size * 0.34 }} aria-hidden="true">
      {initials}
    </span>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.prose} data-reveal>
      {children}
    </div>
  );
}

export { styles as pageStyles };
