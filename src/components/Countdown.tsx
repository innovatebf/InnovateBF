"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/i18n/client";
import { conferenceCountdown, daysUntil } from "@/lib/site";

const DAY = 86_400_000;

/**
 * Heure courante, recalculée chez le visiteur puis à chaque minuit (heure du Burkina, UTC) :
 * les pages sont servies depuis le cache, le décompte reste juste. Le premier rendu reprend
 * l'heure du serveur pour une hydratation identique.
 */
function useNow(serverNow: number) {
  const [now, setNow] = useState(serverNow);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const t = Date.now();
      setNow(t);
      timer = setTimeout(tick, DAY - (t % DAY) + 1000);
    };
    tick();
    return () => clearTimeout(timer);
  }, []);
  return now;
}

type ConferenceProps = {
  start: string;
  end: string;
  /** Date.now() au rendu serveur */
  now: number;
  /** Une seule partie du décompte (cartes flottantes de l'en-tête de page) */
  part?: "value" | "label";
  className?: string;
  strongClassName?: string;
};

/** « J−31 avant l'ouverture », puis « Jour 1 en cours », rien après la conférence. */
export function ConferenceCountdown({ start, end, now, part, className, strongClassName }: ConferenceProps) {
  const c = conferenceCountdown({ start, end }, useNow(now), useLocale());
  if (!c) return null;
  if (part) return <>{c[part]}</>;
  return (
    <span className={className}>
      <strong className={strongClassName}>{c.value}</strong> {c.label}
    </span>
  );
}

/** Jours restants avant la clôture de l'appel : « J−4 » (court) ou « Plus que 4 jours » (long). */
export function CallCountdown({ closes, now, format }: { closes: string; now: number; format: "short" | "long" }) {
  const left = daysUntil(closes, useNow(now));
  const s = left > 1 ? "s" : "";
  if (useLocale() === "en") {
    if (format === "short") return <>{left > 0 ? `${left} day${s}` : "Last day"}</>;
    return <>{left > 0 ? `${left} day${s} left` : "Last day to apply"}</>;
  }
  if (format === "short") return <>{left > 0 ? `J−${left}` : "Dernier jour"}</>;
  return <>{left > 0 ? `Plus que ${left} jour${s}` : "Dernier jour pour candidater"}</>;
}
