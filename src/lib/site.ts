/**
 * Structure du site (routes, menus) et fonctions de date.
 * Les contenus éditables (textes, dates, lieu…) viennent de la base de
 * données et se gèrent dans le back-office (/admin).
 */

import { DEFAULT_LOCALE, LOCALE_TAGS, tr, type Locale } from "@/i18n";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.innovatebf.org";

export const CONFERENCE_BASE = "/innovons/conference";
export const APPLY_URL = `${CONFERENCE_BASE}/candidater`;

export const nav = [
  { href: "/", label: tr("Accueil", "Home") },
  { href: "/about", label: tr("À propos", "About") },
  { href: "/domains", label: tr("Domaines d'action", "Action areas") },
  { href: CONFERENCE_BASE, label: tr("Conférence EBC2026", "EBC2026 Conference") },
  { href: "/contact", label: tr("Contact", "Contact") },
];

export const legalLinks = [
  { href: "/legal", label: tr("Mentions légales", "Legal notice") },
  { href: "/privacy", label: tr("Politique de confidentialité", "Privacy policy") },
  { href: "/contact", label: tr("Contact", "Contact") },
];

export const conferencePages = [
  { slug: "appel-a-contributions", label: tr("Appel à contributions", "Call for contributions") },
  { slug: "programme", label: tr("Programme", "Program") },
  { slug: "intervenants", label: tr("Intervenants", "Speakers") },
  { slug: "highlights", label: tr("Highlights", "Highlights") },
  { slug: "expositions", label: tr("Expositions", "Exhibitions") },
] as const;

/** Lien vers un autre site (ouvert dans un nouvel onglet), par opposition à un chemin du site. */
export const isExternal = (href: string) => /^https?:\/\//i.test(href);

/** Pages publiques (sans préfixe de langue) : plan du site et mesure d'audience. */
export const PUBLIC_PATHS = [
  "/",
  "/about",
  "/domains",
  "/domains/analysis",
  "/contact",
  "/legal",
  "/privacy",
  CONFERENCE_BASE,
  ...conferencePages.map((p) => `${CONFERENCE_BASE}/${p.slug}`),
  APPLY_URL,
];

/* ---------- Dates (heure de Ouagadougou = UTC) ---------- */

type ConferenceDates = { start: string; end: string; openingTime: string };
type Calendar = { callOpens: string; callCloses: string };

const TZ = "Africa/Ouagadougou";
export const LONG_DATE = { day: "numeric", month: "long", year: "numeric" } as const;

function toDate(iso: string) {
  return new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions, locale: Locale = DEFAULT_LOCALE) {
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale].intl, { timeZone: TZ, ...opts }).format(toDate(iso));
}

/** « 27–28 novembre 2026 » (« November 27–28, 2026 ») */
export function conferenceDates(c: Pick<ConferenceDates, "start" | "end">, locale: Locale = DEFAULT_LOCALE) {
  const s = toDate(c.start);
  const e = toDate(c.end);
  const end = formatDate(c.end, LONG_DATE, locale);
  if (c.start === c.end) return end;
  const sameMonth = s.getUTCMonth() === e.getUTCMonth() && s.getUTCFullYear() === e.getUTCFullYear();
  if (locale === "en") {
    return sameMonth
      ? `${formatDate(c.start, { day: "numeric", month: "long" }, locale)}–${e.getUTCDate()}, ${e.getUTCFullYear()}`
      : `${formatDate(c.start, { day: "numeric", month: "long" }, locale)} – ${end}`;
  }
  return sameMonth ? `${s.getUTCDate()}–${end}` : `${formatDate(c.start, { day: "numeric", month: "long" }, locale)} – ${end}`;
}

/** Heure « 09:00 » : « 09 h 00 » en français, inchangée en anglais. */
export const formatTime = (time: string, locale: Locale = DEFAULT_LOCALE) => (locale === "fr" ? time.replace(":", " h ") : time);

/** Session de pitchs (Top 5 Inventeurs), reconnue à son format ou à son sous-titre (« 8 min/pitch ») : les inventeurs y sont présentés comme intervenants. */
export const isPitchSession = (s: { kind: string; detail: string }) => s.kind === "Pitchs" || s.kind === "Compétition" || /pitch/i.test(s.detail);

/** Plage horaire d'un créneau : « 08 h 30 – 10 h 30 », ou l'heure de début seule. */
export const formatTimeRange = (start: string, end = "", locale: Locale = DEFAULT_LOCALE) =>
  end ? `${formatTime(start, locale)} – ${formatTime(end, locale)}` : formatTime(start, locale);

/** Horaires saisis en français (« 08 h 30 – 18 h 30 ») : « 08:30 – 18:30 » en anglais. */
export const formatHours = (hours: string, locale: Locale = DEFAULT_LOCALE) =>
  locale === "fr" ? hours : hours.replace(/(\d{1,2})\s*h\s*(\d{2})?/g, (_, h: string, m?: string) => `${h.padStart(2, "0")}:${m ?? "00"}`);

/** Date ISO (AAAA-MM-JJ) du jour n de la conférence (0 = premier jour). */
export function conferenceDay(c: Pick<ConferenceDates, "start">, n: number) {
  const d = toDate(c.start);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

const DAY = 86_400_000;
/** Début du jour contenant `t`, à l'heure du Burkina Faso (UTC). */
const dayStart = (t: number) => Math.floor(t / DAY) * DAY;

/** Jours calendaires restants avant `iso` (heure du Burkina) : 1 la veille, 0 le jour même ou après. */
export function daysUntil(iso: string, now = Date.now()) {
  return Math.max(0, Math.round((dayStart(Date.parse(iso)) - dayStart(now)) / DAY));
}

/** Jours calendaires avant l'ouverture : J−1 la veille, 0 le jour même ou après. */
export function daysUntilConference(c: Pick<ConferenceDates, "start">, now = Date.now()) {
  return daysUntil(`${c.start}T00:00:00Z`, now);
}

/**
 * Décompte affiché : « J−n avant l'ouverture » (« n days to go »), puis
 * « Jour 1 en cours » (« Day 1 in progress »)…, null une fois la conférence terminée.
 */
export function conferenceCountdown(c: Pick<ConferenceDates, "start" | "end">, now = Date.now(), locale: Locale = DEFAULT_LOCALE) {
  const en = locale === "en";
  const days = daysUntilConference(c, now);
  if (days > 0) return en ? { value: `${days} day${days > 1 ? "s" : ""}`, label: "to go" } : { value: `J−${days}`, label: "avant l'ouverture" };
  if (!isConferenceAhead(c, now)) return null;
  const day = Math.round((dayStart(now) - Date.parse(`${c.start}T00:00:00Z`)) / DAY) + 1;
  return en ? { value: `Day ${day}`, label: "in progress" } : { value: `Jour ${day}`, label: "en cours" };
}

export function isCallOpen(cal: Pick<Calendar, "callOpens" | "callCloses">, now = Date.now()) {
  return now >= Date.parse(cal.callOpens) && now <= Date.parse(cal.callCloses);
}

/** Jusqu'à la fin du dernier jour de la conférence : l'accueil met EBC2026 en avant. */
export function isConferenceAhead(c: Pick<ConferenceDates, "end">, now = Date.now()) {
  return now <= Date.parse(`${c.end}T23:59:59Z`);
}
