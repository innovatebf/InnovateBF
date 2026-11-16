import "server-only";
import { createHash } from "node:crypto";
import { and, asc, count, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import {
  collectionDefs,
  collectionSchemas,
  settingsDefs,
  settingsSchemas,
  type AllSettings,
  type CollectionData,
  type CollectionItem,
  type CollectionName,
  type SettingsKey,
  type SettingsValue,
} from "@/lib/content/definitions";
import { emptyValue, type Field } from "@/lib/content/fields";
import { conferenceIdentity } from "@/content/conference";
import { DEFAULT_LOCALE, localize, localizeHref, type Locale, type Localize } from "@/i18n";
import { formatHours, SITE_URL } from "@/lib/site";
import { demoSpeakers } from "@/content/demo-speakers";
import { siteIdentity } from "@/content/innovatebf";
import { db, schema } from "../db/client";
import { ApiError, errors } from "../http";
import { defaultSettings } from "./seed-data";

export const CONTENT_TAG = "content";

/** Contrôles qui dépassent un champ isolé. */
function checkSettings<K extends SettingsKey>(key: K, value: SettingsValue<K>) {
  if (key === "calendar") {
    const v = value as SettingsValue<"calendar">;
    if (Date.parse(v.callOpens) >= Date.parse(v.callCloses)) {
      throw new ApiError(422, "VALIDATION_ERROR", "Dates incohérentes.", { callCloses: "La clôture doit suivre l'ouverture." });
    }
  }
  if (key === "conference") {
    const v = value as SettingsValue<"conference">;
    if (v.end < v.start) throw new ApiError(422, "VALIDATION_ERROR", "Dates incohérentes.", { end: "Le dernier jour doit suivre le premier." });
  }
}

/** Contrôles entre champs d'un élément (le schéma valide chaque champ isolément). */
function checkItem<C extends CollectionName>(collection: C, data: CollectionData<C>) {
  if (collection === "programme") {
    const v = data as CollectionData<"programme">;
    if (v.end && v.end <= v.time) throw new ApiError(422, "VALIDATION_ERROR", "Horaires incohérents.", { end: "L'heure de fin doit suivre l'heure de début." });
  }
  return data;
}

/**
 * Valeur stockée ramenée aux champs actuels : un champ ajouté depuis prend sa
 * valeur par défaut, un champ retiré est ignoré. Le contenu saisi survit
 * ainsi aux évolutions des formulaires.
 */
function alignFields(fields: readonly Field[], value: unknown, fallback: (f: Field) => unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const v = value as Record<string, unknown>;
  return Object.fromEntries(fields.map((f) => [f.name, Object.hasOwn(v, f.name) ? v[f.name] : fallback(f)]));
}

/* ---------- Blocs uniques ---------- */

export async function readAllSettings(): Promise<AllSettings> {
  const rows = await db.select().from(schema.settings);
  const stored = new Map(rows.map((r) => [r.key, r.value]));
  const out = {} as Record<SettingsKey, unknown>;
  for (const key of Object.keys(settingsDefs) as SettingsKey[]) {
    const defaults = defaultSettings[key] as Record<string, unknown>;
    const value = alignFields(settingsDefs[key].fields, stored.get(key), (f) => defaults[f.name]);
    const parsed = settingsSchemas[key].safeParse(value);
    if (stored.has(key) && !parsed.success) console.warn(`[contenu] bloc « ${key} » invalide en base : valeur par défaut utilisée`);
    out[key] = parsed.success ? parsed.data : defaultSettings[key];
  }
  return out as AllSettings;
}

export async function saveSettings<K extends SettingsKey>(key: K, input: unknown) {
  const value = settingsSchemas[key].parse(input) as SettingsValue<K>;
  checkSettings(key, value);
  await db
    .insert(schema.settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: schema.settings.key, set: { value, updatedAt: schema.nowIso } });
  return value;
}

/* ---------- Collections ---------- */

type Row = typeof schema.items.$inferSelect;

function toItem<C extends CollectionName>(collection: C, row: Row): CollectionItem<C> | null {
  const parsed = collectionSchemas[collection].safeParse(alignFields(collectionDefs[collection].fields, row.data, emptyValue));
  if (!parsed.success) {
    console.warn(`[contenu] élément ${collection}#${row.id} invalide : ignoré`);
    return null;
  }
  return { id: row.id, position: row.position, visible: row.visible, data: parsed.data } as CollectionItem<C>;
}

export async function listItems<C extends CollectionName>(collection: C, { includeHidden = false } = {}) {
  const rows = await db
    .select()
    .from(schema.items)
    .where(includeHidden ? eq(schema.items.collection, collection) : and(eq(schema.items.collection, collection), eq(schema.items.visible, true)))
    .orderBy(asc(schema.items.position), asc(schema.items.id));
  return rows.map((r) => toItem(collection, r)).filter((x): x is CollectionItem<C> => x !== null);
}

async function findRow(collection: CollectionName, id: number) {
  const [row] = await db
    .select()
    .from(schema.items)
    .where(and(eq(schema.items.id, id), eq(schema.items.collection, collection)))
    .limit(1);
  if (!row) throw errors.notFound("Élément introuvable.");
  return row;
}

export async function getItem<C extends CollectionName>(collection: C, id: number) {
  const item = toItem(collection, await findRow(collection, id));
  if (!item) throw errors.notFound("Élément introuvable.");
  return item;
}

const MAX_ITEMS = 500;

export async function createItem<C extends CollectionName>(collection: C, input: { data: unknown; visible?: boolean }) {
  const data = checkItem(collection, collectionSchemas[collection].parse(input.data) as CollectionData<C>);
  const [{ n, maxPos }] = await db
    .select({ n: count(), maxPos: sql<number>`coalesce(max(${schema.items.position}), -1)` })
    .from(schema.items)
    .where(eq(schema.items.collection, collection));
  if (n >= MAX_ITEMS) throw errors.conflict(`Limite de ${MAX_ITEMS} éléments atteinte.`);
  const [row] = await db
    .insert(schema.items)
    .values({ collection, data, visible: input.visible ?? true, position: maxPos + 1 })
    .returning();
  return toItem(collection, row)!;
}

export async function updateItem<C extends CollectionName>(collection: C, id: number, input: { data?: unknown; visible?: boolean }) {
  await findRow(collection, id);
  const patch: Partial<Row> = {};
  if (input.data !== undefined) patch.data = checkItem(collection, collectionSchemas[collection].parse(input.data) as CollectionData<C>);
  if (input.visible !== undefined) patch.visible = input.visible;
  const [row] = await db
    .update(schema.items)
    .set({ ...patch, updatedAt: schema.nowIso })
    .where(and(eq(schema.items.id, id), eq(schema.items.collection, collection)))
    .returning();
  return toItem(collection, row)!;
}

export async function deleteItem(collection: CollectionName, id: number) {
  await findRow(collection, id);
  await db.delete(schema.items).where(and(eq(schema.items.id, id), eq(schema.items.collection, collection)));
}

/* ---------- Intervenants d'exemple ---------- */

const isDemo = sql`${schema.items.data}->>'demo' = 'true'`;

export async function countDemoSpeakers() {
  const [{ n }] = await db
    .select({ n: count() })
    .from(schema.items)
    .where(and(eq(schema.items.collection, "speakers"), isDemo));
  return n;
}

/** Ajoute les fiches d'exemple en fin de liste (refusé si elles sont déjà présentes). */
export async function addDemoSpeakers() {
  if ((await countDemoSpeakers()) > 0) throw errors.conflict("Les intervenants d'exemple sont déjà présents.");
  for (const data of demoSpeakers) await createItem("speakers", { data });
  return demoSpeakers.length;
}

/** Supprime toutes les fiches cochées « exemple » (les vrais intervenants sont conservés). */
export async function removeDemoSpeakers() {
  const deleted = await db
    .delete(schema.items)
    .where(and(eq(schema.items.collection, "speakers"), isDemo))
    .returning({ id: schema.items.id });
  return deleted.length;
}

/** Réordonne : `ids` doit contenir exactement tous les éléments de la collection. */
export async function reorderItems(collection: CollectionName, ids: number[]) {
  const rows = await db.select({ id: schema.items.id }).from(schema.items).where(eq(schema.items.collection, collection));
  const existing = new Set(rows.map((r) => r.id));
  if (ids.length !== existing.size || new Set(ids).size !== ids.length || !ids.every((id) => existing.has(id))) {
    throw errors.badRequest("La liste doit contenir chaque élément de la collection une seule fois.");
  }
  await db.transaction(async (tx) => {
    for (const [position, id] of ids.entries()) {
      await tx.update(schema.items).set({ position }).where(and(eq(schema.items.id, id), eq(schema.items.collection, collection)));
    }
  });
}

export async function countItems(collection: CollectionName) {
  const [r] = await db.select({ n: count() }).from(schema.items).where(eq(schema.items.collection, collection));
  return r?.n ?? 0;
}

/* ---------- Contenu public (mis en cache) ---------- */

type StoredContent = {
  settings: AllSettings;
  collections: { [C in CollectionName]: CollectionItem<C>["data"][] };
};

/** Site et conférence : identité fixe (code) complétée par les informations du back-office. */
export type SiteInfo = Localize<typeof siteIdentity> & SettingsValue<"site">;
export type ConferenceInfo = Localize<typeof conferenceIdentity> & SettingsValue<"conference">;

type Collections = StoredContent["collections"];
/** Créneau du programme : `key` garde l'intitulé français, qui sert à rattacher les intervenants. */
export type ProgrammeSlot = Collections["programme"][number] & { key: string };

export type PublicContent = {
  settings: Omit<AllSettings, "site" | "conference"> & { site: SiteInfo; conference: ConferenceInfo };
  collections: Omit<Collections, "programme"> & { programme: ProgrammeSlot[] };
};

async function loadStoredContent(): Promise<StoredContent> {
  const names = Object.keys(collectionDefs) as CollectionName[];
  const [settings, rows] = await Promise.all([
    readAllSettings(),
    db
      .select()
      .from(schema.items)
      .where(and(inArray(schema.items.collection, names), eq(schema.items.visible, true)))
      .orderBy(asc(schema.items.position), asc(schema.items.id)),
  ]);
  const collections = Object.fromEntries(names.map((n) => [n, [] as unknown[]])) as Record<CollectionName, unknown[]>;
  for (const row of rows) {
    const item = toItem(row.collection as CollectionName, row);
    if (item) collections[row.collection as CollectionName].push(item.data);
  }
  return { settings, collections: collections as StoredContent["collections"] };
}

// Empreinte de la structure (blocs, collections, champs) : un cache créé avant une évolution
// des formulaires, par exemple lors d'un nouveau déploiement, n'est jamais relu.
const CONTENT_SHAPE = createHash("sha256")
  .update(JSON.stringify([settingsDefs, collectionDefs].map((defs) => Object.entries(defs).map(([k, d]) => [k, (d.fields as readonly Field[]).map((f) => f.name)]))))
  .digest("hex")
  .slice(0, 12);

// Contenu du back-office : mis en cache, invalidé à chaque modification
// Le commit déployé fait partie de la clé : chaque déploiement repart d'un cache neuf
// (contenu initial ajouté au build, modifications faites directement en base…)
const getStoredContent = unstable_cache(loadStoredContent, ["public-content", CONTENT_SHAPE, process.env.VERCEL_GIT_COMMIT_SHA ?? ""], {
  tags: [CONTENT_TAG],
  revalidate: 3600,
});

const isImage = (v: unknown): v is { src: string; alt: string } => Boolean(v) && typeof v === "object" && "alt" in (v as object);

// Champs comparés par le code (format d'un créneau : « Pause », « Compétition »… ; sujet d'un
// intervenant, qui le rattache à une session) : leur version anglaise sert seulement à l'affichage
// (kindLabel, src/i18n/labels.ts ; page Intervenants), le texte français reste en place.
const KEPT_IN_FRENCH = new Set(["kindEn", "topicEn", "hoursEn"]);

/**
 * Version anglaise d'un élément ou d'un bloc : chaque champ « xxxEn » renseigné
 * remplace le champ « xxx » (sinon le texte français est conservé) ; « xxxAltEn »
 * remplace le texte alternatif de l'image « xxx ». Une image dont le texte
 * alternatif reprend un champ traduit (logo nommé d'après le partenaire) suit sa traduction.
 */
function inLocale<T extends object>(data: T, locale: Locale): T {
  if (locale === DEFAULT_LOCALE) return data;
  const src = data as Record<string, unknown>;
  const out: Record<string, unknown> = { ...src };
  for (const [k, v] of Object.entries(src)) {
    if (!k.endsWith("En") || KEPT_IN_FRENCH.has(k)) continue;
    // Liste (points d'une session) : sa version anglaise remplace la française si elle est remplie
    if (Array.isArray(v) && v.length > 0) out[k.slice(0, -2)] = v;
    if (typeof v !== "string" || !v.trim()) continue;
    if (k.endsWith("AltEn")) {
      const image = out[k.slice(0, -5)];
      if (isImage(image)) out[k.slice(0, -5)] = { ...image, alt: v };
      continue;
    }
    const base = k.slice(0, -2);
    for (const [ik, iv] of Object.entries(out)) if (isImage(iv) && src[base] && iv.alt === src[base]) out[ik] = { ...iv, alt: v };
    out[base] = v;
  }
  return out as T;
}

const host = (u: string) => new URL(u).hostname.replace(/^www\./, "");

/** Lien d'un partenaire vers ce site même (InnovateBF) : chemin interne, dans la langue de la page. */
function ownSiteLink(href: string, locale: Locale) {
  try {
    const u = new URL(href);
    return host(href) === host(SITE_URL) ? localizeHref(u.pathname + u.search + u.hash, locale) : href;
  } catch {
    return href;
  }
}

/**
 * Contenu lu par le site, dans la langue de la page. L'identité fixe est
 * ajoutée hors du cache : une modification du code est visible dès le
 * déploiement suivant.
 */
export async function getPublicContent(locale: Locale = DEFAULT_LOCALE): Promise<PublicContent> {
  const { settings, collections } = await getStoredContent();
  const localized = Object.fromEntries(
    Object.entries(collections).map(([name, items]) => [name, (items as object[]).map((d) => inLocale(d, locale))]),
  ) as Collections;
  const { conference } = settings;
  // Horaires : version anglaise saisie, sinon conversion automatique (« 08 h 30 » → « 08:30 »)
  const hours = locale === "en" && conference.hoursEn.trim() ? conference.hoursEn : formatHours(conference.hours, locale);
  return {
    settings: {
      ...settings,
      site: { ...localize(siteIdentity, locale), ...inLocale(settings.site, locale) },
      conference: { ...localize(conferenceIdentity, locale), ...inLocale(conference, locale), hours },
    },
    collections: {
      ...localized,
      programme: localized.programme.map((slot, i) => ({ ...slot, key: collections.programme[i].title })),
      partners: localized.partners.map((p) => (p.href ? { ...p, href: ownSiteLink(p.href, locale) } : p)),
    },
  };
}

export function invalidateContent() {
  revalidateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
}
