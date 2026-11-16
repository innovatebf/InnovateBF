import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { and, count, desc, eq, gte, lt, sql, type SQL } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import { isLocale } from "@/i18n";
import { PUBLIC_PATHS } from "@/lib/site";
import { db, schema } from "./db/client";

/*
 * Mesure d'audience sans cookie (décrite dans la politique de confidentialité) :
 * page, langue, domaine d'origine, type d'appareil et pays. L'adresse IP n'est
 * jamais stockée ; l'identifiant de visiteur est un hachage avec un sel du jour,
 * supprimé le lendemain : il compte les visiteurs uniques d'une journée sans
 * permettre de les reconnaître d'un jour à l'autre.
 */

const DAY = 86_400_000;
const RETENTION_DAYS = 400; // environ 13 mois
const MAX_VIEWS_PER_VISITOR = 300; // par jour : au-delà (robot, abus), les pages vues sont ignorées
const MAX_VIEWS_PER_DAY = 50_000; // plafond global : borne les écritures même si l'identifiant est contourné

/** Jour AAAA-MM-JJ à l'heure de Ouagadougou (UTC). */
export const dayOf = (t = Date.now()) => new Date(t).toISOString().slice(0, 10);
const shiftDay = (day: string, n: number) => dayOf(Date.parse(`${day}T00:00:00Z`) + n * DAY);

const BOT =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|discord|embedly|headless|lighthouse|pagespeed|gtmetrix|curl|wget|python|axios|node-fetch|go-http|java\/|httpclient|okhttp/i;
export const isBotAgent = (ua: string) => !ua || BOT.test(ua);

export type Device = "mobile" | "tablet" | "desktop";

export function deviceOf(ua: string): Device {
  if (/ipad|tablet|kindle|silk|playbook|android(?!.*mobile)/i.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android|blackberry|opera mini|iemobile|windows phone/i.test(ua)) return "mobile";
  return "desktop";
}

// Un seul nom par réseau ou moteur (l.facebook.com, lm.facebook.com… → facebook.com)
const SOURCES: [RegExp, string][] = [
  [/(^|\.)facebook\.com$|^fb\.me$/, "facebook.com"],
  [/(^|\.)linkedin\.com$|^lnkd\.in$/, "linkedin.com"],
  [/^t\.co$|(^|\.)x\.com$|(^|\.)twitter\.com$/, "x.com"],
  [/(^|\.)instagram\.com$/, "instagram.com"],
  [/(^|\.)youtube\.com$|^youtu\.be$/, "youtube.com"],
  [/(^|\.)tiktok\.com$/, "tiktok.com"],
  [/(^|\.)whatsapp\.com$|^wa\.me$/, "whatsapp.com"],
  [/(^|\.)google\.[a-z.]+$/, "google"],
  [/(^|\.)bing\.com$/, "bing.com"],
];

/** Domaine d'origine d'une visite, sans « www. » ; vide pour un accès direct ou une navigation interne. */
export function sourceOf(referrer: string, ownHost: string) {
  let host: string;
  try {
    host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
  if (!host || host === ownHost.toLowerCase().replace(/^www\./, "")) return "";
  // Site inconnu : seul un nom de domaine plausible est gardé (sinon, compté comme accès direct)
  return SOURCES.find(([re]) => re.test(host))?.[1] ?? (/^(?=.{4,100}$)([a-z0-9-]+\.)+[a-z]{2,}$/.test(host) ? host : "");
}

let saltCache: { day: string; salt: string } | null = null;

/** Sel du jour, créé à la première visite du jour ; ceux des jours précédents sont supprimés. */
async function saltOf(day: string) {
  if (saltCache?.day === day) return saltCache.salt;
  await db.insert(schema.analyticsSalts).values({ day, salt: randomBytes(32).toString("hex") }).onConflictDoNothing();
  const [row] = await db.select().from(schema.analyticsSalts).where(eq(schema.analyticsSalts.day, day));
  await db.delete(schema.analyticsSalts).where(lt(schema.analyticsSalts.day, day));
  saltCache = { day, salt: row.salt };
  return row.salt;
}

const KNOWN_PATHS = new Set<string>(PUBLIC_PATHS);

/** `entry` : première page d'une visite (arrivée d'un autre site, d'un favori ou d'une adresse saisie). */
export type ViewInput = { path: string; locale: string; referrer: string; entry: boolean };
export type ViewContext = { ip: string; userAgent: string; country: string | null; host: string };

/** Enregistre une page vue ; ignorée pour les robots, les adresses inconnues et les abus. */
export async function recordView(view: ViewInput, ctx: ViewContext) {
  if (isBotAgent(ctx.userAgent) || !KNOWN_PATHS.has(view.path) || !isLocale(view.locale)) return false;
  const day = dayOf();
  const salt = await saltOf(day);
  const visitor = createHash("sha256").update(`${salt}|${ctx.ip}|${ctx.userAgent}`).digest("hex").slice(0, 32);
  const pv = schema.pageViews;
  const [[{ n }], [{ total }]] = await Promise.all([
    db.select({ n: count() }).from(pv).where(and(eq(pv.day, day), eq(pv.visitor, visitor))),
    db.select({ total: count() }).from(pv).where(eq(pv.day, day)),
  ]);
  if (n >= MAX_VIEWS_PER_VISITOR || total >= MAX_VIEWS_PER_DAY) return false;
  await db.insert(pv).values({
    day,
    path: view.path,
    locale: view.locale,
    visitor,
    referrer: view.entry ? sourceOf(view.referrer, ctx.host) : "",
    entry: view.entry,
    device: deviceOf(ctx.userAgent),
    country: ctx.country && /^[A-Z]{2}$/.test(ctx.country) ? ctx.country : "",
  });
  // Conservation limitée : purge occasionnelle des pages vues de plus de 13 mois
  if (Math.random() < 0.01) await db.delete(pv).where(lt(pv.day, shiftDay(day, -RETENTION_DAYS)));
  return true;
}

/* ---------- Statistiques du back-office ---------- */

export const AUDIENCE_PERIODS = [7, 30, 90] as const;
export type AudiencePeriod = (typeof AUDIENCE_PERIODS)[number];

export type AudienceRow = { key: string; visitors: number; views: number };
export type AudienceDay = { day: string; visitors: number; views: number; visits: number };

/**
 * Audience sur les `days` derniers jours (aujourd'hui compris) et sur la
 * période précédente de même durée. Les visiteurs sont comptés uniques par
 * jour, puis additionnés : un visiteur revenu deux jours compte deux fois.
 * Les sources sont comptées par visite (première page), les autres
 * classements par page vue. `allTime` ne dépend pas de la période : compteur
 * depuis la plus ancienne page vue conservée en base.
 */
export async function getAudience(days: AudiencePeriod, now = Date.now()) {
  const pv = schema.pageViews;
  const end = dayOf(now);
  const start = shiftDay(end, -(days - 1));
  const previousStart = shiftDay(start, -days);
  const visitorsPerDay = sql<number>`count(distinct ${pv.visitor})::int`;
  const visitorDays = sql<number>`count(distinct ${pv.day} || ${pv.visitor})::int`;
  const visits = sql<number>`(count(*) filter (where ${pv.entry}))::int`;

  const top = (column: PgColumn, where?: SQL, limit = 8) =>
    db
      .select({ key: column, visitors: visitorDays, views: count() })
      .from(pv)
      .where(and(gte(pv.day, start), where))
      .groupBy(column)
      .orderBy(desc(visitorDays), desc(count()))
      .limit(limit);

  const [daily, pages, sources, devices, locales, countries, [allTime]] = await Promise.all([
    db.select({ day: pv.day, visitors: visitorsPerDay, views: count(), visits }).from(pv).where(gte(pv.day, previousStart)).groupBy(pv.day),
    top(pv.path),
    top(pv.referrer, eq(pv.entry, true)),
    top(pv.device, undefined, 3),
    top(pv.locale, undefined, 2),
    top(pv.country, undefined, 6),
    db.select({ visitors: visitorDays, views: count(), since: sql<string | null>`min(${pv.day})` }).from(pv),
  ]);

  const byDay = new Map(daily.map((d) => [d.day, d]));
  const series: AudienceDay[] = Array.from({ length: days }, (_, i) => {
    const day = shiftDay(start, i);
    const d = byDay.get(day);
    return { day, visitors: Number(d?.visitors ?? 0), views: Number(d?.views ?? 0), visits: Number(d?.visits ?? 0) };
  });
  const total = (from: string, to: string) =>
    daily
      .filter((d) => d.day >= from && d.day <= to)
      .reduce(
        (acc, d) => ({ visitors: acc.visitors + Number(d.visitors), views: acc.views + Number(d.views), visits: acc.visits + Number(d.visits ?? 0) }),
        { visitors: 0, views: 0, visits: 0 },
      );
  const rows = (list: { key: string; visitors: number; views: number }[]): AudienceRow[] =>
    list.map((r) => ({ key: r.key, visitors: Number(r.visitors), views: Number(r.views) }));

  return {
    days,
    start,
    end,
    series,
    totals: total(start, end),
    previous: total(previousStart, shiftDay(start, -1)),
    today: { visitors: series.at(-1)?.visitors ?? 0, views: series.at(-1)?.views ?? 0 },
    allTime: { visitors: Number(allTime.visitors), views: Number(allTime.views), since: allTime.since },
    pages: rows(pages),
    sources: rows(sources),
    devices: rows(devices),
    locales: rows(locales),
    countries: rows(countries),
  };
}

export type Audience = Awaited<ReturnType<typeof getAudience>>;
