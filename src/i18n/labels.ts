import type { Locale } from ".";

// Formats du programme, saisis en français dans le back-office (et utilisés par le code : Pause, Pitchs…)
const KINDS_EN: Record<string, string> = {
  Atelier: "Workshop",
  Cérémonie: "Ceremony",
  Clôture: "Closing",
  Compétition: "Competition",
  Exposition: "Exhibition",
  Keynote: "Keynote",
  Panel: "Panel",
  Partenaires: "Partners",
  Pause: "Break",
  Pitchs: "Pitches",
  "Pitchs étudiants": "Student pitches",
  Session: "Session",
  "Table ronde": "Round table",
  Talks: "Talks",
  "Zone Jeunesse": "Youth Zone",
};

/**
 * Libellé d'un format du programme dans la langue de la page : version anglaise saisie
 * dans le back-office (champ « Format (anglais) »), sinon traduction connue, sinon tel quel.
 */
export const kindLabel = (kind: string, locale: Locale, custom = "") => (locale === "en" ? custom.trim() || (KINDS_EN[kind] ?? kind) : kind);
