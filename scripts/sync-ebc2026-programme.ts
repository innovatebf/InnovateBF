/**
 * Aligne le programme, les intervenants, les fiches Top 5 et les stands d'EBC2026 sur la
 * référence (src/content/ebc2026-programme.ts). Script ciblé et idempotent, lancé à la main :
 * il ne fait pas partie du build et ne touche qu'à ces quatre collections de la table `items`.
 *
 *   npx tsx scripts/sync-ebc2026-programme.ts --dry-run    affiche le diff, n'écrit rien (par défaut)
 *   npx tsx scripts/sync-ebc2026-programme.ts --apply      sauvegarde dans backups/, puis écrit en transaction
 *
 * Options :
 *   --retirer-zone-jeunesse   retire aussi les créneaux hors référence que la mission ne liste pas
 *   --confirme-base=<hôte>    obligatoire avec --apply sur une base distante (hôte affiché par le dry-run)
 *
 * Base visée : comme le site (DATABASE_URL, sinon la base PostgreSQL locale).
 *
 * Les lignes existantes sont mises à jour sur place par leur identifiant : une ligne n'est
 * supprimée que si elle figure dans une liste « à retirer » ci-dessous, et une ligne inconnue
 * (ajoutée au back-office) n'est jamais modifiée, seulement signalée. Le groupe « Organisateurs
 * et partenaires » des stands n'est ni lu pour modification ni déplacé.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { and, asc, eq } from "drizzle-orm";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { referenceInventors, referenceProgramme, referenceSpeakers, referenceStands } from "../src/content/ebc2026-programme";
import { collectionDefs, collectionSchemas, type CollectionName } from "../src/lib/content/definitions";
import { emptyValue, emptyValues, type Field } from "../src/lib/content/fields";
import { databaseUrl, describeDatabase, isLocalDatabase, isPostgresUrl, poolConfig } from "../src/server/db/config";
import * as schema from "../src/server/db/schema";

type Db = Pick<NodePgDatabase<typeof schema>, "select" | "insert" | "update" | "delete">;
type Data = Record<string, unknown>;
type Row = { id: number; position: number; visible: boolean; data: Data };

/* ---------- Correspondances : anciennes identités de chaque ligne de la référence ---------- */

// Créneau : [jour, heure, début de l'intitulé]. v2 : base actuelle de la production ; v3 : version intermédiaire du 29 octobre.
type SlotId = readonly [day: string, time: string, title: string];

const SLOT_ALIASES: Record<string, readonly SlotId[]> = {
  "1|08:30": [["1", "08:30", "Cérémonie d'ouverture officielle"]],
  "1|10:30": [["1", "10:30", "Visite du Village"]],
  "1|12:00": [["1", "12:30", "Pause déjeuner et réseautage"], ["1", "12:00", "Pause déjeuner"]],
  "1|13:00": [["2", "09:00", "Keynote du jour 2"], ["1", "13:00", "L'ingénierie des compétences"]],
  "1|15:00": [["1", "15:00", "Pause café"]],
  "1|15:30": [["1", "14:00", "Panel 2 :"], ["1", "15:30", "Du labo au marché"]],
  "2|08:30": [["1", "10:30", "Panel 1 :"], ["2", "08:30", "Souveraineté numérique"]],
  "2|10:30": [["2", "10:30", "Pause café"]],
  "2|11:00": [["2", "10:00", "Panel 3 :"], ["2", "11:00", "L'ingénierie au service"]],
  "2|13:00": [["2", "12:30", "Pause déjeuner"], ["2", "13:00", "Pause déjeuner"]],
  "2|14:00": [["2", "14:00", "Panel 4 :"], ["2", "14:00", "Financement et incubation"]],
  "2|16:00": [["2", "16:00", "Pause café"]],
  "2|16:30": [["2", "17:00", "Cérémonie des Awards"], ["2", "16:30", "Cérémonie des Awards"]],
};

// Listés « à retirer » par la mission (la finale et la keynote du jour 2 fusionnent dans la session de 13 h 00)
const SLOTS_TO_REMOVE: readonly SlotId[] = [
  ["1", "09:30", "Keynote d'ouverture"],
  ["1", "10:30", "Lancement du Makathon Flash"],
  ["1", "11:45", "Tech Talks"],
  ["1", "11:45", "Ouverture de l'espace"],
  ["1", "15:15", "Lab Talks"],
  ["1", "15:15", "Tech Speed-Dating"],
  ["1", "16:30", "Pitchs sur stands"],
  ["2", "11:15", "BSB & Abamix Professional Talks"],
  ["2", "15:30", "Finale et grand pitch"],
];

// Absents de la référence mais non listés par la mission : retirés seulement avec --retirer-zone-jeunesse
const SLOTS_TO_DECIDE: readonly SlotId[] = [
  ["2", "10:30", "Fin du chrono du Makathon"],
  ["2", "11:15", "Pitch Chrono du Makathon"],
  ["2", "14:00", "Le Grand Quiz de l'Inventeur Endogène"],
];

const SPEAKER_ALIASES: Record<string, readonly string[]> = {
  "Les représentants du CNRST / INERA": ["Représentants du CNRST / INERA"],
  "La direction de l'Institut 2iE": ["Direction de l'Institut 2iE"],
  // La fiche collective de NOVARK devient celle du premier intervenant nommé (document NOVARK du 6 novembre)
  "Justin Nabi": ["L'équipe de NOVARK", "Équipe NOVARK"],
  Citadel: ["CITADEL"],
  "Les responsables de la Ferme pilote de Guiè": ["Ferme pilote de Guiè"],
  "Les innovateurs du réseau Faso Andubè": ["Réseau Faso Andubè"],
  "La direction de Dunia Labs": ["Direction de Dunia Labs"],
  "L'équipe de Startup Café Burkina": ["Équipe de Startup Café Burkina"],
};

const STAND_ALIASES: Record<string, readonly string[]> = {
  "citadel|Traduction automatique français–mooré (modèles de langage)": ["citadel|Traduction automatique français–mooré"],
  "citadel|Chaîne de traduction vocale français–mooré": ["citadel|Traduction vocale pour les langues locales"],
  "citadel|Traitement automatique des relevés de programmes radio et TV au format BBDA": ["citadel|Traitement des relevés de programmes radio et TV"],
  "citadel|Identification des instruments dans un morceau": ["citadel|Reconnaissance d'instruments"],
  "citadel|BurkinaRadVL-JEPA : aide à la radiologie": ["citadel|Aide à la radiologie par intelligence artificielle"],
  "citadel|NOVARK": ["entreprises|NOVARK"],
  "etudiants|Arroseur automatique intelligent": ["etudiants|Arroseur automatique"],
  "etudiants|Drone de Surveillance": ["etudiants|Drone de surveillance"],
  "etudiants|Drone muni de détecteur de métaux": ["etudiants|Drone détecteur de métaux"],
  "etudiants|Système embarqué agricole intelligent": ["etudiants|Système embarqué agricole"],
  "etudiants|Tapis Roulant Industriel Trieur": ["etudiants|Tapis trieur", "etudiants|Tapis roulant industriel trieur"],
  "etudiants|Système Antivol Intelligent": ["etudiants|Système antivol", "etudiants|Système antivol intelligent"],
  "inventeurs|Olorum / E-DEFENCE – Guundi Mobile Security": ["inventeurs|Guundi Mobile Security"],
  "jeunesse|Le « Makathon Flash : Hack ton Quotidien »": ["jeunesse|Makathon Flash : Hack ton Quotidien"],
  "jeunesse|L'Espace « IA Showroom & Coding Arcade »": ["jeunesse|Espace IA Showroom & Coding Arcade"],
};

// Listés « à retirer » par la mission
const STANDS_TO_REMOVE = ["etudiants|Robot humanoïde", "etudiants|Suiveur solaire"];
// Hors référence : jamais lus pour modification (« NE PAS toucher »)
const UNTOUCHED_STAND_CATEGORY = "organisateurs";

/* ---------- Plan : ce qui change, calculé sans rien écrire ---------- */

type Update = { id: number; label: string; changes: [field: string, before: unknown, after: unknown][]; data: Data; position: number; visible: boolean };
type Create = { label: string; data: Data; position: number };
type Removal = { id: number; label: string };
type Plan = {
  collection: CollectionName;
  updates: Update[];
  creates: Create[];
  removals: Removal[];
  toDecide: Removal[];
  unknown: Removal[];
  unchanged: number;
  untouched: number;
};

async function readRows(db: Db, collection: CollectionName): Promise<Row[]> {
  const fields = collectionDefs[collection].fields as readonly Field[];
  const rows = await db
    .select()
    .from(schema.items)
    .where(eq(schema.items.collection, collection))
    .orderBy(asc(schema.items.position), asc(schema.items.id));
  // Ramenées aux champs actuels, comme à la lecture par le site (repository.ts)
  return rows.map((r) => {
    const stored = (r.data ?? {}) as Data;
    return { id: r.id, position: r.position, visible: r.visible, data: Object.fromEntries(fields.map((f) => [f.name, Object.hasOwn(stored, f.name) ? stored[f.name] : emptyValue(f)])) };
  });
}

// Comparaison sans tenir compte de l'ordre des clés, que PostgreSQL (jsonb) ne conserve pas
const canonical = (v: unknown) =>
  JSON.stringify(v, (_, x) => (x && typeof x === "object" && !Array.isArray(x) ? Object.fromEntries(Object.entries(x).sort(([a], [b]) => a.localeCompare(b))) : x));
const same = (a: unknown, b: unknown) => canonical(a) === canonical(b);

/**
 * Rapproche la référence des lignes existantes. Les lignes déjà à leur place sont
 * rattachées d'abord, pour qu'une nouvelle exécution ne change rien (idempotence).
 */
function buildPlan(
  collection: CollectionName,
  rows: Row[],
  targets: { own: Data; matches: (r: Row) => boolean; isSelf: (r: Row) => boolean; label: string; position: number }[],
  opts: { removes?: (r: Row) => boolean; decides?: (r: Row) => boolean; retireDecided?: boolean; untouched?: (r: Row) => boolean; rowLabel: (r: Row) => string },
): Plan {
  const fields = collectionDefs[collection].fields as readonly Field[];
  const plan: Plan = { collection, updates: [], creates: [], removals: [], toDecide: [], unknown: [], unchanged: 0, untouched: 0 };
  const pool = rows.filter((r) => {
    if (!opts.untouched?.(r)) return true;
    plan.untouched++;
    return false;
  });
  const claimed = new Map<number, Row>();
  const claim = (i: number, test: (r: Row) => boolean) => {
    if (claimed.has(i)) return;
    const row = pool.find((r) => ![...claimed.values()].includes(r) && test(r));
    if (row) claimed.set(i, row);
  };
  targets.forEach((t, i) => claim(i, t.isSelf));
  targets.forEach((t, i) => claim(i, t.matches));

  targets.forEach((t, i) => {
    const row = claimed.get(i);
    if (!row) {
      const data = collectionSchemas[collection].parse({ ...emptyValues(fields), ...t.own }) as Data;
      plan.creates.push({ label: t.label, data, position: t.position });
      return;
    }
    const data = collectionSchemas[collection].parse({ ...row.data, ...t.own }) as Data;
    const changes: Update["changes"] = [];
    for (const f of fields) if (!same(row.data[f.name], data[f.name])) changes.push([f.name, row.data[f.name], data[f.name]]);
    if (row.position !== t.position) changes.push(["(position)", row.position, t.position]);
    if (!row.visible) changes.push(["(visible)", false, true]);
    if (changes.length) plan.updates.push({ id: row.id, label: t.label, changes, data, position: t.position, visible: true });
    else plan.unchanged++;
  });

  const taken = new Set([...claimed.values()].map((r) => r.id));
  for (const r of pool) {
    if (taken.has(r.id)) continue;
    const item = { id: r.id, label: opts.rowLabel(r) };
    if (opts.removes?.(r)) plan.removals.push(item);
    else if (opts.decides?.(r)) (opts.retireDecided ? plan.removals : plan.toDecide).push(item);
    else plan.unknown.push(item);
  }
  return plan;
}

const slotOf = (r: Row) => ({ day: String(r.data.day), time: String(r.data.time), title: String(r.data.title) });
const isSlot = (r: Row, [day, time, title]: SlotId) => {
  const s = slotOf(r);
  return s.day === day && s.time === time && s.title.startsWith(title);
};
const slotLabel = (d: Data) => `J${d.day} ${d.time}${d.end ? `–${d.end}` : ""} « ${d.title} »`;
const standKey = (d: Data) => `${d.category}|${d.name}`;

async function buildPlans(db: Db, retireDecided: boolean): Promise<Plan[]> {
  const programme = buildPlan(
    "programme",
    await readRows(db, "programme"),
    referenceProgramme.map((slot, position) => {
      const aliases = SLOT_ALIASES[`${slot.day}|${slot.time}`] ?? [];
      return {
        // La ligne « Intervenant(s) » saisie au back-office n'est pas réécrite
        own: Object.fromEntries(Object.entries(slot).filter(([k]) => k !== "speaker" && k !== "speakerEn")),
        label: slotLabel(slot),
        position,
        isSelf: (r: Row) => slotOf(r).day === slot.day && slotOf(r).time === slot.time && slotOf(r).title === slot.title,
        matches: (r: Row) => aliases.some((a) => isSlot(r, a)),
      };
    }),
    {
      removes: (r) => SLOTS_TO_REMOVE.some((a) => isSlot(r, a)),
      decides: (r) => SLOTS_TO_DECIDE.some((a) => isSlot(r, a)),
      retireDecided,
      rowLabel: (r) => slotLabel(r.data),
    },
  );

  const speakers = buildPlan(
    "speakers",
    await readRows(db, "speakers"),
    referenceSpeakers.map((own, position) => ({
      own,
      label: own.name,
      position,
      isSelf: (r) => r.data.name === own.name,
      matches: (r) => (SPEAKER_ALIASES[own.name] ?? []).includes(String(r.data.name)),
    })),
    { rowLabel: (r) => `${r.data.name}${r.data.demo ? " (fiche d'exemple)" : ""}` },
  );

  const inventors = buildPlan(
    "inventors",
    await readRows(db, "inventors"),
    referenceInventors.map((own, position) => ({
      own,
      label: own.project,
      position,
      isSelf: (r) => r.data.project === own.project,
      matches: () => false,
    })),
    { rowLabel: (r) => String(r.data.project) },
  );

  // Stands : la référence se place après le groupe « Organisateurs et partenaires », qui ne bouge pas
  const standRows = await readRows(db, "stands");
  const lastUntouched = Math.max(-1, ...standRows.filter((r) => r.data.category === UNTOUCHED_STAND_CATEGORY).map((r) => r.position));
  const stands = buildPlan(
    "stands",
    standRows,
    referenceStands.map((own, i) => ({
      own,
      label: `${own.category} · ${own.name}`,
      position: lastUntouched + 1 + i,
      isSelf: (r) => standKey(r.data) === standKey(own),
      matches: (r) => (STAND_ALIASES[standKey(own)] ?? []).includes(standKey(r.data)),
    })),
    {
      removes: (r) => STANDS_TO_REMOVE.includes(standKey(r.data)),
      untouched: (r) => r.data.category === UNTOUCHED_STAND_CATEGORY,
      rowLabel: (r) => `${r.data.category} · ${r.data.name}`,
    },
  );

  return [programme, speakers, inventors, stands];
}

/* ---------- Affichage du diff ---------- */

const show = (v: unknown) => (typeof v === "string" ? (v === "" ? "(vide)" : `« ${v} »`) : Array.isArray(v) ? (v.length ? `${v.length} ligne(s)` : "(aucune)") : String(v));

function printPlan(p: Plan) {
  console.log(
    `\n=== ${p.collection.toUpperCase()} : ${p.updates.length} mise(s) à jour, ${p.creates.length} création(s), ${p.removals.length} suppression(s), ` +
      `${p.toDecide.length} à décider, ${p.unknown.length} inconnue(s), ${p.unchanged} inchangée(s)${p.untouched ? `, ${p.untouched} hors périmètre (intouchées)` : ""}`,
  );
  for (const u of p.updates) {
    console.log(`  ~ #${u.id} ${u.label}`);
    for (const [field, before, after] of u.changes) {
      console.log(`      ${field}: ${show(before)} → ${show(after)}`);
      if (Array.isArray(after)) for (const line of after) console.log(`        · ${line}`);
    }
  }
  for (const c of p.creates) {
    console.log(`  + ${c.label} (position ${c.position})`);
    for (const [k, v] of Object.entries(c.data)) {
      if (v === "" || v === false || (Array.isArray(v) && !v.length) || (typeof v === "object" && !Array.isArray(v))) continue;
      console.log(`      ${k}: ${show(v)}`);
      if (Array.isArray(v)) for (const line of v) console.log(`        · ${line}`);
    }
  }
  for (const r of p.removals) console.log(`  - #${r.id} ${r.label}`);
  for (const r of p.toDecide) console.log(`  ? #${r.id} ${r.label} : hors référence, non listé par la mission, CONSERVÉ (--retirer-zone-jeunesse pour le retirer)`);
  for (const r of p.unknown) console.log(`  ! #${r.id} ${r.label} : ligne inconnue, CONSERVÉE telle quelle`);
}

const hasWork = (plans: Plan[]) => plans.some((p) => p.updates.length || p.creates.length || p.removals.length);

/* ---------- Sauvegardes (backups/ est ignoré par git : la base complète contient des données personnelles) ---------- */

async function backup(pool: Pool, db: Db, stamp: string) {
  mkdirSync("backups", { recursive: true });
  const targeted: Record<string, unknown> = {};
  for (const c of ["programme", "speakers", "inventors", "stands"] as const) {
    targeted[c] = await db.select().from(schema.items).where(eq(schema.items.collection, c)).orderBy(asc(schema.items.position), asc(schema.items.id));
  }
  const targetedPath = join("backups", `ebc2026-${stamp}.json`);
  // « wx » : une sauvegarde existante n'est jamais écrasée
  writeFileSync(targetedPath, JSON.stringify({ date: new Date().toISOString(), collections: targeted }, null, 2), { mode: 0o600, flag: "wx" });

  const tables = await pool.query<{ tablename: string }>("select tablename from pg_tables where schemaname = 'public' order by tablename");
  const full: Record<string, unknown[]> = {};
  for (const { tablename } of tables.rows) {
    full[tablename] = (await pool.query(`select * from "${tablename.replaceAll('"', '""')}"`)).rows;
  }
  const fullPath = join("backups", `base-complete-${stamp}.json`);
  writeFileSync(fullPath, JSON.stringify({ date: new Date().toISOString(), tables: full }), { mode: 0o600, flag: "wx" });

  // Relecture : on n'écrit pas en base sur une sauvegarde incomplète
  const check = JSON.parse(readFileSync(targetedPath, "utf8")) as { collections: Record<string, unknown[]> };
  for (const c of Object.keys(targeted)) {
    if (check.collections[c].length !== (targeted[c] as unknown[]).length) throw new Error(`Sauvegarde incomplète : ${c}`);
  }
  console.log(`✓ Sauvegarde ciblée : ${targetedPath}`);
  console.log(`✓ Sauvegarde complète : ${fullPath} (${Object.keys(full).length} tables)`);
}

/* ---------- Écriture : uniquement par identifiant, dans une transaction ---------- */

async function applyPlans(db: Db, plans: Plan[]) {
  for (const p of plans) {
    const inCollection = (id: number) => and(eq(schema.items.id, id), eq(schema.items.collection, p.collection));
    for (const r of p.removals) await db.delete(schema.items).where(inCollection(r.id));
    for (const u of p.updates) {
      await db.update(schema.items).set({ data: u.data, position: u.position, visible: u.visible, updatedAt: schema.nowIso }).where(inCollection(u.id));
    }
    for (const c of p.creates) await db.insert(schema.items).values({ collection: p.collection, position: c.position, visible: true, data: c.data });
  }
}

/** Garde-fous : aucun plan ne doit viser les organisateurs ni une ligne non listée. */
function assertSafe(plans: Plan[]) {
  const stands = plans.find((p) => p.collection === "stands")!;
  const touchesOrganizers = [...stands.updates, ...stands.creates, ...stands.removals].some((x) => x.label.startsWith(`${UNTOUCHED_STAND_CATEGORY} ·`));
  if (touchesOrganizers) throw new Error("Le plan vise le groupe « Organisateurs et partenaires » : arrêt.");
  const maxRemovals = SLOTS_TO_REMOVE.length + SLOTS_TO_DECIDE.length + STANDS_TO_REMOVE.length;
  const removals = plans.reduce((n, p) => n + p.removals.length, 0);
  if (removals > maxRemovals) throw new Error(`Trop de suppressions (${removals} > ${maxRemovals}) : arrêt.`);
}

/* ---------- Lancement ---------- */

for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    /* fichier absent */
  }
}

const KNOWN_ARGS = /^(--dry-run|--apply|--retirer-zone-jeunesse|--confirme-base=.+)$/;

function fail(message: string): never {
  console.error(`✗ ${message}`);
  process.exit(1);
}

async function main() {
  const args = process.argv.slice(2);
  const unknownArg = args.find((a) => !KNOWN_ARGS.test(a));
  if (unknownArg) fail(`Option inconnue : ${unknownArg}`);
  const apply = args.includes("--apply");
  if (apply && args.includes("--dry-run")) fail("--apply et --dry-run sont incompatibles.");
  const retireDecided = args.includes("--retirer-zone-jeunesse");

  const url = databaseUrl();
  if (!isPostgresUrl(url)) fail("URL de base non prise en charge.");
  // Jamais le mot de passe : seulement l'hôte et le nom de la base
  const target = describeDatabase(url);
  console.log(`Base visée : ${target}`);
  console.log(apply ? "Mode : ÉCRITURE (--apply)" : "Mode : SIMULATION (--dry-run), AUCUNE ÉCRITURE EN BASE");

  if (apply && !isLocalDatabase(url) && !args.includes(`--confirme-base=${target}`)) {
    fail(`Sur une base distante, --apply exige --confirme-base=${target}`);
  }

  const pool = new Pool(poolConfig(url));
  const db = drizzle(pool, { schema });

  const plans = await buildPlans(db, retireDecided);
  assertSafe(plans);
  plans.forEach(printPlan);

  const total = (k: "updates" | "creates" | "removals") => plans.reduce((n, p) => n + p[k].length, 0);
  console.log(`\nTOTAL : ${total("updates")} mise(s) à jour, ${total("creates")} création(s), ${total("removals")} suppression(s).`);

  if (!apply) {
    console.log("Simulation terminée : rien n'a été écrit.");
    return;
  }
  if (!hasWork(plans)) {
    console.log("Base déjà alignée sur la référence : rien à écrire.");
    return;
  }

  const stamp = new Date().toISOString().slice(0, 19).replaceAll(":", "");
  await backup(pool, db, stamp);

  await db.transaction(async (tx) => {
    // Recalcul dans la transaction : si la base a changé depuis le plan affiché, on annule
    const fresh = await buildPlans(tx, retireDecided);
    if (!same(fresh, plans)) throw new Error("La base a changé depuis le calcul du plan : annulation, relancez le dry-run.");
    await applyPlans(tx, fresh);
  });

  const after = await buildPlans(db, retireDecided);
  if (hasWork(after)) fail("Vérification : il reste des écarts après écriture. Voir les sauvegardes dans backups/.");
  console.log("✓ Écriture terminée et vérifiée : une nouvelle exécution ne changerait plus rien.");
  console.log("  Le site garde son cache jusqu'à une heure : enregistrez un élément au back-office ou redéployez pour l'actualiser.");
}

main()
  .catch((e) => {
    // Drizzle enveloppe l'erreur du pilote : la cause dit ce qui ne va pas (jamais l'adresse de la base)
    const cause = (e instanceof Error ? (e.cause ?? e) : e) as Error & { code?: string };
    console.error(`✗ ${cause.message || cause.code || String(cause)}`);
    process.exitCode = 1;
  })
  .finally(() => process.exit());
