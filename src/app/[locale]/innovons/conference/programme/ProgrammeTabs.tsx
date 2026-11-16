"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { useLocale, useT } from "@/i18n/client";
import { kindLabel } from "@/i18n/labels";
import type { CollectionData } from "@/lib/content/definitions";
import { delay } from "@/lib/motion";
import { formatTime } from "@/lib/site";
import styles from "../conference.module.css";

type Day = { label: string; date: string; slots: CollectionData<"programme">[] };

/** Présentation d'un point : intertitre (se termine par « : »), ligne déjà numérotée, ou puce. */
function pointClass(point: string) {
  if (point.endsWith(":")) return styles.slotPointHead;
  return /^\d+\)/.test(point) ? styles.slotPointNumbered : styles.slotPoint;
}

export function ProgrammeTabs({ days }: { days: Day[] }) {
  const locale = useLocale();
  const t = useT();
  const [active, setActive] = useState(0);
  const day = days[active];

  return (
    <div>
      <div role="tablist" aria-label={t("Jours de la conférence", "Conference days")} className={styles.tabs} data-reveal>
        {days.map((d, i) => (
          <button
            key={d.label}
            type="button"
            role="tab"
            id={`tab-${i}`}
            aria-selected={i === active}
            aria-controls={`panel-${i}`}
            onClick={() => setActive(i)}
            className={styles.tab}
          >
            <span className={styles.tabKicker}>{d.label}</span>
            <span className={styles.tabDate}>{d.date}</span>
          </button>
        ))}
      </div>

      {/* La clé relance l'apparition des créneaux à chaque changement de jour */}
      <ol key={active} id={`panel-${active}`} role="tabpanel" aria-labelledby={`tab-${active}`} className={styles.timeline}>
        {day.slots.map((s, i) => (
          <li
            key={s.time + s.title}
            className={`${styles.slot} ${s.highlight ? styles.slotHot : ""} ${s.kind === "Pause" ? styles.slotPause : ""}`}
            data-reveal
            style={delay(Math.min(i, 8) * 50)}
          >
            <time className={styles.slotTime}>
              {formatTime(s.time, locale)}
              {/* Heure de fin sous l'heure de début (colonne étroite) */}
              {s.end && <span className={styles.slotEnd}>– {formatTime(s.end, locale)}</span>}
            </time>
            <div className={styles.slotCard}>
              {(s.kind || s.highlight) && (
                <div className={styles.slotTags}>
                  {/* Format comparé en français (valeur du back-office), affiché dans la langue de la page */}
                  {s.kind && <span className={`${styles.kind} ${s.kind === "Zone Jeunesse" ? styles.kindYouth : ""}`}>{kindLabel(s.kind, locale, s.kindEn)}</span>}
                  {s.highlight && (
                    <span className={styles.hot}>
                      <Icon name="star" className="size-3" strokeWidth={2.4} />
                      {t("Temps fort", "Highlight")}
                    </span>
                  )}
                </div>
              )}
              <p className={styles.slotTitle}>{s.title}</p>
              {s.detail && <p className={styles.slotDetail}>{s.detail}</p>}
              {s.points.length > 0 && (
                <ul className={styles.slotPoints}>
                  {s.points.map((point) => (
                    <li key={point} className={pointClass(point)}>
                      {point}
                    </li>
                  ))}
                </ul>
              )}
              {s.speaker && (
                <p className={styles.slotSpeaker}>
                  <Icon name="mic" className="mt-0.5 size-4 shrink-0" />
                  {s.speaker}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
