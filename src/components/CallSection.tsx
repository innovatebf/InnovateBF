import Image from "next/image";
import type { CallBlock } from "@/content/conference";
import type { Localize } from "@/i18n";
import { Link } from "@/i18n/Link";
import { getLocale, getT } from "@/i18n/server";
import type { SettingsValue } from "@/lib/content/definitions";
import { delay } from "@/lib/motion";
import { APPLY_URL, formatDate, formatTime, isCallOpen, LONG_DATE } from "@/lib/site";
import styles from "./call.module.css";
import { Icon } from "./Icon";

/** Bouton de candidature : désactivé après la clôture de l'appel. */
export function CallLink({ open }: { open: boolean }) {
  const t = getT();
  return open ? (
    <Link href={APPLY_URL} className="btn btn-primary">
      {t("Soumettre un projet", "Submit a project")}
      <Icon name="arrow" className="size-[1.1em]" strokeWidth={2.2} />
    </Link>
  ) : (
    <span className="btn" aria-disabled="true">
      {t("Candidatures closes", "Applications closed")}
    </span>
  );
}

/** Section « Appel à projets » (page Conférence) : photo, statut, clôture, slogan. */
export function CallSection({
  id = "appel",
  block,
  calendar,
}: {
  id?: string;
  block: Localize<CallBlock>;
  calendar: SettingsValue<"calendar">;
}) {
  const locale = getLocale();
  const t = getT();
  const open = isCallOpen(calendar);
  // « 31 octobre 2026 à 23 h 59 » (« October 31, 2026 at 23:59 »)
  const closes = formatDate(calendar.callCloses, LONG_DATE, locale);
  const closingTime = formatTime("23:59", locale);
  return (
    <section className={styles.call} aria-labelledby={id}>
      <div className={styles.frame}>
        <div className={styles.card}>
          <div className={`${styles.media} zoom-media`} data-reveal="fade">
            {block.image.src && (
              <Image src={block.image.src} alt={block.image.alt} fill sizes="(min-width: 1024px) 380px, 100vw" className="object-cover" />
            )}
            <span className={`${styles.status} ${open ? "" : styles.statusOff}`}>
              <span className={styles.dot} aria-hidden="true" />
              {open ? t("Appel ouvert", "Call open") : t("Appel clos", "Call closed")}
            </span>
          </div>

          <div className={styles.main} data-reveal style={delay(100)}>
            <p className="label" id={id}>
              {block.label}
            </p>
            <h2 className={styles.title}>{block.title}</h2>
            <p className={styles.text}>{block.text}</p>
            <dl className={styles.facts}>
              <div className={styles.fact}>
                <Icon name="clock" className={styles.factIcon} />
                <dt>{t("Clôture", "Deadline")}</dt>
                <dd>{t(`${closes} à ${closingTime}`, `${closes}, at ${closingTime}`)}</dd>
              </div>
              <div className={styles.fact}>
                <Icon name="trophy" className={styles.factIcon} />
                <dt>Participation</dt>
                <dd>{block.participation}</dd>
              </div>
            </dl>
            <div className={styles.actions}>
              <CallLink open={open} />
            </div>
          </div>

          {(block.boxWords.length > 0 || block.boxText.length > 0) && (
            <div className={styles.box} data-reveal="right" style={delay(200)}>
              <p className={styles.boxWords}>
                {block.boxWords.map((w, i) => (
                  <span key={i}>{w}</span>
                ))}
              </p>
              <span className={styles.boxBar} aria-hidden="true" />
              <p className={styles.boxText}>{block.boxText.join(" ")}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
