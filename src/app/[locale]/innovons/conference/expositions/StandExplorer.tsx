"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { useLocale, useT } from "@/i18n/client";
import { optionLabel, standCategoryOptions, type CollectionData } from "@/lib/content/definitions";
import { delay } from "@/lib/motion";
import styles from "../conference.module.css";

type Stand = CollectionData<"stands">;
type StandCategory = Stand["category"];

const look: Record<StandCategory, { icon: string; badge: string; text: string }> = {
  organisateurs: { icon: "building", badge: styles.organisateurs, text: styles.catOrganisateurs },
  inventeurs: { icon: "trophy", badge: styles.inventeurs, text: styles.catInventeurs },
  citadel: { icon: "spark", badge: styles.citadel, text: styles.catCitadel },
  etudiants: { icon: "graduation", badge: styles.etudiants, text: styles.catEtudiants },
  entreprises: { icon: "building", badge: styles.entreprises, text: styles.catEntreprises },
  jeunesse: { icon: "rocket", badge: styles.jeunesse, text: styles.catJeunesse },
};

export function StandExplorer({ stands }: { stands: Stand[] }) {
  const locale = useLocale();
  const t = useT();
  const [filter, setFilter] = useState<StandCategory | "all">("all");
  const visible = filter === "all" ? stands : stands.filter((s) => s.category === filter);
  const label = (id: StandCategory) => optionLabel(standCategoryOptions, id, locale);

  const filters: { id: StandCategory | "all"; label: string; count: number }[] = [
    { id: "all", label: t("Tous les stands", "All booths"), count: stands.length },
    ...standCategoryOptions
      .map((c) => ({ id: c.value, label: label(c.value), count: stands.filter((s) => s.category === c.value).length }))
      .filter((c) => c.count > 0),
  ];

  return (
    <div>
      <div className={styles.tabs} role="group" aria-label={t("Filtrer par catégorie", "Filter by category")} data-reveal>
        {filters.map((f) => (
          <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)} className={styles.tab}>
            {f.label} <span className={styles.count}>{f.count}</span>
          </button>
        ))}
      </div>

      <ul key={filter} className={styles.standGrid} aria-live="polite">
        {visible.map((s, i) => (
          <li key={`${s.category}-${s.name}`} data-reveal style={delay(Math.min(i, 9) * 40)}>
            <div className={styles.stand}>
              <span className={`${styles.standIcon} ${look[s.category].badge}`}>
                <Icon name={look[s.category].icon} className="size-5" strokeWidth={1.9} />
              </span>
              <span>
                <span className={styles.standName}>{s.name}</span>
                {s.detail && <span className={styles.standDetail}>{s.detail}</span>}
                <span className={`${styles.standCat} ${look[s.category].text}`}>{label(s.category)}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
